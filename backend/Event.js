import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, confirmPasswordReset, sendPasswordResetEmail, updatePassword, updateEmail, deleteUser } from "firebase/auth";
import { doc, setDoc, getDoc,addDoc, collection, query, where, getDocs,updateDoc,Document, deleteDoc, orderBy, arrayUnion, FieldValue  } from "firebase/firestore"; 
import { db,auth,storage } from "../firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState } from "react";
import moment from 'moment';
import * as FileSystem from 'expo-file-system';
import * as userBackEnd from '../backend/Users';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native'

const [errorEvent,setErrorEvent] = useState('');
const [idCurEvent, setIdCurEvent] = useState('');
var arrData = [];
var ownerMsg = false;
var response = false;
var idM = '';

//JSON Message 

/*
Events :

{
id:’’
idUser : ‘’
likes:[
userId
]
comments:[{
userId:
content:
like:[userId]
date:
}],
share:[
{
userId:’’
content:’’
like:[userId]
date:’’
}
],
links:[],
photo:[],
verses:[
{text:‘’,ref:’’},
{text:‘’,ref:’’},
{text:‘’,ref:’’},
warning: false
]
*/


export function getCurId(){
  return idM;
}

//This function allow to create user 
export async function CreateEvent(currentUserLogged,links,photo,verses,themeEvent,warning,contenttext){

  
    // Add a new document in collection "cities"
    await addDoc(collection(db, "events"), {

          idUser : currentUserLogged,
          content : contenttext,
          likes:[],
          comments:[{
            userId:"",
            content:"",
            like:[],
            date:""
          }],
          share:[
          {
            userId:"",
            content:"",
            like:[],
            date:""
          }
          ],
          links:links,
          photo:photo,
          verses:verses,
          theme: themeEvent,
          warning: warning,
          date:moment().format("DD/MM/YYYY")
      
    })
    .then((docRef) => {
        setErrorEvent('');
        idM = docRef.id;
        console.log('This value has been written '+idM)
        //setIdCurMsg(idM)
        console.log('ID has been written ')

    })
    .catch((error) => {
        alert(error.message);
        setErrorEvent(error.message);
    });
        

}

export async function SearchEventById(idEvent){

  arrData=[];
  var owner = false;

  const docRef = doc(db, "events", idEvent);
  
  const value = await AsyncStorage.getItem('USER_EMAIL') 
  if(value != ''){
    await getDoc(docRef)
    .then(async(doc)=> {
      // doc.data() is never undefined for query doc snapshots

        const json = doc.data();

        console.log(json.Response, " => Response ");

        if(value == json.idUser){
          owner = true;
        }

        await userBackEnd.SearchAvatarByEmail(json.idUser)
        .then((arrUserData)=>{

          arrData.push({

            id:doc.id,
            idUser : json.idUser,
            content : json.content,
            likes:json.likes,
            comments:json.comments,
            share:json.share,
            links:json.links,
            photo:json.photo,
            verses:json.verses,
            theme:json.theme,
            warning: json.warning,
            date:json.date,
            usName: arrUserData[0].nom,
            usFirst: arrUserData[0].prenom,
            usAvatar: arrUserData[0].avatar,
            usPseudo: arrUserData[0].pseudo,
            owner:owner
          })

        })

    });
  }
   return arrData;
}

//This function allow to find  a secific user or a specific category of users
export async function SearchEventByIDUser(criteria){

  arrData=[];

  console.log('search message for conv : '+criteria)

  const q = query(collection(db, "events"),where("idUser", "==", criteria));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(async (doc) => {
    // doc.data() is never undefined for query doc snapshots

      const json = doc.data();

      console.log(json.Response, " => Response ");

        arrData.push({

          id:doc.id,
          idUser : json.idUder,
          content : json.content,
          likes:json.likes,
          comments:json.comments,
          share:json.share,
          links:json.links,
          photo:json.photo,
          theme:json.theme,
          verses:json.verses,
          warning: json.warning,
          date:json.date
  
        })
    
  });
   return arrData;
}

