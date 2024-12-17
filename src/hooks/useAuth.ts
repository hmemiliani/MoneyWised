import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import {
  login as loginService,
  register as registerService,
  forgotPassword as forgotPasswordService,
  validateRecoveryCode as validateRecoveryCodeService,
  resetPassword as resetPasswordService,
} from '../services/authService';

interface DecodedToken {
  email: string;
  iat: number;
  userId: string;
}

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      setIsAuthenticated(!!token);
      setLoading(false);
    };

    checkAuth();

    const interval = setInterval(() => {
      checkAuth();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { accessToken } = await loginService(email, password);
      const decoded: DecodedToken = jwtDecode(accessToken);
      const { userId } = decoded;
      await AsyncStorage.setItem('token', accessToken);
      await AsyncStorage.setItem('userId', userId);

      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error in login:', error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    file?: any;
  }) => {
    setLoading(true);
    try {
      await registerService(data);
    } catch (error) {
      console.error('Error in registration:', error);
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setLoading(true);
    try {
      await forgotPasswordService(email);
    } catch (error) {
      console.error('Error in forgotPassword:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateRecoveryCode = async (data: { email: string; token: string }) => {
    setLoading(true);
    try {
      await validateRecoveryCodeService(data);
    } catch (error) {
      console.error('Error in validateRecoveryCode:', error);
      throw new Error('Invalid recovery code.');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (data: {
    email: string;
    token: string;
    newPassword: string;
  }) => {
    setLoading(true);
    try {
      await resetPasswordService(data);
    } catch (error) {
      console.error('Error in resetPassword:', error);
      throw new Error('Could not reset password.');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userId');
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    loading,
    login,
    register,
    forgotPassword,
    validateRecoveryCode,
    resetPassword,
    logout,
  };
};
