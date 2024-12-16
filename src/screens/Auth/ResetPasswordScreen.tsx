import React, { useState } from 'react';
import { View, Text, Alert, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Input from '../../components/Input';
import Button from '../../components/Button';
import styles from '../../styles/ResetPasswordScreenStyles';
import { useAuth } from '../../hooks/useAuth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<StackParamList, 'ResetPassword'>;

const ResetPasswordScreen: React.FC<Props> = ({ navigation, route }) => {
  const { email, token } = route.params;
  const { resetPassword } = useAuth();
  const [loading, setLoading] = useState(false); // Estado de loading

  // Validación de formulario con Yup
  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], 'Passwords must match')
      .required('Confirmation is required'),
  });

  // Función para manejar el reseteo de contraseña
  const handleResetPassword = async (values: { newPassword: string }) => {
    setLoading(true);
    try {
      await resetPassword({ email, token, newPassword: values.newPassword });
      Alert.alert('Success', 'Your password has been reset. You can now log in.');
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Error', 'Could not reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset your password</Text>
      <Formik
        initialValues={{ newPassword: '', confirmPassword: '' }}
        validationSchema={validationSchema}
        onSubmit={handleResetPassword}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <Input
              placeholder="New Password"
              secureTextEntry
              onChangeText={handleChange('newPassword')}
              onBlur={handleBlur('newPassword')}
              value={values.newPassword}
              error={touched.newPassword ? errors.newPassword : undefined}
            />
            <Input
              placeholder="Confirm Password"
              secureTextEntry
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              value={values.confirmPassword}
              error={touched.confirmPassword ? errors.confirmPassword : undefined}
            />
            {loading ? (
              <ActivityIndicator size="large" color="#FF6F00" />
            ) : (
              <Button title="Reset Password" onPress={handleSubmit} />
            )}
          </>
        )}
      </Formik>
    </View>
  );
};

export default ResetPasswordScreen;
