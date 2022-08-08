/* eslint-disable prettier/prettier *//* eslint-disable react-hooks/exhaustive-deps */

import { View, Text,FlatList ,StyleSheet,TouchableOpacity,Image,Alert} from 'react-native';
import React, {useEffect,useLayoutEffect,useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import MenuOptionIcon from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MenuIcon from 'react-native-vector-icons/Feather';
import { Menu , MenuOptions, MenuOption,MenuTrigger} from 'react-native-popup-menu';

const onedaytime = 24 * 60 * 60 * 1000;

const PostActivity = (props) => {
  const [items, setItems] = useState([]);
  const [isrefreshing,setIsRefreshing] = useState(true);
  const [shouldRefresh,setShouldRefresh] = useState(true);
  const [uid,setUid] = useState(auth().currentUser.uid);
  useLayoutEffect(()=>{

    if (isrefreshing){
        firestore().collection('sellPosts').where('uid','==',uid).orderBy('time').get().then((value)=>{
         let arr = [];
          value.docs.forEach((post)=>{
            let difference = (Date.now() - post.data().time);
              let shouldDisplayRepost = false;
              let daysago = Math.trunc(difference / onedaytime);
              let daysagotext = '';
              if (daysago === 0){
                console.log(daysago);
                daysagotext = Math.trunc((difference) / (60 * 60 * 1000)) + ' Hr before';
              }
              else {
                daysagotext = daysago + ' days before';
              }
              if (daysago > 8){
                shouldDisplayRepost = true;
              }
            arr.push({...post.data(),id:post.id,daysago:daysagotext,repost:shouldDisplayRepost});
          });
          arr.reverse();
          setItems(arr);
        },(reason)=>{
          console.log(reason);
        }).catch((reason)=>{
          console.log(reason);
      });
    }
    setIsRefreshing(false);

  },[shouldRefresh]);

  const selectAction = (val,item)=>{
     if (val === 'deleteItem' ){
        Alert.alert('Should Delete Post!','Only you can see this post after deletion',
        [{text:'Delete',onPress:()=>{
                firestore().collection('sellPosts').doc(item.id).delete().then(()=>{
                    console.log('Post Deleted');
                  }).catch((reason)=>{
                    console.log(reason);
                  });
        }},{text:'Cancel',onPress:()=>{},style:'cancel'} ],{cancelable:true});
    }
    else if (val === 'editItem') {
      navigateToEditPost(item.id);
    }
  };

  const navigateToEditPost = (Postid)=>{
    props.navigation.navigate('CreatePost',{from:'sellPosts',editable:true,id:Postid});
  };
  const navigateToBidList = (id)=>{
    props.navigation.navigate('BidList',{id:id});
  };
  const renderItems = (item,index)=>{
      return (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.daysago}>{item.daysago}</Text>
              <Menu onSelect={value => selectAction(value,item)} >
                          <MenuTrigger>
                                  <MenuIcon name ="more-vertical" size={30} color="black" style={styles.menuButton}/>
                          </MenuTrigger>

                          <MenuOptions>
                              <View>
                                  <MenuOption value="deleteItem" style={styles.cardContent}>
                                      <Icon name="delete" size={25} color="black"/>
                                      <Text style={styles.option}>Delete Post</Text>
                                  </MenuOption>
                                  <MenuOption value="editItem" style={styles.cardContent}>
                                      <MenuOptionIcon name="edit" size={25} color="black" solid={true}/>
                                      <Text style={styles.option}>Edit Post</Text>
                                  </MenuOption>
                                  { item.repost ?
                                    <MenuOption value="editItem" style={styles.cardContent}>
                                      <MenuOptionIcon name="edit" size={25} color="black" solid={false}/>
                                      <Text style={styles.option}>RePost</Text>
                                    </MenuOption> : null
                                  }
                              </View>
                          </MenuOptions>
              </Menu>
          </View>

        <Text selectable={true} style = {styles.cardDiscription}>{item.description}</Text>
        <Image  source = {{uri:item.imageurl}} style={styles.image} progressiveRenderingEnabled={true} />
          <View style={styles.cardContent}>
              <Text style={styles.text}>Rs. {item.price}/-</Text>
              <TouchableOpacity onPress={()=>navigateToBidList(item.id)} style={styles.bidCardContent}>
                      <Icon name="list-alt" size={25} color="blue"/>
                      <Text style={styles.bidText}>View Received Bids</Text>
              </TouchableOpacity>
          </View>
      </View>
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

const BidList = (prop) =>{
  const [bidArray,setBidArray] = useState([]);
  const [id,setId] = useState(prop.route.params.id);
  const [isrefreshing,setIsRefreshing] = useState(true);
  const [shouldRefresh,setShouldRefresh] = useState(true);
  useEffect(() => {
    if (isrefreshing){
      firestore().collection('sellPosts').doc(id).collection('bids').orderBy('bidPrice').get().then((value)=>{
              let arr = [];
              value.forEach((res,index)=>{
                console.log(res.data());
                arr.push({...res.data(),id:res.id});
              });
              arr.reverse();
              setBidArray(arr);
            },(reason)=>{
              console.log(reason);
            }).catch((reason)=>{
              console.log(reason);
          });
      setIsRefreshing(false);
    }

  }, [shouldRefresh]);

  const renderListItem = (item,index) =>{

    return (
      <View style = {styles.cardContent}>
          <Text style={styles.index}>{index + 1}</Text>
          <Text style={styles.name}>{item.bidderName}</Text>
          <Text style={styles.price}>Rs. {item.bidPrice}/-</Text>
      </View>
    );

  };

  return (
    <View>
      <View style = {styles.bidCardHeader}>
          <Text style={styles.index}>Index</Text>
          <Text style={styles.name}>Bidder Name</Text>
          <Text style={styles.price}>Received Bid</Text>
      </View>
      {
        bidArray.length !== 0 ? (
          <FlatList
            data={bidArray}
            style={styles.list}
            renderItem={({item,index})=>{
              return (
              renderListItem(item,index));
            }}
            refreshing={isrefreshing}
            onRefresh={()=>{setIsRefreshing(true); setShouldRefresh(!shouldRefresh);}}
            keyExtractor={(item)=>item.id}
          />) : <Text style={styles.nopost}>No bids received yet!</Text>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container:{
      padding:30,
      paddingTop:100,
      width:'100%',
      height:'100%',
  },
  card: {
      alignContent:'center',
      backgroundColor:'white',
      shadowColor:'rgba(0,0, 0, 1)',
      shadowOffset:{width:1,height:1},
      shadowRadius:5,
      elevation:3,
      zIndex:1,
      marginVertical:5,
      marginHorizontal:10,
  },
  cardTitle: {
    width:'70%',
    textAlign:'left',
    fontWeight:'bold',
    fontSize:20,
    color:'black',
    padding:10,
    margin:0,
  },
  menuButton:{
      padding:10,
      paddingEnd:0,
      backgroundColor:'white',
  },
  daysago:{
    width:'20%',
    paddingTop:10,
    fontSize:16,
  },
  cardHeader:{
      height:50,
      display:'flex',
      flexDirection:'row',
      marginBottom:10,
  },
  cardDiscription : {
    color:'grey',
    fontSize:16,
    paddingHorizontal:10,
    maxHeight:100,
  },
  cardContent:{
      display:'flex',
      flexDirection:'row',
      padding:10,
      margin:5,
      backgroundColor:'white',
  },
  bidCardHeader:{
      display:'flex',
      flexDirection:'row',
      padding:10,
      backgroundColor:'lightblue',
  },
  text:{
    color:'blue',
    fontSize:16,
    paddingLeft:20,
    width:'50%',
  },
  cards:{
      margin:15,
      elevation:2,
  },
  bidCardContent:{
    display:'flex',flexDirection:'row',
  },
  bidText:{
      color:'blue',
      paddingLeft:10,
      fontSize:16,
  },
  list:{
      width:'100%',
      height:'100%',
  },
  btn:{
    fontSize:20,
  },
  price:{
    width:'30%',
    fontSize:16,
    color:'black',
    textAlign:'center',
    paddingHorizontal:5,
  },
  name:{
    width:'55%',
    fontSize:16,
    color:'black',
    paddingHorizontal:5,
  },
  index:{
    width:'12%',
    fontSize:16,
    color:'black',
    paddingEnd:5,
    textAlign:'center',
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
    width:350,
    alignSelf:'center',
    height:350,
  },
  option: {
    fontSize:17,
    textAlign:'center',
    padding:5,
    marginHorizontal:5,
    color:'black',
    shadowColor:'rgba(0, 0, 0, 0)',
    shadowOffset:{width:2,height:2},
    shadowRadius:5,
    zIndex:1,
    alignSelf:'flex-start',
  },
});

export {PostActivity,BidList};
