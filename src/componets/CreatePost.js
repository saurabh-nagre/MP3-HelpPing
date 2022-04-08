/* eslint-disable prettier/prettier */
import React, { useState ,useEffect} from 'react';
import { View, Text, TextInput, Image, StyleSheet, Alert } from 'react-native';
import {Button} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { Menu , MenuOptions, MenuOption,MenuTrigger} from 'react-native-popup-menu';
import storage from '@react-native-firebase/storage';
import SimpleToast from 'react-native-simple-toast';
import { ScrollView } from 'react-native-gesture-handler';

const CreateSellPost = (props) => {
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [price, setPrice] = useState('');
    const [phone, setPhone] = useState('');
    const [imageuri, setImageUri] = useState('');

    useEffect(() => {
      const subscriber = firestore().collection('profiles').doc(auth().currentUser.uid).get().then((value)=>{
        if (value.exists){
          setPhone(value.data().contact);
        }
      });
      return () => {
        subscriber;
      };
    }, []);

    const postData = async ()=>{
      if (!name || !desc || !price || !phone || !imageuri ) {
        Alert.alert('Please fill all fields');
        return;
      }
      var id = null;
      const time = Date.now();
      let downloadurl = '';
      let flag = true;
      try {
        await firestore().collection('sellPosts')
          .add({
            name:name,
            description :desc,
            phoneNo : phone,
            price :price,
            time:time,
            uid:auth().currentUser.uid,
          }).then((value)=>{
            id = value.id;
            console.log('Post id added to sell posts');
          },((reason)=>{
            console.log(reason);
            flag = false;
            Alert.alert("Can't save the post now! check your internet connection and try again!");
            return;
          })).catch((reason)=>{
            console.log(reason);
            flag = false;
            Alert.alert("Can't save the post now! check your internet connection and try again!");
            return;
          });

        await storage().ref('sellPosts/' + id).putFile(imageuri.uri).then(async (snapshot)=>{
            if (snapshot.state === 'success'){
              await storage().ref('sellPosts/' + id).getDownloadURL().then((value)=>{
                downloadurl = value;
              });
            }
          }).catch((reason)=>{
            console.log(reason);
            flag = false;
            Alert.alert("Can't save the post now! check your internet connection and try again!");
            return;
          });

        await firestore().collection('sellPosts').doc(id).set({imageurl : downloadurl , postid : id},{merge:true}).then((value)=>{
          console.log('Post id added to sell posts');
        },((reason)=>{
          console.log(reason);
          flag = false;
          Alert.alert("Can't save the post now! check your internet connection and try again!");
          return;
        })).catch((reason)=>{
          console.log(reason);
          flag = false;
          Alert.alert("Can't save the post now! check your internet connection and try again!");
          return;
        });

          await firestore().collection('profiles').doc(auth().currentUser.uid).collection('sellPosts').add({postid:id}).then((value)=>{
            console.log('Post id added to user profile');
          },((reason)=>{
            console.log(reason);
            flag = false;
            Alert.alert("Can't save the post now! check your internet connection and try again!");
            return;
          })).catch((reason)=>{
            console.log(reason);
            flag = false;
            Alert.alert("Can't save the post now! check your internet connection and try again!");
            return;
          });
          if (flag){
            SimpleToast.show('Your post is now live!',SimpleToast.SHORT);
          }
        props.navigation.goBack();
      } catch (err){
        console.log(err);
        Alert.alert("Can't save the post now! check your internet connection and try again!");
      }

    };
    const selectAction = (action)=>{
      if (action === 'camera1'){
          launchCamera({maxHeight:400,maxWidth:400},(response)=>{
              if (!response.didCancel){
                  setImageUri(response.assets[0]);
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
          launchImageLibrary({maxHeight:400,maxWidth:400},(response)=>{
              if (!response.didCancel){
                  setImageUri(response.assets[0]);
              }
              else if (response.errorCode === 'permission'){
                  Alert.alert('Permission Denied','You need to provide permission for Storage Access',['ok']);
              }
              else {
                  console.log(response.errorMessage);
              }
          });
      }
  };


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Post for Selling!</Text>
      <TextInput
            placeholder ="Add Title"
            value={name}
            style={styles.input}
            autoFocus={true}
            onChangeText={text => setName(text)}
      />
      <TextInput
            placeholder="Add Description"
            value={desc}
            multiline={true}
            collapsable={true}
            style={styles.descinput}
            onChangeText={text => setDesc(text)}
      />
       <TextInput
            placeholder="Enter price"
            value={price}
            style={styles.input}
            keyboardType="number-pad"
            onChangeText={text => setPrice(text)}
      />
      <TextInput
            placeholder="contact number"
            value={phone}
            style={styles.input}
            keyboardType="number-pad"
            onChangeText={text => setPhone(text)}
      />
      {
        imageuri ? (<Image source={imageuri} style={styles.image} progressiveRenderingEnabled={true} />) : null
      }

      {/* <MenuProvider> */}
                    <Menu onSelect={value => selectAction(value)}>
                    <MenuTrigger>
                      <View style={styles.uploadButton}>
                        <Button icon="camera" mode="text" style={styles.button}>Upload Image</Button>
                      </View>
                    </MenuTrigger>

                    <MenuOptions>
                        <MenuOption value="camera1">
                            <Text style={styles.option}>Launch Camera</Text>
                        </MenuOption>
                        <MenuOption value="camera2">
                            <Text style={styles.option}>Select Image</Text>
                        </MenuOption>
                    </MenuOptions>
                    </Menu>
                {/* </MenuProvider> */}
        <Button  disabled = {imageuri ? false : true} style={styles.button} mode="contained" onPress={() => postData()}>
                Post
        </Button>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'lightblue',
        paddingHorizontal:40,
    },
    title:{
      fontFamily:'notoserif',
      fontSize:30,
      color:'red',
      fontWeight:'bold',
      marginVertical:20,
      textAlign:'center',
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: {width: 2, height: 3},
      textShadowRadius: 5,
    },
    input:{
      padding: 5,
      height:40,
      fontSize:18,
      color:'black',
      marginTop: 20,
      backgroundColor:'lightpink',
      borderRadius: 5,
      shadowColor:'rgba(0, 0, 0, 0.75)',
      shadowOffset:{width:2,height:2},
      shadowRadius:5,
      elevation:8,
      zIndex:1,
    },
    button:{
      marginVertical:20,
    },
    descinput:{
      padding: 5,
      maxHeight:150,
      fontSize:18,
      color:'black',
      marginTop: 20,
      backgroundColor:'lightpink',
      borderRadius: 5,
      shadowColor:'rgba(0, 0, 0, 0.75)',
      shadowOffset:{width:2,height:2},
      shadowRadius:5,
      elevation:8,
      zIndex:1,
    },
    image:{
      width:300,
      marginVertical:10,
      height:300,
      alignSelf:'center',
    },
    option: {
      fontSize:18,
      textAlign:'center',
      padding:3,
      color:'black',
      shadowColor:'rgba(0, 0, 0, 0)',
      shadowOffset:{width:2,height:2},
      shadowRadius:5,
      zIndex:1,
      alignSelf:'flex-start',
  },
});

export default CreateSellPost;
