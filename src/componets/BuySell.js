import { View, Text, FlatList ,StyleSheet, Linking,Platform} from 'react-native'
import React, {useEffect,useState} from 'react'
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

const openDial = (phone)=>{
  if(Platform.OS == 'android'){
      Linking.openURL(`tel:${phone}`)
  }
  else{
    Linking.openURL(`telprompt:${phone}`)
  }
}

const renderItems=(item)=>{
    return(
        <Card style={styles.cards}>
    <Card.Title title={item.name} />
    <Card.Content>
      
      <Paragraph>{item.desc}</Paragraph>
    </Card.Content>
    <Card.Cover source={{ uri: item.image }} />
    <Card.Actions>
      <Button>Rs. {item.price}</Button>
      <Button onPress={()=>openDial(item.phone)}>call- {item.phone}</Button>
      
      
    </Card.Actions>
    <Card.Actions>
    <Button  styles={styles.btn} mode="contained" onPress={() => console.log('Pressed')}>
                Your price
        </Button>
    </Card.Actions>
  </Card>
    )
}



const SellItemScreen = () => {
    const [items, setItems] = useState([])
    const myitems=[
       
    ]
    const getDetails= async()=>{
      const querySnap =await firestore().collection('ads').get()
      const result = querySnap.docs.map(docSnap=>docSnap.data())
      console.log(result)
      setItems(result)
    }
    useEffect(()=>{
      getDetails()
      return()=>{
        console.log("cleanup")
      }
    },[])
  return (
    <View>
      <FlatList 
      data={items}
      keyExtractor={(item)=>item.phone}
      renderItem={({item})=>renderItems(item)}
     
      />
    </View>
  )
}


const styles= StyleSheet.create({
    cards:{
        margin:15,
        elevation:2
    },
    btn:{
      fontSize:20
    }
})

export default SellItemScreen