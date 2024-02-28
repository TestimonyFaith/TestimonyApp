import { View,Text,Image } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native";
import {COLORS,icons,images,SIZES,FONT} from '../constants';
import styleCom from '../styles/common'
import { SafeAreaView } from "react-native-safe-area-context";
import  styleFont from '../styles/fonts';
import { useState,useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';


import Login from '../components/screen/login';
import Home from '../components/screen/Home';
import CreateConv from '../components/screen/Conversation/ConvCreator'
import EditorConv from '../components/screen/Conversation/ConvEditor'
import ListConv from '../components/screen/Conversation/ConvList'
import Message from '../components/screen/messages'
import UserEditPage from '../components/screen/Users/Edit';
import UserDetailsPage from '../components/screen/Users/Details';
import SearchPage from '../components/screen/SearchUser';
import CameraPage from '../components/screen/messages/Component/CameraPage';
import DashBoard from '../components/screen/Theme'
import MediaDetails from '../components/screen/Media/MediaDetails'
import AVHeader from '../components/AVHeader'
import PostWriter from '../components/Inputs/EventWriter'

{/* Signup screens */}
import Welcome from '../components/screen/signup/welcome';
import Info from '../components/screen/signup/info';
import Step from '../components/screen/signup/step';
import Testi from '../components/screen/signup/testimony';
import Congrats from '../components/screen/signup/congrats';
import Modify from '../components/screen/signup/modify';
import ModifyStep from '../components/screen/signup/modifyStep';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Avatar } from '@rneui/themed';
import { Badge } from '@rneui/themed';

import { RootSiblingParent } from 'react-native-root-siblings'

import BackgroundFetch from 'react-native-background-fetch';
import PushNotification from 'react-native-push-notification';
import SplashLoader from '../components/screen/Loader';
import QuestSelectPage from '../components/QuestionSelector';
import BookSelectPage from '../components/Book/BookSelector';
import ChapSelectPage from '../components/Book/ChapterSelector';
import VerseSelectPage from '../components/Book/VerseSelector';
import ImageSelectPage from '../components/Book/ImageSelector';
import NoteListPage from '../components/screen/Theme/NoteList';
import TagListPage from '../components/screen/Theme/VerseList';
import TestListPage from '../components/screen/Theme/TestiList';

import ViewUserPage from '../components/screen/Users/ViewProfile';

import CommentPage from '../components/screen/Home/Comments';



{/*Interactive book */}
import InteractiveBookPage from '../components/InteractiveBook';
import BookListPage from '../components/InteractiveBook/BookList';
import BookCreatorPage from '../components/InteractiveBook/Input';
import BookModifyPage from '../components/InteractiveBook/Modify';


import { useFonts } from 'expo-font';


function LoginScreen({navigation}) {
  return (
    <Login navigation={ navigation }/>
  );
}

const HomeScreen = ({navigation,route})=> {
  return (
    <Home navigation={ navigation } route={route}/>
  );
}

const ConvScreen = ({navigation}) => {
  return (
    <ListConv navigation={ navigation }/>
  );
}

{/* Signup screen && process */}

const SignUpWelcomeScreen = ({navigation, route}) => {
  return (
    <Welcome navigation={ navigation }/>
  );
}

const SignUpInfoScreen = ({navigation, route}) => {
  return (
    <Info navigation={ navigation }/>
  );
}

const ModifyScreen = ({navigation, route}) => {
  return (
    <Modify navigation={ navigation } route={route} />
  );
}

const ModifyStepScreen = ({navigation, route}) => {
  return (
    <ModifyStep navigation={ navigation } route={route} />
  );
}


const SignUpStepScreen = ({navigation, route}) => {
  return (
    <Step navigation={ navigation }/>
  );
}

const SignUpTestiScreen = ({navigation, route}) => {
  return (
    <Testi navigation={ navigation } route={route}/>
  );
}

const SignUpCongratsScreen = ({navigation, route}) => {
  return (
    <Congrats navigation={ navigation }/>
  );
}

{/* end signup screen  */}

const UserDetails = ({navigation}) =>(
    <UserDetailsPage navigation={ navigation }/>
);


const UserView = ({navigation,route}) => {
  return(
    <ViewUserPage navigation={ navigation } route={route}/>
  );
}

