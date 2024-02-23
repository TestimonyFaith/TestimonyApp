import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, confirmPasswordReset, sendPasswordResetEmail, updatePassword, updateEmail, deleteUser } from "firebase/auth";
import { doc, setDoc, getDoc,addDoc, collection, query, where, getDocs,updateDoc,Document, deleteDoc, arrayUnion, arrayRemove  } from "firebase/firestore"; 
import { db,auth,storage } from "../firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState } from "react";
import * as msgBackEnd from '../backend/Messages'
import moment from 'moment';
import {LABELS} from '../constants';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as userBackEnd from '../backend/Users';
import * as uuid from "uuid";

const [errorNote,setErrorNote] = useState('');
const arrData = [];

export async function addNote(content,book,chap,verse,idUser,color,idBiCollab){

  console.log('refVerse : '+verse);
  await isNoteExist(book,chap,verse,idBiCollab)
  .then(async(isExist )=>{

    console.log('isExist : '+isExist);


    if(isExist == true){
    await getIdbyRef(book,chap,verse,idBiCollab)
    .then(async(idNote)=>{

      console.log('note id : '+idNote);


          dataNote = 
            {
              idCont:uuid.v4(),
              user:idUser,
              text:content,
              backColor:color,
              date: moment().format("DD/MM/YYYY"),
            }
          
      
          const docRef = doc(db, "notes", idNote);
      
          await updateDoc(docRef,{content: arrayUnion(dataNote)})
          .then(docRef => {
              console.log("A New Document Field has been added to an existing document");
          })
          .catch(error => {
              console.log(error);        
          })
    })
  }else{

    await createNote(content,book,chap,verse,idUser,color,idBiCollab)
    .then(()=>{
      console.log("A New Document Field has been added to an existing document");
    })

  }
  })
}

export async function isNoteExist(book,chap,verse,idBiCollab){

  var i = 0;
  const q = query(collection(db, "notes"), 
    where("refBook", "==", book),
    where("refChapter","==",chap),
    where("refVerse","==",verse),
    where("idBicollab","==",idBiCollab),
  );

  console.log('query running ...');
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(async(doc) => {
    i++;
  })

  if(i>0){
    return true;
  }else{
    return false;
  }



}

export async function getIdbyRef(book,chap,verse,idBiCollab){

  var idNote = '';
  const q = query(collection(db, "notes"), 
    where("refBook", "==", book),
    where("refChapter","==",chap),
    where("refVerse","==",verse),
    where("idBicollab","==",idBiCollab)
  );

  console.log('ref : '+book+chap+verse)

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(async(doc) => {
    const json = doc.data();
    idNote = doc.id

    console.log('id ' + doc.id + ' '+JSON.stringify(json))
  })

  return idNote;

}

export async function createNote(content,book,chap,verse,idUser,color,idBiCollab){
        // Add a new document in collection "notes"
        await addDoc(collection(db, "notes"), {
            content:[{
              idCont:uuid.v4(),
              user:idUser,
              text:content,
              backColor:color,
              date: moment().format("DD/MM/YYYY"),
            }],
            refBook:book,
            refChapter:chap,
            refVerse:verse,
            likes:[],
            idBicollab:idBiCollab,
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

export async function readByRef(book,chap,verse,idBiCollab){

  console.log('read by ref : '+book+' '+chap+' '+verse+' '+idBiCollab)
  const q = query(collection(db, "notes"), 
    where("refBook", "==", book),
    where("refChapter","==",chap),
    where("refVerse","==",verse),
    where("idBicollab","==",idBiCollab),

    );

  var arrDataNote = []
  var owner = false;

  const value = await AsyncStorage.getItem('USER_EMAIL') 
  if(value != ''){
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async(doc) => {
      // doc.data() is never undefined for query doc snapshots
          
      const json = doc.data();

  
     // console.log('json annotations : '+JSON.stringify(json))

      json.content.forEach(async(cont)=>{
        await userBackEnd.SearchAvatarByEmail(cont.user)
        .then(async(arrUserData)=>{

          var likeCont = json.likes.filter((l)=>{return l.idContent == cont.idCont})
          //var likeContUser = likeCont.filter((l)=>{return l.idUser == value})

          if(value == cont.user){
            owner = true;
    
          }

          arrDataNote.push({
            id:doc.id,
            content:cont.text,
            likes:json.likes,
            dateCont: cont.date,
            userId:cont.idUser,
            contId:cont.idCont,
            nbLikes:likeCont.length,
            refBook:json.refBook,
            refChapter:json.refChapter,
            refVerse:json.refVerse,
            date: json.date,
            owner:owner,
            idBicollab:json.idBicollab,
            usName:arrUserData[0].nom,
            usFirst:arrUserData[0].prenom,
            usAvatar:arrUserData[0].avatar,
            usPseudo:arrUserData[0].pseudo
        })
        })

        })
      })


  }else{
    console.log('value is null')
  }
   return arrDataNote;
}

export async function readAvatarByRef(book,chap){

  const q = query(collection(db, "notes"), 
    where("refBook", "==", book),
    where("refChapter","==",chap)
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
  
      //console.log('json : '+JSON.stringify(json))
      
      await userBackEnd.SearchAvatarByEmail(json.idUser)
      .then(async(arrUserData)=>{



          arrDataNote.push({
      
            id:json.id,
            content:json.content,
            refBook:json.refBook,
            refChapter:json.refChapter,
            refVerse:json.refVerse,
            idUser:json.idUser,
            backColor:json.backColor,
            likes:json.likes,
            date: json.date,
            owner:owner,
            idBicollab:json.idBicollab,
            nbLikes:0,
            usName:arrUserData[0].nom,
            usFirst:arrUserData[0].prenom,
            usAvatar:arrUserData[0].avatar,
            usPseudo:arrUserData[0].pseudo,

          })
        })

        })

  }
   return arrDataNote;
}

