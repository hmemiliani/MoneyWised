import React from 'react';
import { View, Text, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Input from '../../components/Input';
import Button from '../../components/Button';
import styles from '../../styles/ForgotPasswordScreenStyles';
import { useAuth } from '../../hooks/useAuth';

const ForgotPasswordScreen: React.FC = () => {
  const { forgotPassword } = useAuth();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Email inválido').required('Email requerido'),
  });

  const handleForgotPassword = async (values: { email: string }) => {
    try {
      await forgotPassword(values.email);
      Alert.alert('Recuperación', 'Revisa tu correo para restablecer tu contraseña');
    } catch (error) {
      Alert.alert('Error', 'No se pudo completar la solicitud');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recupera tu contraseña</Text>
      <Formik
        initialValues={{ email: '' }}
        validationSchema={validationSchema}
        onSubmit={handleForgotPassword}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <Input
              placeholder="Correo electrónico"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              error={touched.email ? errors.email : undefined}
            />
            <Button title="Enviar" onPress={handleSubmit} />
          </>
        )}
      </Formik>
    </View>
  );
};

export default ForgotPasswordScreen;
