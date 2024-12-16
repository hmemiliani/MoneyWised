import { useState, useEffect } from 'react';
import api from '../services/api';

type Category = {
  id: string;
  name: string;
  budgetId?: string;
  budgetAmount?: number;
};

type Transaction = {
  id: string;
  amount: number;
  description: string;
};

export const useCategoryData = (categoryId: string) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategoryDetails = async () => {
    try {
      const categoryResponse = await api.get(`/categories/${categoryId}`);
      setCategory(categoryResponse.data);

      const transactionsResponse = await api.get('/transactions');
      setTransactions(transactionsResponse.data);
    } catch (err) {
      console.error('Error fetching category details:', err);
      setError('Failed to load category details.');
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (
    budgetId: string,
    amount: number,
    description: string,
    type: 'income' | 'expense'
  ) => {
    try {
      const formattedAmount = type === 'expense' ? -Math.abs(amount) : Math.abs(amount);
      const response = await api.post('/transactions', {
        budgetId,
        amount: formattedAmount,
        description,
      });
      setTransactions((prev) => [...prev, response.data]);
    } catch (err) {
      console.error('Error creating transaction:', err);
      setError('Failed to create transaction.');
    }
  };

  useEffect(() => {
    fetchCategoryDetails();
  }, [categoryId]);

  return {
    category,
    transactions,
    loading,
    error,
    createTransaction,
  };
};