const CommentScreen = ({navigation,route}) =>{
  return(
    <CommentPage navigation={ navigation } route={route}/>
  );
}


const CreateConvScreen = ({navigation,route}) =>{
  return (
    <CreateConv navigation={ navigation } route={route}/>
  );
}

const EditorConvScreen = ({navigation,route}) => {
  return (
    <EditorConv navigation={ navigation } route={route}/>
  );
}

const SearchUser = ({navigation, route}) => {
  return (
    < SearchPage navigation={navigation} route={route}/>
  );
}

const MessageScreen = ({navigation, route}) => {
  return (
    < Message navigation={navigation} route={route}/>
  );
}

const CamScreen = ({navigation, route})=>{
  return (
    < CameraPage navigation={navigation} route={route}/>
  );
}

const QuestSelectScreen = ({navigation, route})=>{
  return (
    < QuestSelectPage navigation={navigation} route={route}/>
  );
}

const BookSelectScreen = ({navigation, route})=>{
  return (
    < BookSelectPage navigation={navigation} route={route}/>
  );
}

const ChapSelectScreen = ({navigation, route})=>{
  return (
    < ChapSelectPage navigation={navigation} route={route}/>
  );
}

const VerseSelectScreen = ({navigation, route})=>{
  return (
    < VerseSelectPage navigation={navigation} route={route}/>
  );
}

const ImageSelectScreen = ({navigation, route})=>{
  return (
    < ImageSelectPage navigation={navigation} route={route}/>
  );
}

{/*INTERACTIVE BOOK  */}
const InteractiveBookScreen = ({navigation, route})=>{
  return (
    < InteractiveBookPage navigation={navigation} route={route}/>
  );
}

const BookListScreen = ({navigation, route})=>{
  return (
    <BookListPage navigation={navigation} route={route}/>
  );
}

const BookCreatorScreen = ({navigation, route})=>{
  return (
    < BookCreatorPage navigation={navigation} route={route}/>
  );
}

const BookModifyScreen = ({navigation, route})=>{
  return (
    < BookModifyPage navigation={navigation} route={route}/>
  );
}

const NoteListScreen = ({navigation, route})=>{
  return (
    < NoteListPage navigation={navigation} route={route}/>
  );
}

const TagListScreen = ({navigation, route}) =>{
  return (
    < TagListPage navigation={navigation} route={route}/>
  );
}

const TestListScreen = ({navigation, route})=> {
  return (
    < TestListPage navigation={navigation} route={route}/>
  );
}

const ThemeScreen = ({navigation,route})=> {
  return (
    <Theme navigation={ navigation } route={route}/>
  );
}

const DashScreen = ({navigation, route})=> {
  return(
    <DashBoard navigation={navigation}/>
  );
}

const MediaScreenDetails = ({navigation, route})=> {
  return(
    <MediaDetails navigation={navigation}/>
  );
}

const Writer = ({navigation, route}) =>{
  return(
    <PostWriter navigation={navigation} route={route}/>
  );
}

const Splash = ({navigation, route}) =>{
  return(
    <SplashLoader navigation={navigation}/>
  );
}

