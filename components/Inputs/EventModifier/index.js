import { View,Text,Image } from "react-native";
import { ScrollView,FlatList, TextInput } from "react-native-gesture-handler";
import { TouchableOpacity, ActivityIndicator } from "react-native";
import {COLORS,icons,images,SIZES} from '../../../constants';
import styleCom from '../../../styles/common'
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import  styleFont from '../../../styles/fonts';
import { Avatar } from '@rneui/themed';
import { ListItem,CheckBox,Tab, TabView } from '@rneui/themed';
import { Badge } from '@rneui/themed';

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc,  query, where, getDocs, collection } from "firebase/firestore";
import {auth,db} from "../../../firebase"
import * as eventBackend from '../../../backend/Event'
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as bufferVerse from '../../../backend/buffer/bufferVerseSelector'

import Toast from 'react-native-root-toast';
import { useIsFocused } from "@react-navigation/native";
import { getImage } from "../../../backend/imagePost";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, uploadString,listAll } from "firebase/storage";
import * as uuid from "uuid";
import AsyncStorage from '@react-native-async-storage/async-storage';


const EventWriter = ({navigation,route}) =>{

    {/*
{Avatar,Content, nbPrayer, Comments, nbSharings, userName, userIdent, imgContent}
*/}
  const [resQuery, setResQuery] = useState([]);
  const [showActivty , setShowActivity] = useState(false);
  const [imgEvent, setImgEvent] = useState([])
  const [textEvent,setTextEvent] = useState('')
  const [links,setLinks] = useState([])
  const [verses,setVerses] = useState([])

  {/* Show widget / framework  */}
  const [showLinks,setShowLinks]=useState(false)
  const [checked, setChecked] = useState(true);
  const [themeId,setThemeId] = useState('');
  const [checkedTheme, setCheckedTheme] = useState([false,false,false,false,false,false]);   
  const [step, setStep] = useState(0); 

  const [showMessage, setShowMessage]=useState(true);
  const [showTheme, setShowTheme]=useState(false);
  const [imgUrlFound, setImgUrlFound]=useState(false);
  const [imgUrl, setImgUrl]=useState([]);
  const [imgFire,setImgFire]=useState([]);


  const isFocused = useIsFocused();

  function setCheckedLine(idLine){
      var arrCheck = []
      for(let r=0;r<DATA.length;r++){
          arrCheck.push(false)
      }
      arrCheck[idLine] = true;
      setCheckedTheme(arrCheck);
      setStep(idLine);
      setThemeId(idLine);

  }

  const toggleCheckbox = (id) => {
    setChecked(!checked)
  }


  DATA = [
    {id:0,theme:'Guérison'},
    {id:1,theme:'Délivrance'},
    {id:2,theme:'Paix'},
    {id:3,theme:'Amour'},
    {id:4,theme:'Justice'},
    {id:5,theme:'Maîtrise de soi'}
  ]



useEffect(()=>{
  getImage();
  getEventData(route.params.idEvent);
},[isFocused])

function getEventData(idEvent){
    arrUrl = [];

    eventBackend.SearchEventById(idEvent)
    .then((arrEvent)=>{
        setResQuery(arrEvent);
        for(let i =0;i<arrEvent[0].images.length;i++){
            arrUrl.push({
                id:i,
                url:arrEvent[0].images[i]
              })
        }
        if(arrEvent[0].images.length>0){
            setImgUrlFound(true);
        }
        setImgUrl(arrUrl);
        setTextEvent(arrEvent[0].content);
    })
}

const Item = ({id,theme}) => (
    <ListItem bottomDivider >
    <CheckBox
      checked={checkedTheme[id]}
      onPress={()=>{setCheckedLine(id)}}
      iconType="material-community"
      checkedIcon="checkbox-outline"
      uncheckedIcon={'checkbox-blank-outline'}
    />
    <ListItem.Content>
      <ListItem.Title>{theme}</ListItem.Title>
    </ListItem.Content>
  </ListItem>
  );


  const ImageSelected = ({id, url}) => (

    <View style={{flex:1,flexDirection:'column',alignItems:'center',justifyContent:'center',marginLeft:10}}>
        <Image source={{uri:url}} style={{minHeight:100,padding:10,marginTop:20,minWidth:100}} />
            <TouchableOpacity style={{backgroundColor:COLORS.green, borderRadius:15,minHeight:30,maxHeight:30,minWidth:30,maxWidth:30,alignItems:'center',justifyContent:'center'}} onPress={()=>{
                                //remove image from the row
                                deletImg(id)
                        }}>
                  <Image style={{maxWidth:20,maxHeight:20,minWidth:20,minHeight:20}} source={require('../../../assets/icons/trash.png')} />
            </TouchableOpacity>
    </View>

  );

  async function getImage(){
    arrUrl = imgUrl;
    if(bufferVerse.getImageUri() != undefined && bufferVerse.getImageUri() != ''){
      console.log(bufferVerse.getImageUri())
        setImgUrlFound(true);
        arrUrl.push({
          id:imgUrl.length,
          url:bufferVerse.getImageUri()
        })
        setImgUrl(arrUrl);
        bufferVerse.cleanBuffer();
    }else if(imgUrl.length>0){
      setImgUrlFound(true);
    }
    else{
        setImgUrlFound(false);
    }
  }

  function deletImg(id){
      console.log('delete img '+imgUrl.length)
      var arrImg = imgUrl;
      arrImg.splice(id,1);
      setImgUrl(arrImg);
      console.log('delete img after '+imgUrl.length)
      navigation.navigate('ContentWriter',{fromPage:'ContentWriter'});
  }

  const pickAvatar = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection : true,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });


    console.log(result);

    if (!result.canceled) {
      const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, { encoding: 'base64' });
      setImgEvent(result.assets);
      arrUrl = imgUrl;

      for(let i=0;i<result.assets.length;i++){
        arrUrl.push({
          id:imgUrl+i,
          url:result.assets[i].uri
        })
        
      }

      setImgUrlFound(true);
      setImgUrl(arrUrl);

      Toast.show('Votre image a été chargée', Toast.SHORT);
    }
  };

  const downloadImgs = async()=>{

    setShowActivity(true);
    var arrImgFiebase = [];
    var imgDownloaded = 0;

    for(let i=0;i<imgUrl.length;i++){

      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", imgUrl[i].url, true);
        xhr.send(null);
      });
    
      console.log('blob OK : ');
    
      const fileRef = ref(getStorage(), '/events/'+uuid.v4());
    
      // We're done with the blob, close and release it    
      const metadata = {
        contentType: 'image/jpeg',
      };      
    
      const uploadTask = uploadBytesResumable(fileRef,blob,metadata);
    
      uploadTask.on("state_changed",
        (snapshot) => {
          const progressMath =
            Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            //setProgress(progressMath)
            //setDownloadFileOnGoing(true);
          
        },
        (error) => {
          alert(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
          .then(async(downloadURL) => {
              arrImgFiebase.push(downloadURL);
              imgDownloaded++;
              console.log('get url : '+downloadURL+' '+imgUrl.length+' '+imgDownloaded);

              if(imgDownloaded == imgUrl.length){
                setImgFire(arrImgFiebase);
                updateEvent();
              }
 
          })
        })
    };



  }
  
  const updateEvent = async () =>{

    console.log('ADD EVENT !')
    const value = await AsyncStorage.getItem('USER_EMAIL')
    if(value !== null){

        var dataToUpdate = {
            idUser : value,
            content : textEvent,
            likes:resQuery[0].likes,
            comments:resQuery[0].comments,
            share:resQuery[0].share,
            links:resQuery[0].links,
            photo:imgFire,
            verses:resQuery[0].verses,
            theme: resQuery[0].theme,
            warning: resQuery[0].warning,
            date:moment().format("DD/MM/YYYY")
        }

        await eventBackend.UpdateEventContent(route.params.idEvent,dataToUpdate)
        .then(()=>{

          //------------------------------
          //UPLOAD IMAGE if img verse created !!!!!
          //-----------------------------

            setShowActivity(false);
            let toast = Toast.show('Evenement modifié', {
                duration: Toast.durations.LONG,
              });
        
              // You can manually hide the Toast, or it will automatically disappear after a `duration` ms timeout.
              setTimeout(function hideToast() {
                Toast.hide(toast);
              }, 2000);
            })
          .catch((error) => {
            let toast = Toast.show(error.message, {
              duration: Toast.durations.LONG,
            });
      
            // You can manually hide the Toast, or it will automatically disappear after a `duration` ms timeout.
            setTimeout(function hideToast() {
              Toast.hide(toast);
            }, 500);
            setError(error.message);
          });
          navigation.navigate('Home');
        }
  }



    return (
        <View style={{flex:1,flexDirection:"column",backgroundColor:'#fff',padding:0,alignItems:"center",padding:10,borderRadius:20,marginBottom:10}}>
            
            {/* Header card */}
            <View style={{flex:1,flexDirection:"row"}}>
                        <Text style={{fontSize:14,color:COLORS.green}}># Modifier l'événement</Text>
            </View>

            {showActivty&&
              <View style={{flex:1,flexDirection:"column",alignItems:"center"}}>
                  <ActivityIndicator size="large" color={COLORS.green} />
                  <Text style={styleFont.message}>Modification en cours ...</Text>
              </View>
            }

            <View style={{flex:1,flexDirection:"column",alignItems:'center',justifyContent:'center',padding:10,gap:10,minHeight:'40%',maxWidth:'90%'}}>
           
            { !imgUrlFound&&<Text style={{fontSize:12,color:'#dedede',paddingBottom:0}} >
                Illutre tes propos par une image ou un verset. 
              </Text>
            }
            

            { imgUrlFound&&
                          
                          <ScrollView style={{minWidth:"100%"}} >
                            <FlatList
                                data={imgUrl}
                                renderItem={({item}) => <ImageSelected id={item.id} url={item.url} />}
                                keyExtractor={item => item.id}
                                numColumns={3}
                                style={{width:"100%"}}
                            />
                          </ScrollView>
          }

              {/* Content card */}
              <View style={{flex:1,flexDirection:"row",alignItems:'center',justifyContent:'center',padding:10,marginBottom:10,minWidth:'90%', maxWidth:'90%',backgroundColor:COLORS.green, borderRadius:20,minHeight:30,maxHeight:30}}>
                <View style={{flex:1,flexDirection:"row",alignItems:'center',justifyContent:'center',padding:5,margin:5,gap:5,minWidth:'20%', maxWidth:'20%',maxHeight:20,minHeight:20}}>

                        <TouchableOpacity onPress={()=>{
                                pickAvatar()
                        }}>
                            <Image style={{width:20,height:20}} source={require('../../../assets/icons/image.png')} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={()=>{
                                navigation.navigate('CameraPage')
                        }}>
                            <Image style={{width:20,height:20}} source={require('../../../assets/icons/photo-camera.png')} />
                        </TouchableOpacity>

                        {/* Developper un widget pour ajouter un verse avec l'API */}
                        <TouchableOpacity onPress={()=>{
                               navigation.navigate('BookSelector',{fromPage:'ContentWriter'})

                        }}>
                            <Image style={{width:20,height:20}} source={require('../../../assets/icons/book.png')} />
                        </TouchableOpacity>
              </View>
              </View>
            </View>

            <View style={{width:'100%',alignItems:"center",justifyContent:'center',minHeight:'40%'}}>

              <View style={{flex:1,flexDirection:'row',width:'100%',height:'10%'}}>

                        <TouchableOpacity onPress={()=>{
                          setShowTheme(false)
                          setShowMessage(true)
                        }} style={[{backgroundColor:COLORS.green,minWidth:'50%',height:50,alignItems:'center',justifyContent:'center'},showMessage&&{borderBottomWidth:2,borderBottomColor:'#fff'}]}>
                          <Text style={{fontSize:12,color:'#fff'}}>Message</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={()=>{
                          setShowTheme(true)
                          setShowMessage(false)
                        }} style={[{backgroundColor:COLORS.green,minWidth:'50%',height:50,alignItems:'center',justifyContent:'center'},showTheme&&{borderBottomWidth:2,borderBottomColor:'#fff'}]}>
                          <Text style={{fontSize:12,color:'#fff'}}>Theme</Text>
                        </TouchableOpacity>

              </View>

                  {showMessage&&<TextInput onChangeText={(text)=>{
                      setTextEvent(text)
                    }}
                      style={{backgroundColor:'none',width:'100%',height:'auto',backgroundColor:'#fff',minHeight:150,borderRadius:10,maxHeight:200,padding:20}} 
                      multiline={true} 
                      value={textEvent}
                      placeholder="Raconte nous ce que tu as vécu ..."/>
                  }

                  {showTheme&&<ScrollView style={{width:'90%',height:'auto',minHeight:150,maxHeight:200}}>
                    <FlatList 
                      data={DATA}
                      renderItem={({item}) => <Item id={item.id} theme={item.theme}  />}
                      keyExtractor={item => item.id}
                    />
                  </ScrollView>
                  }

              
            </View>

            <TouchableOpacity onPress={()=>{
                    downloadImgs()
                }} 
                style={{backgroundColor:COLORS.green,height:40,alignItems:'center',justifyContent:"center",borderRadius:10,width:"90%"}}>
                    <Text style={{color:"#fff",padding:10}}>Ajouter</Text>
            </TouchableOpacity>

        </View>
    );
}
export default EventWriter;