/* eslint-disable prettier/prettier */
/* eslint-disable no-shadow */
import React,{useState} from 'react';
import {Text,Image,SafeAreaView,View,ScrollView,TextInput,TouchableOpacity,StyleSheet,Alert} from 'react-native';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-simple-toast';

const shouldContain = new RegExp('.walchandsangli.ac.in$');


const LoginPage = ({navigation}) => {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [ispressed,setisPressed] = useState(false);

  const checkEmail = ()=>{
    if (!shouldContain.test(email)){
      Alert.alert('Login Failed','Please use Walchandsangli Email only',['Ok'],{cancelable:false});
      setEmail('');
      setPassword('');
      return false;
    }
    else {return true;}
  };
  //navigate to dashboard starts
  const navigateDashboard = ()=>{
    navigation.navigate('Dashboard');
  };

  //navigate to dashboard ends
  //Authentication starts
  const validateUser = async () =>{
    if (ispressed){
      return;
    }
    if (!checkEmail()){
      return;
    }
    if (password.length < 9){
      Alert.alert('Signup Failed','Password should be more than 8 characters long.',['ok'],{cancelable:false});
      setisPressed(false);
      return;
    }
    setisPressed(true);
    await auth().signInWithEmailAndPassword(email.toString(),password.toString()).then(
      async (value)=>{
        if (value.user){
          if (!value.user.emailVerified){
            await value.user.sendEmailVerification().then(
            ()=>{
              Alert.alert('Verify','Please check your mailbox and verify your mail!',['Ok'],{cancelable:false});
            },
            ()=>{
              Toast.show('Check your mailbox, Verify yourself and try again!');
            });
          }
          else {
            // navigate to dashboard
            navigateDashboard();
            Alert.alert('Successful','Navigate to dashboard',['Ok'],{cancelable:false});
          }

        }
        else {
          Alert.alert('Login Failed!','Try Login again!',['Ok'],{cancelable:false});
        }
      },(reason)=>{
        console.log(reason);
        Alert.alert('Login Failed!','Please check whether there are no problems at your end!',['Ok'],{cancelable:false});
      }
    )
    .catch((reason)=>{
      console.log(reason);
      Alert.alert('Login Failed!','Please check whether there are no problems at your end!',['Ok'],{cancelable:false});
    });
    setisPressed(false);
  };
  // Authentication end

  // reset Password starts
  const resetPassword = ()=>{
    if (!checkEmail()){
      return;
    }
    else {
      auth().sendPasswordResetEmail(email.toString()).then(()=>{
        setPassword('');
        Toast.show('Password Reset email sent to ' + email,Toast.SHORT);
      },(reason)=>{
        console.log(reason);
        Toast.show('Can\'t send password reset email ');
      }).catch((reason)=>{
        Toast.show('Can\'t send password reset email ');
      });
    }
  };
  // reset password end

  // signup user starts
  const signupUser = async ()=>{
    if (ispressed){
      return;
    }
    if (password.length < 9){
      Alert.alert('Signup Failed','Password should be more than 8 characters long.',['ok'],{cancelable:false});
      return;
    }

    if (!checkEmail()){
      return;
    }
    setisPressed(true);
    await auth().createUserWithEmailAndPassword(email,password).then(async (value)=>{
        if (value){
          await value.user.sendEmailVerification().then(()=>{
            Alert.alert('Verify','Please check your mailbox and verify your mail!',['ok'],{cancelable:false});
          },
          ()=>{
            Toast.show('Can\'t logged you at this time!',Toast.SHORT);
          });
        } else {
          Alert.alert('Failed','Please try loggin again!',['ok'],{cancelable:false});
        }

    },(reason)=>{
      console.log(reason);
      Alert.alert('Signup Failed!','Please check there are no problems at your end! or Try Login!',['ok'],{cancelable:false});
    })
    .catch((reason)=>{
      console.log(reason);
      Alert.alert('Signup Failed!','Please check there are no problems at your end! or Try Login!',['ok'],{cancelable:false});
    });

    setisPressed(false);
  };

  // signup user ends

  return (

    <SafeAreaView style={styles.container}>
      <ScrollView>
      <View>
        <Image source={require('../assets/wceLogo2.png')} style={styles.image}/>
        <Text style={styles.logoText}>HelpPing </Text>
      </View>

      <View style={styles.content}>
        <TextInput
              placeholder="Enter WCE Email ID"
              style = {styles.input}
              onChangeText={(email)=>setEmail(email)}
              defaultValue={email}
              textContentType="emailAddress"
              textBreakStrategy="simple"
              autoComplete="email"
              autoFocus={true}
              keyboardType="email-address"
              />
            <TextInput
              placeholder="Enter Password"
              // eslint-disable-next-line react-native/no-inline-styles
              style={{...styles.input , fontSize : 15 }}
              onChangeText={(password)=>{setPassword(password);}}
              textContentType="password"
              defaultValue={password}
              />
            <Text style={[styles.resettext]} onPress={()=>resetPassword()}>Reset Password</Text>
            <TouchableOpacity onPress={()=>{ validateUser();}} style={styles.loginButton} >
              <Text style={styles.authtext}>{ispressed ? 'Loading...' : 'Login'}</Text>
            </TouchableOpacity>

            <Text style={styles.text}>Or</Text>

            <TouchableOpacity onPress={()=>{signupUser();}} style={styles.signupButton}>
                <Text style={styles.authtext}>{ispressed ? 'Loading...' : 'Create New Account'}</Text>
            </TouchableOpacity>
      </View>
    </ScrollView>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#cce6ff',
  },
  content:{
    width:'80%',
    marginHorizontal:'10%',
    marginVertical:50,
  },
  text:{
    marginVertical:10,
    fontSize:18,
    textAlign:'center',
    fontWeight:'500',
    padding:10,
  },
  authtext:{
    fontSize:18,
    textAlign:'center',
    fontWeight:'bold',
    padding:10,
    color:'white',
  },
  resettext:{
    textAlign:'right',
    fontSize:15,
    fontWeight:'bold',
    marginTop:15,
    marginBottom:20,
  },
  loginButton:{
    marginHorizontal:10,
    backgroundColor:'green',
    borderRadius:20,
  },
  signupButton:{
    marginHorizontal:10,
    backgroundColor:'red',
    borderRadius:20,
  },
    image:{
        width:250,
        height:250,
        alignSelf:'center',
        marginHorizontal:'auto',
        borderRadius:120,
        marginTop:10,
    },
    input:{
      padding: 10,
      height: 50,
      fontSize:16,
      marginTop: 30,
      backgroundColor:'white',
      borderRadius: 10,
      shadowColor:'rgba(0, 0, 0, 0.75)',
      shadowOffset:{width:2,height:2},
      shadowRadius:5,
      elevation:10,
      zIndex:1,
    },
    logoText:{
        fontFamily:'notoserif',
        fontSize:42,
        color:'red',
        fontWeight:'bold',
        textAlign:'center',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: {width: 2, height: 2},
        textShadowRadius: 5,
    },
});

export default LoginPage;
