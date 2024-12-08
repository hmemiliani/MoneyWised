import { useEffect, useState } from 'react';
import api from '../services/api';

export const useHomeData = () => {
  const [loading, setLoading] = useState(true);
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [graphics, setGraphics] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch budgets
      const budgetsResponse = await api.get('/budgets');
      setBudgets(budgetsResponse.data);

      // Fetch transactions
      const transactionsResponse = await api.get('/transactions');
      setTransactions(transactionsResponse.data);

      // Fetch graphics
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
