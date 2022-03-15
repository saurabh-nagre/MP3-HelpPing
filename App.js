/* eslint-disable prettier/prettier */
import React from 'react';
import Login from './src/componets/LoginPage.js';
import {
  SafeAreaView,
  StyleSheet,
} from 'react-native';

const App = ()=>{
  return (
    <SafeAreaView style={styles.container}>
      <Login/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#cce6ff',
  },
});

export default App;
