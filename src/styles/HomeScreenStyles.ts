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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.gray.dark,
    marginTop: 20,
    marginBottom: 10,
  },
  budgetList: {
    paddingVertical: 10,
  },
  budgetItem: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 15,
    marginRight: 15,
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
  transactionItem: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.gray.dark,
  },
  transactionDetail: {
    fontSize: 14,
    color: colors.primary,
    marginTop: 5,
  },
  transactionDate: {
    fontSize: 12,
    color: colors.gray.medium,
    marginTop: 2,
  },
  chart: {
    height: 200,
    width: 200,
    alignSelf: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
