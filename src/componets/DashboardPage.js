/* eslint-disable prettier/prettier */
import React,{useState} from 'react';
import {Text,StyleSheet,SafeAreaView} from 'react-native';
import auth from '@react-native-firebase/auth';
import { useEffect } from 'react/cjs/react.development';

export default function Dashboard() {
    const [username,setUsername] = useState();

    useEffect(()=>{
        setUsername(auth().currentUser.email);
    },[]);


    return (
        <SafeAreaView style={styles.container}>
            <Text>Welcome! {username}</Text>
        </SafeAreaView>
    );
}

const styles = new StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
});
