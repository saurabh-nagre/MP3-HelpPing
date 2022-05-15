/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState ,useEffect} from 'react';
import { View, Text, TextInput, Image, StyleSheet, Alert } from 'react-native';
import {Button} from 'react-native-paper';
import { firebase } from '@react-native-firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { Menu , MenuOptions, MenuOption,MenuTrigger} from 'react-native-popup-menu';
import storage from '@react-native-firebase/storage';
import SimpleToast from 'react-native-simple-toast';
import { ScrollView } from 'react-native-gesture-handler';

const EDITPOST = 'Edit Post And Post Again';
const CREATEPOST = 'Create Awesome Post';
const SHAREEVENT = 'Create Post For Your Club Event';
const CreatePost = (props) => {
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [price, setPrice] = useState('');
    const [phone, setPhone] = useState('');
    const [imageuri, setImageUri] = useState();
    const [collectionName,setCollectionName]  = useState(props.route.params.from);
    const [pressed,setPressed] = useState(false);
    const [isEditable,setEditable] = useState(props.route.params.editable);
    const [id,setId] = useState(props.route.params.id);
    const [didImageChange,setDidImageChange] = useState(false);

    useEffect(() => {

      if (isEditable){
        firestore().collection(collectionName).doc(id).get().then((val)=>{
          if (val.exists){
            setName(val.data().name);
            setDesc(val.data().description);
            setPhone(val.data().phoneNo);
            setImageUri(val.data().imageurl);
            if (collectionName === 'sellPosts'){
              setPrice(val.data().price);
            }
          }
        });
      }
      firestore().collection('profiles').doc(auth().currentUser.uid).get().then((value)=>{
        if (value.exists){
          setPhone(value.data().contact);
        }
      });
    }, []);

    const postData = async ()=>{

      setPressed(true);

      if (!name || !desc || !phone || !imageuri){
        Alert.alert('Please Fill All Fields! ');
        setPressed(false);
        return;
      }

      if (collectionName === 'sellPosts' && !price){
        Alert.alert('Please Fill Price Field! ');
        setPressed(false);
        return;
      }
      const time = Date.now();
      let flag = true;
      let postId = id;
      try {
        if (isEditable){
          await firestore().collection(collectionName).doc(postId)
          .set({
            name:name,
            description :desc,
            phoneNo : phone,
            price :price,
            time:time,
            uid:auth().currentUser.uid,
          },{merge:true}).then((value)=>{
            console.log('Post Updated');
          },((reason)=>{
            console.log(reason);
            flag = false;
            Alert.alert("Can't save the post now! check your internet connection and try again!");
            setPressed(false);
            return;
          })).catch((reason)=>{
            console.log(reason);
            flag = false;
            Alert.alert("Can't save the post now! check your internet connection and try again!");
            setPressed(false);
            return;
          });
        }
        else {
          await firestore().collection(collectionName)
          .add({
            name:name,
            description :desc,
            phoneNo : phone,
            price :price,
            time:time,
            uid:auth().currentUser.uid,
            postid:postId,
          }).then((value)=>{
            postId = value.id;
          },((reason)=>{
            console.log(reason);
            flag = false;
            Alert.alert("Can't save the post now! check your internet connection and try again!");
            setPressed(false);
            return;
          })).catch((reason)=>{
            console.log(reason);
            flag = false;
            Alert.alert("Can't save the post now! check your internet connection and try again!");
            setPressed(false);
            return;
          });
            await firestore().collection('profiles').doc(auth().currentUser.uid).collection(collectionName).add({postid:postId}).then((value)=>{
              console.log('Post id added to user profile');
            },((reason)=>{
              console.log(reason);
              flag = false;
              Alert.alert("Can't save the post now! check your internet connection and try again!");
              setPressed(false);
              return;
            })).catch((reason)=>{
              console.log(reason);
              flag = false;
              Alert.alert("Can't save the post now! check your internet connection and try again!");
              setPressed(false);
              return;
            });
        }

        if (didImageChange) {
          const filePath = imageuri.uri;
          await storage().ref(collectionName + '/' + postId).putFile(filePath).then(async (snapshot)=>{
            console.log('success');
          }).catch((reason)=>{
            console.log(reason);
            flag = false;
            Alert.alert("Can't save the post now! check your internet connection and try again!");
            setPressed(false);
            return;
          });
          await storage().ref(collectionName + '/' + postId).getDownloadURL().then(async (value)=>{
              await firebase.firestore().collection(collectionName).doc(postId)
              .set({
                imageurl : value,
              },{merge:true}).then(()=>{
                console.log('Post Updated');
              }).catch((reason)=>{
                console.log(reason);
                flag = false;
                Alert.alert("Can't save the post now! check your internet connection and try again!");
                setPressed(false);
                return;
              });
          }).catch((reason)=>{
            console.log(reason);
            flag = false;
            Alert.alert("Can't save the post now! check your internet connection and try again!");
            setPressed(false);
            return;
          });
        }
          if (flag){
            SimpleToast.show('Your post is now live!',SimpleToast.SHORT);
          }
        props.navigation.goBack();
      } catch (err){
        console.log(err);
        Alert.alert("Can't save the post now! check your internet connection and try again!");
      }
      setPressed(false);
    };
    const selectAction = (action)=>{
      if (action === 'camera1'){
          launchCamera({maxHeight:400,maxWidth:400},(response)=>{
              if (!response.didCancel){
                setDidImageChange(true);
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
                setDidImageChange(true);
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
      {
        isEditable ? <Text style={styles.title}>{EDITPOST}</Text> :
          ( collectionName === 'clubEventsPosts' ?
          <Text style={styles.title}>{SHAREEVENT}</Text> :
          <Text style={styles.title}>{CREATEPOST}</Text>)
      }
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
      {
        collectionName !== 'clubEventsPosts' ? <TextInput
          placeholder="Enter price"
          value={price}
          style={styles.input}
          keyboardType="number-pad"
          onChangeText={text => setPrice(text)}
        /> : null
      }
      <TextInput
            placeholder="contact number"
            value={phone}
            style={styles.input}
            keyboardType="number-pad"
            onChangeText={text => setPhone(text)}
      />
      {
        didImageChange ? <Image source={imageuri} style={styles.image} progressiveRenderingEnabled={true}/>
        : (imageuri ? <Image source={{uri:imageuri}} style={styles.image} progressiveRenderingEnabled={true} /> : null)
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
        <Button  disabled = {imageuri && !pressed ? false : true} style={styles.button} mode="contained" onPress={() => postData()}>
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
      fontSize:35,
      color:'red',
      fontWeight:'bold',
      marginVertical:20,
      textAlign:'center',
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: {width: 1, height: 1},
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
      minHeight:100,
      color:'black',
      marginTop: 20,
      textAlignVertical:'top',
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

export default CreatePost;
