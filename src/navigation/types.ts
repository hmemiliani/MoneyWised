import { NavigatorScreenParams } from '@react-navigation/native';


export type TabsParamList = {
  Home: undefined;
  Budgets: undefined;
  Transactions: undefined;
  Profile: undefined;
  EditUser: undefined;
};

export type StackParamList = {
  App: NavigatorScreenParams<TabsParamList>;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  CategoryScreen: { categoryId: string };
};
