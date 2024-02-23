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

const [errorBicollab,setErrorBicollab] = useState('');
const arrData = [];


//This function allow to create user 
export async function CreateBicollab(BiName,base64,members,type,currentUserLogged,version,language){

    // Add a new document in collection "cities"
    await addDoc(collection(db, "bicollab"), {
        nom: BiName,
        image: base64,
        members: members,
        author:currentUserLogged,
        type:type,
        version:version,
        lang:language,
        date: moment().format("DD/MM/YYYY")
    })
    .then((id) => {
        setErrorBicollab('');
        console.log('This value has been written');

    })
    .catch((error) => {
        //alert(error.message+' '+Email)
        setErrorBicollab(error.message);
    });
        

}

export async function getVersionById(id){

  var vers = '';
  const docRef = doc(db, "bicollab", id);

  {/* const data = {
    code: "613"
  }; */}

  await getDoc(docRef)
  .then(doc => {

      console.log(doc.id, " => ", doc.data());
      const json = doc.data();
      

      setErrorBicollab('');
      console.log("A New Document Field has been added to an existing document \n");

      vers= json.version;
  })
  .catch(error => {
      console.log(error);
      setErrorBicollab(error.message);

  })

  return vers;

}

//This function allow to get all conversations
export async function getAllBicollab(){

  arrDataConv = []
  var owner = false;

  const value = await AsyncStorage.getItem('USER_EMAIL') 
  if(value != ''){

    const q = query(collection(db, "bicollab"),where('members',"array-contains",value));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async(doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());

      const json = doc.data();

      console.log(JSON.stringify(json))

      if(value == json.idUser){
        owner = true;
      }


        arrDataConv.push({

          id:doc.id,
          nom:json.nom,
          image:json.image,
          members: json.members,
          author:json.author,
          type:json.type,
          version:json.version,
          date: json.date,
          owner:owner

        })
      });
    
  }
  return arrDataConv;
}

//This function allow to find  a secific user or a specific category of users
export async function SearchBicollabByName(criteria){

  const q = query(collection(db, "bicollab"), where("nom", "==", criteria));

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

export async function SearchBicollabById(criteria){

  var resQuery = {};

  const docRef = doc(db, "bicollab", bicollabId);

  await getDoc(docRef)
  .then(doc => {
    console.log(doc.id, " => ", doc.data());
    const json = datas.data();

    resQuery = json;

  })
  .catch(error => {
      console.log(error);
      setErrorBicollab(error.message);

  })
return json;
}

//This function allow to a member to leave the conversation
export async function LeaveBicollab(bicollabId,emailUser){

  const docRef = doc(db, "bicollab", bicollabId);

  await updateDoc(docRef,{members: arrayRemove(emailUser)})
  .then(docRef => {
      setErrorBicollab('');
      console.log("A New Document Field has been added to an existing document");
  })
  .catch(error => {
      console.log(error);
      setErrorBicollab(error.message);

  })

}

//This function allow to update conv's informations
export async function UpdateBicollab(convId,dataUpdated){

      const docRef = doc(db, "bicollab", convId);

      {/* const data = {
        code: "613"
      }; */}

      await updateDoc(docRef,dataUpdated)
      .then(docRef => {
          setErrorBicollab('');
          console.log("A New Document Field has been added to an existing document");
      })
      .catch(error => {
          console.log(error);
          setErrorBicollab(error.message);

      })

}

//This function allow to delete a specific user 
export async function DeleteBicollab(convId){
    const docRef = doc(db, "bicollab", convId);
    deleteDoc(docRef)
    .then(async () =>{
        setErrorBicollab('');
    })
    .catch((error) => {
      console.log(error);
      setErrorBicollab(error.message);
    })
}

export function getErrorBicollab(){
  return errorBicollab;
}

