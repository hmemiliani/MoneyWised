import React from 'react';
import {View, Text, Alert} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Input from '../../components/Input';
import Button from '../../components/Button';
import styles from '../../styles/LoginScreenStyles';
import {useAuth} from '../../hooks/useAuth';

const LoginScreen: React.FC = () => {
  const {login} = useAuth();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Email inválido').required('Requerido'),
    password: Yup.string().required('Requerido'),
  });

  const handleLogin = async (values: {email: string; password: string}) => {
    try {
      await login(values.email, values.password);
    } catch (error) {
      Alert.alert('Error', 'Credenciales inválidas');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inicia Sesión</Text>
      <Formik
        initialValues={{email: '', password: ''}}
        validationSchema={validationSchema}
        onSubmit={handleLogin}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            <Input
              placeholder="Correo electrónico"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              error={touched.email ? errors.email : undefined}
            />
            <Input
              placeholder="Contraseña"
              secureTextEntry
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              error={touched.password ? errors.password : undefined}
            />
            <Button title="Iniciar sesión" onPress={handleSubmit} />
          </>
        )}
      </Formik>
    </View>
  );
};

export default LoginScreen;
