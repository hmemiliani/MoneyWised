import React, { useState } from 'react';
import { View, Text, Alert, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Input from '../../components/Input';
import Button from '../../components/Button';
import styles from '../../styles/ValidateCodeScreenStyles';
import { useAuth } from '../../hooks/useAuth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<StackParamList, 'ValidateCode'>;

const ValidateCodeScreen: React.FC<Props> = ({ navigation, route }) => {
  const { email } = route.params;
  const { validateRecoveryCode } = useAuth();
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    code: Yup.string()
      .required('Code is required')
      .length(6, 'Code must be 6 digits'),
  });

  const handleValidateCode = async (values: { code: string }) => {
    setLoading(true);
    try {
      await validateRecoveryCode({ email, token: values.code });
      navigation.navigate('ResetPassword', { email, token: values.code });
    } catch (error) {
      Alert.alert('Error', 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter the recovery code</Text>
      <Formik
        initialValues={{ code: '' }}
        validationSchema={validationSchema}
        onSubmit={handleValidateCode}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <Input
              placeholder="Recovery Code"
              onChangeText={handleChange('code')}
              onBlur={handleBlur('code')}
              value={values.code}
              keyboardType="numeric"
              error={touched.code ? errors.code : undefined}
            />
            {loading ? (
              <ActivityIndicator size="large" color="#FF6F00" />
            ) : (
              <Button title="Validate" onPress={handleSubmit} />
            )}
          </>
        )}
      </Formik>
    </View>
  );
};

export default ValidateCodeScreen;
