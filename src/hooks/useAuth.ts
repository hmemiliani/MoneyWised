import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as loginService, register as registerService, forgotPassword as forgotPasswordService } from '../services/authService';

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
      await AsyncStorage.setItem('token', accessToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error in login:', error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: { name: string; email: string; password: string; phone?: string; file?: any }) => {
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
    await forgotPasswordService(email);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    loading,
    login,
    register,
    forgotPassword,
    logout,
  };
};
