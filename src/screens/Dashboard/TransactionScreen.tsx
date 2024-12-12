import React, { useState } from 'react';
import { View, Text, FlatList, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTransactions } from '../../hooks/useTransactions';
import Button from '../../components/Button';
import Input from '../../components/Input';
import styles from '../../styles/TransactionScreenStyles';

const TransactionScreen: React.FC = () => {
  const { transactions, loading, createTransaction, deleteTransaction } = useTransactions();
  const [showForm, setShowForm] = useState(false);
  const [formValues, setFormValues] = useState({
    description: '',
    amount: '',
    date: '',
    budgetId: '',
  });

  const handleCreate = async () => {
    if (!formValues.description || !formValues.amount || !formValues.date || !formValues.budgetId) {
      Alert.alert('Error', 'Please complete all fields.');
      return;
    }

    await createTransaction({
      description: formValues.description,
      amount: parseFloat(formValues.amount),
      date: formValues.date,
      budgetId: formValues.budgetId,
    });

    setShowForm(false);
    setFormValues({ description: '', amount: '', date: '', budgetId: '' });
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => await deleteTransaction(id) },
      ]
    );
  };

  const renderTransactionItem = ({ item }: { item: any }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionDescription}>{item.description}</Text>
      <Text style={styles.transactionAmount}>${item.amount}</Text>
      <Text style={styles.transactionDate}>{item.date}</Text>
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
      <Text style={styles.title}>Transactions</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#FF6F00" />
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={renderTransactionItem}
          contentContainerStyle={styles.transactionList}
        />
      )}

      {showForm && (
        <View style={styles.form}>
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
            placeholder="Date (YYYY-MM-DD)"
            value={formValues.date}
            onChangeText={(text) => setFormValues({ ...formValues, date: text })}
          />
          <Input
            placeholder="Budget ID"
            value={formValues.budgetId}
            onChangeText={(text) => setFormValues({ ...formValues, budgetId: text })}
          />
          <Button title="Save" onPress={handleCreate} />
        </View>
      )}
      <Button title={showForm ? 'Cancel' : 'Add Transaction'} onPress={() => setShowForm(!showForm)} />
    </View>
  );
};

export default TransactionScreen;
