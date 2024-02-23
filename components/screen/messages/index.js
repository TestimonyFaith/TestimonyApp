import { View,Text,Image, ActivityIndicator } from "react-native";
import { FlatList, ScrollView, TextInput } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native";
import {COLORS,icons,images,SIZES} from '../../../constants';
import styleCom from '../../../styles/common'
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, createRef, useRef } from "react";
import  styleFont from '../../../styles/fonts';
import { Avatar,Overlay } from '@rneui/themed';
import { ListItem } from '@rneui/themed';
import { Badge } from '@rneui/themed';
import { Tab } from "@rneui/base";

import {ref, uploadBytes, uploadBytesResumable, getStorage,listAll,getDownloadURL} from 'firebase/storage'
import { db,storage } from "../../../firebase";
import moment from 'moment';
import currentUserLogged from "../../../global"
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as msgBackEnd from '../../../backend/Messages';
import * as userBackEnd from'../../../backend/Users';
import Toast from 'react-native-root-toast';

import 'react-native-get-random-values';
import { useIsFocused } from "@react-navigation/native";
import { v4 as uuidv4 } from 'uuid';


const Message = ({navigation, route}) =>{

  const [show, setShow] = useState(false);
  const [showToolbar,setShowToolbar]=useState(false);
  const [showReply, setShowReply] = useState(false);
  const [resMsgs, setResMsgs] = useState([]);
  const [activeMsg, setActiveMsg] = useState('');
  const [msgContent, setMsgContent] = useState('');
  const [imageLoaded, setImageLoaded] = useState([]);
  const [photoBuffer, setPhotoBuffer] = useState(false);
  const [showActivty , setShowActivity] = useState(false);
  const [ownerMessage, setOwnerMessage] = useState(false);
  const [reply, setReply] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyAuthor, setReplyAuthor] = useState('');
  const [picturesBuffer, setPicturesBuffer] = useState(false);
  const content = useRef(null);
  const [listImages,setListImages]=useState([]);
  const [listImages64,setListImages64]=useState([]);
  const [listImagesURI,setListImagesURI]=useState([]);
  const [img,setImg]=useState('');
  const [progress,setProgress] = useState('');
  const [downloadFileOnGoing,setDownloadFileOnGoing]=useState(false);
  const [idMsgImg, setIdMsgImg]=useState('');
  const [lastImg,setLastImg]=useState(false);


  //State nb images 
  const [supImgs,setSupImgs]=useState(false);

  var arrImgs = [];
  var arr64 = [];
  var arrRes = [];

  const isFocused = useIsFocused();

  useEffect(() => {
    // write your code here, it's like componentWillMount
    setShowActivity(true);
    getMessage();
  },[isFocused])


  const activeMessage = async(idMsg) =>{

    await msgBackEnd.ReadMsg(idMsg)
    .then(async (arrayResult)=>{

      console.log('res : '+arrayResult);

      const prenom = arrayResult.user.prenom;
      const contentSrc = arrayResult.content;
      const avatar = arrayResult.user.avatar;

      setReplyAuthor(prenom);
      setReplyContent(contentSrc);

      setShowToolbar(!showToolbar);
      setActiveMsg(idMsg);
      console.log(idMsg);
    })
  }

  const createMessage = async() =>{
    if(reply){
      //Read source message
      console.log('Reply is going to send ...')
      await msgBackEnd.ReadMsg(activeMsg)
      .then(async (arrayResult)=>{

        const prenom = arrayResult.user.prenom;
        const contentSrc = arrayResult.content;
        const avatar = arrayResult.user.avatar;

        console.log(avatar+' '+prenom+' '+contentSrc);
          
          //Create our own reply as new message
          await msgBackEnd.CreateReply(route.params.idConv,msgContent,userBackEnd.getEmail(),listImages,userBackEnd.getName(),userBackEnd.getFirstname(),userBackEnd.getAvatar(),prenom,avatar,contentSrc)
          .then(()=>{

            console.log('written')
               getMessage();
               setMsgContent('');
               content.current.clear();
               replyDesactivate();
          })
      })
    }else{
      // Add a new document in collection "cities"

      //Séparer l'écriture du message et l'upgrade des images 
      // Ecrire le message => récupèrer le ID du message et download les photos après coup. 
      
      setShowActivity(true);
          await msgBackEnd.CreateMsg(route.params.idConv,msgContent,userBackEnd.getEmail(),[],userBackEnd.getName(),userBackEnd.getFirstname(),userBackEnd.getAvatar())
          .then(()=>{
                setMsgContent('');
                content.current.clear();
                setShowActivity(false);
                setPicturesBuffer(false);
                setListImages64([]);
                getMessage();

          })

          console.log('id Ref : '+msgBackEnd.getCurId())


          if(listImages64.length > 0){
            uploadAllImages();
          }
      

  }
 }

 const deleteMessage = async() =>{

  await msgBackEnd.DeleteMsg(activeMsg)
  .then(()=>{
    getMessage();
  })

 }

 const replyActivate = () =>{

  setReply(true);
  setShowReply(true);
  setShowToolbar(false);
 }

 const replyDesactivate = () => {

  setReply(false);
  setShowReply(false);

 }

 const photoDescativate = () =>{
  setListImages([]);
  setPicturesBuffer(false);
 }

 const uploadAllImages = () =>{

  console.log('upload all images ...')
  
  listImagesURI.forEach(async (imageUri,idx)=>{
    console.log('idx : '+idx+' '+listImagesURI.length)
    if(idx === listImagesURI.length - 1){
        setLastImg(true);
        console.log("last idx founded")
    }else{
        setLastImg(false);
        console.log("NOT last idx founded")

    }
     await uploadImagesToStorage(imageUri);
  })

 }

 const uploadImagesToStorage = async(uri) =>{

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
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  console.log('blob OK : ');

  const fileRef = ref(getStorage(), '/msgs/'+route.params.idConv+'/'+uuidv4());

  // We're done with the blob, close and release it    
  const metadata = {
    contentType: 'image/jpeg',
    idMsg : msgBackEnd.getCurId()
  };      

  const uploadTask = uploadBytesResumable(fileRef,blob,metadata);

  uploadTask.on("state_changed",
    (snapshot) => {
      const progressMath =
        Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(progressMath)
        setDownloadFileOnGoing(true);
      
    },
    (error) => {
      alert(error);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref)
      .then(async(downloadURL) => {
        blob.close();
        console.log('url file : '+downloadURL);
        arrRes.push(downloadURL);
        setDownloadFileOnGoing(false);

          //updateMsg with his idRef 
          const dataUpdate = {
            Images:arrRes
          }
          //Back end update func to update images link
          console.log('id msg : '+ uploadTask.snapshot.metadata);
          await msgBackEnd.UpdateMsgContent(msgBackEnd.getCurId(),dataUpdate).then(()=>{
            console.log('Msg updated !')
            setListImages([]);
            setListImagesURI([]);
          })
      });
    }
  );


 }


 const openImagePicker = async() => {
      // No permissions request is necessary for launching the image library
      let resultImg = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        allowsMultipleSelection: true,
        aspect: [4, 3],
        quality: 1.0
     });

      var arrImage = []
  
      if (!resultImg.canceled) {

            await convertAllImagesBase64(resultImg)
            .then(()=>{

                setListImagesURI(arrImgs);
                setPicturesBuffer(true);
                setListImages64(arr64);
                console.log('list 64 : ' +arr64);

            })
      }
 };

 const convertAllImagesBase64 = async(res) =>{

  res.assets.forEach(async(asset)=>{
            
      const base64 = await FileSystem.readAsStringAsync(asset.uri, { encoding: 'base64' })
      var base64Icon = 'data:image/png;base64,'+base64;
      console.log('base64 : '+base64Icon);
      arr64.push({img64:base64Icon});
      arrImgs.push(asset.uri);

 })
 }

 const openCamera = () => {

      {/* 
          Navigate to camera page 
      */}

      navigation.navigate('CamPage',{idMsgConv:route.params.idConv});

};

  const getMessage = async() =>{

    console.log('---------- INIT MSG SCREEN --------')
    console.log('idConv : '+route.params.idConv);
    console.log('uri : '+route.params.uriPix)

    if(route.params.uriPix !== ''){
        setPhotoBuffer(true)
        console.log('uri : '+route.params.uriPix)
    }else{
        setPhotoBuffer(false)
    }

   await msgBackEnd.SearchMsgByIDConv(route.params.idConv)
  .then((arrQueryMsg)=>{
        setResMsgs(arrQueryMsg);
        setShowActivity(false);

    })

  }

      const Item = ({author,content,avatar,date,nom,prenom,owner,id,response,srcAvatar,srcPrenom,srcContent,images,nbImg}) => (

        //[{backgroundColor:COLORS.lightWhite,padding:10,borderRadius:5, width:"90%"}, owner&&{backgroundColor:COLORS.red}]

        <TouchableOpacity style={{marginBottom:5,marginTop:5}} 
          onLongPress={()=>(activeMessage(id))}>
          <View style={[{flex:1,flexDirection:"column",padding:10,borderRadius:5, width:"90%",borderRadius:5,gap:10}, owner&&{marginLeft:'auto',justifyContent:'flex-end',backgroundColor:COLORS.gray2}, !owner&&{backgroundColor:COLORS.lightGrayMsg}]}>
            {response &&
            <View style={{flex:1,flexDirection:"row", width:"90%",borderRadius:5,padding: 10,backgroundColor:COLORS.lightGrayMsg}}>
              <View style={{flex:1,flexDirection:"column"}}>
                <Text style={styleFont.authorMsg}>{srcPrenom}</Text>
                <Text style={styleFont.contentMsg}>{srcContent}</Text>
              </View>
            </View>
            }
              <View style={{flex:1,flexDirection:"column"}}></View>
                <View style={{flex:1,flexDirection:"row", width:"90%",borderRadius:5}}>
                  <Avatar
                        rounded
                        source={{ uri: avatar }}
                      />
                  <View style={{flex:1,flexDirection:"column"}}>
                    <Text style={styleFont.authorMsg}>{prenom}</Text>
                    <Text style={styleFont.contentMsg}>{content}</Text>
                    <Text style={styleFont.dateMsg}>{date}</Text>
                  </View>
                </View>
                {nbImg[0] && 
                  <View style={{flex:1,flexDirection:"row"}}> 
                      <Image style={styleCom.imgMsgAlone} source={{uri:images[0]}} />
                  </View>
                }
                {nbImg[1] && 
                  <View style={{flex:1,flexDirection:"row"}}> 
                          <Image style={styleCom.imgMsg} source={{uri:images[0]}} /> 
                          <Image style={styleCom.imgMsg} source={{uri:images[1]}}/> 
                  </View>
                }
                {nbImg[2] && 
                <View style={{flex:1,flexDirection:"column"}}>
                    <View style={{flex:1,flexDirection:"row"}}> 
                          <Image style={styleCom.imgMsg} source={{uri:images[0]}}/> 
                          <Image style={styleCom.imgMsg} source={{uri:images[1]}}/>
                  </View>
                  <View style={{flex:1,flexDirection:"row"}}> 
                          <Image style={styleCom.imgMsg} source={{uri:images[2]}}/> 
                    </View>
                </View>
                }
                {nbImg[3] && 
                <View style={{flex:1,flexDirection:"column"}}>
                  <View style={{flex:1,flexDirection:"row"}}> 
                       <Image style={styleCom.imgMsg} source={{uri:images[0]}}/> 
                      <Image style={styleCom.imgMsg} source={{uri:images[1]}}/>
                 </View>
                 <View style={{flex:1,flexDirection:"row"}}> 
                        <Image style={styleCom.imgMsg} source={{uri:images[2]}}/> 
                        <Image style={styleCom.imgMsg} source={{uri:images[3]}}/> 
                  </View>
                </View>
                  
                }

          </View>
        </TouchableOpacity>
      );

      const ItemImg = ({base64}) => (

        //[{backgroundColor:COLORS.lightWhite,padding:10,borderRadius:5, width:"90%"}, owner&&{backgroundColor:COLORS.red}]

        <Image
          style={styleCom.imgMsgBuffer}
          source={{uri:base64}}
        />
      );



    return (
        <View style={{flex:1,backgroundColor:COLORS.lightWhite,padding:0,alignItems:"center",gap:10}}>
            {/* La liste des messages */}
            
            {showActivty && <ActivityIndicator size="large" color={COLORS.red} />}
            <ScrollView style={{width:"100%",minHeight:"35%",maxHeight:"70%"}}>
              <FlatList
                  data={resMsgs}
                  renderItem={({item}) => <Item 
                  owner={item.owner} author={item.author} nom={item.user.nom} prenom={item.user.prenom} content={item.content} date={item.date} id={item.id} 
                  avatar={item.user.avatar} response={item.response} srcAvatar={item.source.avatar} srcPrenom={item.source.prenom} srcContent={item.source.content} images={item.images}
                  nbImg={item.nbImgs}/>}
                  keyExtractor={item => item.id
                  }
                  style={{width:"100%",gap:10}}
              />
            </ScrollView>
            
             {photoBuffer && 
              <Image style={styleCom.imgMsgBuffer} source={{uri:route.params.uriPix}} />  
             }

             {picturesBuffer &&
             <View style={{flex:1,flexDirection:"row",minHeight:"20%",backgroundColor:COLORS.gray2}}>
                  <ScrollView style={{width:"100%"}}>
                      <FlatList
                        horizontal={true}
                        data={listImages64}
                        renderItem={({item}) => 
                          <ItemImg base64={item.img64} />
                        }
                        style={{width:"100%",gap:5}}
                      />
                  </ScrollView>
                    
                  {/* Delete message */}
                  <TouchableOpacity onPress={photoDescativate}>
                        <Image style={{ width: 30, height: 30}} source={require('../../../assets/icons/trash.png')}/>
                  </TouchableOpacity>
              </View>
             }

             {showReply && 
              <View style={{flex:1,flexDirection:"row",width:'100%',minHeight:"20%",backgroundColor:COLORS.gray2,padding:0,alignItems:"center",borderRadius:5}}>
                  <View style={{flex:1,flexDirection:"column"}}>
                    <Text style={styleFont.authorMsg}>{replyAuthor}</Text>
                    <Text style={styleFont.contentMsg}>{replyContent}</Text>
                  </View>
                  
                  {/* Delete reply */}
                  <TouchableOpacity onPress={replyDesactivate}>
                          <Image style={{ width: 30, height: 30}} source={require('../../../assets/icons/trash.png')}/>
                  </TouchableOpacity>
              </View>
             }

             {showToolbar && <View style={{flex:1,flexDirection:"row",width:'100%',minHeight:"20%",backgroundColor:COLORS.gray2,padding:0,alignItems:"center",gap:20,alignItems:"center",justifyContent: 'center'}}>

              <TouchableOpacity onPress={()=>{ 
                replyActivate()
              }}>
                      <Image style={{ width: 30, height: 30}} source={require('../../../assets/icons/reply.png')}/>
              </TouchableOpacity>

              {/* Delete message */}
              <TouchableOpacity onPress={deleteMessage}>
                      <Image style={{ width: 30, height: 30}} source={require('../../../assets/icons/trash.png')}/>
              </TouchableOpacity>
            </View> }

            {/* Message writer bar  */}
            <View style={{flex:1,flexDirection:"row",backgroundColor:COLORS.lightWhite,padding:0,alignItems:"center",gap:10,maxHeight:"50%",minHeight:"20%",marginTop:'auto',justifyContent:'flex-end'}}>
                  

                  {/*<TouchableOpacity onPress={() => setShow(!show)}>
                      <Image style={{ width: 30, height: 30}} source={require('../../../assets/icons/smile.png')}/>
                    </TouchableOpacity>*/}

                  {/* Permet de prendre une photo */}
                   
                  <TouchableOpacity onPress={openCamera}>
                      <Image style={{ width: 30, height: 30}} source={require('../../../assets/icons/camera.png')}/>
                  </TouchableOpacity>
                  

                  {/* Permet d4 ajouter une PHOTO en PJ */}
                  <TouchableOpacity onPress={openImagePicker}>
                      <Image style={{ width: 30, height: 30}} source={require('../../../assets/icons/image.png')}/>
                  </TouchableOpacity>

                  {/* Permet d'écrire le message  */}
                  <TextInput 
                    editable = {true}
                    multiline = {true}
                    numberOfLines = {2}
                    ref={content}
                    onChangeText={
                      (text)=>{
                          setMsgContent(text)
                      }
                    } 
                    style={{width:"50%",marginLeft:"3%",borderRadius:15,backgroundColor:"#ffffff",color:"#000000"}} />

                  {/* Permet d'envoyer le message */}
                  <TouchableOpacity onPress={createMessage}>
                      <Image style={{ width: 30, height: 30}} source={require('../../../assets/icons/post.png')}/>
                  </TouchableOpacity>
              </View>

        </View>
    )
}
export default Message;