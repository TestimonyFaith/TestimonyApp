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

const NoteCard = ({id,usId,usAvatar,usFirst,usName,usPseudo,content,date,color,nbLikes,owner,contId}) =>{

  const [isOwnerVisible,setIsOwnerVisible]=useState(false);
  const [isNoteVisible,setIsNoteVisible]=useState(false);

  const listOwner = [
      { 
        title: 'Signaler',
        onPress:(i)=>{
          //Fonction signalement  à faire !
          setIsOwnerVisible(false)
        } 
      },
      { 
        title: 'Modifier la note',
        onPress:(i)=>{
          //Fonction signalement  à faire !
          setIsOwnerVisible(false)
        } 
      },
      {
        title: 'Supprimer la note',
        containerStyle: { backgroundColor: 'red' },
        titleStyle: { color: 'white' },
        onPress:(i)=>{
            createTwoButtonAlert(annotations[i].id)
            setIsOwnerVisible(false)
        } 
      },
      {
        title: 'Annuler',
        containerStyle: { backgroundColor: "#393939" },
        titleStyle: { color: 'white' },
        onPress:()=>{
            setIsOwnerVisible(false)
          } 
      },
  ];

  const list = [
    { 
      title: 'Signaler',
      onPress:(i)=>{
        //Fonction signalement  à faire !
        setIsNoteVisible(false)
      } 
    },
    {
      title: 'Annuler',
      containerStyle: { backgroundColor: "#393939" },
      titleStyle: { color: 'white' },
      onPress:()=>{
          setIsNoteVisible(false)
        } 
    },
  ];

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

      <View style={{flex:1,flexDirection:"column",minWidth:'90%',minHeight:100,backgroundColor:'#ffffff',padding:10,gap:5,marginBottom:5,borderRadius:10}}>
        <View style={{flex:1,flexDirection:"row",minWidth:'90%'}}>
        <View style={{marginTop:15}}>
            <TouchableOpacity onPress={()=>{
                    navigation.navigate('ViewProfile',{emailUser:usId});
                    
                }}>
                    <Avatar
                    rounded
                    source={{ uri: usAvatar }}
                    
                    />
            </TouchableOpacity>
        </View>

        <View style={{flex:1,flexDirection:"column",minWidth:'90%',borderRadius:15}}>

            {/* Content header */}
            <View style={{flex:1,flexDirection:"row",minWidth:'90%'}}>
                <View style={{flex:1,flexDirection:"column",minWidth:'90%',padding:10}}>
                    <View style={{flex:1,flexDirection:"row",minWidth:'90%'}}>
                        <TouchableOpacity onPress={()=>{
                            navigation.navigate('ViewProfile',{emailUser:usId});
                        }}>
                            <Text>{usFirst + ' ' +usName+' - '}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={{color:COLORS.green}}>Follow</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={{color:"#BEBEBE"}}>{'@'+usPseudo}</Text>
                </View>
                <TouchableOpacity style={{justifyContent:'flex-end', marginLeft:"auto",paddingRight:20,justifyContent:'center'}}
                    onPress={
                        ()=>{
                            /*if(owner)
                                //setIsOwnerVisible(true);
                            else{
                                //setIsNoteVisible(true);
                            }*/
                        }
                    }>
                            <Image style={{width:30,height:30}} source={require('../../../../../assets/icons/list.png')} />
                </TouchableOpacity>
            </View>

                {/* Content com */}
                <View style={{flex:1,flexDirection:"column",minWidth:'90%',padding:10}}>
                        <Text>
                            {content}
                        </Text>
                        <Text style={{fontSize:12,fontStyle:"italic",color:"#BEBEBE"}}>
                            {date}
                        </Text>
                </View>
                <View style={{flex:1,flexDirection:"row",minWidth:'90%',padding:10}}>
                        <TouchableOpacity onPress={()=>{
                                addPrayerNote(id,contId)
                            }}>
                            <Image style={{width:30,height:30}} source={require('../../../../../assets/icons/pray.png')} />
                        </TouchableOpacity>
                        <Text>{nbLikes}</Text>
                </View>
        </View>
      </View>

      { owner&&
          
              <BottomSheet modalProps={{}} isVisible={isOwnerVisible}>
                      {listOwner.map((l, i) => (
                          <ListItem
                          key={i}
                          containerStyle={l.containerStyle}
                          onPress={l.onPress(i)}
                          >
                          <ListItem.Content>
                              <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
                          </ListItem.Content>
                          </ListItem>
                      ))}
              </BottomSheet>
          }

      {!owner&&
          
          <BottomSheet modalProps={{}} isVisible={isNoteVisible}>
                  {list.map((l, i) => (
                      <ListItem
                      key={i}
                      containerStyle={l.containerStyle}
                      onPress={l.onPress(i)}
                      >
                      <ListItem.Content>
                          <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
                      </ListItem.Content>
                      </ListItem>
                  ))}
          </BottomSheet> 
      } 
                  
      </View>
  );

}
export default NoteCard;