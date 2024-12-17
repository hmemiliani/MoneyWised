import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

export const login = async (email: string, password: string) => {
  const loginValues = {
    email: email,
    password: password,
  };

  try {
    const response = await api.post('/auth/login', loginValues, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data && response.data.accessToken) {
      await AsyncStorage.setItem('token', response.data.accessToken);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  file?: any;
}) => {
  const formData = new FormData();

  formData.append('name', data.name);
  formData.append('email', data.email);
  formData.append('password', data.password);
  formData.append('phone', data.phone);

  if (data.file) {
    formData.append('file', {
      uri: data.file.uri,
      type: data.file.type,
      name: data.file.fileName,
    });
  }

  const response = await api.post('/auth/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};


export const validateRecoveryCode = async (data: { email: string; token: string }) => {
  const response = await api.post('/auth/validate-recovery-code', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};


export const resetPassword = async (data: { email: string; token: string; newPassword: string }) => {
  const response = await api.post('/auth/reset-password', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};
