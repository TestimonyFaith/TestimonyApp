import { View,Text,Image,ImageBackground } from "react-native";
import { ScrollView,FlatList, TextInput } from "react-native-gesture-handler";
import { TouchableOpacity, ActivityIndicator } from "react-native";
import {COLORS,FONT,icons,images,SIZES} from '../../../constants'
import styleCom from '../../../styles/common'
import { SafeAreaView, useSafeAreaFrame } from "react-native-safe-area-context";
import { useState, useEffect, useRef } from "react";
import  styleFont from '../../../styles/fonts';
import { Avatar } from '@rneui/themed';
import { ListItem } from '@rneui/themed';
import { Badge } from '@rneui/themed';
import { Tab } from "@rneui/base";

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc,  query, where, getDocs, collection } from "firebase/firestore";
import {auth,db} from "../../../firebase"
import * as convBackEnd from '../../../backend/Conversation'

import * as bufferVerse from '../../../backend/buffer/bufferVerseSelector'
import imgAPI from '../../../backend/imagePost'
import { captureRef } from 'react-native-view-shot';
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from 'expo-media-library';

const ImgSelector = ({navigation,route}) =>{

    var dataImgAPI = [];
    const [imgSelected,setImgSelected]=useState(false);
    const [imgUrl, setImgUrl]=useState('');
    const [imgAPI,setImgAPI]=useState([]);
    const [verseText,setVerseText]=useState('');
    const [verseRef, setVerseRef]=useState('');
    const [nbPage,setNbPage]=useState(2);

    const[swatchesOnly,setSwatchesOnly]=useState(false);
    const[colorText,setColorText]=useState('#000000');

    const [status, requestPermission] = MediaLibrary.usePermissions();
    const imageRef = useRef();

    if (status === null) {
      requestPermission();
    }
    
    useEffect(()=>{
        async function getImage(){
          try {
              const response = await fetch(
                  "https://api.pexels.com/v1/search?query=nature&page=1&per_page=20",{
                      method: 'GET',
                      headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': process.env.EXPO_PUBLIC_IMG_API
                      }
                  }
              );
              const json = await response.json();

              for(let i =0;i<json.photos.length;i++){
                dataImgAPI.push({id:i,url:json.photos[i].src.large})
              }

              setImgAPI(dataImgAPI);
              bufferVerse.setImage(dataImgAPI[0].url);
              setImgUrl(dataImgAPI[0].url);
              setImgSelected(true);
              setVerseText(bufferVerse.getTextVerse());
              var chap = parseInt(bufferVerse.getChapter())+1;
              setVerseRef(bufferVerse.getBook()+' '+chap+":"+bufferVerse.getVerse())
    

              console.log('photos : ', JSON.stringify(dataImgAPI))

            } catch (error) {
              console.error(error);
            }
      
        }
      getImage();
    },[])

    const onSaveImageAsync = async () => {
     
        await captureRef(imageRef, {
          quality: 1,
        }).then(async(localUri)=>{
            console.log('local URI : '+localUri);
            await MediaLibrary.saveToLibraryAsync(localUri)
            .then(()=>{
              console.log('image saved');
              bufferVerse.setImageUri(localUri);
              navigation.navigate(route.params.fromPage,{fromPage:'ContentWriter'});
            })
          })
    
    };

    async function fetchMore(){
      try {
          const response = await fetch(
              'https://api.pexels.com/v1/search?query=nature&page='+nbPage+'&per_page=20',{
                  method: 'GET',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': process.env.EXPO_PUBLIC_IMG_API
                  }
              }
          );
          const json = await response.json();
          dataImgAPI=imgAPI;
          for(let i =0;i<json.photos.length;i++){
            dataImgAPI.push({id:i,url:json.photos[i].src.large})
          }

          setImgAPI(dataImgAPI);

          console.log('photos : ', JSON.stringify(dataImgAPI))
          console.log('data : ' + JSON.stringify(Data))

          setNbPage(nbPage+1);

        } catch (error) {
          console.error(error);
        }




  
    }
    


