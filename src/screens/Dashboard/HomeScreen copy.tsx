import React, {useState} from 'react';
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
    createCategoryAndBudget,
  } = useHomeData();
  const navigation = useNavigation<NavigationProp>();
  const [earningModalVisible, setEarningModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

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
    budgetName: Yup.string().required('Budget name is required'),
    amount: Yup.number()
      .required('Amount is required')
      .positive('Must be positive'),
    startDate: Yup.string().required('Start date is required'),
    endDate: Yup.string().required('End date is required'),
    earningId: Yup.string().required('Earning is required'),
  });

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
            ? earnings.reduce(
                (total, earning) => total + (earning.generalAmount || 0),
                0,
              )
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
              navigation.navigate('CategoryScreen', {categoryId: item.id})
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
            onSubmit={async (values, actions) => {
              try {
                setGeneralError(null);
                const formattedValues = {
                  ...values,
                  generalAmount: Number(values.generalAmount),
                };
                await createEarning(formattedValues);
                setEarningModalVisible(false);
                actions.resetForm();
              } catch {
                setGeneralError('Failed to create earning');
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

                {generalError && (
                  <Text style={styles.errorText}>{generalError}</Text>
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
              budgetName: '',
              amount: '',
              startDate: '',
              endDate: '',
              earningId: '',
            }}
            validationSchema={categoryBudgetSchema}
            onSubmit={async (values, actions) => {
              try {
                const formattedValues = {
                  ...values,
                  amount: Number(values.amount),
                };
                await createCategoryAndBudget(formattedValues);
                setCategoryModalVisible(false);
                actions.resetForm();
              } catch {
                setGeneralError('Failed to create category and budget');
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
                  placeholder="Budget Name"
                  onChangeText={handleChange('budgetName')}
                  onBlur={handleBlur('budgetName')}
                  value={values.budgetName}
                />
                {touched.budgetName && errors.budgetName && (
                  <Text style={styles.errorText}>{errors.budgetName}</Text>
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

                <TextInput
                  style={styles.modalInput}
                  placeholder="Select Earning ID"
                  onChangeText={handleChange('earningId')}
                  onBlur={handleBlur('earningId')}
                  value={values.earningId}
                />
                {touched.earningId && errors.earningId && (
                  <Text style={styles.errorText}>{errors.earningId}</Text>
                )}

                {generalError && (
                  <Text style={styles.errorText}>{generalError}</Text>
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
