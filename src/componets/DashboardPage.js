/* eslint-disable prettier/prettier */
import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';
import { useEffect } from 'react/cjs/react.development';
import { DrawerRouter } from '../Navigation/Router';
export default function Dashboard({navigation}) {
    useEffect(()=>{
        const subscriber = auth().onAuthStateChanged((user)=>{
            if (!user){
              navigateLogin();
            }
        });
        return subscriber;
    });
    const navigateLogin = ()=>{
        navigation.replace('Login');
    };

    return (
        <SafeAreaView style={styles.container}>
            <DrawerRouter/>
        </SafeAreaView>
    );
}

const styles = new StyleSheet.create({
    container:{
        flex:1,
      },
});


