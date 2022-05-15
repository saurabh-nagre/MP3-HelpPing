/* eslint-disable prettier/prettier */
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import LoginPage from  '../componets/LoginPage';
import Dashboard from '../componets/DashboardPage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BuySell from '../componets/BuySell';
import AcademicCalender from '../componets/AcademicCalender';
import ClubEvents from '../componets/ClubEvents';
import Discussion from '../componets/Discussion';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Profile from '../componets/Profile';
import Activity, { PostActivity, BidList } from '../componets/Activity';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Home from '../componets/Home';
import Logout from '../componets/logout';
import CreatePost from '../componets/CreatePost';
import SellPosts from '../componets/sellPosts';
import ClubEventsPosts from '../componets/ClubEventsPosts';
import auth from '@react-native-firebase/auth';
// import Header from '../shared/DrawerContent';
const Stack = createNativeStackNavigator();

const activeColor = '#3366ff';
const defaultColor = '#ff4d4d';
export default function StackRouter() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export function ActivityStackRouter(){
  return (
    <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName="PostActivity">
        <Stack.Screen  name="PostActivity" component={PostActivity} />
        <Stack.Screen  name="BidList" component={BidList} />
    </Stack.Navigator>
  );
}

export function BuySellStackRouter(){
  return (
      <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName="SellPosts">
        <Stack.Screen name="Profile" component={Profile}/>
        <Stack.Screen  name="SellPosts" component={SellPosts} />
        <Stack.Screen  name="CreatePost" component={CreatePost} />
      </Stack.Navigator>
  );
}
export function ClubEventsRouter(){
  return (
      <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName="BuySellPosts">
        <Stack.Screen  name="ClubEventsPosts" component={ClubEventsPosts} />
        <Stack.Screen  name="CreatePost" component={CreatePost} />
      </Stack.Navigator>
  );
}
const Tab = createBottomTabNavigator();

export function TabRouter(){
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator screenOptions={{headerShown:false}} >
        <Tab.Screen name="Buy/Sell" component={BuySell} options={{tabBarIcon:(iconinfo)=>{
          return (
            <Icon name="balance-scale" size={iconinfo.focused ? 30 : 20} color={iconinfo.focused ? activeColor : defaultColor} />
          );
        }}}/>
        <Tab.Screen name="Academic Calender" component={AcademicCalender} options={{tabBarIcon:(iconinfo)=>{
          return (
            <Icon name="calendar" size={iconinfo.focused ? 30 : 20} color={iconinfo.focused ? activeColor : defaultColor} />
          );
        }}}/>
        <Tab.Screen name="Club Events" component={ClubEvents} options={{tabBarIcon:(iconinfo)=>{
          return (
            <Icon name="slideshare" size={iconinfo.focused ? 30 : 20} color={iconinfo.focused ? activeColor : defaultColor} />
          );
        }}}/>
        <Tab.Screen name="Discussion" component={Discussion} options={{tabBarIcon:(iconinfo)=>{
          return (
            <Icon name="comments-o" size={iconinfo.focused ? 30 : 20} color={iconinfo.focused ? activeColor : defaultColor} />
          );
        }}}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const Drawer = createDrawerNavigator();

export function DrawerRouter(){
  return (
    <NavigationContainer independent={true} >
      <Drawer.Navigator>
        <Drawer.Screen name="Home" component = {Home} options={{ drawerIcon:(iconinfo)=>{
          return (<Icon name="home" size={iconinfo.focused ? 30 : 20} color={iconinfo.focused ? activeColor : defaultColor} />);
        }}}/>
        <Drawer.Screen name="Profile" component={Profile} initialParams={{user : auth().currentUser.uid}} options={{ drawerIcon:(iconinfo)=>{
          return (<Icon name="user-circle" size={iconinfo.focused ? 30 : 20} color={iconinfo.focused ? activeColor : defaultColor} />);
        }}} />
        <Drawer.Screen name="Activity" component={Activity} options={{ drawerIcon:(iconinfo)=>{
          return (<Icon name="inbox" size={iconinfo.focused ? 30 : 20} color={iconinfo.focused ? activeColor : defaultColor} />);
        }}}/>
        <Drawer.Screen name="Log Out" component={Logout} options={{ drawerIcon:(iconinfo)=>{
          return (<MaterialIcons name="logout" size={iconinfo.focused ? 30 : 20} color={iconinfo.focused ? activeColor : defaultColor} />);
        }}}/>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
