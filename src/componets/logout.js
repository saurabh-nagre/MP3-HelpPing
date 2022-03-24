/* eslint-disable prettier/prettier */
import React from 'react';
import {Button,StyleSheet,SafeAreaView} from 'react-native';

import auth from '@react-native-firebase/auth';

export default class Logout extends React.Component{

    constructor(props){
        super();
    }
    render(){
        return (
            <SafeAreaView style={styles.container}>
                <Button title="Log Out" onPress={(event)=>this.logout()}/>
            </SafeAreaView>
        );
    }

    logout() {
        auth().signOut().then((value)=>{
        });
    }
}

const styles = new StyleSheet.create(
    {
        container: {flex: 1, justifyContent: 'space-around', alignItems: 'center'},
    }
);
