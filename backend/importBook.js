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

import colombe from '../backend/bible/Weebly/fr/French Colombe.json'
//import segond from '../backend/bible/Weebly/fr/French Louis Segond (1910).json'
//import segond21 from '../backend/bible/Weebly/fr/French Bible Segond 21 (S21).json'
import darby from '../backend/bible/Weebly/fr/French Darby.json'
import PDV from '../backend/bible/Weebly/fr/French Parole de Vie.json'

const [errorBook,setErrorBook] = useState('');
const [currentVersion,setCurrentVersion] = useState({});
const arrData = [];

const listVersions = [
    {lang:'fr',
    allVersions:[
    {
        id:0,
        name:'Colombe',
        content:colombe
    },
    {
        id:3,
        name:'Darby',
        content:darby
    },{
        id:4,
        name:'Parole de vie',
        content:PDV
    }]
    }
]


export async function getAllVersions(lang){

    listLang = listVersions.filter((b)=>{return b.lang == lang})
    return listLang[0].allVersions;
    
}

export async function getAllBooks(lang,vers){
    var arrBooks = [];

    console.log('data input : '+lang+' '+vers);

    listLang = listVersions.filter((b)=>{return b.lang == lang})
    //console.log('list lang : '+JSON.stringify(listLang));
    listBook = listLang[0].allVersions.filter((v)=>{return v.name == vers})
    //Abbreviation,Publisher,Language,VersionDate,Description,Introduction,IsCompressed,IsProtected,Guid,Testaments,Text
    // => console.log('all books : '+Object.keys(listBook[0].content));
    console.log('all books : '+Object.keys(listBook[0].content.Testaments[0]));
    
    listBook[0].content.Testaments[0].Books.forEach(e => {
        arrBooks.push({id:e.ID,text:e.Text,testament:'Ancien'})
    });
    listBook[0].content.Testaments[1].Books.forEach(e => {
        arrBooks.push({id:e.ID,text:e.Text,testament:'Nouveau'})
    });

    console.log('all books : '+JSON.stringify(arrBooks));

    return arrBooks;
    
}

export async function getAllChapters(lang,vers,book,testament){

    console.log('data input chapters : '+lang+' '+vers+' '+book+' '+testament);

    //Testament is 0 or 1
    var arrChaps = [];

    listLang = listVersions.filter((b)=>{return b.lang == lang})
    //console.log('list lang : '+JSON.stringify(listLang));
    listBook = listLang[0].allVersions.filter((v)=>{return v.name == vers})
    //Abbreviation,Publisher,Language,VersionDate,Description,Introduction,IsCompressed,IsProtected,Guid,Testaments,Text
    // => console.log('all books : '+Object.keys(listBook[0].content));
    listChap = listBook[0].content.Testaments[testament].Books.filter((b)=>{return b.Text == book})
    console.log('all books : '+Object.keys(listChap[0].Chapters));
    console.log('all chapters : '+JSON.stringify(listChap[0].Chapters));

    var keys = Object.keys(listChap[0].Chapters);
    var arrChap = [];
    keys.forEach((k)=>{
        //console.log('push : '+k)
        arrChap.push({
            num:k
        })
    })

    return arrChap;



}

export async function getAllVerses(lang,vers,book,chapters,testament){

    console.log('get all verses : '+lang+' '+vers+' '+book+' '+chapters+' '+testament)
        //Testament is 0 or 1
        var arrVerses = [];

        listLang = listVersions.filter((b)=>{return b.lang == lang})
        //console.log('list lang : '+JSON.stringify(listLang));
        listBook = listLang[0].allVersions.filter((v)=>{return v.name == vers})
        //Abbreviation,Publisher,Language,VersionDate,Description,Introduction,IsCompressed,IsProtected,Guid,Testaments,Text
        // => console.log('all books : '+Object.keys(listBook[0].content));
        listChap = listBook[0].content.Testaments[testament].Books.filter((b)=>{return b.Text == book})
        console.log('all keys : '+Object.keys(listChap[0].Chapters[chapters].Verses));
        //console.log('all chapters : '+JSON.stringify(listChap[0].Chapters.length));
        console.log('all verses : '+JSON.stringify(listChap[0].Chapters[chapters].Verses[8]));

        return listChap[0].Chapters[chapters].Verses;
}

export async function searchVerse(lang,vers,book,chapters,numVerse,testament){
            //Testament is 0 or 1
            var arrChaps = [];

            listLang = listVersions.filter((b)=>{return b.lang == lang})
            //console.log('list lang : '+JSON.stringify(listLang));
            listBook = listLang[0].allVersions.filter((v)=>{return v.name == vers})
            //Abbreviation,Publisher,Language,VersionDate,Description,Introduction,IsCompressed,IsProtected,Guid,Testaments,Text
            // => console.log('all books : '+Object.keys(listBook[0].content));
            listChap = listBook[0].content.Testaments[testament].Books.filter((b)=>{return b.Text == book})
            listV = listChap[0].Chapters[chapters].Verses.filter((b)=>{return b.ID == numVerse})

            console.log('Verse : '+JSON.stringify(listV[0]));
            return listV[0];
}

export async function searchAllVersionVerse(lang,book,chapters,numVerse,testament){
    //Testament is 0 or 1
    var arrVersVersion = [];

        listLang = listVersions.filter((b)=>{return b.lang == lang})
        listLang[0].allVersions.forEach((lv)=>{

            //Abbreviation,Publisher,Language,VersionDate,Description,Introduction,IsCompressed,IsProtected,Guid,Testaments,Text
            // => console.log('all books : '+Object.keys(listBook[0].content));
            listChap = lv.content.Testaments[testament].Books.filter((b)=>{return b.Text == book})
            listV = listChap[0].Chapters[chapters].Verses.filter((b)=>{return b.ID == numVerse})
            arrVersVersion.push({
                vers:lv.name,
                content:listV[0]
            })
            console.log('Verse all version '+lv.name+' : ' +JSON.stringify(listV[0]));

        })
    return arrVersVersion;
}

export async function readImgChap(bookId,chapId){
    arrDataConv = []
    var owner = false;
    
    
    const q = query(collection(db, "bifootnotes"),where('bookId',"==",bookId),where('chapRef','==',chapId));
    
    const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async(doc) => {
            console.log(doc.id, " => ", doc.data());

            const json = doc.data();

            arrDataConv.push({
                img:json.imgChap
            })
    })

    return arrDataConv;

}