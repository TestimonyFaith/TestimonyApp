import { View, Text, Image, Alert } from "react-native";
import { ScrollView,FlatList, TextInput } from "react-native-gesture-handler";
import { TouchableOpacity, ActivityIndicator } from "react-native";
import {COLORS,icons,images,SIZES} from '../../../../../constants'
import styleCom from '../../../../../styles/common'
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import  styleFont from '../../../../../styles/fonts';
import { Avatar,BottomSheet } from '@rneui/themed';
import { ListItem } from '@rneui/themed';
import { Badge } from '@rneui/themed';
import { Tab } from "@rneui/base";

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc,  query, where, getDocs, collection } from "firebase/firestore";
import {auth,db} from "../../../../../firebase"
import * as convBackEnd from '../../../../../backend/Conversation'
import AsyncStorage from '@react-native-async-storage/async-storage';
import bibFr from '../../../../../backend/bible/Data/json/fr_apee.json';


const VerseCard = ({id,refBook,refChap,refVerse}) =>{

  const [isOwnerVisible,setIsOwnerVisible]=useState(false);
  const [isNoteVisible,setIsNoteVisible]=useState(false);



  const listOwner = [
      { 
        title: 'Signaler',
        onPress:(i)=>{
          //Fonction signalement  à faire !
          setIsVisible(false)
        } 
      },
      { 
        title: 'Modifier la note',
        onPress:(i)=>{
          //Fonction signalement  à faire !
          setIsVisible(false)
        } 
      },
      {
        title: 'Supprimer la note',
        containerStyle: { backgroundColor: 'red' },
        titleStyle: { color: 'white' },
        onPress:(i)=>{
            createTwoButtonAlert(annotations[i].id)
            setIsVisible(false)
        } 
      },
      {
        title: 'Annuler',
        containerStyle: { backgroundColor: "#393939" },
        titleStyle: { color: 'white' },
        onPress:()=>{
            setIsVisible(false)
          } 
      },
  ];

  const list = [
    { 
      title: 'Signaler',
      onPress:(i)=>{
        //Fonction signalement  à faire !
        setIsVisible(false)
      } 
    },
    {
      title: 'Annuler',
      containerStyle: { backgroundColor: "#393939" },
      titleStyle: { color: 'white' },
      onPress:()=>{
          setIsVisible(false)
        } 
    },
  ];

  function getVerse(book,num,numVerse){
    var allVerseForChap = [];
    bibFr.forEach(chap => {
      if(chap.abbrev === book){
        allVerseForChap = chap.chapters[num];
      }
    })
    return allVerseForChap[numVerse];
  }

  const createTwoButtonAlert = (idNote) =>
    Alert.alert('Supprimer la note', 'Souhaitez-vous vraiment supprimer la note ? ', [
      {
        text: 'NON',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OUI', onPress: () => {
        //Event Backend faire un fonction suppression commentaire
        noteBackEnd.deleteNote(idNote)
      }},
  ]);

  return (

      <View style={{flex:1,flexDirection:"column",minWidth:'90%',backgroundColor:'#ffffff',padding:10,gap:5,marginBottom:5,borderRadius:10}}>
          <Text style={styleFont.message}>
              {
                  getVerse(refBook,refChap,refVerse)
              }
          </Text>
      </View>
  );

}
export default VerseCard;