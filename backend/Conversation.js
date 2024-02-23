import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, confirmPasswordReset, sendPasswordResetEmail, updatePassword, updateEmail, deleteUser } from "firebase/auth";
import { doc, setDoc, getDoc,addDoc, collection, query, where, getDocs,updateDoc,Document, deleteDoc, arrayRemove,arrayUnion  } from "firebase/firestore"; 
import { db,auth,storage } from "../firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState } from "react";
import * as msgBackEnd from '../backend/Messages'
import moment from 'moment';
import {LABELS} from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native'

const [errorConv,setErrorConv] = useState('');
const arrData = [];


//This function allow to create user 
export async function CreateConv(convName,base64,members,type,currentUserLogged){

    // Add a new document in collection "cities"
    await addDoc(collection(db, "conv"), {
        nom: convName,
        image: base64,
        members: members,
        author:currentUserLogged,
        type:type,
        date: moment().format("DD/MM/YYYY"),
    })
    .then((id) => {
        setErrorConv('');
        console.log('This value has been written');

    })
    .catch((error) => {
        //alert(error.message+' '+Email)
        setErrorConv(error.message);
    });
        

}

//This function allow to get all conversations
export async function getAllConv(){

  arrDataConv = []
  var owner = false;

  const value = await AsyncStorage.getItem('USER_EMAIL') 
  if(value != ''){

    const q = query(collection(db, "conv"),where('members',"array-contains",value));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async(doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());

      const json = doc.data();

      console.log(JSON.stringify(json))

      if(value == json.idUser){
        owner = true;
      }

      await msgBackEnd.SearchMsgByIDConv(doc.id)
      .then((arrMsg)=>{

        var contentMsg = '';
        if(arrMsg.length>0){
          if(arrMsg[0].content != ''){
              contentMsg = arrMsg[0].content;
          }else{
              contentMsg = LABELS.msgConvEmpty;
          }
        }else{
          contentMsg = LABELS.msgConvEmpty;
        }

        arrDataConv.push({

          id:doc.id,
          nom:json.nom,
          image:json.image,
          members: json.members,
          author:json.author,
          type:json.type,
          shortContent:contentMsg,
          date: json.date,
          owner:owner

        })
      });
    });
  }
  return arrDataConv;
}

//This function allow to find  a secific user or a specific category of users
export async function SearchConvByName(criteria){

  const q = query(collection(db, "conv"), where("nom", "==", criteria));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());

    const json = datas.data();

    arrData.push({

      id:datas.id,
      name:json.nom,
      members: json.members,
      author:json.author,
      date: json.date,

    })


  });
   // return {}
}

//This function allow to a member to leave the conversation
export async function LeaveConv(convId,emailUser){

  const docRef = doc(db, "conv", convId);

  await updateDoc(docRef,{members: arrayRemove(emailUser)})
  .then(docRef => {
      setErrorConv('');
      console.log("A New Document Field has been added to an existing document");
  })
  .catch(error => {
      console.log(error);
      setErrorConv(error.message);

  })

}

//This function allow to update conv's informations
export async function UpdateConv(convId,dataUpdated){

      const docRef = doc(db, "conv", convId);

      {/* const data = {
        code: "613"
      }; */}

      await updateDoc(docRef,dataUpdated)
      .then(docRef => {
          setErrorConv('');
          console.log("A New Document Field has been added to an existing document");
      })
      .catch(error => {
          console.log(error);
          setErrorConv(error.message);

      })

}

//This function allow to delete a specific user 
export async function DeleteConv(convId){
    const docRef = doc(db, "conv", convId);
    deleteDoc(docRef)
    .then(async () =>{
        setErrorConv('');
    })
    .catch((error) => {
      console.log(error);
      setErrorConv(error.message);
    })
}

export function getErrorConv(){
  return errorConv;
}

