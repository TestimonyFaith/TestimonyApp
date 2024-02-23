import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, confirmPasswordReset, sendPasswordResetEmail, updatePassword, updateEmail, deleteUser } from "firebase/auth";
import { doc, setDoc, getDoc,addDoc, collection, query, where, getDocs,updateDoc,Document, deleteDoc  } from "firebase/firestore"; 
import { db,auth,storage } from "../firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState } from "react";


{/* api key : MNUPwQOrJ0xmHwswiiQeSl4aZiVuJ43IC3CVVPUk9dj09VSYkvwc12Rl */}

export async function getImage(){
    try {
        const response = await fetch(
            "https://api.pexels.com/v1/search?query=nature&per_page=10",{
                method: 'GET',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': 'MNUPwQOrJ0xmHwswiiQeSl4aZiVuJ43IC3CVVPUk9dj09VSYkvwc12Rl'
                }
            }
        );
        const json = await response.json();
        return json;
      } catch (error) {
        console.error(error);
      }
}