/* eslint-disable prettier/prettier *//* eslint-disable react-hooks/exhaustive-deps */

import { View, Text,FlatList ,StyleSheet,TouchableOpacity, Linking,Platform} from 'react-native';
import React, {useEffect,useState} from 'react';
import { Button, Card, Paragraph, TextInput } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SimpleToast from 'react-native-simple-toast';
const openDial = (phone)=>{
  if (Platform.OS === 'android'){
      Linking.openURL(`tel:${phone}`);
  }
  else {
    Linking.openURL(`telprompt:${phone}`);
  }
};

const BuySellPosts = (props) => {
  const [items, setItems] = useState([]);
  const [isrefreshing,setIsRefreshing] = useState(true);
  const [shouldRefresh,setShouldRefresh] = useState(true);
  const [uid,setUid] = useState(auth().currentUser.uid);
  useEffect(()=>{
    if (isrefreshing){
      const subscriber = async ()=>{
        await firestore().collection('sellPosts').orderBy('time').get().then((value)=>{
         let arr = [];
          value.docs.forEach((post)=>{
            arr.push({...post.data(),id:post.id,inputPrice:post.data().price});
          });
          arr.reverse();
          setItems(arr);
        },(reason)=>{
          console.log(reason);
        }).catch((reason)=>{
          console.log(reason);
      });
      };
      subscriber();
      setIsRefreshing(false);
    }

    return ()=>{};
  },[shouldRefresh]);

  const navigateToCreatePost = ()=>{
    props.navigation.navigate('CreateSellPost');
  };

  const changeInput = (value,index)=>{
    let arr = items;
    arr[index].inputPrice = value;

    setItems(arr);
  };

  const saveInput = async (index)=>{
      let arr = items;
      await firestore().collection('sellPosts').doc(arr[index].id).collection('bids').doc(uid).set({bidPrice:arr[index].inputPrice})
      .then(()=>{
        SimpleToast.show('Bid saved for ' + arr[index].name,SimpleToast.SHORT);
      }).catch((reason)=>{
        SimpleToast.show("Can't save bid now, please check your internet connection!",SimpleToast.SHORT);
        console.log(reason);
      });
  };
const renderItems = (item,index)=>{
    return (
        <Card style={styles.cards}>
          <Card.Title title={item.name} />
          <Card.Content>
            <Text selectable={true} style = {styles.text}>{item.description}</Text>
          </Card.Content>
          <Card.Cover source={{uri:item.imageurl}} style={styles.image} progressiveRenderingEnabled={true} />
          <Card.Actions>
            <Button>Rs. {item.price}/-</Button>
            <Button onPress={()=>openDial(item.phoneNo)} icon="phone">call- {item.phoneNo}</Button>
          </Card.Actions>
          {
             !(item.uid === uid) ?
              <Card.Actions>
                <TextInput defaultValue={item.inputPrice} placeholder="Enter Your price" onChangeText={(value)=>{changeInput(value,index);}} />
                <Button  styles={styles.btn} mode="contained" onPress={() => saveInput(index)}>Send</Button>
              </Card.Actions>  : null
          }
        </Card>
    );
};


  return (
    <View>
    <View>
        {
          items.length === 0 ? <View style={styles.container}>
          <Text style={styles.nopost}>No Post Yet, Be one to post first !</Text>
          <Button onPress={()=>navigateToCreatePost()} mode="contained" style={styles.btn}>Create Post</Button>
        </View> : null
        }
    </View>
      <FlatList
        style={styles.list}
        data={items}
        refreshing={isrefreshing}
        onRefresh={()=>{setIsRefreshing(true); setShouldRefresh(!shouldRefresh);}}
        renderItem={({item,index})=>renderItems(item,index)}
      />
        <TouchableOpacity onPress={()=>navigateToCreatePost()} style={styles.floating} >
            <Icon name="add-box" size={60} color="green"/>
        </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
    container: {
      alignContent:'center',
      marginHorizontal:'10%',
      marginTop:'50%',
    },
    text : {
      color:'black',
      fontSize:14,
    },
    cards:{
        margin:15,
        elevation:2,
    },
    list:{
        width:'100%',
        height:'100%',
    },
    btn:{
      fontSize:20,
    },
    nopost : {
      margin:30,
      fontSize:30,
      fontWeight:'bold',
      color:'blue',
      textAlign:'center',
    },
    floating: {
        height:60,
        position:'absolute',
        bottom:0,
        right:0,
        margin:20,
        shadowColor:'rgba(0, 0, 0, 1)',
        shadowOffset:{width:5,height:5},
        shadowRadius:5,
        elevation:20,
        zIndex:1,
    },
    image:{
      margin:10,
      width:300,
      alignSelf:'center',
      height:300,
    },
});

export default BuySellPosts;
