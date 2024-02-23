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
        async function UserStore(){
            setShowActivity(true);
            const value = await AsyncStorage.getItem('USER_EMAIL')
            if(value !== null){
                //Retrieve user credentials 
                //alert(value);
                
                //Send the query 
                const q = query(collection(db, "users"),where("email", "==", value));
                const arrData = [];

                //Query snapshot launch 
                try{
                    const querySnapshot = await getDocs(q);
                    querySnapshot.forEach(async(datas) => {

                        console.log('JSON : '+JSON.stringify(json));

                        //Store data
                        const json = datas.data();
                        console.log(json.nom);

                        //Set all user datas
                        userLogger.setStateUserAvatar(json.avatar);
                        userLogger.setStateName(json.nom);
                        userLogger.setStateEmail(value);
                        //userLogger.setStateId(datas.id)

                        userLogger.setStateFirst(json.prenom)
                        //userLogger.setStatePseudo(json.Pseudo)

                    });

                    await AsyncStorage.setItem('USER_EMAIL',value)
                    .then(()=>{
                        setShowActivity(false);
    
                        //Navigate to home 
                        navigation.navigate('Home');  
                    })
                }catch(error){
                    console.log('error loader : '+JSON.stringify(error))
                    if(error.code == 'permission-denied'){
                        navigation.navigate('Login');
                    }
                }

                //Set user email 
                //userLogger.setStateEmail(user.email);

            }else{
                navigation.navigate('Login');
            }
        }
        UserStore();
    },[isFocusedSc])


    
    return (
    <View style={{flex:1,flexDirection:"column",backgroundColor:'#fff',justifyContent:"center",padding:10,alignItems:"center",gap:10}}>
        <Image style={[styleCom.logo,{tintColor:COLORS.green}]} source={icons.logo} />
        <Text
            style={{ width: 150, height: 75,marginTop:0,marginLeft:3,color:COLORS.green,fontFamily:'Gabriela',fontSize:28}}
        >
            Testimony
        </Text>

        <Text style={{fontSize:24,fontStyle:'italic',color:'#000',padding:10}}>
            “Vous êtes la lumière du monde. Une ville située sur une montagne ne peut être cachée;”
        </Text>

        <Text style={{fontSize:22,fontWeight:'bold',color:'#000'}}>
            Matthieu 5:14
        </Text>


        <ActivityIndicator size="large" color={COLORS.green} />


        
    </View>
    )
}
export default Login;