const LogoTitle = () =>{
  return (
    <View style={{flex:1,flexDirection:"row"}}>
      <Image style={[styleCom.logoHead,{tintColor:COLORS.green}]} source={icons.logo} />
      <Text
        style={{ width: 150, height: 75,marginTop:0,marginLeft:3,color:COLORS.green,fontFamily:'Gabriela',fontSize:24}}
      >Testimony</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App({navigation}) {

  useEffect(()=>{

    async function getColorUser(){
      const colorUser = await AsyncStorage.getItem('USER_COLOR');
      if(colorUser != ' ' || colorUser == undefined || colorUser== null){
        console.log('user color : '+colorUser);
        COLORS.green = colorUser;
      }else{
        console.log('user color : '+colorUser);
        colorUser = '#E0CDA9';
      }
    }
    getColorUser();
  },[])

  const [fontsLoaded,error] = useFonts({
    //Pacifico
    'Gabriela': require('../assets/fonts/Pacifico.ttf'),

    //DMS
    'dmsMedium':require('../assets/fonts/DMSans-Medium.ttf'),
    'dmsRegular':require('../assets/fonts/DMSans-Regular.ttf'),
    'dmsBold':require('../assets/fonts/DMSans-Bold.ttf'),

    //Playfair display
    'playfairBlack':require('../assets/fonts/PlayfairDisplay-Black.ttf'),
    'playfairBold':require('../assets/fonts/PlayfairDisplay-Bold.ttf'),
    'playfairExtraBold':require('../assets/fonts/PlayfairDisplay-ExtraBold.ttf'),
    'playfairMedium':require('../assets/fonts/PlayfairDisplay-Medium.ttf'),
    'playfairRegular':require('../assets/fonts/PlayfairDisplay-Regular.ttf'),
    'playfairSemiBold':require('../assets/fonts/PlayfairDisplay-SemiBold.ttf'),

    //Roboto
    'RobotoBlack':require('../assets/fonts/Roboto-Black.ttf'),
    'RobotoMedium':require('../assets/fonts/Roboto-Medium.ttf'),
    'RobotoRegular':require('../assets/fonts/Roboto-Regular.ttf'),
    'RobotoLight':require('../assets/fonts/Roboto-Light.ttf'),

    //Roboto-slab
    'RobotoSlabBlack':require('../assets/fonts/RobotoSlab-Black.ttf'),
    'RobotoSlabMedium':require('../assets/fonts/RobotoSlab-Medium.ttf'),
    'RobotoSlabBold':require('../assets/fonts/RobotoSlab-Bold.ttf'),
    'RobotoSlabLight':require('../assets/fonts/RobotoSlab-Light.ttf'),
    'RobotoSlabExtraBold':require('../assets/fonts/RobotoSlab-ExtraBold.ttf'),
    'RobotoSlabSemiBold':require('../assets/fonts/RobotoSlab-SemiBold.ttf'),
  });

  if (!fontsLoaded) {
    console.log('font not loaded :'+error);
    return null;
  }else{
    console.log('font loaded successfully')
  }

  {/*

  ------------------------------------------------
    LOCAL NOTIF : FETCH MESSAGE DATA 
  ------------------------------------------------

  // 2. Add the following useEffect hook.
  useEffect(() => {
    // Push notifications setup (recommend extracting into separate file)
    PushNotification.configure({
      // onNotification is called when a notification is to be emitted
      onNotification: notification => console.log(notification),

      // Permissions to register for iOS
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
    });

    // Background fetch setup (recommend extracting into separate file)
    BackgroundFetch.configure(
      {
        minimumFetchInterval: 15, // fetch interval in minutes
      },
      async taskId => {
        console.log('Received background-fetch event: ', taskId);

        // 3. Insert code you want to run in the background, for example:
        const outsideTemperature = await getTemperatureInCelsius();

        if (outsideTemperature <= 0) {
          // 4. Send a push notification
          PushNotification.localNotification({
            title: 'Cold Weather Alert',
            message: `It's ${outsideTemperature} degrees outside.`,
            playSound: true,
            soundName: 'default',
          });
        }
        
        // Call finish upon completion of the background task
        BackgroundFetch.finish(taskId);
      },
      error => {
        console.error('RNBackgroundFetch failed to start.');
      },
    );
  }, []);

  ------------------------------------------------
*/}
  

  return (
    <RootSiblingParent>
    <NavigationContainer independent="true">
      <Stack.Navigator>
      
      <Stack.Screen name="Load" component={Splash} options={{ headerShown: false }} />

      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />

      <Stack.Screen
          name="Home"
          component={HomeFct}
          options={{ headerShown: false }}
      />


      <Stack.Screen
          name="UserDetails"
          component={UserDetails}
          options={{ 
            headerTitle: (props) =>(
              <LogoTitle style={{padding:10}} {...props} /> 
            ),
            headerRight: () => (   
              <AVHeader navigation={navigation}/>
            ),
            headerStyle: {
              borderBottomColor:COLORS.green,
              borderBottomWidth:3,
            }}}
      />

      <Stack.Screen
          name="UserView"
          component={UserView}
          options={{ 
            headerTitle: (props) =>(
              <LogoTitle style={{padding:10}} {...props} /> 
            ),
            headerRight: () => (   
              <AVHeader navigation={navigation}/>
            ),
            headerStyle: {

              borderBottomColor:COLORS.green,
              borderBottomWidth:3,
            }}}
      />

      <Stack.Screen
          name="CommentView"
          component={CommentScreen}
          options={{ 
            headerTitle: (props) =>(
              <LogoTitle style={{padding:10}} {...props} /> 
            ),
            headerRight: () => (   
              <AVHeader navigation={navigation}/>
            ),
            headerStyle: {
              borderBottomColor:COLORS.green,
              borderBottomWidth:3,
            }}}
      />

{/* SIGNUP */}
      <Stack.Screen
          name="WelcomeSignUp"
          component={SignUpWelcomeScreen}
          options={{ headerShown: false }}
      />
      <Stack.Screen
          name="InfoSignUp"
          component={SignUpInfoScreen}
          options={{ headerShown: false }}
      />
      <Stack.Screen
          name="ModifyPage"
          component={ModifyScreen}
          options={{ headerShown: false }}
      />
      <Stack.Screen
          name="ModifyStepPage"
          component={ModifyStepScreen}
          options={{ headerShown: false }}
      />
      <Stack.Screen
          name="StepSignUp"
          component={SignUpStepScreen}
          options={{ headerShown: false }}
      />
      <Stack.Screen
          name="TestiSignUp"
          component={SignUpTestiScreen}
          options={{ headerShown: false }}
      />
      <Stack.Screen
          name="CongratsSignUp"
          component={SignUpCongratsScreen}
          options={{ headerShown: false }}
      />
{/* END SIGNUP */}

      <Stack.Screen
          name="CameraPage"
          component={CamScreen}
          options={{ headerShown: false }}
      />

      <Stack.Screen
          name="QuestSelector"
          component={QuestSelectScreen}
          options={{ headerShown: false }}
      />

      <Stack.Screen
          name="BookSelector"
          component={BookSelectScreen}
          options={{ headerShown: false }}
      />

      <Stack.Screen
          name="ChapSelector"
          component={ChapSelectScreen}
          options={{ headerShown: false }}
      />

      <Stack.Screen
                name="VerseSelector"
                component={VerseSelectScreen}
                options={{ headerShown: false }}
            />
    
      <Stack.Screen
                name="ImageSelector"
                component={ImageSelectScreen}
                options={{ headerShown: false }}
            />

      <Stack.Screen
                name="InteractiveBook"
                component={InteractiveBookScreen}
                options={{ headerShown: false }}
            />
      <Stack.Screen
                name="BookList"
                component={BookListScreen}
                options={{ headerShown: false }}
            />
      <Stack.Screen
                name="BookCreator"
                component={BookCreatorScreen}
                options={{ headerShown: false }}
            />
      <Stack.Screen
                name="BookModify"
                component={BookModifyScreen}
                options={{ headerShown: false }}
            />

      <Stack.Screen
                name="NoteList"
                component={NoteListScreen}
                options={{ headerShown: false }}
      />

      <Stack.Screen
                name="TagList"
                component={TagListScreen}
                options={{ headerShown: false }}
      />

<Stack.Screen
                name="TestList"
                component={TestListScreen}
                options={{ headerShown: false }}
      />


<Stack.Screen
          name="ContentWriter"
          component={Writer}
          options={{ 
            headerTitle: (props) =>(
              <LogoTitle style={{padding:10}} {...props} /> 
            ),
            headerRight: ()=>{
              <AVHeader navigation={navigation}/>
            },
            headerStyle: {
              borderBottomColor:COLORS.green,
              borderBottomWidth:3,
            }}}
      />

      <Stack.Screen
          name="MediaDetails"
          component={MediaScreenDetails}
          options={{ 
            headerTitle: (props) =>(
              <LogoTitle style={{padding:10}} {...props} /> 
            ),
            headerRight: ()=>{
              <AVHeader navigation={navigation}/>
            },
            headerStyle: {
              borderBottomColor:COLORS.green,
              borderBottomWidth:3,
            }}}
      />

        <Stack.Screen name="CreateConv" component={CreateConvScreen} 
                options={{ 
                headerTitle: (props) =>(
                  <LogoTitle style={{padding:10}} {...props} /> 
                ),
                headerRight: ()=>{
                  <AVHeader navigation={navigation}/>
                },
                headerStyle: {
                  borderBottomColor:COLORS.green,
                  borderBottomWidth:3,
                }}}
                />

        <Stack.Screen name="Editor" component={EditorConvScreen} 
                options={{ 
                headerTitle: (props) =>(
                  <LogoTitle style={{padding:10}} {...props} /> 
                ),
                headerRight: () => (   
                  <AVHeader navigation={navigation}/>
                ),
                headerStyle: {
                  borderBottomColor:COLORS.green,
                  borderBottomWidth:3,
                }}}
                />

        <Stack.Screen name="Message" component={MessageScreen} 
                options={{ 
                headerTitle: (props) =>(
                  <LogoTitle style={{padding:10}} {...props} /> 
                ),
                headerRight: () => (   
                  <AVHeader navigation={navigation}/>
                ),
                headerStyle: {
                  borderBottomColor:COLORS.green,
                  borderBottomWidth:3,
                }}}
                />

      </Stack.Navigator>
    </NavigationContainer>
    </RootSiblingParent>
  );
}

function HomeFct({navigation}) {
  return (
    <RootSiblingParent>
      <Tab.Navigator>

        <Tab.Screen name="Home" component={HomeScreen} 
        options={  
        { 

        headerTitle: (props) =>(
          <LogoTitle style={{padding:10}} {...props} /> 

        ),
        headerRight: () => (   
          <AVHeader navigation={navigation}/>
          ),
        headerStyle: {
          borderBottomColor:COLORS.green,
          borderBottomWidth:3,
        },
          tabBarIcon:({size,focused,color}) => {
            return (
              <Image
                style={{ width: size, height: size }}
                source={require('../assets/icons/house.png')}
  
              />
            );
          
        },
        tabBarActiveTintColor: COLORS.green,
        tabBarInactiveTintColor: 'gray'}}
          />
      
      <Tab.Screen name="Messages" component={ConvScreen} 
        options={{ 
        headerTitle: (props) =>(
          <LogoTitle style={{padding:10}} {...props} /> 
        ),
        headerRight: () => (   
          <AVHeader navigation={navigation}/>

        ),
        headerStyle: {
          borderBottomColor:COLORS.green,
          borderBottomWidth:3,
        },
        tabBarIcon:({size,focused,color}) => {
          return (
            <Image
              style={{ width: size, height: size }}
              source={require('../assets/icons/conversation.png')}

            />
          );
        },
        tabBarActiveTintColor: COLORS.green,
        tabBarInactiveTintColor: 'gray',}}
        />

<Tab.Screen name="Ajouter" component={Writer} 
        options={{ 
        headerTitle: (props) =>(
          <LogoTitle style={{padding:10}} {...props} /> 
        ),
        headerRight: () => (   
          <AVHeader navigation={navigation}/>

        ),
        headerStyle: {
          borderBottomColor:COLORS.green,
          borderBottomWidth:3,
        },
        tabBarIcon:({size,focused,color}) => {
          return (
            <Image
              style={{ width: size+5, height: size+5,tintColor:COLORS.green }}
              source={require('../assets/icons/add.png')}

            />
          );
        },
        tabBarActiveTintColor: COLORS.green,
        tabBarInactiveTintColor: 'gray',}}
        />

<Tab.Screen name="Recherche" component={SearchUser} 
        options={{ 
        headerTitle: (props) =>(
          <LogoTitle style={{padding:10}} {...props} /> 
        ),
        headerRight: () => (   
          <AVHeader navigation={navigation}/>

        ),
        headerStyle: {
          borderBottomColor:COLORS.green,
          borderBottomWidth:3,
        },
        tabBarIcon:({size,focused,color}) => {
          return (
            <Image
              style={{ width: size, height: size }}
              source={require('../assets/icons/search.png')}

            />
          );
        },
        tabBarActiveTintColor: COLORS.green,
        tabBarInactiveTintColor: 'gray',}}
        />

<Tab.Screen name="DashBoard" component={DashScreen} 
        options={{ 
        headerTitle: (props) =>(
          <LogoTitle style={{padding:10}} {...props} /> 
        ),
        headerRight: () => (   
          <AVHeader navigation={navigation}/>

        ),
        headerStyle: {
          borderBottomColor:COLORS.green,
          borderBottomWidth:3,
        },
        tabBarIcon:({size,focused,color}) => {
          return (
            <Image
              style={{ width: size, height: size }}
              source={require('../assets/icons/hastag.png')}

            />
          );
        },
        tabBarActiveTintColor: COLORS.green,
        tabBarInactiveTintColor: 'gray',}}
        />


        

      </Tab.Navigator>
      </RootSiblingParent>
);
}
