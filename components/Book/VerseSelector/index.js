import { View,Text,Image } from "react-native";
import { ScrollView,FlatList, TextInput } from "react-native-gesture-handler";
import { TouchableOpacity, ActivityIndicator } from "react-native";
import {COLORS,icons,images,SIZES} from '../../../constants';
import styleCom from '../../../styles/common'
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import  styleFont from '../../../styles/fonts';
import { Avatar } from '@rneui/themed';
import { ListItem } from '@rneui/themed';
import { Badge } from '@rneui/themed';
import { Tab } from "@rneui/base";

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc,  query, where, getDocs, collection } from "firebase/firestore";
import {auth,db} from "../../../firebase"
import * as convBackEnd from '../../../backend/Conversation'
import * as UserBack from '../../../backend/Users'

import bibFr from '../../../backend/bible/Data/json/fr_apee.json'
import * as bufferVerse from '../../../backend/buffer/bufferVerseSelector'
import * as buffertesti from '../../../backend/buffer/bufferSignup'
import * as bookBackEnd from '../../../backend/importBook';
import AsyncStorage from '@react-native-async-storage/async-storage';


const VerseSelector = ({navigation,route}) =>{

    useEffect(() => {
        getAllAbb();
  }, [])

  const [dataVerses,setDataVerses]=useState({});

const getAllAbb = async() =>{

    var dataVers = '';

    const vers = await AsyncStorage.getItem('VERS_BI');
    if(vers !=''){
        dataVers=vers;
    }else{
        dataVers= 'Colombe'
    }

    var bookRef = bufferVerse.getBook();
    var chapRef = bufferVerse.getChapter();
    var testNum = bufferVerse.getNumtest();
    await bookBackEnd.getAllVerses('fr',dataVers,bookRef,chapRef,testNum)
    .then((verse)=>{
        console.log('verses dans verseSlector : '+JSON.stringify(verse));
        setDataVerses(verse);
    })

}

const Verse = ({num,content}) => (

    
        <TouchableOpacity style={{height:'auto',padding:10,gap:10}} onPress={
            async()=>{
                if(route.params.fromPage == 'UserDetails'){
                    console.log('user id : '+route.params.user);
                    bufferVerse.setVerse(num)
                    dataUpdate = {verses:[{
                        verseAbbrev:bufferVerse.getBook(),
                        verseChap:bufferVerse.getChapter()+1,
                        verseText:content}]
                    };
                    await UserBack.UpdateCurrentUser(dataUpdate).then(()=>{
                            navigation.navigate(route.params.fromPage);
                    })
                }else if(route.params.fromPage == 'TestiSignUp'){
                    buffertesti.setTestimonyBufferVerse(bufferVerse.getBook(),bufferVerse.getChapter()+1,content,num);
                    navigation.navigate(route.params.fromPage,{refreshValue:false});
                }else if(route.params.fromPage == 'ContentWriter'){
                    bufferVerse.setTextVerse(content)
                    bufferVerse.setVerse(num);
                    navigation.navigate('ImageSelector',{fromPage: route.params.fromPage});

                }
            
            }
        }>
            <View style={{flex:1,flexDirection:'row'}}>
                <Text> {num} </Text>
                <Text> {content} </Text>
            </View>
        </TouchableOpacity>
    

  );

    {/*
{Avatar,Content, nbPrayer, Comments, nbSharings, userName, userIdent, imgContent}
*/}
  const [resQuery, setResQuery] = useState([]);
  const [showActivty , setShowActivity] = useState(false);

    return (
        <View style={{flex:1,flexDirection:"row",padding:0,alignItems:"center",padding:10,gap:10}}>
                            
            {/* Content card */}
            <ScrollView style={{flex:1,flexDirection:"column",padding:10,maxHeight:'90%'}}>

                <FlatList                   
                  data={dataVerses}
                  renderItem={({item,index}) => <Verse num={index} content={item.Text} />}
                  keyExtractor={item => item.id}
                  style={{width:"100%",gap:10}} />

            </ScrollView>

        </View>
    );
}
export default VerseSelector;