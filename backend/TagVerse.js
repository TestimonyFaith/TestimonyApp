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

const [errorNote,setErrorNote] = useState('');
const arrData = [];

export async function createTag(book,chap,verse,verseText,idUser,color,nameBook,idBook){
        // Add a new document in collection "notes"
        await addDoc(collection(db, "tagVerses"), {
            refBook:book,
            refChapter:chap,
            refVerse:verse,
            verseText:verseText,
            idUser:idUser,
            backColor:color,
            biCollabName:nameBook,
            biCollabId:idBook,
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

export async function readTagByRef(book,chap,verse){

  const q = query(collection(db, "tagVerses"), 
    where("refBook", "==", book),
    where("refChapter","==",chap),
    where("refVerse","==",verse)
  );

  var arrDataNote = []
  var owner = false;

  const value = await AsyncStorage.getItem('USER_EMAIL') 
  if(value != undefined){
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async(doc) => {
      // doc.data() is never undefined for query doc snapshots
          
      const json = doc.data();
      if(value == json.idUser){
        owner = true;
      }
  
      console.log('json : '+JSON.stringify(json))
      

          arrDataNote.push({
      
            id:json.id,
            refBook:json.refBook,
            refChapter:json.refChapter,
            refVerse:json.refVerse,
            idUser:json.idUser,
            verseText:json.verseText,
            backColor:json.backColor,
            biCollabName:json.biCollabName,
            biCollabId:json.idBook,
            date: json.date,

        })
        })

    }
   return arrDataNote;
}

export async function readTagByChapRef(book,chap){

  console.log('READ BOOK & CHAP : '+book+' '+chap);
  const q = query(collection(db, "tagVerses"), 
    where("refBook", "==", book),
    where("refChapter","==",chap)
  );

  var arrDataNote = [];
  var owner = false;

  const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async(doc) => {
      // doc.data() is never undefined for query doc snapshots
          
      const json = doc.data();
  
     // console.log('json : '+JSON.stringify(json))
      
          arrDataNote.push({
      
            id:doc.id,
            refBook:json.refBook,
            refChapter:json.refChapter,
            refVerse:json.refVerse,
            idUser:json.idUser,
            backColor:json.backColor,
            verseText:json.verseText,
            biCollabName:json.biCollabName,
            biCollabId:json.idBook,
            date: json.date,

        })
    })
   return arrDataNote;
}

export async function readAllTags(){

  // A FAIRE READ ALL TAG WHERE USERID == USER_EMAIL
    arrDataNote = []

    var owner = false;

    const value = await AsyncStorage.getItem('USER_EMAIL') 
    if(value != ''){

    const q = query(collection(db, "tagVerses"),where('idUser','==',value));
  
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async(doc) => {

    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
  
    const json = doc.data();

    if(value == json.idUser){
      owner = true;
    }

    console.log('json verse tag : '+JSON.stringify(json))
  
    await userBackEnd.SearchAvatarByEmail(json.idUser)
    .then((arrUserData)=>{



      arrDataNote.push({
    
              refBook:json.refBook,
              refChapter:json.refChapter,
              refVerse:json.refVerse,
              idUser:json.idUser,
              backColor:json.backColor,
              biCollabName:json.biCollabName,
              biCollabId:json.biCollabId,  
              date: json.date,
              verseText:json.verseText,
              owner:owner,
              usName:arrUserData[0].nom,
              usFirst:arrUserData[0].prenom,
              usAvatar:arrUserData[0].avatar,
              usPseudo:arrUserData[0].pseudo
          })
      })
    });
  }
    return arrDataNote;
}

export async function readTagsInBicollab(bicollabName){

  // A FAIRE READ ALL TAG WHERE USERID == USER_EMAIL
    arrDataNote = []

    var owner = false;

    const value = await AsyncStorage.getItem('USER_EMAIL') 
    if(value != ''){

    console.log('bicollab name : '+bicollabName);

    const q = query(collection(db, "tagVerses"),where('biCollabId','in',bicollabName));
  
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async(doc) => {

    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
  
    const json = doc.data();

    if(value == json.idUser){
      owner = true;
    }

    console.log('json verse tag : '+JSON.stringify(json))
  
    await userBackEnd.SearchAvatarByEmail(json.idUser)
    .then((arrUserData)=>{

      arrDataNote.push({
    
              refBook:json.refBook,
              refChapter:json.refChapter,
              refVerse:json.refVerse,
              idUser:json.idUser,
              backColor:json.backColor,
              biCollabName:json.biCollabName,
              biCollabId:json.idBook,  
              date: json.date,
              verseText:json.verseText,
              owner:owner,
              usName:arrUserData[0].nom,
              usFirst:arrUserData[0].prenom,
              usAvatar:arrUserData[0].avatar,
              usPseudo:arrUserData[0].pseudo
          })
      })
    });
  }
    return arrDataNote;
}

export async function updateTag(idNote,dataToUpdate){
  const docRef = doc(db, "tagVerses", idNote);

  await updateDoc(docRef,dataToUpdate)
  .then(docRef => {
      setErrorNote('');
      console.log("A New Document Field has been added to an existing document");
  })
  .catch(error => {
      console.log(error.message);
      setErrorNote(error.message);

  })
}

export async function deleteTag(idNote){
  const docRef = doc(db, "tagVerses", idNote);
  deleteDoc(docRef)
  .then(async () =>{
      setErrorNote('');
  })
  .catch((error) => {
    console.log(error);
    setErrorNote(error.message);
  })
}


