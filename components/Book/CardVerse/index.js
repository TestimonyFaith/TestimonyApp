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


const Card = ({verseText, verseReference}) =>{

    {/*
{Avatar,Content, nbPrayer, Comments, nbSharings, userName, userIdent, imgContent}
*/}
  const [resQuery, setResQuery] = useState([]);
  const [showActivty , setShowActivity] = useState(false);

    return (
        <View style={{flex:1,flexDirection:"row",backgroundColor:'#DEDEDE',padding:0,alignItems:"center",padding:10,borderRadius:20,marginBottom:10}}>
            


            {/* Header card */}
            <Image style={{width:30,height:30,padding:5}} source={require('../../../assets/icons/book.png')} />
                

            {/* Content card */}
            <View style={{flex:1,flexDirection:"column",padding:10}}>
                <Text style={styleFont.verse}>
                    {verseText}
                </Text>
                <Text style={styleFont.verseRef}>
                    {verseReference}
                </Text>

            </View>

            {/* Bottom card */}

        </View>
    );
}
export default Card;