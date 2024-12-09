import React, { useState, useEffect } from 'react';
import { View, Text, Alert, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import styles from '../../styles/EditUserScreenStyles';
import api from '../../services/api';

const EditUserScreen: React.FC = ({ route, navigation }: any) => {
  const { userId } = route.params;
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    phone: '',
    profileImage: '',
    file: null,
  });

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/users/${userId}`);
      setFormValues({
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone,
        profileImage: response.data.profileImage,
        file: null,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to load user information.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      if (formValues.name) formData.append('name', formValues.name);
      if (formValues.email) formData.append('email', formValues.email);
      if (formValues.phone) formData.append('phone', formValues.phone);
      if (formValues.file) formData.append('file', formValues.file);

      await api.patch(`/users/${userId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert('Success', 'Information updated successfully.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update information.');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadPhoto = () => {
    Alert.alert('Pending functionality', 'Here the gallery or camera would open to select a photo.');
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6F00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit User</Text>
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: formValues.profileImage || 'https://via.placeholder.com/100',
          }}
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.uploadButton} onPress={handleUploadPhoto}>
          <Text style={styles.uploadText}>Change Photo</Text>
        </TouchableOpacity>
      </View>

      <Input
        placeholder="Name"
        value={formValues.name}
        onChangeText={(text) => setFormValues({ ...formValues, name: text })}
      />
      <Input
        placeholder="Email"
        value={formValues.email}
        onChangeText={(text) => setFormValues({ ...formValues, email: text })}
      />
      <Input
        placeholder="Phone"
        value={formValues.phone}
        onChangeText={(text) => setFormValues({ ...formValues, phone: text })}
      />

      <Button title="Save Changes" onPress={handleSave} />
    </View>
  );
};

export default EditUserScreen;
