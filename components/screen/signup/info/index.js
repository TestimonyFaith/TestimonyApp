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



const Info = ({ navigation }) =>{


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
    const [Name, setName] = useState('');
    const [Firstname, setFirstname] = useState('');
    const [Pseudo, setPseudo] = useState('');
    const [Email, setEmail] = useState('');
    const [Phone,setPhone] = useState('');
    const [AvatarImg, setAvatarImg] = useState('');
    const [AvatarImg64, setAvatarImg64] = useState('');
    const [error,setError] = useState('');
    const [password,setPassword]=useState('');
    const [confimPassword,setConfirmPassword]=useState('');

    function saveInfo(){
        bufferSign.setInfoPage(Name,Firstname,AvatarImg,Pseudo,Phone,Email,password,confimPassword)
    }


    /*
    const handleSignUp = async() =>{

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
        xhr.open("GET", AvatarImg, true);
        xhr.send(null);
      });
    
      console.log('blob OK : ');
    
      const fileRef = ref(getStorage(), '/profils/'+Email+'/'+uuidv4());
    
      // We're done with the blob, close and release it    
      const metadata = {
        contentType: 'image/jpeg',
        idUser : Email
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
            //setDownloadFileOnGoing(false);
    
            if(password === confimPassword){

              console.log("pass: "+password+" vs "+confimPassword)
      
                createUserWithEmailAndPassword(auth,Email,password)
                .then(async(userCredentials) => {
                    const user = userCredentials.user;
                    console.log(auth.currentUser)
      
                    sendEmailVerification(auth.currentUser)
                    .then(async() => {
                        // Add a new document in collection "cities"
      
                        await UserCreator.CreateUser(Name,Firstname,AvatarImg,Email,Pseudo,Step,)
                        .then(() => {
                          console.log('This value has been written')
                          let toast = Toast.show('Account has been created', {
                            duration: Toast.durations.LONG,
                          });
                    
                          // You can manually hide the Toast, or it will automatically disappear after a `duration` ms timeout.
                          setTimeout(function hideToast() {
                            Toast.hide(toast);
                          }, 500);
                        })
                        .catch((error) => {
                          let toast = Toast.show(error.message, {
                            duration: Toast.durations.LONG,
                          });
                    
                          // You can manually hide the Toast, or it will automatically disappear after a `duration` ms timeout.
                          setTimeout(function hideToast() {
                            Toast.hide(toast);
                          }, 500);
                          setError(error.message);
                        });
                    });
              });
            }
          });
        }
      );


  }*/

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
          source={{ uri: AvatarImg64 }}
        />
        <TouchableOpacity style={styleCom.button} 
               onPress={pickAvatar}>
            <Text style={styleCom.textButton}>Changer ta photo</Text>
        </TouchableOpacity>

        <TextInput
            onBlur={() => setIsFocused1(false)}
            onFocus={() => setIsFocused1(true)}
            onChangeText ={text => setName(text)}
            style={[styleCom.input, isFocused1 && {borderBottomColor:COLORS.green}]} secureTextEntry={false} placeholder="Nom" autoComplete="family-name" inputMode="text" keyboardType="default"
        />

        <TextInput
            onBlur={() => setIsFocused2(false)}
            onFocus={() => setIsFocused2(true)}
            onChangeText ={text => setFirstname(text)}
            style={[styleCom.input, isFocused2 && {borderBottomColor:COLORS.green}]} secureTextEntry={false} placeholder="Prénom" autoComplete="name" inputMode="text" keyboardType="default"
        />

        <TextInput
            onBlur={() => setIsFocused8(false)}
            onFocus={() => setIsFocused8(true)}
            onChangeText ={text => setPseudo(text)}
            style={[styleCom.input, isFocused8 && {borderBottomColor:COLORS.green}]} secureTextEntry={false} placeholder="Pseudo" inputMode="text" keyboardType="default"
        />

        <TextInput
            onBlur={() => setIsFocused3(false)}
            onFocus={() => setIsFocused3(true)}
            onChangeText ={text => setEmail(text)}
            style={[styleCom.input, isFocused3 && {borderBottomColor:COLORS.green}]} secureTextEntry={false} placeholder="joe@humanity.io" autoComplete="email" inputMode="email" keyboardType="email-address"
        />

        <TextInput
            onBlur={() => setIsFocused6(false)}
            onFocus={() => setIsFocused6(true)}
            onChangeText ={text => setPhone(text)}
            style={[styleCom.input, isFocused6 && {borderBottomColor:COLORS.green}]} secureTextEntry={false} autoComplete="tel" inputMode="tel" keyboardType="number-pad" placeholder="Phone number"
        />

        <TextInput
            onBlur={() => setIsFocused4(false)}
            onFocus={() => setIsFocused4(true)}
            onChangeText ={text => setPassword(text)}
            style={[styleCom.input, isFocused4 && {borderBottomColor:COLORS.green}]} secureTextEntry={true} autoComplete="current-password" inputMode="text" keyboardType="default" placeholder="Password"
        />

        <TextInput
            onBlur={() => setIsFocused5(false)}
            onFocus={() => setIsFocused5(true)}
            onChangeText ={text => setConfirmPassword(text)}
            style={[styleCom.input, isFocused5 && {borderBottomColor:COLORS.green}]} secureTextEntry={true} autoComplete="current-password" inputMode="text" keyboardType="default" placeholder="Confirm password"
        />

        <TouchableOpacity style={styleCom.button} 
               onPress={()=>{
                  saveInfo()
                  navigation.navigate('StepSignUp')
               }}>
            <Text style={styleCom.textButton}>Suivant</Text>
        </TouchableOpacity>
        </ScrollView>
    </View>
    )
}
export default Info;