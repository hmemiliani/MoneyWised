import React, { useState } from 'react';
import { View, Text, Alert, ActivityIndicator, Modal } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Input from '../../components/Input';
import Button from '../../components/Button';
import styles from '../../styles/RegisterScreenStyles';
import { useAuth } from '../../hooks/useAuth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigationTypes';
import ImagePicker, { ImagePickerResponse, PhotoQuality } from 'react-native-image-picker';

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { register, loading } = useAuth();
  const [image, setImage] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

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
      await register({ ...values, file: image });
      Alert.alert('Registration successful', 'You can now log in');
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Error', 'Registration could not be completed');
    }
  };

  const handleImagePick = (source: 'camera' | 'gallery') => {
    const options = {
      mediaType: 'photo' as 'photo',
      cameraType: 'back' as 'back' | 'front',
      maxWidth: 1024,
      maxHeight: 1024,
      quality: 0.8 as PhotoQuality,
    };

    if (source === 'camera') {
      ImagePicker.launchCamera(options, (response: ImagePickerResponse) => {
        if (response.didCancel || response.errorCode) {
          console.log('User canceled photo picker or error occurred');
        } else {
          if (response.assets && response.assets.length > 0) {
            setImage(response.assets[0]);
          }
          setModalVisible(false);
        }
      });
    } else if (source === 'gallery') {
      ImagePicker.launchImageLibrary(options, (response: ImagePickerResponse) => {
        if (response.didCancel || response.errorCode) {
          console.log('User canceled photo picker or error occurred');
        } else {
          if (response.assets && response.assets.length > 0) {
            setImage(response.assets[0]);
          }
          setModalVisible(false);
        }
      });
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Create your account</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
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
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
                error={touched.name ? errors.name : undefined}
              />
              <Input
                placeholder="Email"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                error={touched.email ? errors.email : undefined}
              />
              <Input
                placeholder="Phone"
                onChangeText={handleChange('phone')}
                onBlur={handleBlur('phone')}
                value={values.phone}
                error={touched.phone ? errors.phone : undefined}
              />
              <Input
                placeholder="Password"
                secureTextEntry
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                error={touched.password ? errors.password : undefined}
              />
              <Button title="Choose Profile Picture" onPress={() => setModalVisible(true)} />
              {image && <Text>Image selected: {image.fileName}</Text>}

              <Button title="Register" onPress={handleSubmit} />
            </>
          )}
        </Formik>
      )}

      <Button
        title="Log in here"
        onPress={() => navigation.navigate('Login')}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, marginBottom: 20 }}>Choose an option</Text>
          <Button title="Take Photo" onPress={() => handleImagePick('camera')} />
          <Button title="Choose from Gallery" onPress={() => handleImagePick('gallery')} />
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

export default RegisterScreen;
