/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import React,{useEffect,useState} from 'react';
import {Text,StyleSheet,View,TextInput,FlatList,TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DiscussionForum from './DiscussionForum';
export default function DiscussionList(props){

    const [forums,setForums] = useState([]);
    const [isrefreshing,setIsRefreshing] = useState(true);
    const [shouldRefresh,setShouldRefresh] = useState(true);
    const [showInputForum,setShowInputForum] = useState(true);
    const [forumName,setForumName] = useState('');

    useEffect(() => {
      const subscriber = firestore().collection('discussions').onSnapshot((snapshot)=>{
        const arr = [];
        snapshot.docChanges().forEach((result)=>{
            arr.push({id:result.doc.id, name :  result.doc.data().name});
        });
        setForums([...forums,...arr]);
      },((err)=>{console.log(err);}));

      return () => subscriber;
    }, []);

    useEffect(()=>{
        const subscriber = firestore().collection('discussion').get().then((value)=>{
            const arr = [];
            value.forEach((result)=>{
              arr.push({id:result.id, name :  result.data().name});
            });
            arr.reverse();
            setForums(arr);
        });

        setIsRefreshing(false);
        return ()=>subscriber;
    },[shouldRefresh]);

    const addForum = ()=>{
    };
    const createNewForum = ()=>{

    };
    return (
        <View>
            {
              forums.length === 0 ?
              <Text style={styles.nopost}>No Post Yet, Be one to post first !</Text>
            : null
            }
            <FlatList
            style={styles.flatlist}
            data={forums}
            refreshing={isrefreshing}
            onRefresh={()=>{setIsRefreshing(true); setShouldRefresh(!shouldRefresh);}}
            renderItem={({item,index})=><DiscussionForum {...item}/>}
          />

            {showInputForum ? <TouchableOpacity onPress={()=>{setShowInputForum(false); addForum();}} style={styles.floating} >
                  <Icon name="add-box" size={60} color="tomato"/>
                </TouchableOpacity> :
                <View>
                  <TextInput onChangeText={(text)=>setForumName(text)} style={styles.input}/>
                  <TouchableOpacity onPress={()=>{setShowInputForum(true); createNewForum();}} style={styles.submit} >
                    <Text style={styles.buttonText}>Submit</Text>
                  </TouchableOpacity>
                </View>}
        </View>
    );
}

const styles = new StyleSheet.create(
    {
      input: {
        height:60,
        position:'absolute',
        top:50,
        left:10,
        backgroundColor:'black',
        shadowColor:'rgba(0, 0, 0, 1)',
        shadowOffset:{width:5,height:5},
        shadowRadius:5,
        elevation:20,
        zIndex:5,
    },
      flatlist :{
        width:'100%',
        height:'100%',
      },
    naviconIcon:{
      marginHorizontal:10,
    },
      submit:{
        position:'absolute',
        right:10,
        top:100,
        backgroundColor:'green',
        width:'20%',
        height:40,
        elevation:10,
        zIndex:2,
        alignSelf:'flex-end',
      },
      cancel:{
        position:'absolute',
        right:10,
        top:50,
        backgroundColor:'red',
        width:'20%',
        height:40,
        alignSelf:'flex-end',
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
});
