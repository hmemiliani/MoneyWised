import { StyleSheet } from 'react-native';
import colors from './colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray.light,
    padding: 20,
  },
  budgetHeader: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  availableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  availableAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
    marginTop: 10,
  },
  budgetList: {
    paddingBottom: 20,
  },
  budgetItem: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    color: colors.primary,
  },
  budgetPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.secondary,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: colors.primary,
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  floatingButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

