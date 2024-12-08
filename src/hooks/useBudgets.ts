import { useState, useEffect } from 'react';
import api from '../services/api';

export const useBudgets = () => {
  const [loading, setLoading] = useState(false);
  const [budgets, setBudgets] = useState([]);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/budgets');
      setBudgets(response.data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const createBudget = async (data: {
    name: string;
    description: string;
    amount: number;
    startDate: string;
    endDate: string;
  }) => {
    try {
      await api.post('/budgets', data);
      await fetchBudgets();
    } catch (error) {
      console.error('Error creating budget:', error);
    }
  };

  const editBudget = async (id: string, data: Partial<{ name: string; amount: number }>) => {
    try {
      await api.patch(`/budgets/${id}`, data);
      await fetchBudgets();
    } catch (error) {
      console.error('Error editing budget:', error);
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      await api.delete(`/budgets/${id}`);
      await fetchBudgets();
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  return { budgets, loading, createBudget, editBudget, deleteBudget };
};
