import { useState, useEffect } from 'react';
import api from '../services/api';

export const useProfile = (userId: string) => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/users/${userId}`);
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<{ name: string; email: string; phone: string; file: any }>) => {
    try {
      setLoading(true);
      const formData = new FormData();

      if (data.name) formData.append('name', data.name);
      if (data.email) formData.append('email', data.email);
      if (data.phone) formData.append('phone', data.phone);
      if (data.file) formData.append('file', data.file);

      await api.patch(`/users/${userId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  return { profile, loading, updateProfile };
};
