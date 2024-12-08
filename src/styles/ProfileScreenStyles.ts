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
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.gray.medium,
    marginBottom: 10,
  },
  uploadButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
  uploadText: {
    color: colors.white,
    fontSize: 14,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.gray.dark,
  },
  profileDetail: {
    fontSize: 16,
    color: colors.gray.medium,
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
