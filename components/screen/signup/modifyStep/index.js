import { View,Text,Image,FlatList } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native";
import {COLORS,icons,images,SIZES} from '../../../../constants';
import styleCom from '../../../../styles/common'
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import  styleFont from '../../../../styles/fonts';
import { StyleSheet } from "react-native";
import { Avatar,ListItem,CheckBox } from '@rneui/themed';

import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc, getDoc,addDoc, collection } from "firebase/firestore"; 
import { db,auth,storage } from "../../../../firebase";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, uploadString,listAll } from "firebase/storage";

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

import Toast from 'react-native-root-toast';
import { useIsFocused } from "@react-navigation/native";
import * as userBackEnd from '../../../../backend/Users'
import AsyncStorage from '@react-native-async-storage/async-storage';


const modifyStep = ({ navigation, route }) =>{

  const [state, setState] = useState(null);

  //hover state
    const [isFocused1, setIsFocused1] = useState(false);
    const [isFocused2, setIsFocused2] = useState(false);
    const [isFocused3, setIsFocused3] = useState(false);
    const [isFocused4, setIsFocused4] = useState(false);
    const [isFocused5, setIsFocused5] = useState(false);
    const [isFocused6, setIsFocused6] = useState(false);
    const [isFocused7, setIsFocused7] = useState(false);
    const [isFocused8, setIsFocused8] = useState(false);
    const [checked, setChecked] = useState([false,false,false,false]);    
    const [userId,setUserId]=useState('');
    const isFocusedSc = useIsFocused();

    useEffect(()=>{
      UserData();
    },[isFocusedSc])

    async function UserData(){
        const value = await AsyncStorage.getItem('USER_EMAIL')
        await userBackEnd.SearchUserByEmail(value)
        .then((arrDataUser)=>{
          
          console.log('data user : '+JSON.stringify(arrDataUser));
          setUserId(arrDataUser[0].id);
          setStep(arrDataUser[0].step);

        })
      }

    async function modifyUserStep(){

        var dataToUpdate = {
            step:step
          }

          await userBackEnd.UpdateUser(dataToUpdate,userId)
          .then(async() => {

            navigation.navigate('UserDetails')

          })
    }

    function setCheckedLine(idLine){
        var arrCheck = []
        for(let r=0;r<DATA.length;r++){
            arrCheck.push(false)
        }
        arrCheck[idLine] = true;
        setChecked(arrCheck);
        setStep(idLine);
    }


    //input state
    const [step, setStep] = useState(0);

    const Item = ({id,question}) => (
        <View style={[{width:"100%",backgroundColor:"#fff"},checked[id]&&{backgroundColor:COLORS.green}]}>
            <TouchableOpacity onPress={()=>{setCheckedLine(id)}}>
                <Text style={{fontSize:20,gap:10,padding:10}}>{question}</Text>
            </TouchableOpacity>
      </View>
      );

    DATA = [
        {id:0,question:"Je m'interroge"},
        {id:1,question:'Je chemine'},
        {id:2,question:'Je suis converti'},
        {id:3,question:'Je suis baptisé'}
    ]

    
    return (
        <View style={{flex:1,backgroundColor:"#fff",justifyContent:"center",padding:10,alignItems:"center",gap:10}}>

        <ScrollView style={{maxHeight:'80%'}}>
            <Text style={styleFont.hastag} >
                Modification
            </Text>

            <Text style={styleFont.subtitle} >
                As-tu avancer avec le seigneur ? 
            </Text>

            {/* Affiche une erreur de remplissage */}
            <Text style={styleFont.subtitle}>
            </Text>

            <FlatList 
                data={DATA}
                renderItem={({item}) => <Item id={item.id} question={item.question}  />}
                keyExtractor={item => item.id}
                style={{width:"100%",padding:10}}
            />

        <TouchableOpacity onPress={ ()=>{ 
            modifyUserStep()
        }} 
        style={styleCom.button}>
            <Text style={styleCom.textButton}>Modifier</Text>
        </TouchableOpacity>

        </ScrollView>
    </View>
    )
}
export default modifyStep;