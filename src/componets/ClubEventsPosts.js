/* eslint-disable prettier/prettier *//* eslint-disable react-hooks/exhaustive-deps */

import { View, Text,FlatList ,StyleSheet,TouchableOpacity,Image,Alert, Linking,Platform} from 'react-native';
import React, {useEffect,useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import MenuOptionIcon from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MenuIcon from 'react-native-vector-icons/Feather';
import { Menu , MenuOptions, MenuOption,MenuTrigger} from 'react-native-popup-menu';
import { ScrollView } from 'react-native-gesture-handler';
const openDial = (phone)=>{
  if (Platform.OS === 'android'){
      Linking.openURL(`tel:${phone}`);
  }
  else {
    Linking.openURL(`telprompt:${phone}`);
  }
};

export default function SellPosts(props){
    const [items, setItems] = useState([]);
    const [isrefreshing,setIsRefreshing] = useState(true);
    const [shouldRefresh,setShouldRefresh] = useState(true);
    const [showAddButton,setShowAddButton] = useState(false);
    useEffect(()=>{
        firestore().collection('ClubEventsEditors').get().then((result)=>{
            let useremail = auth().currentUser.email;
            result.forEach((snapshot)=>{
                if (snapshot.data().email === useremail){
                    setShowAddButton(true);
                }
            });
        }).catch((reason)=>{
            console.log(reason);
        });

      if (isrefreshing){
        firestore().collection('clubEventsPosts').orderBy('time').get().then((value)=>{
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
        setIsRefreshing(false);
      }

      return ()=>{};
    },[shouldRefresh]);

    const navigateToEditPost = (Postid)=>{
        props.navigation.navigate('CreatePost',{from:'clubEventsPosts',editable:true,id:Postid});
    };
    const navigateToCreatePost = ()=>{
        props.navigation.navigate('CreatePost',{from:'clubEventsPosts',editable:false,id:123});
    };
    const navigateToProfile = (id)=>{
        props.navigation.navigate('Profile',{user:id});
    };

      const selectAction = (val,item,index)=>{
        if (val === 'viewProfile'){
            navigateToProfile(item.uid);
        } else if (val === 'deleteItem' ){
            Alert.alert('Should Delete Post!','Only you can see this post after deletion',
            [{text:'Delete',onPress:()=>{
                    firestore().collection('clubEventsPosts').doc(item.id).delete().then(()=>{
                        console.log('Post Deleted');
                        let arr = items;
                        arr.splice(index,1);
                        console.log(arr.length);
                        setItems(arr);
                      }).catch((reason)=>{
                        console.log(reason);
                      });
            }},{text:'Cancel',onPress:()=>{},style:'cancel'} ],{cancelable:true});
        }
        else if (val === 'editItem') {
          navigateToEditPost(item.id);
        }
      };

    const renderItems = (item,index)=>{
        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{item.name}</Text>

                    <Menu onSelect={value => selectAction(value,item,index)} >
                                <MenuTrigger>
                                        <MenuIcon name ="more-vertical" size={30} color="black" style={styles.menuButton}/>
                                </MenuTrigger>

                                <MenuOptions>
                                    <MenuOption value="viewProfile" style={styles.cardContent}>
                                        <MenuOptionIcon name="user" size={25} color="black" solid={true}/>
                                        <Text style={styles.option}>Club Profile</Text>
                                    </MenuOption>
                                    {item.uid === auth().currentUser.uid ?
                                    <View>
                                        <MenuOption value="deleteItem" style={styles.cardContent}>
                                            <Icon name="delete" size={25} color="black"/>
                                            <Text style={styles.option}>Delete Post</Text>
                                        </MenuOption>
                                        <MenuOption value="editItem" style={styles.cardContent}>
                                            <MenuOptionIcon name="edit" size={25} color="black" solid={true}/>
                                            <Text style={styles.option}>Edit Post</Text>
                                        </MenuOption>
                                    </View> : null
                                    }
                                </MenuOptions>
                    </Menu>
                </View>
              <ScrollView nestedScrollEnabled={true} scr scrollsToTop={true} focusable={true} style={styles.scrollview}>
                <Text selectable={true} style = {styles.cardDiscription}>{item.description}</Text>
              </ScrollView>
              <Image  source = {{uri:item.imageurl}} style={styles.image} resizeMode="stretch" progressiveRenderingEnabled={true} />
                    <TouchableOpacity onPress={()=>openDial(item.phoneNo)} style={styles.callCardContent}>
                            <MenuIcon name="phone-call" size={20} color="blue"/>
                            <Text style={styles.calltext}>{item.phoneNo}</Text>
                    </TouchableOpacity>
            </View>
        );
    };
    return (
        <View>
          <FlatList
              style={styles.flatlist}
              data={items}
              refreshing={isrefreshing}
              onRefresh={()=>{setIsRefreshing(true); setShouldRefresh(!shouldRefresh);}}
              renderItem={({item,index})=>renderItems(item,index)}
            />
            {
              items.length === 0 ? (showAddButton ? <Text style={styles.nopost}>Reach to every student by sharing your event!</Text> :
              <Text style={styles.nopost}>No Post Yet, Be one to post first !</Text>)
            : null
            }
          <TouchableOpacity onPress={()=>navigateToCreatePost()} style={styles.floating} >
              <Icon name="add-box" size={60} color="tomato"/>
          </TouchableOpacity>
      </View>
    );
}


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
      width:'90%',
      textAlign:'left',
      fontWeight:'bold',
      fontSize:24,
      color:'black',
      padding:10,
      margin:0,
    },
    menuButton:{
        padding:10,
        paddingEnd:0,
        backgroundColor:'white',
    },
    cardHeader:{
        height:50,
        display:'flex',
        flexDirection:'row',
        marginBottom:10,
    },
    cardDiscription : {
      color:'black',
      fontSize:16,
      paddingHorizontal:10,
    },
    scrollview : {
      maxHeight:200,
    },
    cardContent:{
        display:'flex',
        flexDirection:'row',
        padding:10,
    },
    callCardContent:{
        display:'flex',flexDirection:'row',
        marginHorizontal:30,
        marginVertical:5,
    },
    calltext:{
        color:'blue',
        paddingLeft:10,
        fontSize:16,
    },
    text:{
        color:'blue',
        fontSize:16,
        paddingLeft:20,
        width:'50%',
    },
    cardInput:{
        height:40,
        backgroundColor:'lightblue',
        fontSize:16,
        marginLeft:20,
        width: 200,
    },
    flatlist :{
      width:'100%',
      height:'100%',
    },
    cardButton:{
      fontSize:16,
      marginLeft:50,
      width:100,
      textAlign:'center',
      paddingVertical:10,
      backgroundColor:'green',
      color:'white',
      height:40,
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
    nopost : {
      position:'absolute',
      top:300,
      alignSelf:'center',
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
        zIndex:2,
    },
    image:{
      margin:10,
      width:350,
      alignSelf:'center',
      height:400,
    },
});
