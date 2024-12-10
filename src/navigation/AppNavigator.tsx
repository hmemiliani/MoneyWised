import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../hooks/useAuth';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import HomeScreen from '../screens/Dashboard/HomeScreen';
import BudgetScreen from '../screens/Dashboard/BudgetScreen';
import TransactionScreen from '../screens/Dashboard/TransactionScreen';
import ProfileScreen from '../screens/Dashboard/ProfileScreen';
import EditUserScreen from '../screens/Dashboard/EditUserScreen';
import CategoryScreen from '../screens/Dashboard/CategoryScreen'; // Importa la nueva pantalla de categorías
import { StackParamList, TabsParamList } from './types';
import Icon from 'react-native-vector-icons/Ionicons';

const Stack = createNativeStackNavigator<StackParamList>();
const Tabs = createBottomTabNavigator<TabsParamList>();

const AppTabs: React.FC = () => {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({ color, size }) => {
          let iconName: string = '';
          if (route.name === 'Home') {
            iconName = 'home-outline';
          }
          if (route.name === 'Budgets') {
            iconName = 'pie-chart-outline';
          }
          if (route.name === 'Transactions') {
            iconName = 'list-outline';
          }
          if (route.name === 'Profile') {
            iconName = 'person-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6F00',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tabs.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tabs.Screen
        name="Budgets"
        component={BudgetScreen}
        options={{ headerShown: false }}
      />
      <Tabs.Screen
        name="Transactions"
        component={TransactionScreen}
        options={{ headerShown: false }}
      />
      <Tabs.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Tabs.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <Stack.Navigator>
          <Stack.Screen
            name="App"
            component={AppTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CategoryScreen"
            component={CategoryScreen}
            options={{ headerShown: true, title: 'Category Details' }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
