import React, {useState} from 'react';
import {View, Text, Alert, ActivityIndicator, TouchableOpacity} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Input from '../../components/Input';
import Button from '../../components/Button';
import styles from '../../styles/LoginScreenStyles';
import {useAuth} from '../../hooks/useAuth';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../navigation/types';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  StackParamList,
  'Login'
>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({navigation}) => {
  const {login, loading} = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
  });

  const handleLogin = async (values: {email: string; password: string}) => {
    setIsSubmitting(true);
    try {
      await login(values.email, values.password);
      navigation.replace('App', {screen: 'Home'});
    } catch (error) {
      Alert.alert('Error', 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
      {loading || isSubmitting ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
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
                placeholder="Email"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                error={touched.email ? errors.email : undefined}
              />
              <Input
                placeholder="Password"
                secureTextEntry
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                error={touched.password ? errors.password : undefined}
              />
              <Button title="Log In" onPress={() => handleSubmit()} />
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => navigation.navigate('Register')}>
                <Text style={styles.linkButtonText}>Don't have an account? Sign up!</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.linkButtonText}>Did you forget your password? Recover it!</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      )}
    </View>
  );
};

export default LoginScreen;
