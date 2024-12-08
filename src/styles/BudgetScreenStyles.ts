import { StyleSheet } from 'react-native';
import colors from './colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray.light,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  budgetList: {
    paddingVertical: 10,
  },
  budgetItem: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  budgetName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.gray.dark,
  },
  budgetDetail: {
    fontSize: 14,
    color: colors.gray.medium,
    marginTop: 5,
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: colors.danger,
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  deleteText: {
    color: colors.white,
    fontSize: 14,
  },
  form: {
    marginBottom: 20,
  },
});
