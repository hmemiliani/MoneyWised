import React, { useState } from 'react';
import { View, Text, Alert, ActivityIndicator, Modal, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Input from '../../components/Input';
import Button from '../../components/Button';
import styles from '../../styles/RegisterScreenStyles';
import { useAuth } from '../../hooks/useAuth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamList } from '../../navigation/types';
import colors from '../../styles/colors';

type RegisterScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { register, loading } = useAuth();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name required'),
    email: Yup.string().email('Invalid email').required('Email required'),
    password: Yup.string().min(8, 'Minimum 8 characters').required('Password required'),
    phone: Yup.string()
      .matches(/^\d+$/, 'Only numbers are allowed')
      .required('Phone required'),
  });

  const handleRegister = async (values: { name: string; email: string; password: string; phone: string }) => {
    try {
      await register(values);
      Alert.alert('Registration successful', 'You can now log in');
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Error', 'Registration could not be completed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create your account</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <Formik
          initialValues={{ name: '', email: '', password: '', phone: '' }}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <>
              <Input
                placeholder="Full name"
                style={styles.input}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
                error={touched.name ? errors.name : undefined}
              />
              <Input
                placeholder="Email"
                style={styles.input}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                error={touched.email ? errors.email : undefined}
              />
              <Input
                placeholder="Phone"
                style={styles.input}
                onChangeText={handleChange('phone')}
                onBlur={handleBlur('phone')}
                value={values.phone}
                error={touched.phone ? errors.phone : undefined}
              />
              <Input
                placeholder="Password"
                style={styles.input}
                secureTextEntry
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                error={touched.password ? errors.password : undefined}
              />
              <Button title="Register" onPress={handleSubmit} style={styles.button} />
            </>
          )}
        </Formik>
      )}

      <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkButtonText}>Already have an account? Log in!</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;
