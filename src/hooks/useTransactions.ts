import { useState, useEffect } from 'react';
import api from '../services/api';

export const useTransactions = () => {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/transactions');
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (data: {
    amount: number;
    budgetId: string;
    description: string;
    date: string;
  }) => {
    try {
      await api.post('/transactions', data);
      await fetchTransactions();
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  const editTransaction = async (id: string, data: Partial<{ amount: number; description: string }>) => {
    try {
      await api.patch(`/transactions/${id}`, data);
      await fetchTransactions();
    } catch (error) {
      console.error('Error editing transaction:', error);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await api.delete(`/transactions/${id}`);
      await fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return { transactions, loading, createTransaction, editTransaction, deleteTransaction };
};
