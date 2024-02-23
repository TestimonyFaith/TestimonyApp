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
import * as UserCreator from '../../../../backend/Users'
import * as bufferSign from '../../../../backend/buffer/bufferSignup'
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useIsFocused } from "@react-navigation/native";
import * as userBackEnd from '../../../../backend/Users'


const Modify = ({ navigation,route }) =>{


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

    //input state
    const [userId,setUserId]=useState('');
    const [name, setName] = useState('');
    const [firstname, setFirstname] = useState('');
    const [pseudo, setPseudo] = useState('');
    const [email, setEmail] = useState('');
    const [phone,setPhone] = useState('');
    const [avatarImg, setAvatarImg] = useState('');
    const [avatarImg64, setAvatarImg64] = useState('');
    const [error,setError] = useState('');
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
        setFirstname(arrDataUser[0].prenom);
        setName(arrDataUser[0].nom);
        setEmail(arrDataUser[0].email);
        setPseudo(arrDataUser[0].pseudo);
        setAvatarImg(arrDataUser[0].avatar);
        setPhone(arrDataUser[0].phone);


      })
    }

    async function modifyInfo(){
        //bufferSign.setInfoPage(Name,Firstname,AvatarImg,Pseudo,Phone,Email,password,confimPassword)
    
          const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
              resolve(xhr.response);
            };
            xhr.onerror = function (e) {
              console.log(e);
              reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", img, true);
            xhr.send(null);
          });
        
          console.log('blob OK : ');
        
          const fileRef = ref(getStorage(), '/profils/'+email+'/'+uuid.v4());
        
          // We're done with the blob, close and release it    
          const metadata = {
            contentType: 'image/jpeg',
            idUser : email
          };      
        
          const uploadTask = uploadBytesResumable(fileRef,blob,metadata);
        
          uploadTask.on("state_changed",
            (snapshot) => {
              const progressMath =
                Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                //setProgress(progressMath)
                //setDownloadFileOnGoing(true);
              
            },
            (error) => {
              alert(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref)
              .then(async(downloadURL) => {
                blob.close();
                console.log('url file : '+downloadURL);

                //UpdateUser

                var dataToUpdate = {
                  nom:name,
                  prenom:firstname,
                  pseudo:pseudo,
                  phone:phone
                }

                await UserCreator.UpdateUser(dataToUpdate,userId)
                .then(async() => {
  
                  navigation.navigate('UserDetails')
  
                })
                
              });
            }
          );
    
      }

     const pickAvatar = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  

      console.log(result);
  
      if (!result.canceled) {
        const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, { encoding: 'base64' });

        console.log('BASE64 : '+base64)
  
        var base64Icon = 'data:image/png;base64,'+base64;
        setAvatarImg64(base64Icon);

        setAvatarImg(result.assets[0].uri);
        Toast.show('Votre image a été chargée', Toast.SHORT);
      }
    };

    
    return (
        <View style={{flex:1,backgroundColor:"#fff",justifyContent:"center",padding:10,alignItems:"center",gap:10}}>

<ScrollView style={{maxHeight:'80%'}}>
        <Text style={styleFont.hastag} >
            Inscription
        </Text>

        <Text style={styleFont.subtitle} >
            Apprenons à se conaître !
        </Text>

        {/* Affiche une erreur de remplissage */}
        <Text style={styleFont.subtitle}>
            {error}
        </Text>

        <Avatar
          rounded
          source={{ uri: avatarImg }}
        />
        <TouchableOpacity style={styleCom.button} 
               onPress={pickAvatar}>
            <Text style={styleCom.textButton}>Changer ta photo</Text>
        </TouchableOpacity>

        <TextInput
            onBlur={() => setIsFocused1(false)}
            onFocus={() => setIsFocused1(true)}
            onChangeText ={text => setName(text)}
            value={name}
            style={[styleCom.input, isFocused1 && {borderBottomColor:COLORS.green}]} secureTextEntry={false} placeholder="Nom" autoComplete="family-name" inputMode="text" keyboardType="default"
        />

        <TextInput
            onBlur={() => setIsFocused2(false)}
            onFocus={() => setIsFocused2(true)}
            onChangeText ={text => setFirstname(text)}
            value={firstname}
            style={[styleCom.input, isFocused2 && {borderBottomColor:COLORS.green}]} secureTextEntry={false} placeholder="Prénom" autoComplete="name" inputMode="text" keyboardType="default"
        />

        <TextInput
            onBlur={() => setIsFocused8(false)}
            onFocus={() => setIsFocused8(true)}
            onChangeText ={text => setPseudo(text)}
            value={pseudo}
            style={[styleCom.input, isFocused8 && {borderBottomColor:COLORS.green}]} secureTextEntry={false} placeholder="Pseudo" inputMode="text" keyboardType="default"
        />

        <TextInput
            onBlur={() => setIsFocused6(false)}
            onFocus={() => setIsFocused6(true)}
            onChangeText ={text => setPhone(text)}
            value={phone}
            style={[styleCom.input, isFocused6 && {borderBottomColor:COLORS.green}]} secureTextEntry={false} autoComplete="tel" inputMode="tel" keyboardType="number-pad" placeholder="Phone number"
        />

        <TouchableOpacity style={styleCom.button} 
               onPress={()=>{
                  modifyInfo()
               }}>
            <Text style={styleCom.textButton}>Modifier</Text>
        </TouchableOpacity>
        </ScrollView>
    </View>
    )
}
export default Modify;