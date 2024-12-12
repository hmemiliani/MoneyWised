import { NavigatorScreenParams } from '@react-navigation/native';


export type TabsParamList = {
  Home: undefined;
  Budgets: undefined;
  Transactions: undefined;
  Profile: undefined;
};

export type StackParamList = {
  App: NavigatorScreenParams<TabsParamList>;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  EditUser: undefined;
  CategoryScreen: { categoryId: string };
};
