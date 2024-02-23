import { View,Text,Image,FlatList,Alert, ActivityIndicator  } from "react-native";
import { TextInput,ScrollView } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native";
import {COLORS,icons,images,SIZES} from '../../../../constants';
import styleCom from '../../../../styles/common'
import { SafeAreaView } from "react-native-safe-area-context";
import { useState,useEffect, useRef } from "react";
import  styleFont from '../../../../styles/fonts';
import { StyleSheet } from "react-native";
import { Avatar,ListItem,CheckBox,BottomSheet } from '@rneui/themed';
import * as userBackEnd from '../../../../backend/Users'
import * as testiBackEnd from '../../../../backend/Testimony'
import Timeline from 'react-native-timeline-flatlist'
import CardMedia from '../../Media/MediaCard'
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { arrayUnion } from "firebase/firestore";
import CardVerse from '../../../Book/CardVerse';
import { stringify } from "uuid";
import moment from 'moment';

import { captureRef } from 'react-native-view-shot';
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from 'expo-media-library';
import Toast from 'react-native-root-toast';

const DetailsUser = ({navigation}) =>{

    const [arrInfouser,setArrInfoUser] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    {/*

----------------------------------------------------------------------------------------------

MODIFICATION A FAIRE : 
-----------------------

- Ajouter la fonction reste du mot de passe 
- modification des informations  ajoute un avatar au lieu de le replacer 

----------------------------------------------------------------------------------------------

    

        id:doc.id,
      nom : json.nom,
      prenom: json.prenom,
      dateInscription: json.dateInscription,
      dateNaissance: json.dateNaissance,
      email: json.email,
      pseudo: json.pseudo,
      step: json.step,
      avatar: json.avatar,
      phone: json.phone,
      userfollowed :json.userfollowed,
      followedBy:json.followedBy,
      blacklist:json.blacklist,
      verses : json.verses,
  */}

    //user state
    const [prenom, setPrenom] = useState('');
    const [nom, setNom] = useState('');
    const [dateInscription, setDateInscription] = useState('');
    const [email,setEmail] = useState('');
    const [pseudo,setPseudo] = useState('');
    const [step, setStep] = useState('');
    const [urlAvatar, setUrlAvatar] = useState('');
    const [phone, setPhone] = useState('');
    const [userFollowed, setUserFollowed] = useState('');
    const [followedBy, setFollowedBy] = useState('');
    const [verses,setVerses]=useState('');

    //testimony state 
    const [testBefore, setTestBefore]=useState('');
    const [testDuring, setTestDuring]=useState('');
    const [testAfter, setTestAfter]=useState('');
    const [testMessage, setTestMessage]=useState('');
    const [testDateBefore, setTestDateBefore]=useState('');
    const [testDateDuring, setTestDateDuring]=useState('');
    const [testDateAfter, setTestDateAfter]=useState('');
    const [testData, setTestData]=useState([]);

    //Internal component state
    const [testiWritten, setTestiWritten]=useState(false);
    const [verseWritten, setVerseWritten]=useState(false);
    const [idUser,setIdUser]=useState('');
    const [showActivty,setShowActivity]=useState(false);
    const isFocusedSc = useIsFocused();

    const [status, requestPermission] = MediaLibrary.usePermissions();
    const imageTestRef = useRef();

    if (status === null) {
      requestPermission();
    }


    useEffect(()=>{
      setShowActivity(true)
      UserTestimony()
      .then(()=>{
        setTimeline();
        console.log('data test :'+JSON.stringify(testData))
      })
      UserData();
  },[isFocusedSc])


  const onSaveImageAsync = async () => {
     
    await captureRef(imageTestRef, {
      quality: 1,
    }).then(async(localUri)=>{
        console.log('local URI : '+localUri);
        await MediaLibrary.saveToLibraryAsync(localUri)
        .then(()=>{
          console.log('image saved');
          let toast = Toast.show('Exporté dans le dossier photos', {
            duration: 3000,
          });
    
          // You can manually hide the Toast, or it will automatically disappear after a `duration` ms timeout.
          setTimeout(function hideToast() {
            Toast.hide(toast);
          }, 3000);
        })
      })

};



    const list = [
    { title: 'Me déconnecter',
      onPress:()=>{
        console.log('press')
        userBackEnd.disconnectUser();
        setIsVisible(false)
      } },
      { title: 'Modifier mes informations',
      onPress:()=>{
        console.log('press')
        navigation.navigate('ModifyPage',{userToModify:email})
        setIsVisible(false)
      } },
      { title: 'Changer mon mot de passe',
      onPress:()=>{
        console.log('press')
        userBackEnd.resetPassword();
        let toast = Toast.show('Email de réinitialisation envoyé', {
          duration: 3000,
        });
  
        // You can manually hide the Toast, or it will automatically disappear after a `duration` ms timeout.
        setTimeout(function hideToast() {
          Toast.hide(toast);
        }, 3000);
        

        setIsVisible(false)
      } },
      { title: 'Exporter mon témoignage',
      onPress:()=>{
        console.log('press')
        onSaveImageAsync();

        setIsVisible(false)
      } },
    {
        title: 'Supprimer mon compte',
        containerStyle: { backgroundColor: 'red' },
        titleStyle: { color: 'white' },
        onPress:()=>{
            createTwoButtonAlert()
            setIsVisible(false)
          } 
        },
        {
          title: 'Annuler',
          containerStyle: { backgroundColor: "#393939" },
          titleStyle: { color: 'white' },
          onPress:()=>{
              setIsVisible(false)
            } 
          },
    
    ];

    const createTwoButtonAlert = () =>
    Alert.alert('Supprimer mon compte', 'Souhaitez-vous vraiment supprimer votre compte ? ', [
      {
        text: 'NON',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OUI', onPress: () => {
        userBackEnd.DeleteUser();
        navigation.navigate('Login')
      }},
    ]);

      DataStep =
      ["Je m'interroge",
      "Je chemine",
      "Je suis converti",
      "Je suis baptisé"]

      const CardMediaItem = ({name,id,image,date,members}) => (

        <CardMedia />
  
      );

      async function UserData(){
        const value = await AsyncStorage.getItem('USER_EMAIL')
        if(value != ''){
          await userBackEnd.SearchUserByEmail(value)
          .then((arrDataUser)=>{
            
            console.log('data user : '+JSON.stringify(arrDataUser));
    
            setIdUser(arrDataUser[0].id);
            setPrenom(arrDataUser[0].prenom);
            setNom(arrDataUser[0].nom);
            setDateInscription(arrDataUser[0].dateInscription);
            setEmail(arrDataUser[0].email);
            setPseudo(arrDataUser[0].pseudo);
            setStep(arrDataUser[0].step);
            setUrlAvatar(arrDataUser[0].avatar);
            setPhone(arrDataUser[0].phone);
            setUserFollowed(arrDataUser[0].userFollowed);
            setFollowedBy(arrDataUser[0].followedBy);
            setVerses(arrDataUser[0].verses);
    
            console.log('user id userDetails: '+idUser);
    
            if(arrDataUser[0].verses !== undefined){
              setVerseWritten(true);
            }else{
              setVerseWritten(false);
            }
    
    
          })
        }
      }


      async function UserTestimony(){
        const value = await AsyncStorage.getItem('USER_EMAIL')
        await testiBackEnd.SearchTestimonyByEmail(value)
        .then((arrDataTest)=>{

            console.log('data testimony : '+JSON.stringify(arrDataTest[0]));

            setTestBefore(arrDataTest[0].phase.avant.content)
            setTestDuring(arrDataTest[0].phase.pendant.content)
            setTestAfter(arrDataTest[0].phase.apres.content)
            setTestMessage(arrDataTest[0].message);

            setTestDateBefore(arrDataTest[0].phase.avant.date)
            setTestDateDuring(arrDataTest[0].phase.pendant.date)
            setTestDateAfter(arrDataTest[0].phase.apres.date)

            var testBeforeDatetmp = moment(arrDataTest[0].phase.avant.date).format("DD/MM/YYYY");
            var testBeforeContenttmp = arrDataTest[0].phase.avant.content;

            var testDuringDatetmp = moment(arrDataTest[0].phase.pendant.date).format("DD/MM/YYYY");
            var testDuringContenttmp = arrDataTest[0].phase.pendant.content;

            var testAfterDatetmp = moment(arrDataTest[0].phase.apres.date).format("DD/MM/YYYY");
            var testAfterContenttmp = arrDataTest[0].phase.apres.content;

            dataTest = [ 
              {time: testBeforeDatetmp, title: 'AVANT', description:testBeforeContenttmp, circleColor: COLORS.green,lineColor:COLORS.green},
              {time: testDuringDatetmp, title: 'PENDANT', description:testDuringContenttmp, circleColor: COLORS.green,lineColor:COLORS.green},
              {time: testAfterDatetmp, title: 'APRES', description:testAfterContenttmp, circleColor: COLORS.green,lineColor:COLORS.green},

            ]

            setTestiWritten(true);
            setShowActivity(false);

      })
  
      }
    
    function setTimeline(){

      console.log('set timeline !!!' );


      setTestData(dataTest);
      console.log('data :'+JSON.stringify(dataTest))

    }
  
    
    return (
        
        <View style={{flex:1,backgroundColor:COLORS.lightWhite,justifyContent:"center",padding:10,alignItems:"center",gap:10}}>

            {showActivty&&
              <View style={{flex:1,flexDirection:"column",alignItems:"center"}}>
                  <ActivityIndicator size="large" color={COLORS.green} />
              </View>
            }

        <View style={{flex:1,backgroundColor:COLORS.lightWhite,justifyContent:"center",padding:10,alignItems:"center",gap:10,backgroundColor:"#ffffff",borderRadius:10,width:'100%'}}>


            <ScrollView style={{width:'100%',padding:0}}>

            <ViewShot ref={imageTestRef} options={{ fileName: "MonTemoignage", format: "jpg", quality: 0.9 }}>
            <View style={{flex:1,flexDirection:"row"}}>
                <Avatar
                rounded
                source={{ uri: urlAvatar }}
                />
                <View style={{flex:1,flexDirection:"column"}}>
                    <View style={{flex:1,flexDirection:"row"}}>
                        <Text>{prenom}</Text>
                    </View>
                    <Text style={{color:"#BEBEBE"}}>@{pseudo}</Text>
                </View>
                <TouchableOpacity style={{justifyContent:'flex-end', marginLeft:"auto"}}
                onPress={() => setIsVisible(true)}
                >
                            <Image style={{width:30,height:30}} source={require('../../../../assets/icons/list.png')} />
                </TouchableOpacity>
            </View>

            <View style={{flex:1,flexDirection:'column'}}>
              <Text style={[styleFont.title, {paddingTop:10,paddingBottom:0 }]}>Etape</Text>
              <Text style={[{paddingTop:10,paddingBottom:10 }]}>{DataStep[step]}</Text>
              <TouchableOpacity style={[styleCom.button,{backgroundColor:COLORS.green}]}  onPress={()=>{
                  navigation.navigate('ModifyStepPage')
                }}>
                      <Text>Changer d'étape</Text>  
                </TouchableOpacity>
            </View>

            <Text style={[styleFont.title, {paddingTop:10,paddingBottom:10 }]}>Verset du moment</Text>
            {verseWritten&& 
            <View style={{flex:1,flexDirection:'column'}}>
              <CardVerse verseText={verses[0].verseText} verseReference={verses[0].verseAbbrev +' - '+ verses[0].verseChap}/>
              <TouchableOpacity style={[styleCom.button,{backgroundColor:COLORS.green}]}  onPress={()=>{
                navigation.navigate('BookSelector',{fromPage:'UserDetails',user:idUser})
              }}>
                    <Text>Changer de verset</Text>  
              </TouchableOpacity>
            </View> 
            }
            {!verseWritten&&<TouchableOpacity style={[styleCom.button,{backgroundColor:COLORS.green}]}  onPress={()=>{
                  navigation.navigate('BookSelector',{fromPage:'UserDetails',user:idUser})
                }}>
                      <Text>Choisir un verset</Text>  
              </TouchableOpacity>}

                {testiWritten&&
                <View style={{flex:1,flexDirection:'column',gap:5,paddingTop:10}}>
                  <Text style={styleFont.title}>Mon témoignage</Text>
                  <Timeline 
              // style={styles.list}
                  data={dataTest}
                  separator={true}
                  circleSize={20}
                  circleColor={COLORS.green}
                  lineColor= {COLORS.green}
                  timeContainerStyle={{minWidth:52, marginTop: 0}}
                  timeStyle={{textAlign: 'center', backgroundColor:COLORS.green, color:'white', padding:5, borderRadius:13, overflow: 'hidden'}}
                  descriptionStyle={{color:'gray'}}
                  options={{
                      style:{paddingTop:20}
                  }}
                  />

                  <View style={{flex:1,flexDirection:'column',gap:5,paddingTop:10,paddingBottom:10}}>
                    <Text style={styleFont.title}>Mon message</Text>
                    <Text>{testMessage}</Text>
                  </View>

                  <TouchableOpacity style={[styleCom.button,{backgroundColor:COLORS.green}]}  onPress={()=>{
                      navigation.navigate('TestiSignUp',{refreshValue:true})
                  }}>
                      <Text>Modifier mon témoignage</Text>  
                  </TouchableOpacity>
                </View>
                }

                
                {!testiWritten&&
                <View style={{flex:1,flexDirection:'column'}}>
                  <Text style={styleFont.title}>Mon témoignage</Text>
                  <TouchableOpacity style={[styleCom.button,{backgroundColor:COLORS.green}]}  onPress={()=>{
                    navigation.navigate('TestiSignUp',{refreshValue:false})
                  }}>
                        <Text>Ecrire mon témoignage</Text>  
                  </TouchableOpacity>
                </View>
                }

               {/* Contenu media publier par église 
               <Text style={styleFont.hastag}># Prière </Text>
                <FlatList 
                    data={DATA}
                    horizontal={true}
                    renderItem={({item}) => <CardMediaItem  />}
                    keyExtractor={item => item.id}
                    style={{width:"100%"}}
              /> */}
              </ViewShot>
            </ScrollView>
            <BottomSheet modalProps={{}} isVisible={isVisible}>
                {list.map((l, i) => (
                    <ListItem
                    key={i}
                    containerStyle={l.containerStyle}
                    onPress={l.onPress}
                    >
                    <ListItem.Content>
                        <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
                    </ListItem.Content>
                    </ListItem>
                ))}
            </BottomSheet>
        </View>
       
    </View>
    )
}
export default DetailsUser;