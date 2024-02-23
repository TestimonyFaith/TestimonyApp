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

import bibFr from '../../../backend/bible/Data/json/fr_apee.json'
import * as bufferVerse from '../../../backend/buffer/bufferVerseSelector'
import { useIsFocused } from "@react-navigation/native";
import * as bookBackEnd from '../../../backend/importBook';
import AsyncStorage from '@react-native-async-storage/async-storage';


const BookSelector = ({navigation,route}) =>{

    const isFocused = useIsFocused();
    const [dataAbb,setDataAbb]=useState([]);

    useEffect(() => {
        getAllAbb();
        console.log('route : '+route.params.fromPage)
        console.log('user id : '+route.params.user);

  }, [isFocused])

  

const getAllAbb = async() =>{
    setShowActivity(true);

    var dataVers = '';

    const vers = await AsyncStorage.getItem('VERS_BI');
    if(vers !=''){
        dataVers=vers;
    }else{
        dataVers= 'Colombe'
    }
    
    await bookBackEnd.getAllBooks('fr',dataVers)
    .then((books)=>{
        setTimeout(() => {
            console.log('book : '+books)
            setDataAbb(books);
            setShowActivity(false);
        }, 500);
    })
}

const Chapter = ({name,nbChapters}) => (

    <TouchableOpacity style={{flex:1,flexDirection:'column',borderBottomColor:'#393939',borderBottomWidth:1,minHeight:50}} onPress={
        ()=>{
            console.log('user id : '+route.params.user);
            var idTestament = 0;
            if(nbChapters == 'ancien'){
                idTestament = 0;
            }else if(nbChapters == 'nouveau'){
                idTestament = 1;
            }
            bufferVerse.setBook(name,idTestament);
            navigation.navigate('ChapSelector',{fromPage: route.params.fromPage,user:route.params.user});
        }
    }>
            <Text style={{padding:10,fontSize:14,fontWeight:'bold'}}> {name} </Text>
            <Text style ={{padding:10,fontSize:12,color:COLORS.darkGrayMsg}}>{nbChapters+' testament'}</Text>
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
                  data={dataAbb}
                  renderItem={({item}) => <Chapter name={item.text} nbChapters={item.testament}/>}
                  keyExtractor={item => item.id}
                  style={{width:"100%",gap:10}} />

            </ScrollView>

        </View>
    );
}
export default BookSelector;