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


  const earningSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    generalAmount: Yup.number()
      .required('Amount is required')
      .positive('Must be positive'),
    startDate: Yup.string().required('Start date is required'),
    endDate: Yup.string().required('End date is required'),
  });

  const categoryBudgetSchema = Yup.object().shape({
    categoryName: Yup.string().required('Category name is required'),
    amount: Yup.number()
      .required('Amount is required')
      .positive('Must be positive'),
    startDate: Yup.string().required('Start date is required'),
    endDate: Yup.string().required('End date is required'),
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
        startDate: values.startDate,
        endDate: values.endDate,
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
                total + (parseFloat((earning.generalAmount || '0').toString().replace(/[$,]/g, '')) - parseFloat((earning.amountBudgeted || '0').toString().replace(/[$,]/g, ''))),
                0
              )
              .toLocaleString()
            : 0}
        </Text>
        <Text style={styles.addIcon}>+</Text>
      </TouchableOpacity>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
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
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setCategoryModalVisible(true)}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* Modal for Adding Earning */}
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
                  keyboardType="numeric"
                  onChangeText={handleChange('generalAmount')}
                  onBlur={handleBlur('generalAmount')}
                  value={values.generalAmount.toString()}
                />
                {touched.generalAmount && errors.generalAmount && (
                  <Text style={styles.errorText}>{errors.generalAmount}</Text>
                )}

                <TextInput
                  style={styles.modalInput}
                  placeholder="Start Date"
                  onChangeText={handleChange('startDate')}
                  onBlur={handleBlur('startDate')}
                  value={values.startDate}
                />
                {touched.startDate && errors.startDate && (
                  <Text style={styles.errorText}>{errors.startDate}</Text>
                )}

                <TextInput
                  style={styles.modalInput}
                  placeholder="End Date"
                  onChangeText={handleChange('endDate')}
                  onBlur={handleBlur('endDate')}
                  value={values.endDate}
                />
                {touched.endDate && errors.endDate && (
                  <Text style={styles.errorText}>{errors.endDate}</Text>
                )}

                <Button
                  title="Add Earning"
                  onPress={() => handleSubmit()}
                  disabled={isSubmitting}
                />
                <Button
                  title="Cancel"
                  onPress={() => setEarningModalVisible(false)}
                />
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
                  placeholder="Start Date"
                  onChangeText={handleChange('startDate')}
                  onBlur={handleBlur('startDate')}
                  value={values.startDate}
                />
                {touched.startDate && errors.startDate && (
                  <Text style={styles.errorText}>{errors.startDate}</Text>
                )}

                <TextInput
                  style={styles.modalInput}
                  placeholder="End Date"
                  onChangeText={handleChange('endDate')}
                  onBlur={handleBlur('endDate')}
                  value={values.endDate}
                />
                {touched.endDate && errors.endDate && (
                  <Text style={styles.errorText}>{errors.endDate}</Text>
                )}

                <Button
                  title="Add Category & Budget"
                  onPress={() => handleSubmit()}
                  disabled={isSubmitting}
                />
                <Button
                  title="Cancel"
                  onPress={() => setCategoryModalVisible(false)}
                />
              </View>
            )}
          </Formik>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;
