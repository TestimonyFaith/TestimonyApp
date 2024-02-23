import { useState } from "react";


const [errorUser,setErrorUser] = useState('');
const [userId, setUserId] = useState('');

var bookAbb = '';
var testNum = 0;
var numChap = 0;
var numVerse = 0;
var urlImage ='';
var textVerse = '';
var uriImage = '';

VersesBuffer = []

export function setBook(bookAbbrev,testament){
    bookAbb = bookAbbrev;
    testNum = testament;
}

export function getBook(){
    return bookAbb;
}

export function getNumtest(){
    return testNum;
}

export function setChapter(nChap){
    numChap = nChap;
}

export function setImage(url){
    urlImage = url;
}

export function getChapter(){
    return numChap;
}

export function setVerse(nVerse){
    numVerse = nVerse;
    VersesBuffer.push({
        bookab:bookAbb,
        chapter:numChap,
        verse:numVerse
    })
}

export function getVerse(){
    return numVerse;
}

export function getReference(){
    return VersesBuffer;
}

export function getUrlImage(){
    return urlImage;
}

export function setTextVerse(text){
    textVerse = text;
}

export function getTextVerse(){
    return textVerse;
}

export function setImageUri(URI){
    uriImage = URI;
}

export function getImageUri(){
    return uriImage;
}

export function cleanBuffer(){
    
     bookAbb = '';
     numChap = 0;
     numVerse = 0;
     urlImage ='';
     textVerse = '';
     uriImage = '';
     VersesBuffer = []

}