/* eslint-disable prettier/prettier */
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import LoginPage from  '../componets/LoginPage';
import Dashboard from '../componets/DashboardPage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AcademicCalender from '../componets/AcademicCalender';
import ClubEvents from '../componets/ClubEvents';
import Profile from '../componets/Profile/Profile';
import { PostActivity, BidList } from '../componets/Profile/Activity';
import Icon from 'react-native-vector-icons/FontAwesome';
import CreatePost from '../componets/CreatePost';
import SellPosts from '../componets/sellPosts';
import ClubEventsPosts from '../componets/ClubEventsPosts';
import DiscussionList from '../componets/DiscussionTab/DiscussionList';
import DiscussionForum from '../componets/DiscussionTab/DiscussionForum';
import DiscussionMain from '../componets/DiscussionTab/DiscussionMain';
import ProfileHome from '../componets/Profile/ProfileHome';
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

export function DiscussionStackRouter(){
  return (
    <Stack.Navigator initialRouteName="DiscussionList" screenOptions={{headerShown:true}}>
      <Stack.Screen name="DiscussionList"  options={{headerTitle:'Discussion'}}  component={DiscussionList} />
      <Stack.Screen name="DiscussionForum"  options={{headerTitle:'Discussion'}}  component={DiscussionForum}/>
    </Stack.Navigator>
  );
}


export function BuySellStackRouter(){
  return (
       <Stack.Navigator screenOptions={{headerShown:true}} initialRouteName="SellPosts">
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen  name="SellPosts"  options={{headerTitle:'Sell Posts'}}  component={SellPosts} />
        <Stack.Screen  name="CreatePost"  options={{headerTitle:'Create Post'}} component={CreatePost} />
      </Stack.Navigator>
  );
}
export function ClubEventsRouter(){
  return (
      <Stack.Navigator screenOptions={{headerShown:true} } initialRouteName="ClubEventsPosts">
        <Stack.Screen  name="ClubEventsPosts" options={{headerTitle:'Club Events'}} component={ClubEventsPosts} />
        <Stack.Screen  name="CreatePost" options={{headerTitle:'Create Post'}} component={CreatePost} />
      </Stack.Navigator>
  );
}
export function ProfileStackRouter(){
  return (
    <Stack.Navigator screenOptions = {{headerShown:true}} initialRouteName="ProfileHome">
      <Stack.Screen name="ProfileHome"  options={{headerTitle:'Profile'}}  component={ProfileHome}/>
      <Stack.Screen name="profile"  options={{headerTitle:'Profile'}}  component={Profile}/>
      <Stack.Screen name="activity"  options={{headerTitle:'Activity'}}  component={PostActivity}/>
      <Stack.Screen  name="BidList"  options={{headerTitle:'Bid list'}}  component={BidList} />
    </Stack.Navigator>
  );
}
const Tab = createBottomTabNavigator();

export function TabRouter(){
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator screenOptions={{headerShown:false}} >
        <Tab.Screen name="Buy/Sell" children={()=>BuySellStackRouter()} options={ {tabBarIcon:(iconinfo)=>{
          return (
            <Icon name="balance-scale"  size={iconinfo.focused ? 30 : 20} color={iconinfo.focused ? activeColor : defaultColor} />
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
        <Tab.Screen name="DiscussionMain" component={DiscussionMain} options={{tabBarIcon:(iconinfo)=>{
          return (
            <Icon name="comments-o" size={iconinfo.focused ? 30 : 20} color={iconinfo.focused ? activeColor : defaultColor} />
          );
        }}}/>
        <Tab.Screen name="profileHome" children={()=>ProfileStackRouter()} options={{
          tabBarIcon:(iconinfo)=>{
            return (
              <Icon name="comments-o" size={iconinfo.focused ? 30 : 20} color={iconinfo.focused ? activeColor : defaultColor} />
            );
          }}}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