export async function readAllNotes(){

    var arrDataNote = []
    var arrDataCont = []
    var lastId = '';

    var owner = false;

    const value = await AsyncStorage.getItem('USER_EMAIL') 
    if(value != undefined){

    const q = query(collection(db, "notes"));
  
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async(doc) => {

    // doc.data() is never undefined for query doc snapshots
   // console.log(doc.id, " => ", doc.data());
  
    const json = doc.data();



      json.content.forEach(async(cont)=>{
        await userBackEnd.SearchAvatarByEmail(cont.user)
        .then((arrUserData)=>{

          if(value == cont.user){
            owner = true;
    
          }

          var likeCont = json.likes.filter((l)=>{return l.idContent == cont.idCont})
          //var likeContUser = likeCont.filter((l)=>{return l.idUser == value})

          //console.log('user data : '+JSON.stringify(arrUserData));
          //console.log('json notes : '+JSON.stringify(json));
          //console.log('filter result : '+JSON.stringify(likeCont));

          /*              
              */
              arrDataCont.push({
                id:doc.id,
                content:cont.text,
                dateCont: cont.date,
                userId:cont.idUser,
                contId:cont.idCont,
                nbLikes:likeCont.length,
                owner:owner,
                color:'',
                nbLikes:0,//likeCont.length,
                usName:arrUserData[0].nom,
                usFirst:arrUserData[0].prenom,
                usAvatar:arrUserData[0].avatar,
                usPseudo:arrUserData[0].pseudo
            })

            console.log(doc.id, " => ",lastId)

            if(doc.id != lastId){
              //console.log('push array to contArray')
              arrDataNote.push({
                refBook:json.refBook,
                refChapter:json.refChapter,
                refVerse:json.refVerse,
                date: json.date,
                likes:json.likes,
                idBicollab:json.idBicollab,
                contArray:arrDataCont
              })
              lastId=doc.id;
            }
        })

      })



    });

    //console.log('json arrCont : '+JSON.stringify(arrDataNote));
  }
  
    return arrDataNote;
}

