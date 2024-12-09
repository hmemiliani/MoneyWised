import { useEffect, useState } from 'react';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useHomeData = () => {
  const [loading, setLoading] = useState(true);
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [graphics, setGraphics] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('token');
      console.log('Token recuperado:', token);
      if (token) {
        api.defaults.headers.Authorization = `Bearer ${token}`;
      }

      const budgetsResponse = await api.get('/budgets');
      setBudgets(budgetsResponse.data);

      const transactionsResponse = await api.get('/transactions');
      setTransactions(transactionsResponse.data);

      const graphicsResponse = await api.get('/graphics/broadcast');
      setGraphics(graphicsResponse.data);

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
