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
  }, []);

  const login = async (email: string, password: string) => {
    const { token } = await loginService(email, password);
    await AsyncStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const register = async (data: { name: string; email: string; password: string; phone?: string }) => {
    await registerService(data);
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
