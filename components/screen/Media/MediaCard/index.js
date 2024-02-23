import { View,Text,Image } from "react-native";
import { ScrollView,FlatList, TextInput } from "react-native-gesture-handler";
import { TouchableOpacity, ActivityIndicator } from "react-native";
import {COLORS,icons,images,SIZES} from '../../../../constants';
import styleCom from '../../../../styles/common'
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import  styleFont from '../../../../styles/fonts';
import { Avatar } from '@rneui/themed';
import { ListItem } from '@rneui/themed';
import { Badge } from '@rneui/themed';
import { Tab } from "@rneui/base";

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc,  query, where, getDocs, collection } from "firebase/firestore";
import {auth,db} from "../../../../firebase"
import * as convBackEnd from '../../../../backend/Conversation'


const MediaCard = ({navigation}) =>{

    {/*
{Avatar,Content, nbPrayer, Comments, nbSharings, userName, userIdent, imgContent}
*/}
  const [resQuery, setResQuery] = useState([]);
  const [showActivty , setShowActivity] = useState(false);

    return (
        <View style={{flex:1,flexDirection:"column",maxWidth:200,padding:5,marginLeft:5,backgroundColor:'#fff',padding:0,alignItems:"center",padding:10,borderRadius:20,marginBottom:10}}>
            
            {/* Header card */}
            <View style={{flex:1,flexDirection:"row"}}>
                <Avatar
                rounded
                source={{ uri: 'https://randomuser.me/api/portraits/men/36.jpg' }}
                />
                <View style={{flex:1,flexDirection:"column"}}>
                    <View style={{flex:1,flexDirection:"row"}}>
                        <Text>Florian</Text>
                        <TouchableOpacity>
                            <Text style={{color:"#50C878"}}>Follow</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={{color:"#BEBEBE"}}>@Florian02100</Text>
                </View>
            </View>

            {/* Content card */}
            <View style={{flex:1,flexDirection:"column",padding:5}}>
                <Image style={{width:"auto",height:200,borderRadius:10}} source={require('../../../../assets/icons/OIP.jpg')} />
                <Text style={{maxHeight:100}}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec malesuada mollis ipsum a aliquet. Integer molestie felis ac justo suscipit gravida. Donec egestas sagittis augue in bibendum. Nulla facilisi. Aliquam arcu lacus, sodales in augue et, egestas suscipit ante. Morbi in risus ex. Fusce sagittis nisi quis congue fermentum. Morbi vestibulum a ligula sed faucibus. Nunc gravida libero urna. Mauris varius, orci vitae congue consectetur, orci tellus euismod ipsum,
                </Text>
                <TouchableOpacity onPress={()=>{
                    navigation.navigate('MediaDetails')
                }}>
                            <Text style={{color:"#50C878"}}>Voir plus</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
export default MediaCard;