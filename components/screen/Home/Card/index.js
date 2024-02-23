import { View,Text,Image,Share, Alert } from "react-native";
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

const Card = ({id,idUser,image,date,content,usAvatar,usName,usFirst,usPseudo, nbLikes, theme,nbComs, navigation, owner,onDelete}) =>{

    {/*
{Avatar,Content, nbPrayer, Comments, nbSharings, userName, userIdent, imgContent}
*/}
const [resQuery, setResQuery] = useState([]);
const [showActivty , setShowActivity] = useState(false);
const [isVisible, setIsVisible] = useState(false);
const [nbLike, setNbLike] = useState(nbLikes);
const [nbCom, setNbCom] = useState(nbComs);
const [ownerEvent, setOwnerEvent] = useState(owner);

DATA = [
    'Guérison',
    'Délivrance',
    'Paix',
    'Amour',
    'Justice',
    'Maîtrise de soi'
  ]
  
  async function addPrayer(){
    const value = await AsyncStorage.getItem('USER_EMAIL')
    if(value !== null){
        var dataToUpdate = {
            likes : [
                {idUser:value}
            ]
        }
        eventBackEnd.AddEventReaction(id,dataToUpdate).
        then(async()=>{
            await eventBackEnd.ReadLikeEvent(id)
            .then((arrEventLike)=>{
                console.log('nb like : '+ JSON.stringify(arrEventLike));
                setNbLike(arrEventLike.length)
            })
        })
    }
  }

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: content +' \n'+ image + ' \n'+ usFirst +' '+ usName +' \n -- Shared from Testimony app --' 
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
            let toast = Toast.show('Evenement partagé', {
                duration: Toast.durations.LONG,
              });
        
              // You can manually hide the Toast, or it will automatically disappear after a `duration` ms timeout.
              setTimeout(function hideToast() {
                Toast.hide(toast);
              }, 2000);
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };



  const list = [
    { title: 'Publication non-conforme à la parole',
        onPress:()=>{
            setIsVisible(false)
        } 
    },
    {
    title: 'Signaler cette publication',
        onPress:()=>{
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

  const listOwner = [
        { title: 'Publication non-conforme à la parole',
            onPress:()=>{
                setIsVisible(false)
            } 
        },
        {
            title: 'Signaler cette publication',
                onPress:()=>{
                    setIsVisible(false)
                } 
        },
        {
            title: 'Supprimer cette publication',
            onPress:async()=>{
                createTwoButtonAlert();
                setIsVisible(false);

            } 
        },{
            title: 'Modifier cette publication',
            onPress:()=>{
                //Ouvrir l'écran de modification
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
            Alert.alert('Supprimer l\'événement ?', 'Souhaitez-vous vraiment supprimer l\'événement ? ', [
              {
                text: 'NON',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {text: 'OUI', onPress: async() => {
                  //Event Backend faire un fonction suppression commentaire
                  await eventBackEnd.DeleteEvent(id)
                  .then(()=>{
                        onDelete();
                  })
              }},
            
          ]);
        }


    async function addFollow(){
        var userFollowed = '';
        var userFollowers = '';

        const value = await AsyncStorage.getItem('USER_EMAIL')
        if(value !== null){
           userFollowers = userBackEnd.getUserIdByEmail(value);
           userFollowed = userBackEnd.getUserIdByEmail(idUser);

           await userBackEnd.SearchUserByEmail(idUser)
           .then(async(arrUserFollowedData)=>{
                await userBackEnd.SearchUserByEmail(value)
                .then(async(userFollowersData)=>{
                    dataFollowers = {
                        followedBy:[
                            arrUserFollowedData[0].followedBy,
                            userFollowers
                        ]
                    }
                    await userBackEnd.addFollowedBy(userFollowed,dataFollowers)
                    .then(async()=>{
                        dataFollowed = {
                            userfollowed:[
                                userFollowersData[0].userfollowed,
                                userFollowed
                            ]
                        }
                        await userBackEnd.addFollowers(userFollowers,dataFollowed)
                        .then(()=>{
                            let toast = Toast.show('Utilisateur suivi', {
                                duration: Toast.durations.LONG,
                              });
                        
                              // You can manually hide the Toast, or it will automatically disappear after a `duration` ms timeout.
                              setTimeout(function hideToast() {
                                Toast.hide(toast);
                              }, 2000);
                        })
                    })
                })

           })


        }


    }


    return (
        <View style={{flex:1,flexDirection:"column",backgroundColor:'#fff',padding:0,alignItems:"center",padding:10,borderRadius:20,marginBottom:10}}>
            
            {/* Header card */}
            <View style={{flex:1,flexDirection:"row"}}>
                <TouchableOpacity onPress={()=>{
                    navigation.navigate('UserView',{emailUser:idUser});
                }}>
                    <Avatar
                    rounded
                    source={{ uri: usAvatar }}
                    />
                </TouchableOpacity>
                <View style={{flex:1,flexDirection:"column"}}>
                    <View style={{flex:1,flexDirection:"row"}}>
                        <TouchableOpacity onPress={()=>{
                            navigation.navigate('UserView',{emailUser:idUser});
                        }}>
                            <Text>{usFirst + ' ' +usName+' - '}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{
                            addFollow();
                        }}>
                            <Text style={{color:COLORS.green}}>Follow</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={{color:"#BEBEBE"}}>{'@'+usPseudo}</Text>
                </View>
                <TouchableOpacity style={{justifyContent:'flex-end', marginLeft:"auto"}}
                onPress={
                    ()=>{
                        setIsVisible(true)
                    }
                }>
                            <Image style={{width:30,height:30}} source={require('../../../../assets/icons/list.png')} />
                </TouchableOpacity>
            </View>

            {/* Content card */}
            <View style={{flex:1,flexDirection:"column",padding:5,minWidth:'90%'}}>
                <Image style={{minWidth:'100%',height:300,objectFit:'fill',borderRadius:10}} source={{uri:image[0]}} />
                {theme !="" &&<Text style={{padding:10,backgroundColor:COLORS.green,borderRadius:20,maxWidth:100}}>
                    {DATA[theme]}
                </Text>}
                <Text>
                    {content}
                </Text>
                <Text>
                    {date}
                </Text>
                <TouchableOpacity>
                            <Text style={{color:COLORS.green}}>Voir plus</Text>
                </TouchableOpacity>
            </View>

            {/* Bottom card */}

            <View style={{flex:1,flexDirection:"row",gap:10}}>
                <TouchableOpacity onPress={()=>{
                    addPrayer()
                }}>
                    <Image style={{width:30,height:30}} source={require('../../../../assets/icons/pray.png')} />
                </TouchableOpacity>
                <Text>{nbLike}</Text>
                <TouchableOpacity onPress={()=>{
                    navigation.navigate('CommentView',{idEvent:id});
                }}>
                    <Image style={{width:30,height:30}} source={require('../../../../assets/icons/Comment.png')} />
                </TouchableOpacity>
                <Text>{nbCom}</Text>
                <TouchableOpacity         onPress={async () => {
                    onShare();
                }}>
                    <Image style={{width:30,height:30}} source={require('../../../../assets/icons/share.png')} />
                </TouchableOpacity>
                {/*<Text>0</Text>*/}
            </View>
            {!ownerEvent&&<BottomSheet modalProps={{}} isVisible={isVisible}>
                {list.map((l, i) => (
                    <ListItem
                    key={i}
                    containerStyle={l.containerStyle}
                    onPress={l.onPress}
                    >
                    <ListItem.Content>
                        <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
                    </ListItem.Content>
                    </ListItem>
                ))}
            </BottomSheet>}
            {ownerEvent&&<BottomSheet modalProps={{}} isVisible={isVisible}>
                {listOwner.map((l, i) => (
                    <ListItem
                    key={i}
                    containerStyle={l.containerStyle}
                    onPress={l.onPress}
                    >
                    <ListItem.Content>
                        <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
                    </ListItem.Content>
                    </ListItem>
                ))}
            </BottomSheet>}
        </View>
    );
}
export default Card;