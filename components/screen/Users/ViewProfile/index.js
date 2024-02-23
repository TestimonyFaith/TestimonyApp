import { View,Text,Image,FlatList,Alert,ActivityIndicator } from "react-native";
import { TextInput,ScrollView } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native";
import {COLORS,icons,images,SIZES, IMAGESURL} from '../../../../constants';
import styleCom from '../../../../styles/common'
import { SafeAreaView } from "react-native-safe-area-context";
import { useState,useEffect } from "react";
import  styleFont from '../../../../styles/fonts';
import { StyleSheet } from "react-native";
import { Avatar,ListItem,CheckBox,BottomSheet } from '@rneui/themed';
import * as userBackEnd from '../../../../backend/Users'
import * as testiBackEnd from '../../../../backend/Testimony'
import * as convbackEnd from '../../../../backend/Conversation'
import Timeline from 'react-native-timeline-flatlist'
import CardMedia from '../../Media/MediaCard'
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { arrayUnion } from "firebase/firestore";
import CardVerse from '../../../Book/CardVerse';
import { stringify } from "uuid";
import moment from 'moment';
import Toast from 'react-native-root-toast';
import * as tagTestBackEnd from '../../../../backend/TagTestimony';


const ViewUser = ({navigation,route}) =>{

    const [arrInfouser,setArrInfoUser] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    {/*
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
    const [testiTagged,setTestiTagged]=useState(false);
    const [idUser,setIdUser]=useState('');
    const [showActivity,setShowActivity]=useState(false);
    const isFocusedSc = useIsFocused();


    useEffect(()=>{
      setShowActivity(true);
      UserTestimony()
      .then(()=>{
        setTimeline();
        console.log('data test :'+JSON.stringify(testData))
      })
      UserData();
  },[isFocusedSc])



    const list = [
    { title: 'Signaler ce compte',
      onPress:()=>{
        console.log('press')
        userBackEnd.disconnectUser();
        setIsVisible(false)
      } },
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
        const value = route.params.emailUser;
        await userBackEnd.SearchUserByEmail(value)
        .then(async(arrDataUser)=>{
          
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

          await tagTestBackEnd.readAllTagTests()
          .then((arrTagTest)=>{
              tags = arrTagTest.filter((t)=>{return t.idUser == value})

              console.log('Tags Tests : '+JSON.stringify(tags));
              console.log('all tags : '+JSON.stringify(arrTagTest));

              if(tags.length >0){
                setTestiTagged(true);
              }else{
                setTestiTagged(false);
              }
          })
  
          console.log('user id userDetails: '+idUser);
  
          if(arrDataUser[0].verses !== undefined){
            setVerseWritten(true);
          }else{
            setVerseWritten(false);
          }
  
          setShowActivity(false);
  
        })
      }

      async function UserTestimony(){
        const value = route.params.emailUser;
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
      })
  
      }
    
    function setTimeline(){

      console.log('set timeline !!!' );


      setTestData(dataTest);
      console.log('data :'+JSON.stringify(dataTest))

    }

    async function createInstantConv(){
      const valueAuthor = await AsyncStorage.getItem('USER_EMAIL')
      if(valueAuthor != ''){
        const value = route.params.emailUser;
        console.log('author : '+valueAuthor)
        if(value != ''){
          userBackEnd.SearchAvatarByEmail(value)
          .then(  async(arrUserData)=>{
            await convbackEnd.CreateConv('Conversation avec '+arrUserData[0].prenom,IMAGESURL.logoURL,[valueAuthor,value],'',valueAuthor)
            .then((id)=>{
              navigation.navigate('Message',{idConv:id})
              let toast = Toast.show('Conversation créée', {
                duration: Toast.durations.LONG,
              });
        
              // You can manually hide the Toast, or it will automatically disappear after a `duration` ms timeout.
              setTimeout(function hideToast() {
                Toast.hide(toast);
              }, 2000);
            })
          })
        }
      }
    }
  
    return (
        
        <View style={{flex:1,backgroundColor:COLORS.lightWhite,justifyContent:"center",padding:10,alignItems:"center",gap:10}}>

        {showActivity && <ActivityIndicator size="large" color={COLORS.green} />}

        <View style={{flex:1,backgroundColor:COLORS.lightWhite,justifyContent:"center",padding:10,alignItems:"center",gap:10,backgroundColor:"#ffffff",borderRadius:10,width:'100%'}}>


            <ScrollView style={{width:'100%',padding:0}}>

            <View style={{flex:1,flexDirection:"row"}}>
                <Avatar
                rounded
                source={{ uri: urlAvatar }}
                />
                <View style={{flex:1,flexDirection:"column"}}>
                    <View style={{flex:1,flexDirection:"row"}}>
                        <Text>{prenom}</Text>
                        <TouchableOpacity>
                            <Text style={{color:COLORS.green}}>Follow</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={{color:"#BEBEBE"}}>@{pseudo}</Text>
                </View>
                <TouchableOpacity style={{justifyContent:'flex-end', marginLeft:"auto"}}
                onPress={() => setIsVisible(true)}
                >
                            <Image style={{width:30,height:30}} source={require('../../../../assets/icons/list.png')} />
                </TouchableOpacity>
            </View>



            <Text style={styleFont.title}>Etape</Text>
            <Text>{DataStep[step]}</Text>

            <Text style={[styleFont.title, {paddingTop:10,paddingBottom:10 }]}>Verset du moment</Text>
            {verseWritten&& 
            <View style={{flex:1,flexDirection:'column'}}>
              <CardVerse verseText={verses[0].verseText} verseReference={verses[0].verseAbbrev +' - '+ verses[0].verseChap}/>
            </View> 
            }

            <View style={{flex:1,flexDirection:'row',minWidth:'90%',gap:5,alignItems:'center',justifyContent:'center'}}>
              <TouchableOpacity 
                style={{minWidth:'45%',borderRadius:5,backgroundColor:COLORS.green,minHeight:50,maxHeight:50,alignItems:'center',justifyContent:'center'}}
                onPress={()=>{
                    createInstantConv();
                }}
              >
                  <Text style={styleFont.message}>Discuter</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={{minWidth:'45%',borderRadius:5,backgroundColor:COLORS.green,minHeight:50,maxHeight:50,alignItems:'center',justifyContent:'center'}}
                onPress={()=>{

                    //Tag testimony : state pour voir si ce testimony est déjà marqué
                    tagTestBackEnd.createTagTest(email)
                    
                }}
              >
                  <Text style={styleFont.message}>Marquer</Text>
              </TouchableOpacity>
            </View>


                {testiWritten&&
                <View style={{flex:1,flexDirection:'column',gap:5,paddingTop:10}}>
                  <Text style={styleFont.title}>Son témoignage</Text>
                  <Timeline 
              // style={styles.list}
                  data={dataTest}
                  separator={true}
                  circleSize={20}
                  circleColor='rgb(80,200,120)'
                  lineColor='rgb(80,200,120)'
                  timeContainerStyle={{minWidth:52, marginTop: 0}}
                  timeStyle={{textAlign: 'center', backgroundColor:COLORS.green, color:'white', padding:5, borderRadius:13, overflow: 'hidden'}}
                  descriptionStyle={{color:'gray'}}
                  options={{
                      style:{paddingTop:20}
                  }}
                  />

                  <View style={{flex:1,flexDirection:'column',gap:5,paddingTop:10,paddingBottom:10}}>
                    <Text style={styleFont.title}>Son message</Text>
                    <Text>{testMessage}</Text>
                  </View>
                </View>
                }

                
                {!testiWritten&&
                <View style={{flex:1,flexDirection:'column'}}>
                  <Text style={styleFont.title}>Son témoignage</Text>
                  <Text style={styleFont.message}>Ce membre n'a pas encore écris son témoignage</Text>
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
export default ViewUser;