import React from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Input from '../../components/Input';
import Button from '../../components/Button';
import styles from '../../styles/ForgotPasswordScreenStyles';
import { useAuth } from '../../hooks/useAuth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamList } from '../../navigation/types';

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'ForgotPassword'>;

interface Props {
  navigation: ForgotPasswordScreenNavigationProp;
}

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const { forgotPassword } = useAuth();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
  });

  const handleForgotPassword = async (values: { email: string }) => {
    try {
      await forgotPassword(values.email);
      Alert.alert('Recovery', 'Check your email for a recovery code');
      navigation.navigate('ValidateCode', { email: values.email });
    } catch (error) {
      Alert.alert('Error', 'The request could not be completed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recover your password</Text>
      <Formik
        initialValues={{ email: '' }}
        validationSchema={validationSchema}
        onSubmit={handleForgotPassword}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <Input
              placeholder="Email"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              error={touched.email ? errors.email : undefined}
            />
            <Button title="Send" onPress={handleSubmit} />
          </>
        )}
      </Formik>
      <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkButtonText}>
          Did you remember your credentials? Log in!
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPasswordScreen;
