/* eslint-disable prettier/prettier */
import React from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import StackRouter from './src/Navigation/StackRouter.js';

const App = ()=>{
  return (
    <NavigationContainer>
      <StackRouter/>
    </NavigationContainer>
  );
};

export default App;
