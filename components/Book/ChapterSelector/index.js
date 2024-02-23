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

import * as bufferVerse from '../../../backend/buffer/bufferVerseSelector'
import * as bookBackEnd from '../../../backend/importBook';
import AsyncStorage from '@react-native-async-storage/async-storage';


const ChapSelector = ({navigation,route}) =>{

    const [dataChap,setDataChap]=useState([]);
    useEffect(() => {
        getAllAbb();
  }, [])



const getAllAbb = async() =>{

    var dataVers = '';

    const vers = await AsyncStorage.getItem('VERS_BI');
    if(vers !=''){
        dataVers=vers;
    }else{
        dataVers= 'Colombe'
    }

    var book = bufferVerse.getBook();
    var test = bufferVerse.getNumtest();
    await bookBackEnd.getAllChapters('fr',dataVers,book,test)
    .then((arrChap)=>{
        setDataChap(arrChap)
    })

}

const Chapter = ({num}) => (

    <TouchableOpacity style={{height:45}} onPress={
        ()=>{
            bufferVerse.setChapter(num)
            navigation.navigate('VerseSelector',{fromPage: route.params.fromPage,user:route.params.user});

        }
    }>
        <Text style={{padding:10,fontSize:14,fontWeight:'bold'}}> {'Chapitre ' + parseInt(parseInt(num)+1)} </Text>
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
                  data={dataChap}
                  renderItem={({item}) => <Chapter num={item.num} />}
                  keyExtractor={item => item.id}
                  style={{width:"100%",gap:10}} />

            </ScrollView>

        </View>
    );
}
export default ChapSelector;