/* eslint-disable prettier/prettier */
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginPage from  '../componets/LoginPage';
import Dashboard from '../componets/DashboardPage';

const Stack = createNativeStackNavigator();

export default function StackRouter() {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginPage} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
    </Stack.Navigator>
  );
}
