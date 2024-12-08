import React, { useState } from 'react';
import { View, Text, FlatList, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useBudgets } from '../../hooks/useBudgets';
import Button from '../../components/Button';
import Input from '../../components/Input';
import styles from '../../styles/BudgetScreenStyles';

const BudgetScreen: React.FC = () => {
  const { budgets, loading, createBudget, editBudget, deleteBudget } = useBudgets();
  const [showForm, setShowForm] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    amount: '',
    startDate: '',
    endDate: '',
  });

  const handleCreate = async () => {
    if (!formValues.name || !formValues.amount) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios.');
      return;
    }

    await createBudget({
      name: formValues.name,
      description: formValues.description,
      amount: parseFloat(formValues.amount),
      startDate: formValues.startDate,
      endDate: formValues.endDate,
    });

    setShowForm(false);
    setFormValues({ name: '', description: '', amount: '', startDate: '', endDate: '' });
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Eliminar Presupuesto',
      '¿Estás seguro de que deseas eliminar este presupuesto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: async () => await deleteBudget(id) },
      ]
    );
  };

  const renderBudgetItem = ({ item }: { item: any }) => (
    <View style={styles.budgetItem}>
      <Text style={styles.budgetName}>{item.name}</Text>
      <Text style={styles.budgetDetail}>
        ${item.spent} / ${item.amount}
      </Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}
      >
        <Text style={styles.deleteText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Presupuestos</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#FF6F00" />
      ) : (
        <FlatList
          data={budgets}
          keyExtractor={(item) => item.id}
          renderItem={renderBudgetItem}
          contentContainerStyle={styles.budgetList}
        />
      )}

      {showForm && (
        <View style={styles.form}>
          <Input
            placeholder="Nombre del presupuesto"
            value={formValues.name}
            onChangeText={(text) => setFormValues({ ...formValues, name: text })}
          />
          <Input
            placeholder="Descripción"
            value={formValues.description}
            onChangeText={(text) => setFormValues({ ...formValues, description: text })}
          />
          <Input
            placeholder="Monto"
            value={formValues.amount}
            keyboardType="numeric"
            onChangeText={(text) => setFormValues({ ...formValues, amount: text })}
          />
          <Input
            placeholder="Fecha de inicio (YYYY-MM-DD)"
            value={formValues.startDate}
            onChangeText={(text) => setFormValues({ ...formValues, startDate: text })}
          />
          <Input
            placeholder="Fecha de fin (YYYY-MM-DD)"
            value={formValues.endDate}
            onChangeText={(text) => setFormValues({ ...formValues, endDate: text })}
          />
          <Button title="Guardar" onPress={handleCreate} />
        </View>
      )}
      <Button title={showForm ? 'Cancelar' : 'Agregar Presupuesto'} onPress={() => setShowForm(!showForm)} />
    </View>
  );
};

export default BudgetScreen;