//This function allow to update user's informations
export async function UpdateEventContent (msgId,dataUpdated){

      const docRef = doc(db, "events", msgId);

      {/* const data = {
        code: "613"
      }; */}

      await updateDoc(docRef,dataUpdated)
      .then(docRef => {
          setErrorEvent('');
          console.log("A New Document Field has been added to an existing document");
      })
      .catch(error => {
          console.log(error.message);
          setErrorEvent(error.message);

      })

}

//This function allow to update user's informations
export async function AddEventReaction(msgId,dataUpdated){

  const docRef = doc(db, "events", msgId);


  await updateDoc(docRef,{likes: arrayUnion(dataUpdated)})
  .then(docRef => {
      setErrorEvent('');
      console.log("A New Document Field has been added to an existing document");
  })
  .catch(error => {
      console.log(error);
      setErrorEvent(error.message);

  })
}

//This function allow to update user's informations
export async function AddEventAnswer(msgId,dataUpdated){

  const docRef = doc(db, "events", msgId);



  {/* const data = {
    code: "613"
  }; */}

  await updateDoc(docRef,{comments: arrayUnion(dataUpdated)})
  .then(docRef => {
      setErrorEvent('');
      console.log("A New Document Field has been added to an existing document");
  })
  .catch(error => {
      console.log(error);
      setErrorEvent(error.message);

  })

}

export async function RemoveEventAnswer(msgId,dataUpdated){

  const docRef = doc(db, "events", msgId);



  {/* const data = {
    code: "613"
  }; */}

  await updateDoc(docRef,{comments: arrayRemove(dataUpdated)})
  .then(docRef => {
      setErrorEvent('');
      console.log("A New Document Field has been added to an existing document");
  })
  .catch(error => {
      console.log(error);
      setErrorEvent(error.message);

  })

}

//This function allow to delete a specific user 
export async function DeleteEvent(msgId){
    const docRef = doc(db, "events", msgId);
    deleteDoc(docRef)
    .then(async () =>{
        setErrorEvent('');
    })
    .catch((error) => {
      console.log(error);
      setErrorEvent(error.message);
    })
}

export async function ReadAllEvents(){

  arrData=[];
  var owner = false;

  const value = await AsyncStorage.getItem('USER_EMAIL') 
  if(value != ''){

    console.log('event reading ...');

    const q = query(collection(db, "events"));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      // doc.data() is never undefined for query doc snapshots

        const json = doc.data();

        console.log(json.Response, " => Response ");

        if(value == json.idUser){
          owner = true;
        }

        await userBackEnd.SearchAvatarByEmail(json.idUser)
        .then((arrUserData)=>{

          arrData.push({

            id:doc.id,
            idUser : json.idUser,
            content : json.content,
            likes:json.likes,
            comments:json.comments,
            share:json.share,
            links:json.links,
            photo:json.photo,
            verses:json.verses,
            theme:json.theme,
            warning: json.warning,
            date:json.date,
            usName: arrUserData[0].nom,
            usFirst: arrUserData[0].prenom,
            usAvatar: arrUserData[0].avatar,
            usPseudo: arrUserData[0].pseudo,
            usOwner:owner
    
          })

        })


      
    });
  }
   return arrData;
  
}

export async function ReadLikeEvent(id){

  if(id != undefined){
  arrData=[];

  const docRef = doc(db, "events", id);

  await getDoc(docRef)
  .then((doc)=>{
    const json = doc.data();

    console.log(json.Response, " => Response ");

    arrData.push({
      id:doc.id,
      likes:json.likes,
    })
  })
  return arrData;
}
}

export async function SignalEvent(idEvent){

    Alert.alert('Signaler cet événement', 'Souhaitez-vous vraiment signaler cet événement ? ', [
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

export async function SignalComment(IdComment,IdEvent){

  Alert.alert('Signaler ce commentaire', 'Souhaitez-vous vraiment signaler ce commentaire ? ', [
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
export function getErrorEvents (){
  return errorEvent;
}