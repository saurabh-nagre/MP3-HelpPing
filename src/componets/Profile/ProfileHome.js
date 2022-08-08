/* eslint-disable prettier/prettier */
import React,{useState} from 'react';
import {View,TouchableOpacity,Text,StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';

export default function ProfileHome(props){

    const [id,setID] = useState(auth().currentUser.uid);

    const navigateToProfile  = ()=>{
        props.navigation.navigate('Profile',{user:id});
    };

    const navigateToActivity = ()=>{
        props.navigation.navigate('activity');
    };

    const logout = ()=>{
        auth().signOut().then((value)=>{
            console.log('user signout successful');
        }).catch((reason)=>{
            console.log(reason);
        });
    };

    return (
        <View>
            <TouchableOpacity onPress={()=>navigateToProfile()} style={styles.button}>
                <Text style={styles.buttonText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigateToActivity()} style={styles.button}>
                <Text style={styles.buttonText}>Activity</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>logout()} style={styles.button}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>


        </View>
    );
}

const styles = StyleSheet.create(
    {
        button:{
            width:'100%',
            alignSelf:'center',
            padding:10,
            margin:5,
            elevation:10,
            backgroundColor:'lightblue',
            shadowRadius:5,
            shadowOpacity:10,
            shadowOffset:{width:2,height:2},
        },
        buttonText:{
            color:'black',
            fontSize:20,
            textAlign:'left',
            paddingHorizontal:20,
        },
    }
);