export async function readAllNotesInBicollab(idBiCollab){

  var arrDataNote = []
  var arrDataCont = []
  var lastId = '';

  var owner = false;

  const value = await AsyncStorage.getItem('USER_EMAIL') 
  if(value != undefined){

  const q = query(collection(db, "notes"),where('idBicollab','==',idBiCollab));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(async(doc) => {

  // doc.data() is never undefined for query doc snapshots
 // console.log(doc.id, " => ", doc.data());

  const json = doc.data();



    json.content.forEach(async(cont)=>{
      await userBackEnd.SearchAvatarByEmail(cont.user)
      .then((arrUserData)=>{

        if(value == cont.user){
          owner = true;
  
        }

        var likeCont = json.likes.filter((l)=>{return l.idContent == cont.idCont})
        //var likeContUser = likeCont.filter((l)=>{return l.idUser == value})

        //console.log('user data : '+JSON.stringify(arrUserData));
        //console.log('json notes : '+JSON.stringify(json));
        //console.log('filter result : '+JSON.stringify(likeCont));

        /*              
            */
            arrDataCont.push({
              id:doc.id,
              content:cont.text,
              dateCont: cont.date,
              userId:cont.idUser,
              contId:cont.idCont,
              nbLikes:likeCont.length,
              owner:owner,
              color:'',
              nbLikes:0,//likeCont.length,
              usName:arrUserData[0].nom,
              usFirst:arrUserData[0].prenom,
              usAvatar:arrUserData[0].avatar,
              usPseudo:arrUserData[0].pseudo
          })

          console.log(doc.id, " => ",lastId)

          if(doc.id != lastId){
            //console.log('push array to contArray')
            arrDataNote.push({
              refBook:json.refBook,
              refChapter:json.refChapter,
              refVerse:json.refVerse,
              date: json.date,
              likes:json.likes,
              idBicollab:json.idBicollab,
              contArray:arrDataCont
            })
            lastId=doc.id;
          }
      })

    })



  });

  //console.log('json arrCont : '+JSON.stringify(arrDataNote));
}

  return arrDataNote;
}

export async function readOneNotes(idNote){
    
    var arrDataOne=[] 

    const docRef = doc(db, "notes", idNote);
    
    await getDoc(docRef)
    .then(async(doc)=> {
      // doc.data() is never undefined for query doc snapshots
  
        const json = doc.data();
  
        console.log(json.Response, " => Response ");
  
        await userBackEnd.SearchAvatarByEmail(json.idUser)
        .then((arrUserData)=>{
  
          arrDataOne.push({
            content:json.content,
            refBook:json.refBook,
            refChapter:json.refChapter,
            refVerse:json.refVerse,
            idUser:json.idUser,
            backColor:json.backColor,
            likes:json.likes,
            date: json.date,
            idBicollab:json.idBicollab,
            usName:arrUserData[0].nom,
            usFirst:arrUserData[0].prenom,
            usAvatar:arrUserData[0].avatar,
            usPseudo:arrUserData[0].pseudo
          })
  
        })
  
    });
     return arrDataOne;

}

export async function updateNote(idNote,dataToUpdate){
  const docRef = doc(db, "notes", idNote);

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

export async function updateContNote(idNote,idCont,idUser,content,color,dateCont,newText){

  console.log( ' data modify note : \n '+ idNote+' '+idCont+' '+idUser+' '+content+' '+dateCont)
  await deleteNote(idNote,idCont,idUser,content,'#fff',dateCont).
  then(async()=>{
    const docRef = doc(db, "notes", idNote);
    dataArray = {
      idCont:idCont,
      user:idUser,
      text:newText,
      backColor:'#fff',
      date: dateCont
    }
  
    console.log('array : '+JSON.stringify(dataArray));
  
    await updateDoc(docRef,{content: arrayUnion(dataArray)})
    .then(docRef => {
        setErrorNote('');
        console.log("A New Document Field has been added to an existing document");
    })
    .catch(error => {
        console.log(error);
        setErrorNote(error.message);
  
    })
  })

}

export async function deleteNote(idNote,idCont,idUser,content,color,dateCont){
  const docRef = doc(db, "notes", idNote);

  //Filter à la lecture pour savoir combien de likes pour une note 
  //Filtrer pour savoir si déjà liké ou pas

  dataArray = {
    idCont:idCont,
    user:idUser,
    text:content,
    backColor:'#fff',
    date: dateCont
  }

  console.log('array : '+JSON.stringify(dataArray));

  await updateDoc(docRef,{content: arrayRemove(dataArray)})
  .then(docRef => {
      setErrorNote('');
      console.log("A New Document Field has been added to an existing document");
  })
  .catch(error => {
      console.log(error);
      setErrorNote(error.message);

  })
}

export async function SignalNote(idNote){

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

export async function addLikeNote(idUs,idNote,idCont){

  console.log('note id : '+idCont);
  const docRef = doc(db, "notes", idNote);

  //Filter à la lecture pour savoir combien de likes pour une note 
  //Filtrer pour savoir si déjà liké ou pas

  dataArray = {
    idContent: idCont,
    idUser : idUs
  }

  console.log('array : '+JSON.stringify(dataArray));

  await updateDoc(docRef,{likes: arrayUnion(dataArray)})
  .then(docRef => {
      setErrorNote('');
      console.log("A New Document Field has been added to an existing document");
  })
  .catch(error => {
      console.log(error);
      setErrorNote(error.message);

  })
}