const ImageTile = ({url}) => (

    <TouchableOpacity style={{height:'auto',width:'35%'}} onPress={
        ()=>{
          bufferVerse.setImage(url);
          setImgUrl(url);
          setImgSelected(true);
          setVerseText(bufferVerse.getTextVerse());
          var chap = bufferVerse.getChapter()+1;
          setVerseRef(bufferVerse.getBook()+' '+chap+":"+bufferVerse.getVerse())
        }
    }>
        <Image source={{uri:url}} style={{width:'100%',aspectRatio:1/1}} />
    </TouchableOpacity>

  );

    {/*
{Avatar,Content, nbPrayer, Comments, nbSharings, userName, userIdent, imgContent}
*/}
  const [resQuery, setResQuery] = useState([]);
  const [showActivty , setShowActivity] = useState(false);
  const [sizePolice, setSizePolice]=useState(14);
  const [famillyPolice,setFamillyPolice]=useState('');
  
  const policeAvailable = [

    {id:0,fontName:FONT.RobotoBlack},
    {id:1,fontName:FONT.RobotoLight},
    {id:2,fontName:FONT.RobotoMedium},
    {id:3,fontName:FONT.RobotoRegular},
    {id:4,fontName:FONT.RobotoSlabBlack},
    {id:5,fontName:FONT.RobotoSlabBold},
    {id:6,fontName:FONT.RobotoSlabExtraBold},
    {id:7,fontName:FONT.RobotoSlabLight},
    {id:8,fontName:FONT.RobotoSlabMedium},
    {id:9,fontName:FONT.dmsBold},
    {id:10,fontName:FONT.dmsMedium},
    {id:11,fontName:FONT.dmsRegular},
    {id:12,fontName:FONT.calibri},
    {id:13,fontName:FONT.playfairBlack},
    {id:14,fontName:FONT.playfairBold},
    {id:15,fontName:FONT.playfairMedium},
    {id:16,fontName:FONT.playfairRegular},
    {id:17,fontName:FONT.playfairSemiBold},

]

    return (
        <SafeAreaView style={{flex:1,flexDirection:"column",padding:0,alignItems:"center",padding:10,gap:10}}>

            {/* Header */}
            <View style={{flex:1,flexDirection:'row',maxHeight:50,minHeight:50,justifyContent:'center',alignItems:'center',minWidth:'100%',maxWidth:'100%',borderBottomColor:COLORS.green,borderBottomWidth:2}}>
                <Text style={styleFont.message}>Partage ton verset</Text>
                    <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',marginLeft:'auto',padding:10,gap:10}}>
                </View>
            </View>

          <ScrollView contentContainerStyle={{minWidth:'90%',alignItems:'center',justifyContent:'center'}}>
            

          <View style={{flex:1,flexDirection:'column',alignItems:'center',justifyContent:"center"}}>
            <Text style={styleFont.title}>Visualisation</Text>
            <Text style={styleFont.subtitle}>Visualise le rendu final</Text>
            

            {imgSelected&& 
              <ViewShot ref={imageRef} options={{ fileName: "Your-File-Name", format: "jpg", quality: 0.9 }} style={{minHeight:'25%',maxHeight:'25%',padding:10,marginTop:20,minWidth:'90%'}}>
                <ImageBackground resizeMode="cover" imageStyle={{ borderRadius: 25,minWidth:'90%',aspectRatio:1/1}} style={{flex: 1,justifyContent:"center",alignItems:'center'}} source={{uri:bufferVerse.getUrlImage()}} >
                  <Text style={{color:colorText,padding:10,fontFamily:famillyPolice}}>{verseText}</Text>
                  <Text style={[styleFont.verseRef,{ color:'#fff' } ]}>{verseRef}</Text>
                </ImageBackground>
              </ViewShot>
            }

            <Text style={styleFont.title}>Fond de l'image</Text>
            <Text style={styleFont.subtitle}>Choisi le fond de ton image</Text>

                            
            {/* Content card */}
            <ScrollView contentContainerStyle={{flex:1,flexDirection:"column",padding:10,minWidth:'100%'}}>

                <FlatList                   
                  data={imgAPI}
                  numColumns={3}
                  renderItem={({item}) => <ImageTile url={item.url} />}
                  keyExtractor={item => item.id}
                  style={{minWidth:"100%",gap:10,maxHeight:300}}
                  onEndReached={()=>{
                    console.log('end reached => fetch more');
                    fetchMore();
                  }} />

            </ScrollView>

            <Text style={styleFont.title}>Police d'écriture</Text>
            <Text style={styleFont.subtitle}>Choisi la police</Text>

            <ScrollView contentContainerStyle={{flex:1,flexDirection:"column",padding:10,minWidth:'90%'}}>
                        <FlatList                   
                            data={policeAvailable}
                            renderItem={({item}) => 
                                <TouchableOpacity onPress={()=>{
                                    setFamillyPolice(item.fontName);
                                }}>
                                    <Text style={{fontFamily:item.fontName,fontSize:14}}>{item.fontName}</Text>
                                </TouchableOpacity>
                            }
                            keyExtractor={item => item.id}
                            style={{width:"100%",gap:10,maxHeight:200}} 
                        />
            </ScrollView>

             {/* ------------------------------------ */}
             <Text style={styleFont.title}>Couleur du texte</Text>
            <Text style={styleFont.subtitle}>Choisi la couleur </Text>

            <ColorPicker
                    color={COLORS.green}
                    swatchesOnly={swatchesOnly}
                    onColorChange={()=>{}}
                    onColorChangeComplete={(colorHexa)=>{
                        setColorText(colorHexa);
                  }}
                    thumbSize={40}
                    sliderSize={40}
                    palette={[COLORS.green,'#97C1A9','#A3E1DC','#F5D2D3','#F6EAC2']}
                    noSnap={true}
                    row={false}
                    swatchesLast={true}
                    swatches={true}
                    discrete={false}
                    wheelLodingIndicator={<ActivityIndicator size={40} />}
                    sliderLodingIndicator={<ActivityIndicator size={20} />}
                    useNativeDriver={false}
                    useNativeLayout={false}
                />
                
                {swatchesOnly&&<TouchableOpacity style={styleCom.button} onPress={()=>{
                  setSwatchesOnly(false)
                }}>
                  <Text style={styleFont.message}>
                    Voir plus 
                  </Text>
                </TouchableOpacity>}

                {!swatchesOnly&&<TouchableOpacity style={styleCom.button} onPress={()=>{
                  setSwatchesOnly(true)
                }}>
                  <Text style={styleFont.message}>
                    Voir moins
                  </Text>
                </TouchableOpacity>}

            {/* ------------------------------------ */}


            <TouchableOpacity onPress={()=>{
                    onSaveImageAsync();
                }} 
                style={{backgroundColor:COLORS.green,height:40,alignItems:'center',justifyContent:"center",borderRadius:10,width:"90%",marginBottom:20}}>
                    <Text style={{color:"#fff",padding:10}}>Ajouter</Text>
            </TouchableOpacity>

            </View>

          </ScrollView>

        </SafeAreaView>
    );
}
export default ImgSelector;