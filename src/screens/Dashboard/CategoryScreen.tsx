import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Button,
  ActivityIndicator,
} from 'react-native';
import {PieChart} from 'react-native-svg-charts';
import {Formik} from 'formik';
import * as Yup from 'yup';
import styles from '../../styles/CategoryScreenStyles';
import api from '../../services/api';
import {RouteProp} from '@react-navigation/native';
import {StackParamList} from '../../navigation/types';

type CategoryScreenRouteProp = RouteProp<StackParamList, 'CategoryScreen'>;

type Budget = {
  id: string;
  name: string;
  amount: string;
  amountSpent: string;
};

interface CategoryScreenProps {
  route: CategoryScreenRouteProp;
}

const CategoryScreen: React.FC<CategoryScreenProps> = ({route}) => {
  const {categoryId, categoryName} = route.params;
  const [budget, setBudget] = useState<Budget | null>(null);
  const [transactions, setTransactions] = useState<
    {amount: string; budgetId: string; description: string}[]
  >([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBudgetAndTransactions = async () => {
      try {
        setLoading(true);

        const budgetsResponse = await api.get('/budgets');
        const filteredBudget = budgetsResponse.data.data.find(
          (b: {name?: string}) =>
            b.name && b.name.trim() === categoryName.trim(),
        );

        if (filteredBudget) {
          setBudget(filteredBudget);

          const transactionsResponse = await api.get('/transactions');
          const filteredTransactions = transactionsResponse.data.filter(
            (t: {budget: {id: string}}) => t.budget.id === filteredBudget.id,
          );

          setTransactions(filteredTransactions);
        } else {
          console.warn(`No budget found for category name: ${categoryName}`);
          setBudget(null);
          setTransactions([]);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBudgetAndTransactions();
  }, [categoryName, categoryId]);

  const handleAddTransaction = async (values: {
    amount: string;
    description: string;
    type: string;
  }) => {
    try {
      if (!budget) {
        console.error('Budget is null. Cannot create transaction.');
        return;
      }

      const transactionData = {
        amount:
          values.type === 'Expense'
            ? -Math.abs(Number(values.amount))
            : Number(values.amount),
        budgetId: budget.id,
        description: values.description,
      };

      const response = await api.post('/transactions', transactionData);

      if (response.status === 201) {
        const newTransaction = response.data;

        setTransactions(prev => [...prev, newTransaction]);

        const updatedAmountSpent =
          budget.amountSpent + Math.abs(transactionData.amount);

        setBudget(prev => prev && {...prev, amountSpent: updatedAmountSpent});
      }

      setModalVisible(false);
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  const transactionSchema = Yup.object().shape({
    amount: Yup.number()
      .required('Amount is required')
      .positive('Must be positive'),
    description: Yup.string().required('Description is required'),
    type: Yup.string()
      .oneOf(['Expense', 'Income'])
      .required('Type is required'),
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6F00" />
      </View>
    );
  }

  const totalSpent = transactions.reduce((acc, transaction) => {
    const amount = String(transaction.amount).replace(/[$,]/g, '');
    const amountValue = parseFloat(amount);

    if (transaction.amount[0] === '-') {
      return acc - amountValue;
    } else {
      return acc + amountValue;
    }
  }, 0);

  const totalBudget = budget?.amount
    ? parseFloat(budget.amount.replace(/[$,]/g, ''))
    : 0;

  const pieData = budget
    ? [
        {
          value: Math.max(totalBudget - totalSpent, 0),
          svg: {fill: '#00C49F'},
          key: 'budget',
        },
        {
          value: totalSpent,
          svg: {fill: '#FF6F61'},
          key: 'spent',
        },
      ]
    : [];

  const formattedTotalSpent = totalSpent.toLocaleString('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const AvailableBudget = Math.max(totalBudget - totalSpent, 0);

  const formattedAvailableBudget = AvailableBudget.toLocaleString('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });


  return (
    <View style={styles.container}>
      <Text style={styles.title}>{categoryName}</Text>
      <PieChart style={styles.pieChart} data={pieData} />
      <View style={styles.budgetDetails}>
        <Text style={styles.budgetText}>
          Available Budget: {formattedAvailableBudget}
        </Text>
        <Text style={styles.spentText}>
          Total Spent: ${formattedTotalSpent}
        </Text>
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(item, index) => `${item.description}-${index}`}
        renderItem={({item}) => {
          const transactionType = item.amount[0] === '-' ? '-' : '$';

          return (
            <View
              style={[
                styles.transactionItem,
                transactionType === '-' ? styles.expense : styles.income,
              ]}>
              <Text style={styles.transactionAmount}>{item.amount}</Text>
              <Text style={styles.transactionDescription}>
                {item.description}
              </Text>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No transactions yet.</Text>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <Formik
            initialValues={{amount: '0', description: '', type: 'Expense'}}
            validationSchema={transactionSchema}
            onSubmit={handleAddTransaction}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              setFieldValue,
            }) => (
              <View style={styles.modalForm}>
                <Text style={styles.modalTitle}>Add Transaction</Text>

                <TextInput
                  style={styles.modalInput}
                  placeholder="Amount"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  onChangeText={handleChange('amount')}
                  onBlur={handleBlur('amount')}
                  value={values.amount.toString()}
                />
                {touched.amount && errors.amount && (
                  <Text style={styles.errorText}>{errors.amount}</Text>
                )}

                <TextInput
                  style={styles.modalInput}
                  placeholder="Description"
                  placeholderTextColor="#999"
                  onChangeText={handleChange('description')}
                  onBlur={handleBlur('description')}
                  value={values.description}
                />
                {touched.description && errors.description && (
                  <Text style={styles.errorText}>{errors.description}</Text>
                )}

                <View style={styles.typeSelector}>
                  <TouchableOpacity
                    style={
                      values.type === 'Expense'
                        ? styles.selectedType
                        : styles.typeButton
                    }
                    onPress={() => setFieldValue('type', 'Expense')}>
                    <Text style={styles.typeText}>Expense</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={
                      values.type === 'Income'
                        ? styles.selectedType
                        : styles.typeButton
                    }
                    onPress={() => setFieldValue('type', 'Income')}>
                    <Text style={styles.typeText}>Income</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.modalButtonsContainer}>
                  <View style={styles.modalButtons}>
                  <TouchableOpacity onPress={() => handleSubmit()}>
                    <Text style={styles.modalButtonText}>Add</Text>
                  </TouchableOpacity>
                  </View>
                  <View style={styles.modalButtons}>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </Formik>
        </View>
      </Modal>
    </View>
  );
};

export default CategoryScreen;
