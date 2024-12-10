import { useEffect, useState } from 'react';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useHomeData = () => {
  const [loading, setLoading] = useState(true);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [graphics, setGraphics] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('token');

      if (token) {
        api.defaults.headers.Authorization = `Bearer ${token}`;
      }

      const [budgetsResponse, transactionsResponse, graphicsResponse] = await Promise.all([
        api.get('/budgets'),
        api.get('/transactions'),
        api.get('/graphics/broadcast'),
      ]);

      setBudgets(budgetsResponse?.data || []);
      setTransactions(transactionsResponse?.data || []);
      setGraphics(graphicsResponse?.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { loading, budgets, transactions, graphics };
};
