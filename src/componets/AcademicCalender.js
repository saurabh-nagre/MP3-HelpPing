/* eslint-disable prettier/prettier */
import React, {useState,useEffect,useCallback} from 'react';
import {Text,View,StyleSheet,SafeAreaView,FlatList} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { ScrollView } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';

const days = ['Sunday','Monday','TuesDay','Wednesday','Thursday','Friday','Saturday'];

export default function AcademicCalender({props}){
    const [year,setYear] = useState(new Date().getFullYear());
    const years = ['1st Year','2nd Year','3rd Year','4th Year'];
    const [currentYear,setCurrentYear] = useState('');
    const [events,setEvents] = useState([]);
    useEffect(() => {

        const yearSub = firestore().collection('academicActivity').doc('year').get()
        .then((value)=>{
           setYear(value.data().year);
        },(reason)=>{
            console.log(reason);
        });
        const subscriber = firestore().collection('academicActivity').doc('1st Year').collection('data').orderBy('date').get()
        .then((value)=>{
            let arr = [];
            value.forEach((doc)=>{
                const data = {...doc.data(),key:doc.id};
                const date = new Date(data.date.seconds * 1000);
                data.date = date.toLocaleDateString();
                data.day = days[date.getDay()];
                arr.push(data);
            });
            setEvents(arr);
        },(reason)=>{
            console.log(reason);
        });
        return () => {
            subscriber;
            yearSub;
        };

    },[getEvents]);

    const getEvents = useCallback((res)=>{
        firestore().collection('academicActivity').doc(res).collection('data').get()
        .then((value)=>{
            let arr = [];
            value.forEach((doc)=>{
                const data = {...doc.data(),key:doc.id};
                const date = new Date(data.date.seconds * 1000);
                data.date = date.toLocaleDateString();
                data.day = days[date.getDay()];
                arr.push(data);
            });
            setEvents(arr);
        },(reason)=>{
            console.log(reason);
        });
    },[]);


        return (
                <SafeAreaView >
                    <View style={styles.header}>
                        <Text style={styles.headertext}>Academic Calender {year}-{year + 1}</Text>
                        <Picker style={styles.dropdown} dropdownIconColor="white" onValueChange={(value,index)=>{setCurrentYear(value); getEvents(value);}} selectedValue={currentYear}>
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
                            <ScrollView horizontal={true} style={styles.rows} >
                                <Text style={styles.index}>{index}</Text>
                                <Text style={styles.col}>{item.day}</Text>
                                <Text style={styles.col}>{item.date}</Text>
                                <Text style={styles.colLong}>{item.event}</Text>
                            </ScrollView>
                        )}
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
            width:80,
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
            width:80,
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
    }
);
