import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useProfile } from '../../hooks/useProfile';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/Button';
import Input from '../../components/Input';
import styles from '../../styles/ProfileScreenStyles';

const ProfileScreen: React.FC = () => {
  const { logout } = useAuth();
  const { profile, loading, updateProfile } = useProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    profilePicture: null as any,
  });

  const handleSave = async () => {
    try {
      await updateProfile(formValues);
      setIsEditing(false);
      Alert.alert('Profile updated', 'Your information was updated successfully.');
    } catch (error) {
      Alert.alert('Error', 'Could not update your profile.');
    }
  };

  const handleCancel = () => {
    setFormValues({
      name: profile?.name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      profilePicture: null,
    });
    setIsEditing(false);
  };

  const handleImagePick = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: false,
    });

    if (result.assets && result.assets.length > 0) {
      const image = result.assets[0];
      setFormValues({ ...formValues, profilePicture: image });
    }
  };

  if (loading || !profile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6F00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: formValues.profilePicture?.uri || profile?.profileImage || 'https://via.placeholder.com/100',
          }}
          style={styles.profileImage}
        />
        {isEditing && (
          <TouchableOpacity style={styles.uploadButton} onPress={handleImagePick}>
            <Text style={styles.uploadText}>Change Photo</Text>
          </TouchableOpacity>
        )}
        {!isEditing ? (
          <>
            <Text style={styles.profileName}>{profile?.name}</Text>
            <Text style={styles.profileDetail}>{profile?.email}</Text>
            <Text style={styles.profileDetail}>{profile?.phone}</Text>
          </>
        ) : (
          <View>
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
          </View>
        )}
      </View>

      {isEditing ? (
        <>
          <Button title="Save Changes" onPress={handleSave} />
          <Button title="Cancel" onPress={handleCancel} />
        </>
      ) : (
        <Button title="Edit Profile" onPress={() => setIsEditing(true)} />
      )}

      <Button title="Logout" onPress={logout} />
    </View>
  );
};

export default ProfileScreen;
