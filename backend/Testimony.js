import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, confirmPasswordReset, sendPasswordResetEmail, updatePassword, updateEmail, deleteUser } from "firebase/auth";
import { doc, setDoc, getDoc,addDoc, collection, query, where, getDocs,updateDoc,Document, deleteDoc, orderBy  } from "firebase/firestore"; 
import { db,auth,storage } from "../firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState } from "react";
import moment from 'moment';
import * as userBackEnd from'../backend/Users';
import * as FileSystem from 'expo-file-system';
import {Alert} from 'react-native'

const [errorTestimony,setErrorTestimony] = useState('');
const [idCurTestimony, setIdCurTestimony] = useState('');
var arrData = [];
var ownerMsg = false;
var response = false;
var idM = '';

//JSON Testimony
/*
{
id:’’
idUser : ‘’
date:’’
phase :{
   avant : {date:’’,content:’’}
   pendant :{date:’’,content:’’},
   après:{date:’’,content:’’}
}
verses:[
{text:‘’,ref:’’},
{text:‘’,ref:’’},
{text:‘’,ref:’’},
]
*/


export function getCurId(){
  return idM;
}

//This function allow to create user 
export async function CreateTestimony(before,during,after,datBefore,datDuring,datAfter,message,currentUserLogged){

    // Add a new document in collection "cities"
    await addDoc(collection(db, "testimony"), {

        idUser : currentUserLogged,
        date:moment().format("DD/MM/YYYY"),
        phase :{
           avant : {date:datBefore,content:before},
           pendant :{date:datDuring,content:during},
           apres:{date:datAfter,content:after}
        },
        message:message
      
    })
    .then((docRef) => {
        setErrorTestimony('');
        idM = docRef.id;
        console.log('This value has been written '+idM)
        //setIdCurMsg(idM)
        console.log('ID has been written ')

    })
    .catch((error) => {
        alert(error.message);
        setErrorTestimony(error.message);
    });
        

}

//This function allow to find  a secific user or a specific category of users
export async function SearchTestimonyByEmail(criteria){

  arrData=[];

  console.log('search message for conv : '+criteria)

  const q = query(collection(db, "testimony"),where("idUser", "==", criteria));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(async (doc) => {
    // doc.data() is never undefined for query doc snapshots

      const json = doc.data();

      console.log(json.Response, " => Response ");

        arrData.push({

          id:doc.id,
          idUser : json.idUser,
          date:json.date,
          phase :json.phase,
          message:json.message
  
        })
    
  });
   return arrData;
}

//This function allow to update user's informations
export async function UpdateTestimony (msgId,dataUpdated){

      const docRef = doc(db, "testimony", msgId);

      {/* const data = {
        code: "613"
      }; */}

      await updateDoc(docRef,dataUpdated)
      .then(docRef => {
          setErrorTestimony('');
          console.log("A New Document Field has been added to an existing document");
      })
      .catch(error => {
          console.log(error.message);
          setErrorTestimony(error.message);

      })

}


//This function allow to delete a specific user 
export async function DeleteTestimony(msgId){
    const docRef = doc(db, "testimony", msgId);
    deleteDoc(docRef)
    .then(async () =>{
        setErrorMsg('');
    })
    .catch((error) => {
      console.log(error);
      setErrorMsg(error.message);
    })
}

export function getErrorTestimony (){
  return errorTestimony;
}

export async function SignalTestimony(idUser){

  Alert.alert('Signaler ce témoignage', 'Souhaitez-vous vraiment signaler ce témoignage ? ', [
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