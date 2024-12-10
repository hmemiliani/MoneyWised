import React from 'react';
import { View, Text, Modal, TextInput, Button, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import styles from '../../styles/CategoryScreenStyles';
import { useCategoryData } from '../../hooks/useCategoryData';

const CategoryScreen: React.FC<{ route: any }> = ({ route }) => {
  const { categoryId } = route.params;
  const { budgets, createBudget } = useCategoryData(categoryId);
  const [modalVisible, setModalVisible] = React.useState(false);

  const budgetSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    amount: Yup.number()
      .required('Amount is required')
      .positive('Amount must be positive')
      .typeError('Amount must be a number'),
    description: Yup.string().optional(),
  });

  const handleCreateBudget = async (values: any, actions: any) => {
    try {
      await createBudget({ ...values, categoryId });
      setModalVisible(false);
      actions.resetForm();
    } catch (err) {
      actions.setFieldError('general', 'Failed to create budget. Please try again.');
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Budgets</Text>
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* Modal para agregar presupuestos */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <Formik
            initialValues={{ name: '', amount: '', description: '' }}
            validationSchema={budgetSchema}
            onSubmit={handleCreateBudget}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
              <View style={styles.modalForm}>
                <Text style={styles.modalTitle}>Add New Budget</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Name"
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                />
                {touched.name && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

                <TextInput
                  style={styles.modalInput}
                  placeholder="Amount"
                  keyboardType="numeric"
                  onChangeText={handleChange('amount')}
                  onBlur={handleBlur('amount')}
                  value={values.amount}
                />
                {touched.amount && errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}

                <TextInput
                  style={styles.modalInput}
                  placeholder="Description (Optional)"
                  onChangeText={handleChange('description')}
                  onBlur={handleBlur('description')}
                  value={values.description}
                />
                {touched.description && errors.description && (
                  <Text style={styles.errorText}>{errors.description}</Text>
                )}

                {errors.general && <Text style={styles.errorText}>{errors.general}</Text>}

                <Button title="Add Budget" onPress={handleSubmit} disabled={isSubmitting} />
                <Button title="Cancel" onPress={() => setModalVisible(false)} />
              </View>
            )}
          </Formik>
        </View>
      </Modal>
    </View>
  );
};

export default CategoryScreen;
