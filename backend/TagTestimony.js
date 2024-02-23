import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, confirmPasswordReset, sendPasswordResetEmail, updatePassword, updateEmail, deleteUser } from "firebase/auth";
import { doc, setDoc, getDoc,addDoc, collection, query, where, getDocs,updateDoc,Document, deleteDoc  } from "firebase/firestore"; 
import { db,auth,storage } from "../firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState } from "react";
import * as msgBackEnd from '../backend/Messages'
import moment from 'moment';
import {LABELS} from '../constants';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as userBackEnd from '../backend/Users';
import * as testBackEnd from '../backend/Testimony';

const [errorNote,setErrorNote] = useState('');
const arrData = [];

export async function createTagTest(idUser){
        // Add a new document in collection "notes"
        const value = await AsyncStorage.getItem('USER_EMAIL') 
        if(value != ''){
        await addDoc(collection(db, "tagTestimonies"), {
            idUser:idUser,
            userOwner:value,
            date: moment().format("DD/MM/YYYY"),
        })
        .then((id) => {
            setErrorNote('');
            console.log('This value has been written');
    
        })
        .catch((error) => {
            //alert(error.message+' '+Email)
            setErrorNote(error.message);
        });
      }
}



export async function readAllTagTests(){

    arrDataNote = []

    const value = await AsyncStorage.getItem('USER_EMAIL') 
    if(value != ''){

    const q = query(collection(db, "tagTestimonies"),where('userOwner','==',value));
  
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async(doc) => {

    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
  
    const json = doc.data();

    await userBackEnd.SearchAvatarByEmail(json.idUser)
    .then(async(arrUserData)=>{

      await testBackEnd.SearchTestimonyByEmail(json.idUser)
      .then((arrTests)=>{

        console.log('arrTestis : '+JSON.stringify(arrTests[0].phase.avant));

        arrDataNote.push({
    
          idUser:json.idUser,
          userOwner:json.userOwner,
          date: json.date,
          shortBefore: arrTests[0].phase.avant,
          shortDuring: arrTests[0].phase.pendant,
          shortAfter: arrTests[0].phase.apres,
          usName:arrUserData[0].nom,
          usFirst:arrUserData[0].prenom,
          usAvatar:arrUserData[0].avatar,
          usPseudo:arrUserData[0].pseudo

        })
      })
      })
    });
    }
  
    return arrDataNote;
}


export async function deleteTagTest(idTag){
  const docRef = doc(db, "tagTestimonies", idTag);
  deleteDoc(docRef)
  .then(async () =>{
      setErrorNote('');
  })
  .catch((error) => {
    console.log(error);
    setErrorNote(error.message);
  })
}

export async function SignalTagTest(idNote){

  Alert.alert('Signaler cette note', 'Souhaitez-vous vraiment signaler cette note ? ', [
    {
      text: 'NON',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel',
    },
    {text: 'OUI', onPress: async() => {
      
        //Envoyer un mail au modérateur ou trig dans un BDD de signalement 

    }},
  
]);

}

