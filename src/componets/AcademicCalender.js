/* eslint-disable prettier/prettier */
import React, {useState,useEffect} from 'react';
import {Text,View,RefreshControl,StyleSheet,SafeAreaView,FlatList} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { ScrollView } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';

const days = ['Sunday','Monday','TuesDay','Wednesday','Thursday','Friday','Saturday'];

export default function AcademicCalender({props}){
    const [year,setYear] = useState(new Date().getFullYear());
    const years = ['1st Year','2nd Year','3rd Year','4th Year'];
    const [currentYear,setCurrentYear] = useState('1st Year');
    const [events,setEvents] = useState([]);
    const [isFeatching,setisFetching] = useState(false);
    const [shouldFetch,setShouldFetch] = useState(false);
    const [currentIndex , setCurrentIndex] = useState(0);
    useEffect(() => {
        setisFetching(true);
        firestore().collection('academicActivity').doc('year').get()
        .then((value)=>{
           setYear(value.data().year);
        },(reason)=>{
            console.log(reason);
        }).catch((reason)=>{
            console.log(reason);
        });

        firestore().collection('academicActivity').doc(currentYear).collection('data').orderBy('date').get()
        .then((value)=>{
            let arr = [];
            let flag = true;
            value.forEach((doc,index)=>{
                const data = {...doc.data(),key:doc.id};
                const date = new Date(data.date.seconds * 1000);
                data.date = date.toLocaleDateString();
                if (flag && date.getTime() > Date.now()){
                    setCurrentIndex(index);
                    flag = false;
                }
                data.day = days[date.getDay()];
                arr.push(data);
            });
            setEvents(arr);
            setisFetching(false);
        },(reason)=>{
            console.log(reason);
        }).catch((reason)=>{
            console.log(reason);
        });

    },[shouldFetch,currentYear]);

        return (
                <SafeAreaView >
                    <View style={styles.header}>
                        <Text style={styles.headertext}>Academic Calender {year}-{year + 1}</Text>
                        <Picker style={styles.dropdown} dropdownIconColor="white" onValueChange={(value,index)=>{setCurrentYear(value);}} selectedValue={currentYear}>
                            {years.map((value,index)=>{
                                return (
                                    <Picker.Item key={value} value={value} label={value} />
                                );
                            })}
                        </Picker>
                    </View>
                    <ScrollView horizontal={true} style={styles.label}>
                        <Text style={styles.index}>No.</Text>
                        <Text style={styles.labeltext}>Day</Text>
                        <Text style={styles.labeltext}>Date</Text>
                        <Text style={styles.labeltextlong}>Academic/Examination Activities</Text>
                    </ScrollView>
                    <FlatList
                        data={events}
                        renderItem={({item,index})=>(
                            <ScrollView horizontal={true} style={index === currentIndex ? styles.currentrow : styles.rows}  >
                                <Text style={styles.index}>{index + 1}</Text>
                                <Text style={styles.col}>{item.day}</Text>
                                <Text style={styles.col}>{item.date}</Text>
                                <Text style={styles.colLong}>{item.event}</Text>
                            </ScrollView>
                        )}
                        refreshControl={
                            <RefreshControl
                              enabled={true}
                              refreshing={isFeatching}
                              onRefresh={()=>setShouldFetch(!shouldFetch)}
                            />
                        }
                    />
                </SafeAreaView>
        );
}


const styles = new StyleSheet.create(
    {
        headertext: {
            fontFamily:'verdana',
            fontSize:17,
            textAlign:'center',
            color:'white',
            paddingVertical:15,
            width:'60%',
        },
        header: {
            backgroundColor:'orange',
            height:50,
            flexDirection:'row',
        },
        dropdown: {
            color:'white',
            width:'40%',
        },
        index : {
            width:40,
            fontSize:15,
            color:'black',
            textAlign:'center',
            height:40,
            textAlignVertical:'center',
        },
        labeltext : {
            borderLeftColor:'grey',
            borderLeftWidth:1,
            width:90,
            fontSize:15,
            color:'black',
            textAlign:'center',
            height:40,
            textAlignVertical:'center',
        },
        labeltextlong : {
            borderLeftColor:'grey',
            borderLeftWidth:1,
            textAlign:'center',
            color:'black',
            fontSize:15,
            paddingHorizontal:5,
            height:40,
            textAlignVertical:'center',
            marginRight:20,
        },
        col : {
            borderLeftColor:'grey',
            textAlign:'center',
            borderLeftWidth:1,
            padding:5,
            width:90,
            fontSize:15,
            height:40,
            color:'black',
            textAlignVertical:'center',
        },
        colLong : {
            borderLeftColor:'grey',
            textAlign:'center',
            padding:5,
            borderLeftWidth:1,
            height:40,
            color:'black',
            textAlignVertical:'center',
            marginRight:20,
        },
        label :{
            borderColor:'grey',
            borderWidth:1,
            backgroundColor:'orange',
        },
        rows: {
            borderColor:'grey',
            borderWidth:1,
            margin:1,
        },
        currentrow :{
            borderColor:'grey',
            borderWidth:1,
            margin:1,
            backgroundColor:'lightblue',
        },
    }
);
