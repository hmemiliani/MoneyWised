import { useEffect, useState } from 'react';
import api from '../services/api';

export const useCategoryData = (categoryId: string) => {
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<any | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Obtener datos de la categoría y sus presupuestos/transacciones
  const fetchCategoryData = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/api/categories`);
      const selectedCategory = response.data.find((cat: any) => cat.id === categoryId);

      if (!selectedCategory) {
        throw new Error('Category not found');
      }

      setCategory(selectedCategory);

      // Obtener presupuestos relacionados con la categoría
      const budgetsResponse = await api.get(`/api/budgets`);
      const categoryBudgets = budgetsResponse.data.filter((budget: any) => budget.category.id === categoryId);
      setBudgets(categoryBudgets);

      // Simulación de transacciones asociadas (debe implementarse correctamente en el backend)
      setTransactions(selectedCategory.transactions || []);
    } catch (err: any) {
      console.error('Error fetching category data:', err);
      setError(err.message || 'Failed to fetch category data');
    } finally {
      setLoading(false);
    }
  };

  // Crear un nuevo presupuesto asociado a la categoría
  const createBudget = async (budgetData: any) => {
    try {
      const response = await api.post('/api/budgets', budgetData);
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
