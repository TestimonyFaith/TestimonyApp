import { View,Text,Image} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { TouchableOpacity,ActivityIndicator } from "react-native";
import {COLORS,icons,images,SIZES} from '../../../../constants';
import styleCom from '../../../../styles/common'
import { useState,useEffect } from "react";
import  styleFont from '../../../../styles/fonts';
import * as userLogger from '../../../../backend/Users'
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc, getDoc,addDoc, collection } from "firebase/firestore"; 
import { db,auth,storage } from "../../../../firebase";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, uploadString,listAll } from "firebase/storage";


import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import Toast from 'react-native-root-toast';
import * as UserCreator from '../../../../backend/Users'
import * as Testimony from '../../../../backend/Testimony'
import * as bufferSign from '../../../../backend/buffer/bufferSignup'
import * as uuid from "uuid";


const Welcome = ({ navigation }) =>{

    const [isFocused, setIsFocused] = useState(false);
    const [isFocusedPwd, setIsFocusedPwd] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showActivty , setShowActivity] = useState(false);

    const isFocusedSc = useIsFocused();    

    async function handleSignUp(){

        setShowActivity(true);

        var img = bufferSign.getAvatar();
        var emailAvatar = bufferSign.getEmail();
        var passwordUs = bufferSign.getPassword();
        var confirmPasswordUs = bufferSign.getConfirmPassword();
  
        console.log('user info : ' +img+' '+emailAvatar+' '+passwordUs+' '+confirmPasswordUs);
  
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
        
          const fileRef = ref(getStorage(), '/profils/'+emailAvatar+'/'+uuid.v4());
        
          // We're done with the blob, close and release it    
          const metadata = {
            contentType: 'image/jpeg',
            idUser : emailAvatar
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
        
                if(passwordUs === confirmPasswordUs){
    
          
                    createUserWithEmailAndPassword(auth,emailAvatar,passwordUs)
                    .then(async(userCredentials) => {
                        const user = userCredentials.user;
                        console.log(auth.currentUser)
          
                        sendEmailVerification(auth.currentUser)
                        .then(async() => {
                            // Add a new document in collection "cities"
  
                            var arrUser = bufferSign.getAllInfo();
                            console.log('allInfo : '+arrUser.idStepProfil);
          
                            await UserCreator.CreateUser(
                                  arrUser.nameProfil,
                                  arrUser.firstnameProfil,
                                  downloadURL,
                                  arrUser.emailProfil,
                                  arrUser.pseudoProfil,
                                  arrUser.idStepProfil,
                                  arrUser.phoneProfil,
                                  [],
                                  false
                            )
                        
                             .then(async() => {
  
                                setShowActivity(false);
                                AsyncStorage.setItem('USER_EMAIL',arrUser.emailProfil);
                                navigation.navigate('Home')
  
                            })
                            
                            .catch((error) => {
                              let toast = Toast.show(error.message, {
                                duration: Toast.durations.LONG,
                              });
                        
                              // You can manually hide the Toast, or it will automatically disappear after a `duration` ms timeout.
                              setTimeout(function hideToast() {
                                Toast.hide(toast);
                              }, 500);
                              console.log('error : '+error.message);
                            });
                        });
                  });
                }
              });
            }
          );
    
      }
  


    return (
    <View style={{flex:1,flexDirection:"column",backgroundColor:'#fff',justifyContent:"center",padding:10,alignItems:"center",gap:10}}>
        <Image style={styleCom.logo} source={require('../../../../assets/icons/featherGreen.png')} />
        <Image
        style={{ width: 150, height: 50}}
        source={require('../../../../assets/logo/Testimony.png')}
        />

        <Text style={styleFont.hastag}>Bravo</Text>
        <Text style={styleFont.subtitle} >
                Tu n'as plus qu'à cliquer sur "terminé" pour valider ton inscription !
        </Text>


        <Text style={{fontSize:24,fontStyle:'italic',color:'#000',padding:10}}>
            "Je vous donne un commandement nouveau: Aimez-vous les uns les autres; comme je vous ai aimés, vous aussi, aimez-vous les uns les autres"
        </Text>

        <Text style={{fontSize:22,fontWeight:'bold',color:'#000'}}>
            Jean 13:34
        </Text>

        <TouchableOpacity onPress={ ()=>{ 
            handleSignUp();
        }} 
        style={styleCom.button}>
        <Text style={styleCom.textButton}>Terminé</Text>
        </TouchableOpacity>
        
        {showActivty&&<ActivityIndicator size="large" color={COLORS.green} />}


        
    </View>
    )
}
export default Welcome;