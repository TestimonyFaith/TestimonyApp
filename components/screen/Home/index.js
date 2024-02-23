import { View,Text,Image } from "react-native";
import { TouchableOpacity, ActivityIndicator,RefreshControl,FlatList,ScrollView } from "react-native";
import {COLORS,icons,images,SIZES} from '../../../constants';
import styleCom from '../../../styles/common'
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useCallback } from "react";
import  styleFont from '../../../styles/fonts';
import { Avatar } from '@rneui/themed';
import { ListItem } from '@rneui/themed';
import { Badge } from '@rneui/themed';
import { Tab } from "@rneui/base";

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc,  query, where, getDocs, collection } from "firebase/firestore";
import {auth,db} from "../../../firebase"
import CardFeed from '../Home/Card'

import * as eventBackEnd from '../../../backend/Event'
import * as userBackEnd from '../../../backend/Users'
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';


const Home = ({ navigation,route }) =>{

  const [resQuery, setResQuery] = useState([]);
  const [showActivty , setShowActivity] = useState(false);
  const [open, setOpen] = useState(false);
  const isFocusedSc = useIsFocused();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setShowActivity(true);
    console.log('refreshing ...');
    getConv();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);


  useEffect(()=>{
    // write your code here, it's like componentWillMount
      setShowActivity(true);
      getConv();
    },[isFocusedSc]);

  const getConv = async() =>{

    console.log('---------- INIT HOME SCREEN --------')

    //const q = query(collection(db, "cities"), where("capital", "==", true));

    await eventBackEnd.ReadAllEvents()
    .then((arrQuery)=>{
      console.log('await succesful');
      
      setTimeout(function hideToast() {
        setResQuery(arrQuery);
        console.log('read event  : '+ JSON.stringify(resQuery))  
        setShowActivity(false);
      }, 2000);
    })
  }

      const CardFeedItem = ({id,idUser,image,date,content,usAvatar,usName,usFirst,usPseudo,nbLikes,nbComs,theme,owner}) => (

        <CardFeed onDelete={()=>{getConv()}} navigation={navigation} id={id} idUser={idUser} image={image} date={date} content={content} usAvatar={usAvatar} usName={usName} usFirst={usFirst} usPseudo={usPseudo} nbLikes={nbLikes} nbComs={nbComs} theme={theme} owner={owner}/>
  
      );

    return (

      
        <View style={{flex:1,backgroundColor:COLORS.lightWhite,padding:0,alignItems:"center",gap:10,minWidth:'100%',minHeight:'90%'}}>
            {showActivty&&
              <View style={{flex:1,flexDirection:"column",alignItems:"center"}}>
                  <ActivityIndicator style={{marginTop:15}} size="large" color={COLORS.green} />
              </View>
            }
          <ScrollView 
            contentContainerStyle={{width:'100%',minHeight:'90%',padding:0}}
            refreshControl={
            <RefreshControl                   
              refreshing={refreshing}
              colors={[COLORS.green]}
              tintColor={COLORS.green}
              onRefresh={()=>{
                setRefreshing(true);
                getConv();
                setRefreshing(false);
              }}/>}
            >
                    
              <FlatList 
                  data={resQuery}
                  renderItem={({item}) => <CardFeedItem  idUser={item.idUser} usName={item.usName} usFirst={item.usFirst} usAvatar={item.usAvatar} id={item.id} image={item.photo} content={item.content} date={item.date} usPseudo={item.usPseudo} nbLikes={item.likes.length} nbComs={item.comments.length} theme={item.theme} owner={item.usOwner}/>}
                  keyExtractor={item => item.id}
                  style={{width:"100%",elevation:2,zIndex:2}}
              />
          </ScrollView>

        </View>
    )
}
export default Home;