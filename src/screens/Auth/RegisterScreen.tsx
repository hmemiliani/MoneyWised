import React from 'react';
import { View, Text, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Input from '../../components/Input';
import Button from '../../components/Button';
import styles from '../../styles/RegisterScreenStyles';
import { useAuth } from '../../hooks/useAuth';

const RegisterScreen: React.FC = () => {
  const { register } = useAuth();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Nombre requerido'),
    email: Yup.string().email('Email inválido').required('Email requerido'),
    password: Yup.string().min(8, 'Mínimo 8 caracteres').required('Contraseña requerida'),
    phone: Yup.string()
      .matches(/^\d+$/, 'Solo se permiten números')
      .required('Teléfono requerido'),
  });

  const handleRegister = async (values: {
    name: string;
    email: string;
    password: string;
    phone: string;
  }) => {
    try {
      await register(values);
      Alert.alert('Registro exitoso', 'Ahora puedes iniciar sesión');
    } catch (error) {
      Alert.alert('Error', 'No se pudo completar el registro');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crea tu cuenta</Text>
      <Formik
        initialValues={{ name: '', email: '', password: '', phone: '' }}
        validationSchema={validationSchema}
        onSubmit={handleRegister}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <Input
              placeholder="Nombre completo"
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              error={touched.name ? errors.name : undefined}
            />
            <Input
              placeholder="Correo electrónico"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              error={touched.email ? errors.email : undefined}
            />
            <Input
              placeholder="Teléfono"
              onChangeText={handleChange('phone')}
              onBlur={handleBlur('phone')}
              value={values.phone}
              error={touched.phone ? errors.phone : undefined}
            />
            <Input
              placeholder="Contraseña"
              secureTextEntry
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              error={touched.password ? errors.password : undefined}
            />
            <Button title="Registrarse" onPress={handleSubmit} />
          </>
        )}
      </Formik>
    </View>
  );
};

export default RegisterScreen;
