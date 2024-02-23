import { View,Text,Image,Switch,DevSettings } from "react-native";
import { ScrollView,FlatList, TextInput } from "react-native-gesture-handler";
import { TouchableOpacity, ActivityIndicator } from "react-native";
import {COLORS,icons,images,SIZES,THEME} from '../../../constants';
import styleCom from '../../../styles/common'
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import  styleFont from '../../../styles/fonts';
import { Avatar } from '@rneui/themed';
import { ListItem } from '@rneui/themed';
import { Badge } from '@rneui/themed';
import { Tab } from "@rneui/base";

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc,  query, where, getDocs, collection } from "firebase/firestore";
import {auth,db} from "../../../firebase"

import * as userBackEnd from '../../../backend/Users'
import * as bookBackEnd from'../../../backend/importBook';
import { Center } from "native-base";
import AsyncStorage from '@react-native-async-storage/async-storage';
import CardVerse from '../../Book/CardVerse'

import ReactDOM from "react-dom";
import QRCode from "react-qr-code";


const DashBoard = ({ navigation, route }) =>{

  const [resQuery, setResQuery] = useState([]);
  const [showActivty , setShowActivity] = useState(false);
  const [verseWritten, setVerseWritten] = useState(false);
  const [isVisible,setIsVisible]=useState(false);
  const [userName,setUserName]=useState('');
  const [userVerse,setUserVerse]=useState('');
  const [showColors, setShowColors]=useState(false);
  const [allVers, setAllVers]=useState([]);



  //Toggle switch 
  const [isEnabled1, setIsEnabled1] = useState(false);
  const [isEnabled2, setIsEnabled2] = useState(false);
  const [isEnabled3, setIsEnabled3] = useState(false);
  const [isEnabled4, setIsEnabled4] = useState(false);

  //Communauté
  const toggleSwitch1 = () => { 
    setIsEnabled1(previousState => !previousState)
    if(isEnabled1){
     AsyncStorage.setItem('COMMUNITY_ONLY',true);
   }else{
     AsyncStorage.setItem('COMMUNITY_ONLY',false);
   }
  }

  //Notifictaions
  const toggleSwitch2 = () => {
     setIsEnabled2(previousState => !previousState)
     if(isEnabled2){
      AsyncStorage.setItem('NOTIF_ON',true);
    }else{
      AsyncStorage.setItem('NOTIF_ON',false);
    }
  }

  //Privé
  const toggleSwitch3 = () => {
    setIsEnabled3(previousState => !previousState)
    if(isEnabled3){
      AsyncStorage.setItem('ACCOUNT_PRIVATE',true);
    }else{
      AsyncStorage.setItem('ACCOUNT_PRIVATE',false);
    }
  }

  //Dark Mode
  const toggleSwitch4 = () => {

    setIsEnabled4(previousState => !previousState);
    if(isEnabled4){
      AsyncStorage.setItem('DARK_MODE','true');
      COLORS.lightWhite = '#e9e9e9'
      COLORS.colorTitle = '#393939'
      COLORS.colorSubtitle = '#898989'

    }else{
      AsyncStorage.setItem('DARK_MODE','false');

      COLORS.lightWhite = '#393939'
      COLORS.colorTitle = '#ffffff'
      COLORS.colorSubtitle = '#e9e9e9'


    }


  }


  const ListTheme = [
    {
      id:0,
      colorAccent:'#97C1A9'
    },
    {
      id:1,
      colorAccent:'#A3E1DC'
    },
    {
      id:2,
      colorAccent:'#F5D2D3'
    },
    {
      id:3,
      colorAccent:'#F6EAC2'
    },
    {
      id:4,
      colorAccent:'#AEB8FE'
    },
    {
      id:5,
      colorAccent:'#FFD29D'
    },
    {
      id:6,
      colorAccent:'#E0CDA9'
    }
  ]
  

  useEffect(() => {
    // write your code here, it's like componentWillMount
    setShowActivity(true);
    getUser();
  }, [])



  const getUser = async() =>{
    const value = await AsyncStorage.getItem('USER_EMAIL') 
    if(value != ' '){
      await userBackEnd.SearchAvatarByEmail(value)
      .then(async(arrUserData)=>{
        await bookBackEnd.getAllVersions('fr')
        .then((versions)=>{
            setTimeout(async()=>{
              console.log('set user state ! \n'+arrUserData[0].verses[0].verseText)
              if(arrUserData[0].verses[0].verseText != ''){
                setVerseWritten(true)
              }else{
                setVerseWritten(false)

              }
              setUserName(arrUserData[0].prenom);
              setUserVerse(arrUserData[0].verses[0].verseText);
              setAllVers(versions);
              setShowActivity(false);
              
            },2000);
        })
      })
    }

  }

  const list = [
    { title: 'Bible collaborative',
      descr:'Retourve ici tes annotations et les annotations partagées dans les conversations étude biblique',
      icon:'',
      onPress:(i)=>{
        //navigation.navigate('InteractiveBook',{fromConv:false,fromUser:true,userId:''})
        setIsVisible(false)
      } 
    },
    { title: 'Versets marqués',
      descr:'Retrouve tous les versets que tu as marqué',
      icon:'',
      onPress:(i)=>{
        //Fonction signalement  à faire !
        setIsVisible(false)
      } 
    },
    { title: 'Témoignages marqués',
      descr:'Retrouve tous les témoignages que tu as marqués',
      icon:'',
      onPress:(i)=>{
        //Fonction signalement  à faire !
        setIsVisible(false)
      } 
   },{
      title: 'Voir mon profil',
      descr:'Vois ton profil tel qu\'il est publié',
      onPress:(i)=>{
        //Fonction signalement  à faire !
        //navigation.navigate('UserDetails')
        setIsVisible(false)
      } 
  }

  ]


    return (
        <View style={{flex:1,backgroundColor:COLORS.lightWhite,padding:0,alignItems:"center",gap:10, padding:5,alignItems:'center'}}>
          <ScrollView contentContainerStyle={{width:'100%',padding:0,alignItems:'center',gap:10}}>
            {/*Header dahsboard */}
            <View style={{flex:1,flexDirection:'column',minWidth:'90%'}}>
                <Text style={styleFont.title}>{'Journal de bord de '+userName} </Text>
                <Text style={styleFont.subtitle}>Ton journal de bord te permet de suivre au quotidien la progression de ta foi et de la partager pour changer la vie d'autres personnes. </Text>
            </View>

            {/*Pre content with some stat */}
            <View style={{flex:1,flexDirection:'column',alignItems:'center'}}>
              <Text style={[styleFont.title, {paddingTop:10,paddingBottom:10 }]}>Verset préféré</Text>
              {verseWritten&& 
              <View style={{flex:1,flexDirection:'column',minWidth:'90%',justifyContent:'center'}}>
                <CardVerse verseText={userVerse} verseReference={''}/>
                <TouchableOpacity style={[styleCom.button,{backgroundColor:COLORS.green,minWidth:'90%'}]}  onPress={()=>{
                  navigation.navigate('BookSelector',{fromPage:'DashBoard',user:idUser})
                }}>
                      <Text>Changer de verset</Text>  
                </TouchableOpacity>
              </View> 
              }
              {!verseWritten&&<TouchableOpacity style={[styleCom.button,{backgroundColor:COLORS.green}]} onPress={()=>{
                    navigation.navigate('BookSelector',{fromPage:'DashBoard',user:idUser})
                  }}>
                        <Text>Choisir un verset</Text>  
                </TouchableOpacity>}
            </View>

            {/*Content dashboard */}
            <Text style={[styleFont.title, {paddingTop:10,paddingBottom:10 }]}>Menu</Text>
            <View style={{flex:1,flexDirection:'column',minWidth:'90%',gap:10}}>

              <View style={{flex:1,flexDirection:'row',gap:10,minWidth:'90%',maxWidth:'90%'}}>
                <TouchableOpacity style={[styleCom.buttonDash,{backgroundColor:COLORS.green}]}  onPress={()=>{
                  navigation.navigate('BookList');
                }}>
                  <Image source={{}}/>
                  <Text style={styleFont.button}>Bible collaborative</Text>
                  <Text style={styleCom.buttonTextDash}>Retrouve tous tes commentaires bibliques </Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styleCom.buttonDash,{backgroundColor:COLORS.green}]}  onPress={()=>{
                  navigation.navigate('NoteList');
                }}>
                  <Image source={{}}/>
                  <Text style={styleFont.button}>Annotations</Text>
                  <Text style={styleCom.buttonTextDash}>Retrouve toutes tes annotations </Text>
                </TouchableOpacity>
              </View>
              <View style={{flex:1,flexDirection:'row',gap:10,minWidth:'90%',maxWidth:'90%'}}>

                <TouchableOpacity style={[styleCom.buttonDash,{backgroundColor:COLORS.green}]} onPress={()=>{
                      navigation.navigate('TestList');
                }}>
                  <Image source={{}}/>
                  <Text style={styleFont.button}>Témoignages marqués</Text>
                  <Text style={styleCom.buttonTextDash}>Retrouve tous les témoignages que tu as marqués </Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styleCom.buttonDash,{backgroundColor:COLORS.green}]}  onPress={()=>{
                      navigation.navigate('TagList');
                }}>
                  <Image source={{}}/>
                  <Text style={styleFont.button}>Versets marqués</Text>
                  <Text style={styleCom.buttonTextDash}>Retrouve tous les versets que tu as marqués </Text>
                </TouchableOpacity>

              </View>
            </View>

            {/* METTRE DES BOUTONS : Aide, à propos de nous , ... */}
            {/* METTRE DES SLIDERS POUR LE REGLAGE */}

            {/* Suivre uniquement ma communauté  */}
            {/* Activité les notifications  */}
            {/* Garder mon compte privé   */}
            {/* Mode clair ou sombre  */}
            {/* Couleurs d'accents   */}
            {/* Choisir Page d'accueil  */}

            <Text style={[styleFont.title, {paddingTop:10,paddingBottom:10 }]}>Personnalise l'application</Text>

            <View style={{flex:1,flexDirection:'column',minWidth:'90%'}}>
              <View style={{flex:1,flexDirection:'row',alignItems:'center',gap:10}}>
                  <Text style={{color:COLORS.colorTitle}}>
                    Suivre uniquement ma communauté
                  </Text>
                  <Switch
                    trackColor={{false: COLORS.lightDark, true: COLORS.green}}
                    thumbColor={'#e9e9e9'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch1}
                    value={isEnabled1}
                    style={{flex:1,justifyContent:"flex-end"}}
                  />
              </View>
              <View style={{flex:1,flexDirection:'row',alignItems:'center',gap:10}}>
                  <Text style={{color:COLORS.colorTitle}}>
                    Activé les notifications
                  </Text>
                  <Switch
                    trackColor={{false: COLORS.lightDark, true: COLORS.green}}
                    thumbColor={'#e9e9e9'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch2}
                    value={isEnabled2}
                    style={{flex:1,justifyContent:"flex-end"}}
                  />
              </View>
              <View style={{flex:1,flexDirection:'row',alignItems:'center',gap:10}}>
                  <Text style={{color:COLORS.colorTitle}}>
                    Garder mon compte privé
                  </Text>
                  <Switch
                    trackColor={{false: COLORS.lightDark, true: COLORS.green}}
                    thumbColor={'#e9e9e9'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch3}
                    value={isEnabled3}
                    style={{flex:1,justifyContent:"flex-end"}}
                  />
              </View>
              <View style={{flex:1,flexDirection:'row',alignItems:'center',gap:10}}>
                  <Text style={{color:COLORS.colorTitle}}>
                    Mode clair ou sombre 
                  </Text>
                  <Switch
                    trackColor={{false: COLORS.lightDark, true: COLORS.green}}
                    thumbColor={'#e9e9e9'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch4}
                    value={isEnabled4}
                    style={{flex:1,justifyContent:"flex-end"}}
                  />
              </View>

              <View style={{flex:1,flexDirection:'column',alignItems:'center',gap:10,marginBottom:25}}>
       
              <Text style={[styleFont.title,{color:COLORS.colorTitle}]}>Choisir un thème</Text>

                <ScrollView contentContainerStyle={{minWidth:'90%'}} horizontal={true}>      
                {ListTheme.map((t)=>{
                  return(
                  <TouchableOpacity 
                        style={{width:50,height:50,backgroundColor:t.colorAccent,borderRadius:10}} 
                        onPress={()=>{
                          AsyncStorage.setItem('USER_COLOR',t.colorAccent);

                        }}
                      >
                  </TouchableOpacity>
                  )
                })
              }
                </ScrollView>  
              </View>

              <View style={{flex:1,flexDirection:'column',alignItems:'center',justifyContent:'center',gap:10,marginBottom:10,paddingBottom:10}}>
                <Text style={styleFont.title}>Choisir ma version de bible</Text>

                <FlatList
                                data={allVers}
                                renderItem={({item}) => 
                                <TouchableOpacity 
                                style={[styleCom.button,{backgroundColor:COLORS.green,alignItems:'center',justifyContent:'center',minWidth:'90%'}]} 
                                onPress={()=>{
                                    AsyncStorage.setItem('VERS_BI',item.name)
                                }}
                              >
                                <Text style={styleFont.message}>{item.name}</Text>
                          </TouchableOpacity>
                                }
                                keyExtractor={item => item.id}
                                contentContainerStyle={{width:"100%",gap:10,alignItems:'center',justifyContent:'center',paddingBottom:10}} 
                   />
                      
              </View>

              
              <TouchableOpacity style={[styleCom.button,{backgroundColor:COLORS.green,minWidth:'90%',alignItems:'center',gap:10,marginBottom:10}]} onPress={()=>{
                DevSettings.reload();
              }}>
                    <Text style={styleFont.button}>Appliquer les choix</Text>
                  </TouchableOpacity>
            </View>

            <Text style={[styleFont.title, {paddingTop:10,paddingBottom:10 }]}>Partage l'application</Text>
            
            <View style={{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:'#ffffff',borderColor:COLORS.green,borderWidth:2,width:250,height:250,borderRadius:125}} >
              <QRCode
                size={150}
                style={{ height: "auto", maxWidth: "50%", width: "50%" }}
                value={'hello world'}
                viewBox={`0 0 150 150`}
                />
            </View>

          </ScrollView>
        </View>
    )
}
export default DashBoard;