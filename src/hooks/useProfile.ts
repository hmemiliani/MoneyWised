import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      if (!userId) return;
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
      if (data.file) {
        formData.append('file', {
          uri: data.file.uri,
          name: 'profile.jpg',
          type: data.file.type || 'image/jpeg',
        });
      }

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
    const getUserId = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      setUserId(storedUserId);
    };

    getUserId();
  }, []);

  useEffect(() => {
    if (userId) fetchProfile();
  }, [userId]);

  return { profile, loading, updateProfile };
};
