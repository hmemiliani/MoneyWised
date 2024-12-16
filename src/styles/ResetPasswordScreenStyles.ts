import { StyleSheet } from 'react-native';
import colors from './colors';

const ResetPasswordScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray.medium,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: colors.white,
  },
  button: {
    marginTop: 20,
  },
});

export default ResetPasswordScreenStyles;
