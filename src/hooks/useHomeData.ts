import {useEffect, useState} from 'react';
import api from '../services/api';

type Category = {
  id: string;
  name: string;
};

type Budget = {
  id: string;
  name: string;
  amount: number;
  startDate: string;
  endDate: string;
  categoryId: string;
  earningId: string;
};

export const useHomeData = () => {
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState<
    Array<{
      id: string;
      name: string;
      startDate: string;
      endDate: string;
      generalAmount: number;
    }>
  >([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      const earningsResponse = await api.get('/earnings');
      setEarnings(
        Array.isArray(earningsResponse.data) ? earningsResponse.data : [],
      );

      const categoriesResponse = await api.get('/categories');
      setCategories(
        Array.isArray(categoriesResponse.data) ? categoriesResponse.data : [],
      );

      const budgetsResponse = await api.get('/budgets');
      setBudgets(
        Array.isArray(budgetsResponse.data) ? budgetsResponse.data : [],
      );
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchEarnings = async () => {
    try {
      setLoading(true);

      const earningsResponse = await api.get('/earnings');
      const cleanedEarnings = Array.isArray(earningsResponse.data?.data)
        ? earningsResponse.data.data.map((earning: { generalAmount: string }) => ({
            ...earning,
            generalAmount: parseFloat(
              (earning.generalAmount || '').replace(/[^0-9.-]+/g, ''),
            ),
          }))
        : [];

      setEarnings(cleanedEarnings);
    } catch (err) {
      console.error('Error fetching earnings:', err);
      setError('Failed to fetch earnings.');
    } finally {
      setLoading(false);
    }
  };

  const createEarning = async (earning: {
    name: string;
    startDate: string;
    endDate: string;
    generalAmount: number;
  }) => {
    try {
      const formattedEarning = {
        ...earning,
        generalAmount: Number(earning.generalAmount),
      };

      console.log('formattedEarning:', formattedEarning);

      const response = await api.post('/earnings', formattedEarning);
      setEarnings(prev => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      console.error('Error Response:', err.response?.data || err.message);

      if (
        err.response?.status === 500 &&
        err.response?.data?.message?.includes('duplicate key value')
      ) {
        throw new Error(
          'An earning with this name and date range already exists.',
        );
      }

      throw new Error('Failed to create earning');
    }
  };

  const createCategoryAndBudget = async (data: {
    categoryName: string;
    budgetName: string;
    amount: number;
    startDate: string;
    endDate: string;
    earningId: string;
  }) => {
    try {
      const categoryResponse = await api.post('/categories', {
        name: data.categoryName,
      });
      const categoryId = categoryResponse.data.id;

      const budgetResponse = await api.post('/budgets', {
        name: data.budgetName,
        amount: data.amount,
        startDate: data.startDate,
        endDate: data.endDate,
        categoryId,
        earningId: data.earningId,
      });

      setCategories(prev => [...prev, categoryResponse.data]);
      setBudgets(prev => [...prev, budgetResponse.data]);
      return {category: categoryResponse.data, budget: budgetResponse.data};
    } catch (err) {
      console.error('Error creating category and budget:', err);
      throw new Error('Failed to create category and budget');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    loading,
    earnings,
    categories,
    budgets,
    error,
    fetchEarnings,
    createEarning,
    createCategoryAndBudget,
  };
};
