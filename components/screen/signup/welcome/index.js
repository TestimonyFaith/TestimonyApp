import { View,Text,Image} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { TouchableOpacity,ActivityIndicator } from "react-native";
import {COLORS,icons,images,SIZES} from '../../../../constants';
import styleCom from '../../../../styles/common'
import { useState,useEffect } from "react";
import  styleFont from '../../../../styles/fonts';
import { createUserWithEmailAndPassword,inMemoryPersistence,setPersistence, signInWithEmailAndPassword } from "firebase/auth";
import {db,auth} from "../../../../firebase"
import * as userLogger from '../../../../backend/Users'
import { doc, setDoc, getDoc,addDoc, collection, query, where, getDocs,updateDoc,Document, deleteDoc  } from "firebase/firestore"; 

import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from "uuid";


const Welcome = ({ navigation }) =>{

    const [isFocused, setIsFocused] = useState(false);
    const [isFocusedPwd, setIsFocusedPwd] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showActivty , setShowActivity] = useState(false);

    const isFocusedSc = useIsFocused();    


    return (
    <View style={{flex:1,flexDirection:"column",backgroundColor:'#fff',justifyContent:"center",padding:10,alignItems:"center",gap:10}}>
        <Image style={styleCom.logo} source={require('../../../../assets/icons/featherGreen.png')} />
        <Image
        style={{ width: 150, height: 50}}
        source={require('../../../../assets/logo/Testimony.png')}
        />

        <Text style={styleFont.hastag}>Bienvenue</Text>

        <Text style={{fontSize:24,fontStyle:'italic',color:'#000',padding:10}}>
            “Heureux les artisans de paix, car ils seront appelés fils de Dieu !”
        </Text>

        <Text style={{fontSize:22,fontWeight:'bold',color:'#000'}}>
            Matthieu 5:9
        </Text>

        <TouchableOpacity onPress={ ()=>{ 
            navigation.navigate('InfoSignUp')
        }} 
        style={styleCom.button}>
        <Text style={styleCom.textButton}>Démarrer mon inscription</Text>
        </TouchableOpacity>
        
        
    </View>
    )
}
export default Welcome;