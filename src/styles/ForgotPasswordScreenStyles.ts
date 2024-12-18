import { StyleSheet } from 'react-native';
import colors from './colors';

const ForgotPasswordScreenStyles = StyleSheet.create({
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
  linkButton: {
    marginTop: 20,
    alignSelf: 'center',
  },
  linkButtonText: {
    color: colors.info,
    fontSize: 16,
  },
});

export default ForgotPasswordScreenStyles;
