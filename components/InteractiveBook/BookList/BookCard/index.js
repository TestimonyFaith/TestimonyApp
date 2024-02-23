import { View, Text, Image, Alert } from "react-native";
import { ScrollView,FlatList, TextInput } from "react-native-gesture-handler";
import { TouchableOpacity, ActivityIndicator } from "react-native";
import {COLORS,icons,images,SIZES} from '../../../../constants'
import styleCom from '../../../../styles/common'
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import  styleFont from '../../../../styles/fonts';
import { Avatar,BottomSheet } from '@rneui/themed';
import { ListItem } from '@rneui/themed';
import { Badge } from '@rneui/themed';
import { Tab } from "@rneui/base";

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc,  query, where, getDocs, collection } from "firebase/firestore";
import {auth,db} from "../../../../firebase"
import * as convBackEnd from '../../../../backend/Conversation'
import * as bookBackEnd from'../../../../backend/BiCollab'
import AsyncStorage from '@react-native-async-storage/async-storage';


const BookCard = ({name,id,image,date,members,author,version,lang,owner,navigation}) =>{

    {/*
{Avatar,Content, nbPrayer, Comments, nbSharings, userName, userIdent, imgContent}
*/}
  const [resQuery, setResQuery] = useState([]);
  const [showActivty , setShowActivity] = useState(false);
  const [ownerEvent, setOwnerEvent] = useState(owner);
  const [isVisible, setIsVisible] = useState(false);

  const list = [
    { title: 'Quitter la collaboration',
      onPress:async(i)=>{
        
        //Ici faire  un arrayUnion inverse /!\

        const value = await AsyncStorage.getItem('USER_EMAIL')
        if(value != undefined){
          bookBackEnd.LeaveBicollab(id,value)
        }
        setIsVisible(false)
      } },
      { title: 'Modifier la collaboration',
      onPress:(i)=>{
        navigation.navigate('BookModify',{idBicollab:id});
        setIsVisible(false)
      } },
    {
        title: 'Supprimer la collaboration',
        containerStyle: { backgroundColor: 'red' },
        titleStyle: { color: 'white' },
        onPress:()=>{
            createTwoButtonAlert(id)
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

    const createTwoButtonAlert = (idBicollab) =>
    Alert.alert('Supprimer la collaboration', 'Souhaitez-vous vraiment supprimer la collaboration ? ', [
      {
        text: 'NON',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OUI', onPress: async() => {
          await bookBackEnd.DeleteBicollab(idBicollab)
          .then(()=>{
            console.log('bicollab supprimée avec succès')
          })
      }},
  ]);

    return (
        <TouchableOpacity onPress={()=>{
            navigation.navigate('InteractiveBook',{idBook:id,nameBook:name,versBook:version})
        }}>
        <View style={{flex:1,flexDirection:"column",backgroundColor:'#fff',padding:0,alignItems:"center",padding:10,borderRadius:20,marginBottom:10}}>
            
            {/* Header card */}
            <View style={{flex:1,flexDirection:"row",gap:10}}>
                <Avatar
                rounded
                source={{ uri: image }}
                />
            <View style={{flex:1,flexDirection:"column"}}>

                <View style={{flex:1,flexDirection:"column",borderBottomColor:COLORS.green,borderBottomWidth:3}}>
                    <View style={{flex:1,flexDirection:"row"}}>
                        <Text>{name}</Text>
                    </View>
                    <Text style={{color:"#BEBEBE"}} >{version}</Text>
                    <Text style={{color:"#BEBEBE"}} >{lang}</Text>
                    <Text style={{color:"#BEBEBE"}} >{date}</Text>
                </View>
                <View style={{flex:1,flexDirection:"row"}}>
                    <FlatList 
                    data={members}
                    renderItem={({item}) =>
                        <Text>{item}</Text>
                    }
                    horizontal={true}
                    keyExtractor={item => item.id}
                    style={{width:"100%"}}
                    />
                </View>
            </View>
                <TouchableOpacity style={{justifyContent:'flex-end', marginLeft:"auto"}} onPress={
                    ()=>{
                        setIsVisible(true);
                    }
                }>
                            <Image style={{width:30,height:30}} source={require('../../../../assets/icons/list.png')} />
                </TouchableOpacity>
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
        </TouchableOpacity>
    );
}
export default BookCard;