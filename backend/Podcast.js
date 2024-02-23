import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, confirmPasswordReset, sendPasswordResetEmail, updatePassword, updateEmail, deleteUser } from "firebase/auth";
import { doc, setDoc, getDoc,addDoc, collection, query, where, getDocs,updateDoc,Document, deleteDoc, orderBy  } from "firebase/firestore"; 
import { db,auth,storage } from "../firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState } from "react";
import moment from 'moment';
import * as FileSystem from 'expo-file-system';
import * as userBackEnd from '../backend/Users';
import {Alert} from 'react-native'

const [errorPod,setErrorPod] = useState('');
const [idCurPod, setIdCurPod] = useState('');
var arrData = [];
var ownerMsg = false;
var response = false;
var idM = '';

/*
  idUserAuthor : currentUserLogged,
          title:'',
          descr : contenttext,
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
          linksAudio:links,
          photo:photo,
          verses:verses,
          theme: themeEvent,
          public:'converti',
          warning: warning,
          date:moment().format("DD/MM/YYYY")
*/


export function getCurId(){
  return idM;
}

//This function allow to create user 
export async function CreatePodcast(currentUserLogged,links,photo,verses,themeEvent,warning,contenttext){

    // Add a new document in collection "cities"
    await addDoc(collection(db, "podcasts"), {

          idUserAuthor : currentUserLogged,
          title:'',
          descr : contenttext,
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
          linksAudio:links,
          photo:photo,
          verses:verses,
          theme: themeEvent,
          public:'converti',
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

export async function SearchPodcastById(idEvent){

  arrData=[];

  const docRef = doc(db, "podcasts", idEvent);

  await getDoc(docRef)
  .then(async(doc)=> {
    // doc.data() is never undefined for query doc snapshots

      const json = doc.data();

      console.log(json.Response, " => Response ");

      await userBackEnd.SearchAvatarByEmail(json.idUserAuthor)
      .then((arrUserData)=>{

        arrData.push({

          id:doc.id,
          idUserAuthor : json.idUserAuthor,
          title:json.title,
          descr:json.descr,
          content : json.content,
          likes:json.likes,
          comments:json.comments,
          share:json.share,
          linksAudio:json.links,
          photo:json.photo,
          verses:json.verses,
          theme:json.theme,
          public:json.public,
          warning: json.warning,
          date:json.date,
          usName: arrUserData[0].nom,
          usFirst: arrUserData[0].prenom,
          usAvatar: arrUserData[0].avatar,
          usPseudo: arrUserData[0].pseudo
        })

      })

  });
   return arrData;
}

//This function allow to find  a secific user or a specific category of users
export async function SearchPodcastByAuthor(criteria){

  arrData=[];

  console.log('search message for conv : '+criteria)

  const q = query(collection(db, "podcasts"),where("idUserAuthor", "==", criteria));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(async (doc) => {
    // doc.data() is never undefined for query doc snapshots

      const json = doc.data();

      console.log(json.Response, " => Response ");

        arrData.push({

          id:doc.id,
          idUserAuthor : json.idUserAuthor,
          title:json.title,
          descr:json.descr,
          content : json.content,
          likes:json.likes,
          comments:json.comments,
          share:json.share,
          linksAudio:json.links,
          photo:json.photo,
          verses:json.verses,
          theme:json.theme,
          public:json.public,
          warning: json.warning,
          date:json.date,

  
        })
    
  });
   return arrData;
}

//This function allow to update user's informations
export async function UpdatePodcastContent (msgId,dataUpdated){

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
export async function AddPodcastReaction(msgId,dataUpdated){

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
        console.log(error);
        setErrorEvent(error.message);

    })

}

//This function allow to update user's informations
export async function AddPodcastAnswer(msgId,dataUpdated){

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
      console.log(error);
      setErrorEvent(error.message);

  })

}

//This function allow to delete a specific user 
export async function DeletePodcast(msgId){
    const docRef = doc(db, "msgs", msgId);
    deleteDoc(docRef)
    .then(async () =>{
        setErrorMsg('');
    })
    .catch((error) => {
      console.log(error);
      setErrorMsg(error.message);
    })
}

export async function ReadAllPodcast(){

  arrData=[];

  const q = query(collection(db, "events"));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(async (doc) => {
    // doc.data() is never undefined for query doc snapshots

      const json = doc.data();

      console.log(json.Response, " => Response ");

      await userBackEnd.SearchAvatarByEmail(json.idUserAuthor)
      .then((arrUserData)=>{

        arrData.push({

          id:doc.id,
          idUserAuthor : json.idUserAuthor,
          title:json.title,
          descr:json.descr,
          content : json.content,
          likes:json.likes,
          comments:json.comments,
          share:json.share,
          linksAudio:json.links,
          photo:json.photo,
          verses:json.verses,
          theme:json.theme,
          public:json.public,
          warning: json.warning,
          date:json.date,
          usName: arrUserData[0].nom,
          usFirst: arrUserData[0].prenom,
          usAvatar: arrUserData[0].avatar,
          usPseudo: arrUserData[0].pseudo
  
        })

      })


    
  });
   return arrData;
}

export async function ReadLikePodcast(id){

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

export function getErrorPodcast (){
  return errorEvent;
}