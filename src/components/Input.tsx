import React from 'react';
import { View, TextInput, Text } from 'react-native';
import styles from '../styles/InputStyles';

interface InputProps {
  placeholder: string;
  value: string;
  style?: object;
  onChangeText: (text: string) => void;
  onBlur?: (field: string) => void;
  secureTextEntry?: boolean;
  error?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}

const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  onChangeText,
  onBlur,
  secureTextEntry = false,
  error,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onBlur={() => onBlur && onBlur(placeholder)}
        secureTextEntry={secureTextEntry}
        placeholderTextColor="#9E9E9E"
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export default Input;
