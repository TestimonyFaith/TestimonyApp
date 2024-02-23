import { View,Text,Image,Share } from "react-native";
import { ScrollView,FlatList, TextInput } from "react-native-gesture-handler";
import { TouchableOpacity, ActivityIndicator } from "react-native";
import {COLORS,icons,images,SIZES} from '../../../../constants';
import styleCom from '../../../../styles/common'
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import  styleFont from '../../../../styles/fonts';
import { Avatar } from '@rneui/themed';
import { ListItem,BottomSheet } from '@rneui/themed';
import { Badge } from '@rneui/themed';
import { Tab } from "@rneui/base";

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc,  query, where, getDocs, collection } from "firebase/firestore";
import {auth,db} from "../../../../firebase"
import * as eventBackEnd from '../../../../backend/Event';
import * as userBackEnd from '../../../../backend/Users';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";
import Toast from 'react-native-root-toast';

const CommentCard = ({id,usId,usAvatar,date,content,usName,usFirst,usPseudo, navigation, owner}) =>{

    const [isVisible, setIsVisible] = useState(false);
    const [ownerEvent, setOwnerEvent] = useState(owner);
    
    const list = [
        { title: 'Signaler',
        onPress:(i)=>{
          //Fonction signalement  à faire !
          setIsVisible(false)
        } },
      {
          title: 'Supprimer le commentaire',
          containerStyle: { backgroundColor: 'red' },
          titleStyle: { color: 'white' },
          onPress:()=>{
              createTwoButtonAlert()
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
      
      function createTwoButtonAlert (){
      Alert.alert('Supprimer le commentaire', 'Souhaitez-vous vraiment supprimer le commentaire ? ', [
        {
          text: 'NON',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OUI', onPress: () => {
            //Event Backend faire un fonction suppression commentaire
    
            var dataToRemove = {
            
              userId:usId,
              content:content,
              like:like,
              date:date
            
          }
          eventBackEnd.RemoveEventAnswer(id,dataToRemove);
        }},
      
    ]);
    }
      <View style={{flex:1,flexDirection:"column",minWidth:'90%',padding:10,gap:5}}>
    
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
    
          <View style={{flex:1,flexDirection:"column",minWidth:'90%',backgroundColor:'#e9e9e9',borderRadius:15}}>
    
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
                            <Text style={{color:"#50C878"}}>Follow</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={{color:"#BEBEBE"}}>{'@'+usPseudo}</Text>
                </View>
                <TouchableOpacity style={{justifyContent:'flex-end', marginLeft:"auto",paddingRight:20,justifyContent:'center'}}
                onPress={
                    ()=>{
                        setIsVisible(true)
                    }
                }>
                            <Image style={{width:30,height:30}} source={require('../../../../assets/icons/list.png')} />
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
            </View>
          </View>
    

          <BottomSheet modalProps={{}} isVisible={isVisible}>
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
    
      </View>
}
export default CommentCard;