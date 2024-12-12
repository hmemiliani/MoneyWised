import { useEffect, useState } from 'react';
import api from '../services/api';

export const useCategoryData = (categoryId: string) => {
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<any | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchCategoryData = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/categories`);
      const selectedCategory = response.data.find((cat: any) => cat.id === categoryId);

      if (!selectedCategory) {
        throw new Error('Category not found');
      }

      setCategory(selectedCategory);

      const budgetsResponse = await api.get(`/budgets`);
      const categoryBudgets = budgetsResponse.data.filter((budget: any) => budget.category.id === categoryId);
      setBudgets(categoryBudgets);
      setTransactions(selectedCategory.transactions || []);
    } catch (err: any) {
      console.error('Error fetching category data:', err);
      setError(err.message || 'Failed to fetch category data');
    } finally {
      setLoading(false);
    }
  };

  const createBudget = async (budgetData: any) => {
    try {
      const response = await api.post('/budgets', budgetData);
      setBudgets((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      console.error('Error creating budget:', err);
      throw new Error('Failed to create budget. Please try again.');
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, [categoryId]);

  return { loading, category, transactions, budgets, error, fetchCategoryData, createBudget };
};
