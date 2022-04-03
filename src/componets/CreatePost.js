import { View, Text, StyleSheet, Alert } from 'react-native'
import React, { useState } from 'react'
import {TextInput, Button} from 'react-native-paper'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "@react-native-firebase/storage";


const CreateAdScreen = () => {
    const [name, setName]= useState('')
    const [desc, setDesc]= useState('')
    const [year, setYear]= useState('')
    const [price, setPrice]= useState('')
    const [phone, setPhone]= useState('')
    const [image, setImage]= useState("")

    const postData = async ()=>{
      if(!name||!desc||!year||!price||!phone ) {
        Alert.alert("Please fill all fields")
        return
      }
      try{
        await firestore().collection('ads')
      .add({
        name, 
        desc, 
        year, 
        phone,
        price, 
        image,
        uid:auth().currentUser.email
      })
      Alert.alert("Posted your Ad!")
      }catch(err){
        Alert.alert("Something went wrong")
      }
      
    }

    const openCamera= ()=>{
      launchImageLibrary({quality:0.50},(fileobj)=>{
        // console.log(fileobj)
        // const storage = getStorage();
        // const storageRef = ref(storage, `/items/${Date.now()}`);

        // const uploadTask = uploadBytesResumable(storageRef, fileobj).uri;
        const uploadTask =storage().ref().child(`/items/${Date.now()}`).putFile(fileobj.uri)

        uploadTask.on('state_changed', 
        (snapshot) => {

        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (progress=100){Alert.alert("uploaded")}

      }, 
      (error) => {
        alert("something went wrong. try again!")
      }, 
      () => {


      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL)=> {
          setImage(downloadURL)
        });
    }
    );

      })
    }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Add</Text>
      <TextInput
            label="Add Title"
            value={name}
            mode='outlined'
            onChangeText={text => setName(text)}
      />
       <TextInput
            label="Add Description"
            value={desc}
            mode='outlined'
            multiline={true}
            onChangeText={text => setDesc(text)}
      />
       <TextInput
            label="Enter Purchasing year "
            value={year}
            mode='outlined'
            keyboardType='numeric'
            onChangeText={text => setYear(text)}
      />
       <TextInput
            label="Enter price"
            value={price}
            mode='outlined'
            onChangeText={text => setPrice(text)}
      />
      <TextInput
            label="contact number"
            value={phone}
            mode='outlined'
            onChangeText={text => setPhone(text)}
      />
       <Button  icon="camera" mode="contained" onPress={() => openCamera()}>
                Upload Image
        </Button>
        <Button  disabled = {image?false:true} mode="contained" onPress={() => postData()}>
                Post
        </Button>
        
    </View>
  )
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        paddingHorizontal:20,
        justifyContent:"space-evenly"
    },
    title:{
        color:"black",
        fontSize: 26,
        textAlign:"center"
    }
})

export default CreateAdScreen