import { useState } from "react";


const [errorUser,setErrorUser] = useState('');
const [userId, setUserId] = useState('');

//Variable Info page 
var avatar = "";
var nom = "";
var prenom = "";
var pseudo = "";
var Phone = "";
var Email = "";
var Password = "";
var ConfirmPassword = "";

//Variable Step page 
var idStep ="";

//Variable Testimony page
var before ="";
var during ="";
var after = "";
var dateBefore = "";
var dateDuring = "";
var dateAfter = "";
var messageOther ="";
var versesBuffer=[];


export function setInfoPage(IName, IFirstname, IAvatar, IPseudo, IPhone, IEmail,IPassword,IConfirmPassword){
    nom = IName
    prenom = IFirstname 
    avatar = IAvatar
    pseudo = IPseudo 
    Phone = IPhone 
    Email = IEmail 
    Password = IPassword
    ConfirmPassword = IConfirmPassword
}


export function setStepPage(IidStep){
    idStep = IidStep
}

export function setTestimonyPage(IBefore, IDuring, IAfter, IMessage, IVerses, IDatBefore, IDatDuring, IDatAfter){
    before = IBefore 
    during = IDuring 
    after = IAfter 
    messageOther = IMessage 
    dateBefore = IDatBefore
    dateDuring = IDatDuring
    dateAfter = IDatAfter
}

export function setTestimonyBufferVerse(abbrev,chapter,verseText,numVerse){
    versesBuffer.push({
        vAbbrev:abbrev,
        vChap:chapter,
        vVerseText: verseText,
        vNumVerse: numVerse
    })
}

export function getVerseBuffer(){
    return versesBuffer;
}

export function cleanVerseBuffer(){
    versesBuffer = [];
}

export function getAvatar(){
    return avatar;
}

export function getEmail(){
    return Email;
}

export function getPassword(){
    return Password;
}

export function getConfirmPassword(){
    return ConfirmPassword;
}

export function getAllInfo(){

    arrInfo = {
        nameProfil:nom,
        firstnameProfil:prenom,
        imgProfil:avatar,
        pseudoProfil:pseudo,
        phoneProfil:Phone,
        emailProfil:Email,
        idStepProfil:idStep,
        beforeProfil:before,
        duringProfil:during,
        afterProfil:after,
        messageProfil:messageOther,
        versesProfil:verses,
        dateBfProfil:dateBefore,
        dateDgProfil:dateDuring,
        dateAfProfil:dateAfter
    }

    return arrInfo;
}
