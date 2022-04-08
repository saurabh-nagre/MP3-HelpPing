/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useState,useEffect} from 'react';
import {Text,TextInput,Alert,TouchableOpacity,Image,StyleSheet,SafeAreaView} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/storage';
import SimpleToast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Menu , MenuOptions, MenuOption,MenuTrigger} from 'react-native-popup-menu';

export default function Profile({props}){

    const [userProfile,setUserProfile] = useState({uid:auth().currentUser.uid});
    const [imageuri,setImageUri] = useState({});
    const [ispressed,setisPressed] = useState(false);
    const [shouldFetch,setShouldFetch] =  useState(false);
    useEffect(() => {

        firebase.storage().ref('profiles/' + userProfile.uid).getDownloadURL().then((value)=>{
            setImageUri({data:value});
        },(reason)=>{
            console.log(reason);
        }).catch((reason)=>{
            console.log(reason);
        });

        firestore().collection('profiles').doc(userProfile.uid).get().then((value)=>{
            if (value.exists){
                setUserProfile({...userProfile,...value.data()});
            }
        },(reason)=>{
            console.log(reason);
        }).catch((reason)=>{
            console.log(reason);
        });

    },[]);

    const selectAction = (action)=>{
        if (action === 'camera1'){
            launchCamera({maxHeight:400,maxWidth:400},(response)=>{
                if (!response.didCancel){
                    setImageUri({data:response.assets[0]});
                }
                else if (response.errorCode === 'permission'){
                    Alert.alert('Permission Denied','You need to provide permission for Camera Access',['ok']);
                }
                else {
                    console.log(response.errorMessage);
                }
            });
        }
        else if (action === 'camera2'){
            launchImageLibrary({maxHeight:400,maxWidth:400,quality:0.6},(response)=>{
                if (!response.didCancel){
                    setImageUri({data:response.assets[0]});
                }
                else if (response.errorCode === 'permission'){
                    Alert.alert('Permission Denied','You need to provide permission for Storage Access',['ok']);
                }
                else {
                    console.log(response.errorMessage);
                }
            });
        }
        else if (action === 'remove'){
            setImageUri({});
        }
    };

    const saveProfile = async ()=>{
        setisPressed(true);
        if (imageuri.data && imageuri.data.uri){
            const filePath = imageuri.data.uri;
            await firebase.storage().ref('profiles/' + userProfile.uid).putFile(filePath).then((snapshot)=>{
                SimpleToast.show('Profile Picture Changed',SimpleToast.SHORT);
            },(err)=>{
                console.log(err);
            }).catch((reason)=>{
                console.log(reason);
            });
        }
        else if (!imageuri.data){
            await firebase.storage().ref('profiles/' + userProfile.uid).delete().then((snapshot)=>{
                SimpleToast.show('Profile Picture Changed',SimpleToast.SHORT);
            },(err)=>{
                console.log(err);
            }).catch((reason)=>{
                console.log(reason);
            });
        }
        await firebase.firestore().collection('profiles').doc(userProfile.uid).set(userProfile).then((value)=>{
            SimpleToast.show('Profile Updated',SimpleToast.SHORT);
        },(reason)=>{
            SimpleToast.show('Profile Updating Failed',SimpleToast.SHORT);
            console.log(reason);
        }).catch((reason)=>{
            SimpleToast.show('Profile Updating Failed',SimpleToast.SHORT);
            console.log(reason);
        });
        setShouldFetch(!shouldFetch);
        setisPressed(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Image source={imageuri.data ?  (imageuri.data.uri ? imageuri.data : {uri:imageuri.data} ) : require('../assets/avatar.jpg')} style={styles.image}/>

                    <Menu style={styles.menu} onSelect={value => selectAction(value)}>
                    <MenuTrigger>
                        <Icon name="camera" size={30}/>
                    </MenuTrigger>

                    <MenuOptions>
                        <MenuOption value="camera1">
                            <Text style={styles.option}>Launch Camera</Text>
                        </MenuOption>
                        <MenuOption value="camera2">
                            <Text style={styles.option}>Select Image</Text>
                        </MenuOption>
                        {
                            imageuri.data ? ( <MenuOption value="remove">
                                    <Text style={styles.option}>Remove Image</Text>
                                </MenuOption>) : <></>
                        }
                    </MenuOptions>
                    </Menu>

                <TextInput
                    placeholder="Enter Your Full Name"
                    style = {styles.input}
                    onChangeText={(name)=>setUserProfile({...userProfile,fullname:name})}
                    defaultValue={userProfile.fullname}
                    textContentType="name"
                />
                <TextInput
                    placeholder="Enter Username"
                    style = {styles.input}
                    onChangeText={(name)=>setUserProfile({...userProfile,username:name})}
                    defaultValue={userProfile.username}
                    textContentType="username"
                />
                <TextInput
                    placeholder="Enter Contact"
                    style = {styles.input}
                    onChangeText={(con)=>setUserProfile({...userProfile,contact:con})}
                    defaultValue={userProfile.contact}
                    textContentType="telephoneNumber"
                    keyboardType="number-pad"
                />
                <TouchableOpacity onPress={()=>{saveProfile();}} style={styles.button} disabled={ispressed}>
                  <Text style={styles.buttonText}>{ispressed ? 'Saving...' : 'Save Profile'} </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );

}
const styles = new StyleSheet.create(
    {
        container : {backgroundColor:'lightblue',height:'100%'},
        image:{
            width:150,
            height:150,
            alignSelf:'center',
            marginTop:10,
            borderRadius:100,
        },
        cameraIcon: {
            alignSelf:'center',
            padding:10,
            zIndex:1,
        },
        input:{
            padding: 10,
            height: 50,
            fontSize:16,
            marginBottom:30,
            width:300,
            alignSelf:'center',
            backgroundColor:'pink',
            borderRadius: 10,
            shadowColor:'rgba(0, 0, 0,1)',
            shadowOffset:{width:1,height:2},
            shadowRadius:5,
            color:'black',
            elevation:10,
            zIndex:1,
        },
        button:{
            marginHorizontal:10,
            backgroundColor:'green',
            borderRadius:20,
            width:200,
            marginTop:50,
            alignSelf:'center',
            marginBottom:50,
        },
        buttonText:{
            fontSize:18,
            textAlign:'center',
            padding:10,
            color:'white',
        },
        option: {
            fontSize:18,
            textAlign:'center',
            padding:5,
            color:'black',
            shadowColor:'rgba(0, 0, 0, 0)',
            shadowOffset:{width:2,height:2},
            shadowRadius:5,
            zIndex:1,
            alignSelf:'flex-start',
        },
        menu : {
            alignSelf:'center',
            marginLeft:'30%',
            height:150,
            marginTop:0,
        },
    }
);
