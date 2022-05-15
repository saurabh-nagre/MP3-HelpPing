/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */

import React,{useState,useEffect} from 'react';
import {View,Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons';
import { DrawerContentScrollView,DrawerItem } from '@react-navigation/drawer';
export default function DrawerContent(props) {
    const [title,setTitle] = useState(props);

    useEffect(() => {
      console.log(props);
    },[]);
    return (
        <View style={styles.header}>
            <Text>Header Name</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    header:{
        width:'100%',
        height:'30%',
        textAlign:'center',
        alignSelf:'center',
    },
});
