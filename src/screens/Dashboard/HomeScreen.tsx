import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useHomeData } from '../../hooks/useHomeData';
import styles from '../../styles/HomeScreenStyles';

const HomeScreen: React.FC = () => {
  const { loading, budgets } = useHomeData();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6F00" />
      </View>
    );
  }

  const renderBudgetItem = ({ item }: { item: any }) => {
    const spentPercentage = Math.min((item.spent / item.amount) * 100, 100).toFixed(0);
    return (
      <TouchableOpacity style={styles.budgetItem} onPress={() => console.log(`Navigate to ${item.name}`)}>
        <Text style={styles.budgetName}>{item.name}</Text>
        <Text style={styles.budgetDetail}>${item.amount}</Text>
        <Text style={styles.budgetPercentage}>{spentPercentage}%</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.budgetHeader}>
        <Text style={styles.availableTitle}>Available Budget</Text>
        <Text style={styles.availableAmount}>
          ${budgets.reduce((acc, budget) => acc + budget.amount - budget.spent, 0)}
        </Text>
      </View>

      <FlatList
        data={budgets}
        keyExtractor={(item) => item.id}
        renderItem={renderBudgetItem}
        contentContainerStyle={styles.budgetList}
      />

      <TouchableOpacity style={styles.floatingButton} onPress={() => console.log('Add earning or category')}>
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
