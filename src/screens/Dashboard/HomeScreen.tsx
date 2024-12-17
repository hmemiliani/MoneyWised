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
import {Formik} from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../styles/HomeScreenStyles';
import {useHomeData} from '../../hooks/useHomeData';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {StackParamList, TabsParamList} from '../../navigation/types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {RefreshControl} from 'react-native-gesture-handler';

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamList, 'Home'>,
  NativeStackNavigationProp<StackParamList>
>;

const HomeScreen: React.FC = () => {
  const {
    loading,
    earnings,
    categories,
    createEarning,
    fetchCategories,
    createCategoryAndBudget,
    fetchEarnings,
  } = useHomeData();

  const navigation = useNavigation<NavigationProp>();
  const [earningModalVisible, setEarningModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [selectedEarningId, setSelectedEarningId] = useState<string | null>(
    null,
  );
  const [refreshing, setRefreshing] = useState(false);

  const getDateRange = () => {
    const today = new Date();
    const startDate = today.toISOString().split('T')[0];

    today.setDate(today.getDate() + 30);
    const endDate = today.toISOString().split('T')[0];

    return {startDate, endDate};
  };

  const {startDate, endDate} = getDateRange();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await getSelectedEarningId();
        await fetchEarnings();
        await fetchCategories();
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchEarnings();
      await fetchCategories();
    } catch (error) {
      console.error('Error during refresh:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const earningSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    generalAmount: Yup.number()
      .required('Amount is required')
      .positive('Must be positive'),
  });

  const categoryBudgetSchema = Yup.object().shape({
    categoryName: Yup.string().required('Category name is required'),
    amount: Yup.number()
      .required('Amount is required')
      .positive('Must be positive'),
  });

  const handleCreateEarning = async (values: {
    name: string;
    generalAmount: number;
    startDate: string;
    endDate: string;
  }) => {
    try {
      const formattedEarning = {
        name: values.name,
        generalAmount: values.generalAmount,
        startDate: startDate,
        endDate: endDate,
      };

      const response = await createEarning(formattedEarning);

      const newEarningId = response?.id || response?.data?.id;
      if (newEarningId) {
        await AsyncStorage.setItem('selectedEarningId', newEarningId);
      } else {
        console.error('No ID found in the response:', response);
      }

      await fetchEarnings();
      setEarningModalVisible(false);
    } catch (error) {
      console.error('Error creating earning:', error);
    }
  };

  const getSelectedEarningId = async () => {
    try {
      const id = await AsyncStorage.getItem('selectedEarningId');
      if (!id) {
        console.warn('No earning ID found.');
      }
      setSelectedEarningId(id);
    } catch (error) {
      console.error('Error fetching selected earning ID:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6F00" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.earningButton}
        onPress={() => setEarningModalVisible(true)}>
        <Text style={styles.earningText}>Available Budget</Text>
        <Text style={styles.earningAmount}>
          $
          {Array.isArray(earnings)
            ? earnings
                .reduce(
                  (total, earning) =>
                    total +
                    (parseFloat(
                      (earning.generalAmount || '0')
                        .toString()
                        .replace(/[$,]/g, ''),
                    ) -
                      parseFloat(
                        (earning.amountBudgeted || '0')
                          .toString()
                          .replace(/[$,]/g, ''),
                      )),
                  0,
                )
                .toLocaleString()
            : 0}
        </Text>
        <Text style={styles.addIcon}>+</Text>
      </TouchableOpacity>

      <FlatList
        data={categories}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.categoryItem}
            onPress={() =>
              navigation.navigate('CategoryScreen', {
                categoryId: item.id,
                categoryName: item.name,
              })
            }>
            <Text style={styles.categoryName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No categories available. Add one!
          </Text>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setCategoryModalVisible(true)}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <Modal visible={earningModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <Formik
            initialValues={{
              name: '',
              generalAmount: 0,
              startDate: '',
              endDate: '',
            }}
            validationSchema={earningSchema}
            onSubmit={handleCreateEarning}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isSubmitting,
            }) => (
              <View style={styles.modalForm}>
                <Text style={styles.modalTitle}>Add Earning</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Name"
                  placeholderTextColor="#999"
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                />
                {touched.name && errors.name && (
                  <Text style={styles.errorText}>{errors.name}</Text>
                )}

                <TextInput
                  style={styles.modalInput}
                  placeholder="Amount"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  onChangeText={handleChange('generalAmount')}
                  onBlur={handleBlur('generalAmount')}
                  value={values.generalAmount.toString()}
                />
                {touched.generalAmount && errors.generalAmount && (
                  <Text style={styles.errorText}>{errors.generalAmount}</Text>
                )}

                <View style={styles.modalButtonsContainer}>
                  <View style={styles.modalButtons}>
                    <TouchableOpacity onPress={() => handleSubmit()} disabled={isSubmitting}>
                      <Text style={styles.modalButtonText}>Add</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      onPress={() => setEarningModalVisible(false)}>
                      <Text style={styles.modalButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </Formik>
        </View>
      </Modal>

      <Modal visible={categoryModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <Formik
            initialValues={{
              categoryName: '',
              amount: 0,
              startDate: '',
              endDate: '',
            }}
            validationSchema={categoryBudgetSchema}
            onSubmit={async (values, actions) => {
              if (!selectedEarningId) {
                console.error(
                  'No earning ID found. Cannot create category and budget.',
                );
                return;
              }
              try {
                const categoryData = {
                  ...values,
                  startDate: startDate,
                  endDate: endDate,
                  earningId: selectedEarningId || '',
                };
                await createCategoryAndBudget(categoryData);
                setCategoryModalVisible(false);
                actions.resetForm();
              } catch (error) {
                console.error('Error creating category:', error);
              }
            }}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isSubmitting,
            }) => (
              <View style={styles.modalForm}>
                <Text style={styles.modalTitle}>Add Category and Budget</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Category Name"
                  placeholderTextColor="#999"
                  onChangeText={handleChange('categoryName')}
                  onBlur={handleBlur('categoryName')}
                  value={values.categoryName}
                />
                {touched.categoryName && errors.categoryName && (
                  <Text style={styles.errorText}>{errors.categoryName}</Text>
                )}

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

                <View style={styles.modalButtonsContainer}>
                  <View style={styles.modalButtons}>
                    <TouchableOpacity onPress={() => handleSubmit()} disabled={isSubmitting}>
                      <Text style={styles.modalButtonText}>Add</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      onPress={() => setCategoryModalVisible(false)}>
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

export default HomeScreen;
