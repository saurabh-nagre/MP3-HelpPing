/* eslint-disable prettier/prettier *//* eslint-disable react-hooks/exhaustive-deps */

import { View, Text,FlatList ,StyleSheet, Linking,Platform} from 'react-native';
import React, {useLayoutEffect,useEffect,useState} from 'react';
import { Button, Card } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { ActivityStackRouter } from '../Navigation/Router';
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

const Activity  = (props)=>{
  return (
    <ActivityStackRouter/>
  );
}

export default Activity;

const PostActivity = (props) => {
  const [items, setItems] = useState([]);
  const [isrefreshing,setIsRefreshing] = useState(true);
  const [shouldRefresh,setShouldRefresh] = useState(true);
  const [uid,setUid] = useState(auth().currentUser.uid);
  useLayoutEffect(()=>{
    if (isrefreshing){
      const subscriber = async ()=>{
        await firestore().collection('sellPosts').where('uid','==',uid).orderBy('time').get().then((value)=>{
         let arr = [];
          value.docs.forEach((post)=>{
            arr.push({...post.data(),id:post.id});
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

  const navigateToBidList = (id)=>{
    props.navigation.navigate('BidList',{id:id});
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
            <Button onPress={()=>navigateToBidList(item.id)}>View Received Bids</Button>
          </Card.Actions>
        </Card>
    );
};


  return (
    <View>
      <View>
          {
            items.length === 0 ? <View style={styles.container}>
            <Text style={styles.nopost}>No Post Yet, Be one to post first !</Text>
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
    </View>
  );
};

const BidList = (props) =>{
  const [bidArray,setBidArray] = useState([]);
  const [id,setId] = useState('');
  useEffect(() => {
    setId(props.route.params.id);

    const subscriber = async ()=>{
      await firestore().collection('sellPosts').doc(id).collection('bids').orderBy('bidPrice').get().then((value)=>{
        let arr = [];
        value.forEach((res,index)=>{
          arr.push({...res.data(),id:res.id});
        });
        setBidArray(arr);
      },(reason)=>{
        console.log(reason);
      }).catch((reason)=>{
        console.log(reason);
    });
    };
    subscriber();

  }, []);

  return (
    <FlatList
      data={bidArray}
      style={styles.list}
      renderItem={({item,index})=>{
        return (
        <View>
          <Text style={styles.text}>{item.id}</Text>
          <Text style={styles.text}>{item.bidPrice}</Text>
        </View>);
      }}
      keyExtractor={(item)=>item.id}
    />
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
  image:{
    margin:10,
    width:300,
    alignSelf:'center',
    height:300,
  },
});

export {PostActivity,BidList};
