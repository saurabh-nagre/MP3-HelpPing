/* eslint-disable prettier/prettier */
import React from 'react';
import {Text,StyleSheet,SafeAreaView} from 'react-native';
import { Component } from 'react/cjs/react.development';


export default class Discussion extends Component{
    render(){
        return (
            <SafeAreaView style={styles.container}>
                <Text>Discussion Section</Text>
            </SafeAreaView>
        );
    }
}

const styles = new StyleSheet.create(
    {
        container: {flex: 1, justifyContent: 'space-around', alignItems: 'center'},
    }
);
