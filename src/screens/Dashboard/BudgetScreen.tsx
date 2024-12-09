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
      Alert.alert('Error', 'Please complete all required fields.');
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
      'Delete Budget',
      'Are you sure you want to delete this budget?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => await deleteBudget(id) },
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
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Budgets</Text>
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
            placeholder="Budget Name"
            value={formValues.name}
            onChangeText={(text) => setFormValues({ ...formValues, name: text })}
          />
          <Input
            placeholder="Description"
            value={formValues.description}
            onChangeText={(text) => setFormValues({ ...formValues, description: text })}
          />
          <Input
            placeholder="Amount"
            value={formValues.amount}
            keyboardType="numeric"
            onChangeText={(text) => setFormValues({ ...formValues, amount: text })}
          />
          <Input
            placeholder="Start Date (YYYY-MM-DD)"
            value={formValues.startDate}
            onChangeText={(text) => setFormValues({ ...formValues, startDate: text })}
          />
          <Input
            placeholder="End Date (YYYY-MM-DD)"
            value={formValues.endDate}
            onChangeText={(text) => setFormValues({ ...formValues, endDate: text })}
          />
          <Button title="Save" onPress={handleCreate} />
        </View>
      )}
      <Button title={showForm ? 'Cancel' : 'Add Budget'} onPress={() => setShowForm(!showForm)} />
    </View>
  );
};

export default BudgetScreen;
