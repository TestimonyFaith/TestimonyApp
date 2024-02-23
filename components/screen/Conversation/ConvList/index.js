import { View,Text,Image, Alert } from "react-native";
import { ScrollView,FlatList, TextInput } from "react-native-gesture-handler";
import { TouchableOpacity, ActivityIndicator,RefreshControl } from "react-native";
import {COLORS,icons,images,SIZES} from '../../../../constants';
import styleCom from '../../../../styles/common'
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import  styleFont from '../../../../styles/fonts'
import { Avatar } from '@rneui/themed';
import { ListItem, BottomSheet } from '@rneui/themed';
import { Badge } from '@rneui/themed';
import { Tab } from "@rneui/base";

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc,  query, where, getDocs, collection } from "firebase/firestore";
import {auth,db} from "../../../../firebase"
import CardConv from '../ConvList/ConvCard'

import * as convBackEnd from '../../../../backend/Conversation'
import * as msgBackEnd from '../../../../backend/Messages'
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = ({ navigation }) =>{

  const [resQuery, setResQuery] = useState([]);
  const [showActivty , setShowActivity] = useState(false);
  const isFocusedSc = useIsFocused();
  const [refreshing, setRefreshing] = useState(false);


  useEffect(() => {
    // write your code here, it's like componentWillMount
    setShowActivity(true);
    getConv();

  }, [isFocusedSc])



  const getConv = async() =>{

    console.log('---------- INIT CONV SCREEN --------')

    //const q = query(collection(db, "cities"), where("capital", "==", true));

    await convBackEnd.getAllConv()
    .then((arrQuery)=>{
      console.log('await succesful conv !');
      setTimeout(function hideToast() {
        setResQuery(arrQuery);
        setShowActivity(false);
      }, 2000);

    })
  }

      const CardConvItem = ({name,id,image,date,members,author,shortContent,owner}) => (

          <CardConv name={name} id={id} image={image} date={date} members={members} author={author} shortContent={shortContent} owner={owner} />

      );

    return (
        <View style={{flex:1,backgroundColor:COLORS.lightWhite,padding:0,alignItems:"center",gap:10}}>
            {showActivty&&
              <View style={{flex:1,flexDirection:"column",alignItems:"center"}}>
                  <ActivityIndicator style={{marginTop:15}} size="large" color={COLORS.green} />
              </View>
            }
          <TouchableOpacity 
            style={[styleCom.button,{backgroundColor:COLORS.green}]} 
            onPress={()=>{
              navigation.navigate('CreateConv');
            }}
          >
              <Text style={styleFont.message}>Créer une conversation</Text>
          </TouchableOpacity>
          
          <ScrollView style={{width:'100%',padding:0}}
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
              }}/>}>
              <FlatList 
                  data={resQuery}
                  renderItem={({item}) => <CardConvItem name={item.nom} id={item.id} image={item.image} date={item.date} members={item.members} author={item.author} shortContent={item.shortContent} owner={item.owner}/>}
                  keyExtractor={item => item.id}
                  style={{width:"100%"}}
              />
          </ScrollView>
        </View>
    )
}
export default Home;