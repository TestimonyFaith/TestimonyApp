import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, confirmPasswordReset, sendPasswordResetEmail, updatePassword, updateEmail, deleteUser } from "firebase/auth";
import { doc, setDoc, getDoc,addDoc, collection, query, where, getDocs,updateDoc,Document, deleteDoc, orderBy  } from "firebase/firestore"; 
import { db,auth,storage } from "../firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState } from "react";
import moment from 'moment';
import * as userBackEnd from'../backend/Users';
import * as FileSystem from 'expo-file-system';
import {Alert} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';

const [errorMsg,setErrorMsg] = useState('');
const [idCurMsg, setIdCurMsg] = useState('');
var arrData = [];
var ownerMsg = false;
var response = false;
var idM = '';

//JSON Message 

/*{
  "id":"",
  "idConv" : "",
  "idUser" : "",
  "likes":[
  "userId"
  ],
  "content":"",
  "answers":[{
  "userId":"",
  "content":"",
  "like":["userId"],
  "date":""
  }],
  "links":[],
  "photo":[],
  "verses":[
  {"text":"","ref":""},
  ]
}*/


export function getCurId(){
  return idM;
}

//This function allow to create user 
export async function CreateMsg(conv,Content,currentUserLogged,images,nom,prenom,avatar){

    // Add a new document in collection "cities"
    await addDoc(collection(db, "msgs"), {
        Author: currentUserLogged,
        IdConv: conv,
        User:{
          nom:nom,
          prenom:prenom,
          avatar:avatar
        },
        Reactions:{},
        Type:'',
        TextMsg: Content, 
        Date: moment().format("DD/MM/YYYY-HH:MM:SS"),
        Images:images,
        Link:'',
        Response:false,
        Answers:{
          Author:'',
          IdAnwser:'',
          AnswerMsg:'',
          Date:moment().format("DD/MM/YYYY"),
          Reactions:{}
        },
        Verses:[
        ],
        Source:{}

      
    })
    .then((docRef) => {
        setErrorMsg('');
        idM = docRef.id;
        console.log('This value has been written '+idM)
        //setIdCurMsg(idM)
        console.log('ID has been written ')

    })
    .catch((error) => {
        alert(error.message);
        setErrorMsg(error.message);
    });
        

}

export async function CreateReply(conv,Content,currentUserLogged,images,nom,prenom,avatar,srcPrenom,srcAvatar,srcContent){

  
  // Add a new document in collection "cities"
  await addDoc(collection(db, "msgs"), {
      Author: currentUserLogged,
      IdConv: conv,
      User:{
        nom:nom,
        prenom:prenom,
        avatar:avatar
      },
      Reactions:{},
      Type:'',
      TextMsg: Content, 
      Date: moment().format("DD/MM/YYYY"),
      Images:images,
      Response:true,
      Answers:{
        Author:'',
        IdAnwser:'',
        AnswerMsg:'',
        Date:moment().format("DD/MM/YYYY")
      },
      Source:{
        prenom:srcPrenom,
        content:srcContent
      }
  })
  .then(() => {
      setErrorMsg('');
      console.log('This value has been written')
  })
  .catch((error) => {
      //alert(error.message+' '+Email)
      setErrorMsg(error.message);
  });
      

}
//This function allow to find  a secific user or a specific category of users
export async function SearchMsgByIDConv(criteria){

  arrData=[];

  console.log('search message for conv : '+criteria)

  const q = query(collection(db, "msgs"),where("IdConv", "==", criteria));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(async (doc) => {
    // doc.data() is never undefined for query doc snapshots

      const json = doc.data();

      console.log(json.Response, " => Response ");

      if(json.Author === userBackEnd.getEmail()){
        ownerMsg = true;
      }else{
        ownerMsg = false;
      }

      var len = json.Images.length;
      var arrNbImgs = [];
      if(len === 0){

      }else if(len ===1){

        arrNbImgs = [true,false,false,false];

      }else if(len ===2){

        arrNbImgs = [false,true,false,false];

      }else if(len ===3){
        
        arrNbImgs = [false,false,true,false];

      }else if(len ===4){

        arrNbImgs = [false,false,false,true];

      }else if(len > 4){

        arrNbImgs = [false,false,false,true];

      }

        arrData.push({

          id:doc.id,
          author: json.Author,
          content: json.TextMsg,
          idConv: json.IdConv,
          reactions:json.Reactions,
          type:json.Type,
          date: json.Date,
          files:json.Files,
          user: json.User,
          answers:json.Answers,
          owner: ownerMsg,
          response:json.Response,
          source:json.Source,
          images:json.Images,
          nbImgs: arrNbImgs,
  
        })
    
  });
   return arrData;
}

//This function allow to update user's informations
export async function UpdateMsgContent (msgId,dataUpdated){

      const docRef = doc(db, "msgs", msgId);

      {/* const data = {
        code: "613"
      }; */}

      await updateDoc(docRef,dataUpdated)
      .then(docRef => {
          setErrorMsg('');
          console.log("A New Document Field has been added to an existing document");
      })
      .catch(error => {
          console.log(error.message);
          setErrorMsg(error.message);

      })

}

//This function allow to update user's informations
export async function AddMsgReaction(msgId,dataUpdated){

    const docRef = doc(db, "msgs", msgId);

    {/* const data = {
      code: "613"
    }; */}

    await updateDoc(docRef,dataUpdated)
    .then(docRef => {
        setErrorMsg('');
        console.log("A New Document Field has been added to an existing document");
    })
    .catch(error => {
        console.log(error);
        setErrorMsg(error.message);

    })

}

//This function allow to update user's informations
export async function AddMsgAnswer(msgId,dataUpdated){

    const docRef = doc(db, "msgs", msgId);

    {/* const data = {
      code: "613"
    }; */}

    await updateDoc(docRef,dataUpdated)
    .then(docRef => {
        setErrorMsg('');
        console.log("A New Document Field has been added to an existing document");
    })
    .catch(error => {
        console.log(error);
        setErrorMsg(error.message);

    })

}

//This function allow to delete a specific user 
export async function DeleteMsg(msgId){
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

export async function ReadMsg(msgId){


  const docRef = doc(db, "msgs", msgId);
  const docSnap = await getDoc(docRef);

      const json = docSnap.data();

      var arrRes = {
        id:docSnap.id,
        author: json.Author,
        content: json.TextMsg,
        idConv: json.IdConv,
        reactions:json.Reactions,
        type:json.Type,
        date: json.Date,
        files:json.Files,
        user: json.User,
        answers:json.Answers,
        owner: ownerMsg,
        reponse: json.Response
      }
    
   return arrRes;
}

export function getErrorMsg (){
  return errorMsg;
}

export async function SignalMessage(){

  Alert.alert('Signaler ce message', 'Souhaitez-vous vraiment signaler ce message ? ', [
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