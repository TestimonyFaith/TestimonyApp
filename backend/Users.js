import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, confirmPasswordReset, sendPasswordResetEmail, updatePassword, updateEmail, deleteUser } from "firebase/auth";
import { doc, setDoc, getDoc,addDoc, collection, query, where, getDocs,updateDoc,Document, deleteDoc  } from "firebase/firestore"; 
import { db,auth,storage } from "../firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState } from "react";
import moment from 'moment'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native'

const [errorUser,setErrorUser] = useState('');
const [userId, setUserId] = useState('');
var arrData = [];
var avatar = "";
var nom = "";
var prenom = "";

var userEmail = '';
var userAvatar = '';
var userPunch = '';
var userNom = '';
var userFirst = '';
var userPseudo = '';
var userCauses = {};
var userMoney = '0';

//JSON Users 
/*
{

"id":"",
"nom" : "",
"prenom":"",
"dateInscription":"",
"dateNaissance":"",
"email":"",
"pseudo":"",
"step":"",
"avatar":"",
"phone":"",
"Userfollowed" :[
 "userId"
],
"followedBy":[
 "useId"
],
"blacklist":[
"userId"
],
"verses" : [
    {"text":"","ref":""},
    {"text":"","ref":""},
    {"text":"","ref":""}
]
}
*/

//All function to set up state 

export function setStateEmail(email){
  
  console.log('backend email : '+email);
  userEmail = email;
}

export function setStateId(id){
  setUserId(id);
}


export function setStateUserAvatar(Avatar){
  userAvatar = Avatar;
}

export function setStateName(Name){
  userNom = Name;
}

export function setStateFirst(First){
  userFirst = First;
}

export function setStatePseudo(pseudo){
  userPseudo = pseudo;
}


export function getName(){
  return userNom;
}

export function getFirstname(){
  return userFirst;
}

export function getPseudo(){
  return userPseudo;
}

export function getEmail(){
  return userEmail;
}

export function getAvatar(){
  return userAvatar;
}


//END of State --------------

//This function allow to create user 
export async function CreateUser(Name,Firstname,AvatarImg,Email,Pseudo,Step,Phone,Verses,Testimony){

            // Add a new document in collection "cities"
            await addDoc(collection(db, "users"), {
              nom : Name,
              prenom: Firstname,
              dateInscription: moment().format("DD/MM/YYYY"),
              dateNaissance: moment().format("DD/MM/YYYY"),
              email: Email,
              pseudo: Pseudo,
              step: Step,
              avatar: AvatarImg,
              phone: Phone,
              userfollowed :[],
              followedBy:[],
              blacklist:[],
              verses : [],
              testimony:Testimony
            })
            .then(() => {
              setErrorUser('');
              console.log('This value has been written')
            })
            .catch((error) => {
              //alert(error.message+' '+Email)
              setErrorUser(error.message);
            });
        
        
      }

//This function allow to reset user's password
export async function resetPassword(){

  await sendPasswordResetEmail(auth, userEmail)
  .then(()=>{
      setErrorUser('');
      console.log('Password has been reset');

  })
  .catch((error)=>{
    setErrorUser(error.message);
    console.log(error.message);
  })

  // Obtain code from user by email.


}

//This function allow to confirm new password 
export async function confirmReset(email,code,newPassword){
    //------------
    // Copy on another page after password reset.
    await confirmPasswordReset(email, code)
    .then(async()=>{
      setErrorUser('');

      await updatePassword(auth.currentUser,newPassword)
      .then(()=>{
        setErrorUser('');
        console.log('Password has been confirmed');
        Toast.show('Votre mot de passe a été changé', Toast.LONG);  
      })
      .catch((error)=>{
          setErrorUser(error.message);
          console.log(error.message);
      })

    })
    .catch((error)=>{
      setErrorUser(error.message);
      console.log(error.message);
    })
  //----------
}

//This function allow to find  a secific user or a specific category of users
export async function SearchUserByEmail(criteria){

  arrData=[];
  console.log('criteria : '+criteria)

  const q = query(collection(db, "users"), where("email", "==", criteria));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(async(doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
        
    const json = doc.data();

      arrData.push({

        id:doc.id,
        nom : json.nom,
        prenom: json.prenom,
        dateInscription: json.dateInscription,
        dateNaissance: json.dateNaissance,
        email: json.email,
        pseudo: json.pseudo,
        step: json.step,
        avatar: json.avatar,
        phone: json.phone,
        userfollowed :json.userfollowed,
        followedBy:json.followedBy,
        blacklist:json.blacklist,
        verses : json.verses,
        testimony: json.testimony,
  
      })
    })

   return arrData;
}

