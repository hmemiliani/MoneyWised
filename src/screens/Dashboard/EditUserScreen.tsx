import React, { useState, useEffect } from 'react';
import { View, Text, Alert, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import styles from '../../styles/EditUserScreenStyles';
import api from '../../services/api';

const EditUserScreen: React.FC = ({ route, navigation }: any) => {
  const { userId } = route.params; // Recibe el ID del usuario como parámetro
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    phone: '',
    profileImage: '',
    file: null, // Para manejar la nueva foto
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
      Alert.alert('Error', 'No se pudo cargar la información del usuario.');
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

      Alert.alert('Éxito', 'La información se actualizó correctamente.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la información.');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadPhoto = () => {
    Alert.alert('Funcionalidad pendiente', 'Aquí se abriría la galería o cámara para seleccionar una foto.');
    // Aquí puedes implementar react-native-image-picker para subir imágenes.
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
      <Text style={styles.title}>Editar Usuario</Text>
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: formValues.profileImage || 'https://via.placeholder.com/100',
          }}
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.uploadButton} onPress={handleUploadPhoto}>
          <Text style={styles.uploadText}>Cambiar Foto</Text>
        </TouchableOpacity>
      </View>

      <Input
        placeholder="Nombre"
        value={formValues.name}
        onChangeText={(text) => setFormValues({ ...formValues, name: text })}
      />
      <Input
        placeholder="Correo"
        value={formValues.email}
        onChangeText={(text) => setFormValues({ ...formValues, email: text })}
      />
      <Input
        placeholder="Teléfono"
        value={formValues.phone}
        onChangeText={(text) => setFormValues({ ...formValues, phone: text })}
      />

      <Button title="Guardar Cambios" onPress={handleSave} />
    </View>
  );
};

export default EditUserScreen;
