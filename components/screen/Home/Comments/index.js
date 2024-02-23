import { View,Text,Image, ActivityIndicator,Alert } from "react-native";
import { FlatList, ScrollView, TextInput } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native";
import {COLORS,icons,images,SIZES} from '../../../../constants';
import styleCom from '../../../../styles/common'
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, createRef, useRef } from "react";
import  styleFont from '../../../../styles/fonts';
import { Avatar,Overlay,BottomSheet  } from '@rneui/themed';
import { ListItem } from '@rneui/themed';
import { Badge } from '@rneui/themed';
import { Tab } from "@rneui/base";

import {ref, uploadBytes, uploadBytesResumable, getStorage,listAll,getDownloadURL} from 'firebase/storage'
import { db,storage } from "../../../../firebase";
import moment from 'moment';
import currentUserLogged from "../../../../global"
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as eventBackEnd from '../../../../backend/Event'
import * as userBackEnd from '../../../../backend/Users'
import Toast from 'react-native-root-toast';
import 'react-native-get-random-values';
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Center } from "native-base";
import CommentCard from'../CommentCard';

const Comment = ({navigation, route}) =>{

  const [resComs, setResComs] = useState([]);
  const [showActivty , setShowActivity] = useState(false);
  const [msgContent,setMsgContent]=useState('');
  const [isVisible, setIsVisible] = useState(false);
  const isFocused = useIsFocused();
  var oldComments = [];

  useEffect(() => {
    // write your code here, it's like componentWillMount
    setShowActivity(true);
    getComment();
  },[isFocused])


  //----------------------------------------
  // SEULEMENT SI TU ES OWNER !!!!!
  //----------------------------------------



  const createMessage = async() =>{
      //Read source message
      console.log('Reply is going to send ...')
      const value = await AsyncStorage.getItem('USER_EMAIL')
      const msg = msgContent
      if(value !== null){

        var dataToUpdate = {
          
            userId:value,
            content:msgContent,
            like:[],
            date:moment().format("DD/MM/YYYY")
          
        }
          
        //Create our own reply as new message
        await eventBackEnd.AddEventAnswer(route.params.idEvent,dataToUpdate)
        .then(()=>{
              console.log('written')
               getComment();
               setMsgContent('');
               content.current.clear();
               navigation.navigate('Home');
        })
      }
 }


  const getComment = async() =>{

  console.log('---------- INIT MSG SCREEN --------')
  console.log('idEvent : '+route.params.idEvent);

  
  await eventBackEnd.SearchEventById(route.params.idEvent)
  .then(async(arrQueryMsg)=>{

    if(arrQueryMsg[0].comments.length>0){
      oldComments = arrQueryMsg[0].comments;
      console.log('old comm :'+oldComments);
    }

    if(arrQueryMsg[0].comments[0].userId != undefined && arrQueryMsg[0].comments[0].userId != ""){
        await userBackEnd.SearchAvatarByEmail(arrQueryMsg[0].comments[0].userId)
        .then((arrUser)=>{

          console.log('User readed ! '+ arrUser[0].prenom)

          var arrComments = [];
          arrQueryMsg[0].comments.forEach(comment => {
            console.log('content : '+comment.content)
            arrComments.push({
              userId : comment.userId,
              userName : arrUser[0].nom,
              userFirst : arrUser[0].prenom,
              userPseudo : arrUser[0].pseudo,
              userAvatar : arrUser[0].avatar,
              content : comment.content,
              like: comment.like,
              date: comment.date,
              owner : comment.owner
            })
          });
          setTimeout(function hideToast() {
            console.log('comments pushed !');
            setResComs(arrComments);
            setShowActivity(false);
          }, 2000);

        });
      }

    })

    

  }

  //usName={item.userName} usFirst={item.userFirst} usAvatar={item.userAvatar} usPseudo={itemuserPseudo} usId={item.userId} content={item.content} like={item.like} date={item.date} 
const Item = ({id,usId,usAvatar,date,content,usName,usFirst,usPseudo, owner}) => {

    <CommentCard id={id} usId={usId} usAvatar={usAvatar} date={date} content={content} usName={usName} usFirst={usFirst} usPseudo={usPseudo} navigation={navigation} owner={owner}/>

}



return (
        <View style={{flex:1,flexDirection:'column',backgroundColor:'#fff',padding:0,alignItems:"center",gap:10}}>
          
            <View style={{flex:1,alignItems:"left",flexDirection:'row',gap:10,borderBottomColor:COLORS.green,borderBottomWidth:3,padding:10,minWidth:'100%',maxHeight:50,minHeight:50}}>
              <Image style={{width:30,height:30}} source={require('../../../../assets/icons/pray.png')} />
              <Text>{0}</Text>
            </View>

            {/* Comments list */}
            {showActivty && <ActivityIndicator size="large" color={COLORS.green} />}

            <ScrollView style={{width:"100%",minHeight:"35%",maxHeight:"80%"}}>
              <FlatList
                  data={resComs}
                  renderItem={({item}) => 
                  <Item id={item.id} usId={item.userId} usAvatar={item.userAvatar} date={item.date} content={item.content} usName={item.userName} usFirst={item.userFirst} usPseudo={item.userPseudo} owner={item.owner} />}
                  keyExtractor={item => item.id
                  }
                  style={{width:"100%",gap:10}}
              />
            </ScrollView>
          

            {/* Message writer bar  */}
            <View style={{flex:1,flexDirection:"row",padding:0,alignItems:"center",gap:10,maxHeight:"50%",minHeight:"20%",minWidth:'90%',marginTop:'auto',justifyContent:'flex-end',padding:10}}>
         

                  {/* Permet d'écrire le message  */}
                  <TextInput 
                    editable = {true}
                    multiline = {true}
                    numberOfLines = {2}
                    value={msgContent}
                    onChangeText={
                      (text)=>{
                          setMsgContent(text)
                      }
                    } 
                    style={{height:'auto',minHeight:50,borderRadius:10,maxHeight:200,padding:20,width:"90%",marginLeft:"5%",borderRadius:15,backgroundColor:"#e9e9e9",color:"#000000"}} />

                  {/* Permet d'envoyer le message */}
                  <TouchableOpacity onPress={createMessage}>
                      <Image style={{ width: 30, height: 30}} source={require('../../../../assets/icons/post.png')}/>
                  </TouchableOpacity>
              </View>

        </View>
    )
}
export default Comment;