export async function SearchAvatarByEmail(criteria){

  const q = query(collection(db, "users"), where("email", "==", criteria));

  var arrUser = []
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
        
    const json = doc.data();

    console.log('search avatar by email : '+JSON.stringify(json))

    arrUser.push({
    avatar : json.avatar,
    nom : json.nom,
    prenom : json.prenom,
    pseudo: json.pseudo,
    verses: json.verses,
  })



  });
   return arrUser;
}

export async function getUserIdByEmail(criteria){

  const q = query(collection(db, "users"), where("email", "==", criteria));

  var arrUser = '';
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
        
    const json = doc.data();

    console.log('search avatar by email : '+JSON.stringify(json))

    arrUser = doc.id

  });
   return arrUser;
}

export async function getAllUsers(criteria){

  arrData=[];

  const q = query(collection(db, "users"));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots        
    const json = doc.data();

    arrData.push({

      id:doc.id,
      nom : json.nom,
      prenom: json.prenom,
      dateInscription: json.dateInscription,
      dateNaissance: json.dateNaissance,
      email: json.email,
      pseudo: json.pseudo,
      step: json.step,
      avatar: json.avatar,
      phone: json.phone,
      userfollowed :json.userfollowed,
      followedBy:json.followedBy,
      blacklist:json.blacklist,
      verses : json.verses,

    })


  });
   return arrData;
}

//This function allow to update user's informations
export async function UpdateUser(dataUpdated,idDoc){


    console.log('update user ')

      const docRef = doc(db, "users", idDoc);

      await updateDoc(docRef,dataUpdated)
      .then(docRef => {
          setErrorUser('');
          console.log("A New Document Field has been added to an existing document");
      })
      .catch(error => {
          console.log(error);
          setErrorUser(error.message);

      })

}

export async function UpdateCurrentUser(dataUpdated){


  console.log('update current user ')

  const value = await AsyncStorage.getItem('USER_EMAIL')
  if(value != ''){

   await getUserIdByEmail(value)
    .then(async(idCurUser)=>{
      const docRef = doc(db, "users", idCurUser);

      await updateDoc(docRef,dataUpdated)
      .then(docRef => {
          setErrorUser('');
          console.log("A New Document Field has been added to an existing document");
      })
      .catch(error => {
          console.log(error);
          setErrorUser(error.message);
  
      })
    })

  }

}

//This function allow to delete a specific user 
export async function DeleteUser(){

  //Delete by email or find Id before by email !
   
  const q = query(collection(db, "user"), where("email", "==", userEmail));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {

    deleteDoc(doc)
    .then(async () =>{
        setErrorUser('');
        await deleteUser(auth.currentUser)
        .then(()=>{
          setErrorUser('');
          console.log("User has been deleted ")
        })
        .catch((error)=>{
          setErrorUser(error.message);
          console.log(error.message)

        })
    })
    .catch((error) => {
      console.log(error);
      setErrorUser(error.message);
    })
  });

}

export function disconnectUser(){
   AsyncStorage.setItem('USER_EMAIL','');
}

export function getErrorUser(){
  return errorUser;
}

export async function UpdateUserEmail(newEmail) {
  await updateEmail(auth.currentUser,newEmail)
  .then(()=>{
    setErrorUser('');
    console.log('new Email has been confirmed');
  })
  .catch((error)=>{
      setErrorUser(error.message);
      console.log(error.message);
  })
}

export async function addFollowers(idUs,DataUpdated){
  UpdateUser(DataUpdated,idUs);
}
export async function addFollowedBy(idUs,DataUpdated){
  UpdateUser(DataUpdated,idUs);
}

export async function SignalUser(idUser){

  Alert.alert('Signaler cet utilisateur', 'Souhaitez-vous vraiment signaler cet utilisateur? ', [
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

export async function BlockUser(idUser){

  Alert.alert('Bloquer cet utilisateur', 'Souhaitez-vous vraiment bloquer cet utilisateur ? ', [
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


