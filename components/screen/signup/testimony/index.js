import { View,Text,Image,FlatList,Alert } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native";
import {COLORS,icons,images,SIZES} from '../../../../constants';
import styleCom from '../../../../styles/common'
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import  styleFont from '../../../../styles/fonts';
import { StyleSheet } from "react-native";
import { Avatar,ListItem,CheckBox } from '@rneui/themed';

import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc, getDoc,addDoc, collection } from "firebase/firestore"; 
import { db,auth,storage } from "../../../../firebase";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, uploadString,listAll } from "firebase/storage";

import * as ImagePicker from 'expo-image-picker';


import * as FileSystem from 'expo-file-system';

import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

import Toast from 'react-native-root-toast';
import * as UserBack from '../../../../backend/Users'
import * as Testimony from '../../../../backend/Testimony'
import * as bufferSign from '../../../../backend/buffer/bufferSignup'
import * as uuid from "uuid";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useIsFocused } from "@react-navigation/native";
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as testiBackEnd from '../../../../backend/Testimony'


const TestimonyComp = ({ navigation,route }) =>{

  const isFocused = useIsFocused();

  useEffect(() => {

    var arrVerse = bufferSign.getVerseBuffer();

    // write your code here, it's like componentWillMount
    if(arrVerse.length >0){
      if(verseBefore == true){
        console.log('verse before : '+before+' '+arrVerse[0].vVerseText)
        setBefore(before + arrVerse[0].vVerseText+' ( '+arrVerse[0].vAbbrev+' '+ arrVerse[0].vChap+':'+arrVerse[0].vNumVerse+' )')
        setVerseBefore(false)


      }else if(verseDuring == true){
        setDuring(during + arrVerse[0].vVerseText+' ( '+arrVerse[0].vAbbrev+' '+ arrVerse[0].vChap+':'+arrVerse[0].vNumVerse+' )')
        setVerseDuring(false)


      }else if(verseAfter == true){
        setAfter(after + arrVerse[0].vVerseText+' ( '+arrVerse[0].vAbbrev+' '+ arrVerse[0].vChap+':'+arrVerse[0].vNumVerse+' )')
        setVerseAfter(false)

      }else if(verseMessage == true){
        setMessage(message + arrVerse[0].vVerseText+' ( '+arrVerse[0].vAbbrev+' '+ arrVerse[0].vChap+':'+arrVerse[0].vNumVerse+' )')
        setVerseMessage(false)

      }

      bufferSign.cleanVerseBuffer();

    }

    if(route.params.refreshValue === true){
      UserTestimony();
    }
  },[isFocused])

  const [state, setState] = useState(null);

  //hover state
    const [isFocused1, setIsFocused1] = useState(false);
    const [isFocused2, setIsFocused2] = useState(false);
    const [isFocused3, setIsFocused3] = useState(false);
    const [isFocused4, setIsFocused4] = useState(false);
    const [isFocused5, setIsFocused5] = useState(false);
    const [isFocused6, setIsFocused6] = useState(false);
    const [isFocused7, setIsFocused7] = useState(false);
    const [isFocused8, setIsFocused8] = useState(false);
    const [checked, setChecked] = useState(true);
    const toggleCheckbox = () => setChecked(!checked);


    //input state
    const [before, setBefore] = useState('');
    const [during, setDuring] = useState('');
    const [after, setAfter] = useState('');
    const [message, setMessage] = useState('');


    const [date, setDate] = useState(new Date(1598051730000));
    const [dateBefore, setDateBefore] = useState(new Date(1598051730000));
    const [dateDuring, setDateDuring] = useState(new Date(1598051730000));
    const [dateAfter, setDateAfter] = useState(new Date(1598051730000));

    const [datBeforeOk, setDatBeforeOk] = useState(false);
    const [datDuringOk, setDatDuringOk] = useState(false);
    const [datAfterOk, setDatAfterOk] = useState(false);

    const [mode, setMode] = useState('date');
    const [showBefore, setShowBefore] = useState(false);
    const [showDuring, setShowDuring] = useState(false);
    const [showAfter, setShowAfter] = useState(false);

    const [verseBefore,setVerseBefore] = useState(false);
    const [verseDuring,setVerseDuring] = useState(false);
    const [verseAfter,setVerseAfter] = useState(false);
    const [verseMessage,setVerseMessage] = useState(false);

    const [formattedDateBefore,setFormattedDateBefore] = useState('');
    const [formattedDateDuring,setFormattedDateDuring] = useState('');
    const [formattedDateAfter,setFormattedDateAfter] = useState('');

    const [updateTestimony, setUpdateTestimony] = useState(false);
    const [testimonyId, setTestimonyId]=useState('');


    const onChangeDateBefore = (event, selectedDate) => {
      const currentDate = selectedDate;
      console.log('date : '+currentDate)
      setShowBefore(false);
      setDateBefore(currentDate);
      setFormattedDateBefore(moment(currentDate).format("DD/MM/YYYY"));
      setDatBeforeOk(true);
    };

    const onChangeDateDuring = (event, selectedDate) => {
      const currentDate = selectedDate;
      setShowDuring(false);
      setDateDuring(currentDate);
      setFormattedDateDuring(moment(currentDate).format("DD/MM/YYYY"));
      setDatDuringOk(true);

    };

    const onChangeDateAfter = (event, selectedDate) => {
      const currentDate = selectedDate;
      setShowAfter(false);
      setDateAfter(currentDate);
      setFormattedDateAfter(moment(currentDate).format("DD/MM/YYYY"));
      setDatAfterOk(true);

    };
  
  
    const createTwoButtonAlert = () =>
    Alert.alert('Passer', 'Si vous souhaitez passer cette étape le contenu de votre témoignage ne sera pas sauvegarder.', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => {
        navigation.navigate('CongratsSignUp')
      }},
    ]);

    async function saveTestimony(){
        bufferSign.setTestimonyPage(before,during,after,message)
        var dataUpdate = {testimony:true}

        const value = await AsyncStorage.getItem('USER_EMAIL')
        var idUserTmp = '';

        if(value !== null){

          if(updateTestimony === true){

            await UserBack.getUserIdByEmail(value)
            .then(async(idUser)=>{

              idUserTmp = idUser;

              var dataToUpdate = {
                idUser : value,
                date:moment().format("DD/MM/YYYY"),
                phase :{
                  avant : {date:dateBefore,content:before},
                  pendant :{date:dateDuring,content:during},
                  apres:{date:dateAfter,content:after}
                },
                message:message
              }

              await Testimony.UpdateTestimony(testimonyId,dataToUpdate)
              .then(async()=>{
                  console.log('testimony added')

              })
            })

          }else{
            await UserBack.getUserIdByEmail(value)
            .then(async(idUser)=>{
              idUserTmp = idUser;
              await Testimony.CreateTestimony(before,during,after,formattedDateBefore,formattedDateDuring,formattedDateAfter,message,value)
              .then(async()=>{
                  console.log('testimony added')
                  await UserBack.UpdateUser(dataUpdate,idUserTmp).then(()=>{
                              
                  })
              })
            })
          }

        }
      }
    
      async function UserTestimony(){
        const value = await AsyncStorage.getItem('USER_EMAIL')
        await testiBackEnd.SearchTestimonyByEmail(value)
        .then((arrDataTest)=>{

            console.log('data testimony : '+arrDataTest[0].message);

            setBefore(arrDataTest[0].phase.avant.content);
            setDuring(arrDataTest[0].phase.pendant.content);
            setAfter(arrDataTest[0].phase.apres.content);
            setMessage(arrDataTest[0].message);

            setFormattedDateBefore(arrDataTest[0].phase.avant.date);
            setFormattedDateDuring(arrDataTest[0].phase.pendant.date);
            setFormattedDateAfter(arrDataTest[0].phase.apres.date);

            setTestimonyId(arrDataTest[0].id)
            setUpdateTestimony(true);

      })
  
      }
    



    const Item = ({question}) => (
        <ListItem bottomDivider style={{width:"100%"}}>
        <CheckBox
           checked={checked}
           onPress={toggleCheckbox}
           iconType="material-community"
           checkedIcon="checkbox-outline"
           uncheckedIcon={'checkbox-blank-outline'}
         />
        <ListItem.Content>
          <ListItem.Title>{question}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
      );

    DATA = [
        {id:'0',question:''},
        {id:'1',question:''},
        {id:'2',question:''},
        {id:'3',question:''}
    ]

    
    return (
        <View style={{flex:1,backgroundColor:'#fff',justifyContent:"center",padding:10,alignItems:"center",gap:10}}>

        <ScrollView  style={{maxHeight:'90%'}}>

            <Text style={[styleFont.hastag]} >
                Inscription
            </Text>

            <Text style={styleFont.subtitle} >
                Partage ton témoignage !
            </Text>

            <Text style={{fontSize:24,fontStyle:'italic',color:'#000'}} >
                Tu pourras le modifier ou l'écrire par la suite 
            </Text>

            {/* Affiche une erreur de remplissage */}


            <Text style={[styleFont.subHastag,{paddingTop:10,paddingBottom:10}]}>Comment était ta vie avant de connaître le seigneur ? </Text>
            <TextInput 
                onChangeText ={text => {
                  console.log('before : '+text)
                  setBefore(text)
                }}
                value={before}
                style={{backgroundColor:'#DEDEDE',fontSize:12,height:100,padding:10,gap:10}} secureTextEntry={false} multiline={true} inputMode="text" keyboardType="default"
            />
            <TouchableOpacity onPress={()=>{
                      navigation.navigate('BookSelector',{fromPage:'TestiSignUp'})
                      setVerseBefore(true);
                }}>
                  <View style={{flex:1,flexDirection:'row',backgroundColor:COLORS.green,borderRadius:2,gap:10,padding:10}}>
                    <Image style={{width:30,height:30}} source={require('../../../../assets/icons/book.png')} />
                    <Text>Cite un ou plusieurs versets</Text>
                  </View>
            </TouchableOpacity>

            {!datBeforeOk&&<TouchableOpacity style={[styleCom.button,{padding:10}]} onPress={()=>{
                      setShowBefore(!showBefore);
                }}>
                    <Text>Selectionner une date</Text>
            </TouchableOpacity>}
            {datBeforeOk&&          
              <View style={{flex:1,flexDirection:'column'}}>
                <Text style={styleFont.subHastag}>{formattedDateBefore}</Text>
                <TouchableOpacity style={[styleCom.button,{padding:10}]} onPress={()=>{
                      setShowBefore(!showBefore);
                }}>
                    <Text>Modifier la date</Text>
                </TouchableOpacity>
              </View>
            }

            {showBefore && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={dateBefore}
                  mode={mode}
                  is24Hour={true}
                  onChange={onChangeDateBefore}
                />
              )}

            <Text style={[styleFont.subHastag,{paddingTop:10,paddingBottom:10}]}>Comment Dieu est-il intervenu ?</Text>
            <TextInput 
                onChangeText ={text => setDuring(text)}
                value={during}
                style={{backgroundColor:'#DEDEDE',fontSize:12,height:100,padding:10,gap:10}} secureTextEntry={false} multiline={true} inputMode="text" keyboardType="default"
            />
            <TouchableOpacity onPress={()=>{
                      navigation.navigate('BookSelector',{fromPage:'TestiSignUp'})
                      setVerseDuring(true);

                }}>
                  <View style={{flex:1,flexDirection:'row',backgroundColor:COLORS.green,borderRadius:2,gap:10,padding:10}}>
                    <Image style={{width:30,height:30}} source={require('../../../../assets/icons/book.png')} />
                    <Text>Cite un ou plusieurs versets</Text>
                  </View>
            </TouchableOpacity>
            {!datDuringOk&&<TouchableOpacity style={[styleCom.button,{padding:10}]} onPress={()=>{
                      setShowDuring(!showDuring);
                }}>
                    <Text>Selectionner une date</Text>
            </TouchableOpacity>}

            {datDuringOk&&
              <View style={{flex:1,flexDirection:'column'}}>
                <Text style={styleFont.subHastag}>{formattedDateDuring}</Text>
                <TouchableOpacity style={[styleCom.button,{padding:10}]} onPress={()=>{
                      setShowDuring(!showDuring);
                }}>
                    <Text>Modifier la date</Text>
                </TouchableOpacity>
              </View>
            }

            {showDuring && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={dateDuring}
                  mode={mode}
                  is24Hour={true}
                  onChange={onChangeDateDuring}
                />
              )}

            <Text style={[styleFont.subHastag,{paddingTop:10,paddingBottom:10}]}>Comment ta vie a changé après ta conversion ?</Text>
            <TextInput 
                onChangeText ={text => setAfter(text)}
                value={after}
                style={{backgroundColor:'#DEDEDE',fontSize:12,height:100,padding:10,gap:10}} secureTextEntry={false} multiline={true} inputMode="text" keyboardType="default"
            />
            <TouchableOpacity onPress={()=>{
                      navigation.navigate('BookSelector',{fromPage:'TestiSignUp'})
                      setVerseAfter(true);

                }}>
                  <View style={{flex:1,flexDirection:'row',backgroundColor:COLORS.green,borderRadius:2,gap:10,padding:10}}>
                    <Image style={{width:30,height:30}} source={require('../../../../assets/icons/book.png')} />
                    <Text>Cite un ou plusieurs versets</Text>
                  </View>
            </TouchableOpacity>
            {!datAfterOk&&<TouchableOpacity style={[styleCom.button,{padding:10}]} onPress={()=>{
                      setShowAfter(!showAfter);
                }}>
                    <Text>Selectionner une date</Text>
            </TouchableOpacity>}

            {datAfterOk&&
              <View style={{flex:1,flexDirection:'column'}}>
                  <Text style={styleFont.subHastag}>{formattedDateAfter}</Text>
                  <TouchableOpacity style={[styleCom.button,{padding:10}]} onPress={()=>{
                        setShowAfter(!showAfter);
                  }}>
                      <Text>Modifier la date</Text>
                  </TouchableOpacity>
              </View>
            }

            {showAfter && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={dateAfter}
                  mode={mode}
                  is24Hour={true}
                  onChange={onChangeDateAfter}
                />
              )}

            <Text style={[styleFont.subHastag,{paddingTop:10,paddingBottom:10}]}>Quel message aurais-tu pour quelqu'un qui cherche ?</Text>
            <TextInput 
                onChangeText ={text => setMessage(text)}
                value={message}
                style={{backgroundColor:'#DEDEDE',fontSize:12,height:100,padding:10,gap:10}} secureTextEntry={false} multiline={true} inputMode="text" keyboardType="default"
            />
            <TouchableOpacity onPress={()=>{
                      navigation.navigate('BookSelector',{fromPage:'TestiSignUp'})
                      setVerseMessage(true);
                }}>
                  <View style={{flex:1,flexDirection:'row',backgroundColor:COLORS.green,borderRadius:2,gap:10,padding:10}}>
                    <Image style={{width:30,height:30}} source={require('../../../../assets/icons/book.png')} />
                    <Text>Cite un ou plusieurs versets</Text>
                  </View>
            </TouchableOpacity>

          <View style={{flex:1,flexDirection:'row',width:'100%',paddingTop:10,paddingBottom:10}}>
                <TouchableOpacity onPress={ ()=>{ 
                      createTwoButtonAlert()
                }} 
                style={styleCom.buttonSecondary}>
                <Text style={styleCom.textButtonSecondary}>Passer</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={ async()=>{ 
                      await saveTestimony()
                      .then(async()=>{
                        navigation.navigate('UserDetails')
                      })
                }} 
                style={styleCom.buttonThird}>
                    <Text style={styleCom.textButton}>Publier</Text>
                </TouchableOpacity>
          </View>

        </ScrollView>


    </View>
    )
}
export default TestimonyComp;

{/*
                            await Testimony.CreateTestimony(                             
                              arrUser.beforeProfil,
                              arrUser.duringProfil,
                              arrUser.afterProfil,
                              arrUser.dateBfProfil,
                              arrUser.dateDgProfil,
                              arrUser.dateAfprofil,
                              arrUser.messageProfil,
                              arrUser.versesProfil,
                              arrUser.emailProfil
                              )
                              .then(()=>{
                              console.log('This value has been written')
                              let toast = Toast.show('Account has been created', {
                                duration: Toast.durations.LONG,
                              });
                        
                              // You can manually hide the Toast, or it will automatically disappear after a `duration` ms timeout.
                              setTimeout(function hideToast() {
                                Toast.hide(toast);
                              }, 500);
                            })
*/}