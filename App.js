/* eslint-disable prettier/prettier */
import React from 'react';
import 'react-native-gesture-handler';
import StackRouter from './src/Navigation/Router.js';
import { SafeAreaView ,StyleSheet} from 'react-native';
const App = ()=>{
  return (
    <SafeAreaView style={styles.container}>
      <StackRouter/>
    </SafeAreaView>
  );
};

const styles = new StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#cce6ff',
  },
});

export default App;
