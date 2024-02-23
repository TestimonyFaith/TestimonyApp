import { View,Text,Image} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { TouchableOpacity,ActivityIndicator } from "react-native";
import {COLORS,icons,images,SIZES} from '../../../constants';
import styleCom from '../../../styles/common'
import { useState,useEffect } from "react";
import  styleFont from '../../../styles/fonts';
import { createUserWithEmailAndPassword,inMemoryPersistence,setPersistence, signInWithEmailAndPassword } from "firebase/auth";
import {db,auth} from "../../../firebase"
import * as userLogger from '../../../backend/Users'
import { doc, setDoc, getDoc,addDoc, collection, query, where, getDocs,updateDoc,Document, deleteDoc  } from "firebase/firestore"; 

import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from "uuid";


const Login = ({ navigation }) =>{

    const [isFocused, setIsFocused] = useState(false);
    const [isFocusedPwd, setIsFocusedPwd] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showActivty , setShowActivity] = useState(false);

    const isFocusedSc = useIsFocused();


    useEffect(()=>{
        
    },[isFocusedSc])


    
    const handleSignIn = () =>{

        
        setShowActivity(true);
        setPersistence(auth,inMemoryPersistence)
        .then(() => {
            signInWithEmailAndPassword(auth,email,password)
            .then(async(userCredentials) => {
    
                //Retrieve user credentials 
                const user = userCredentials.user;
                console.log(user.email)
                
                //Send the query 
                const q = query(collection(db, "users"),where("email", "==", user.email));
                const arrData = [];
    
                //Query snapshot launch 
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((datas) => {
    
                    //Store data
                    const json = datas.data();
                    console.log(json.nom);
    
                    //Set all user datas
                    userLogger.setStateUserAvatar(json.avatar);
                    userLogger.setStateName(json.nom);
                    userLogger.setStateEmail(user.email);
                    //userLogger.setStateId(datas.id)
    
                    userLogger.setStateFirst(json.prenom)
                    //userLogger.setStatePseudo(json.Pseudo)
                    
                    
    
                });
    
                //Set user email 
                //userLogger.setStateEmail(user.email);
    
                setShowActivity(false);

                try {
                    await AsyncStorage.setItem('USER_EMAIL',user.email);
                  } catch (error) {
                    // Error saving data
                  }
    
                //Navigate to home 
                navigation.navigate('Home')
    
            })
            .catch(async(error) => { 

                alert(error.message+' '+email)
                setError(error.message)
                
                try {
                    await AsyncStorage.setItem('USER_EMAIL','');
                } catch (error) {
                    // Error saving data
                }

             }) 
        })

    }
    const gotoSignup = () =>{

        navigation.navigate('WelcomeSignUp')

    }

    return (
    <View style={{flex:1,backgroundColor:'#fff',justifyContent:"center",padding:10,alignItems:"center",gap:10}}>
      <Image style={[styleCom.logoHead,{tintColor:COLORS.green}]} source={icons.logo} />
      <Text
        style={{ width: 150, height: 75,marginTop:0,marginLeft:3,color:COLORS.green,fontFamily:'Gabriela',fontSize:24}}
      >Testimony</Text>
      
        {showActivty && <ActivityIndicator size="large" color={COLORS.green} />}

        <TextInput
            onBlur={() => setIsFocused(false)}
            onFocus={() => setIsFocused(true)}
            onChangeText ={text => setEmail(text)}
            style={[styleCom.input, isFocused && {borderBottomColor:COLORS.green}]} secureTextEntry={false} placeholder="joe@humanity.io" autoComplete="email" inputMode="email" keyboardType="email-address"
        />
        <TextInput
            onBlur={() => setIsFocusedPwd(false)}
            onFocus={() => setIsFocusedPwd(true)}
            onChangeText={text => setPassword(text)}
            style={[styleCom.input, isFocusedPwd && {borderBottomColor:COLORS.green}]} secureTextEntry={true} placeholder="" autoComplete="current-password" inputMode="text" keyboardType="default"
        />

        {/* Affiche une erreur de connexion */}
        <Text style={styleFont.subtitle}>
            {error}
        </Text>
        
        <TouchableOpacity style={[styleCom.button,{backgroundColor:COLORS.green}]} 
               onPress={handleSignIn}>
            <Text style={styleCom.textButton}>Connexion</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styleCom.button,{backgroundColor:COLORS.green}]} onPress={gotoSignup} >
            <Text style={styleCom.textButton}>Inscription</Text>
        </TouchableOpacity>
        <TouchableOpacity  style={styleFont.link}>
            <Text>
                Mot de passe oublié
            </Text>
        </TouchableOpacity>
    </View>
    )
}
export default Login;