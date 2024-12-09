import React from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import Button from '../../components/Button';
import styles from '../../styles/HomeScreenStyles';
import { useHomeData } from '../../hooks/useHomeData';
import { useAuth } from '../../hooks/useAuth';

const HomeScreen: React.FC = () => {
  const { logout } = useAuth();
  const { loading, budgets, transactions, graphics } = useHomeData();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6F00" />
      </View>
    );
  }

  const renderBudgetItem = ({ item }: { item: any }) => (
    <View style={styles.budgetItem}>
      <Text style={styles.budgetName}>{item.name}</Text>
      <Text style={styles.budgetDetail}>
        ${item.spent} / ${item.amount}
      </Text>
    </View>
  );

  const renderTransactionItem = ({ item }: { item: any }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionDescription}>{item.description}</Text>
      <Text style={styles.transactionDetail}>${item.amount}</Text>
      <Text style={styles.transactionDate}>{item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Summary of your finances</Text>

      <Text style={styles.sectionTitle}>Charts</Text>
      <PieChart
      style={styles.chart}
      data={graphics.map((item: any) => ({
        value: item.value,
        svg: { fill: item.color },
        key: item.key,
      }))}
      />

      <Text style={styles.sectionTitle}>Budgets</Text>
      <FlatList
      data={budgets}
      keyExtractor={(item) => item.id}
      renderItem={renderBudgetItem}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.budgetList}
      />

      <Text style={styles.sectionTitle}>Recent Transactions</Text>
      <FlatList
      data={transactions}
      keyExtractor={(item) => item.id}
      renderItem={renderTransactionItem}
      showsVerticalScrollIndicator={false}
      />

      <Button title="Log out" onPress={logout} />
    </View>
  );
};

export default HomeScreen;
