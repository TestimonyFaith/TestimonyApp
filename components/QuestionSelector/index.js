import { View,Text,Image } from "react-native";
import { ScrollView,FlatList, TextInput } from "react-native-gesture-handler";
import { TouchableOpacity, ActivityIndicator } from "react-native";
import {COLORS,icons,images,SIZES} from '../../constants';
import styleCom from '../../styles/common'
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import  styleFont from '../../styles/fonts';
import { Avatar } from '@rneui/themed';
import { ListItem } from '@rneui/themed';
import { Badge } from '@rneui/themed';
import { Tab } from "@rneui/base";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc,  query, where, getDocs, collection } from "firebase/firestore";
import {auth,db} from "../../firebase"
import * as convBackEnd from '../../backend/Conversation'

import bibFr from '../../backend/bible/Data/json/fr_apee.json'
import * as bufferVerse from '../../backend/buffer/bufferVerseSelector'
import { useIsFocused } from "@react-navigation/native";


const QuestSelector = ({navigation,route}) =>{

DataQuest = [
    {id:0,question:'Question 1 ?'},
    {id:1,question:'Question 2 ?'},
];



const Question = ({id}) => (

    <TouchableOpacity style={{height:45,borderBottomColor:'#393939',borderBottomWidth:1}} onPress={
        ()=>{
        }
    }>
        <Text> {DataQuest[id].question}  </Text>
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
                  data={DataQuest}
                  renderItem={({item}) => <Question id={item.id} />}
                  keyExtractor={item => item.id}
                  style={{width:"100%",gap:10}} />

            </ScrollView>

        </View>
    );
}
export default QuestSelector;