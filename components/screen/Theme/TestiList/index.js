import { View,Text,Image, Alert } from "react-native";
import { ScrollView,FlatList, TextInput } from "react-native-gesture-handler";
import { TouchableOpacity, ActivityIndicator,RefreshControl } from "react-native";
import {COLORS,icons,images,SIZES} from '../../../../constants';
import styleCom from '../../../../styles/common'
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import  styleFont from '../../../../styles/fonts'
import { Avatar } from '@rneui/themed';
import { ListItem, BottomSheet } from '@rneui/themed';
import { Badge } from '@rneui/themed';
import { Tab } from "@rneui/base";

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc,  query, where, getDocs, collection } from "firebase/firestore";
import {auth,db} from "../../../../firebase"

import * as tagTestBackEnd from '../../../../backend/TagTestimony'
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const TestiList = ({ navigation }) =>{

  const [resQuery, setResQuery] = useState([]);
  const [showActivty , setShowActivity] = useState(false);
  const isFocusedSc = useIsFocused();
  const [refreshing, setRefreshing] = useState(false);
  const [allVerses,setAllVerse]=useState([]);
  const [isVisible,setIsVisible]=useState(false);

  const colorUnderline = [
    {theme:'Paix',code:'#97C1A9'},
    {theme:'Sagesse',code:'#A3E1DC'},
    {theme:'Amour',code:'#F5D2D3'},
    {theme:'Joie',code:'#F6EAC2'},
    {theme:'Suppr.',code:'#FFFFFF'},
  ]

  useEffect(() => {
    // write your code here, it's like componentWillMount
    setShowActivity(true);
    getAllTestimonies();

  }, [isFocusedSc])

  const list = [
    {
        title: 'Supprimer ce marquage',
        containerStyle: { backgroundColor: 'red' },
        titleStyle: { color: 'white' },
        onPress:()=>{
            createTwoButtonAlert(id)
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

    const createTwoButtonAlert = (idTesti) =>
    Alert.alert('Supprimer ce marquage', 'Souhaitez-vous vraiment supprimer ce marquage ? ', [
      {
        text: 'NON',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OUI', onPress: () => {
          convBackEnd.DeleteConv(idConv);
      }},
  ]);

  const getAllTestimonies = async() =>{
      console.log('---------- TAG SCREEN --------')

      await tagTestBackEnd.readAllTagTests()
      .then((arrQuery)=>{
        console.log('await succesful tag !');
        setTimeout(function hideToast() {
          setResQuery(arrQuery);
          setShowActivity(false);
        }, 2000);
      })
  }



  const TestiItem = ({id,idUser,usFirst,usName,usAvatar, usPseudo, before, during, after}) => (

    <View style={{flex:1,flexDirection:'column',minWidth:'90%'}}>

          <View style={{flex:1,flexDirection:"column",backgroundColor:'#fff',padding:0,alignItems:"center",padding:10,borderRadius:20,marginBottom:10}}>
              
              {/* Header card */}
              <View style={{flex:1,flexDirection:"row",gap:10}}>
                  <Avatar
                  rounded
                  source={{ uri: usAvatar }}
                  />
              <View style={{flex:1,flexDirection:"column"}}>

                  <View style={{flex:1,flexDirection:"column",borderBottomColor:COLORS.green,borderBottomWidth:3,justifyContent:'center'}}>
                      <View style={{flex:1,flexDirection:"row"}}>
                          <Text>{usFirst +' '+usName}</Text>
                      </View>
                      <TouchableOpacity style={{justifyContent:'flex-end', marginLeft:"auto",justifyContent:'center'}} onPress={
                      ()=>{
                          setIsVisible(true);
                      }
                  }>
                              <Image style={{width:30,height:30}} source={require('../../../../assets/icons/list.png')} />
                  </TouchableOpacity>
                  </View>
                  <View style={{flex:1,flexDirection:"column"}}>
                    <Text style={styleFont.title}>Avant</Text>
                    <Text style={styleFont.message}>{before.content.substring(0,100)}</Text>
                    <Text style={styleFont.title}>Pendant</Text>
                    <Text style={styleFont.message}>{during.content.substring(0,100)}</Text>
                    <Text style={styleFont.title}>Après</Text>
                    <Text style={styleFont.message}>{after.content.substring(0,100)}</Text>
                  </View>
                  <TouchableOpacity style={styleCom.button} onPress={()=>{
                      navigation.navigate('UserView',{emailUser:idUser});
                  }}>
                    <Text >Voir </Text>
                  </TouchableOpacity>
              </View>

              </View>
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
  );

  return (
        <SafeAreaView style={{flex:1,backgroundColor:COLORS.lightWhite,padding:0,alignItems:"center",gap:10}}>

            {showActivty&&
              <View style={{flex:1,flexDirection:"column",alignItems:"center"}}>
                  <ActivityIndicator style={{marginTop:15}} size="large" color={COLORS.green} />
              </View>
            }

            {/* Header */}
            <View style={{flex:1,flexDirection:'row',maxHeight:50,minHeight:50,justifyContent:'center',alignItems:'center',minWidth:'100%',maxWidth:'100%',borderBottomColor:COLORS.green,borderBottomWidth:2}}>
                <Text style={styleFont.message}>Témoignages marqués</Text>
            </View>
          
          <ScrollView style={{width:'100%',padding:0}}
            contentContainerStyle={{width:'100%',minHeight:'90%',padding:0}}
            refreshControl={
            <RefreshControl                   
              refreshing={refreshing}
              colors={[COLORS.green]}
              tintColor={COLORS.green}
              onRefresh={()=>{
                setRefreshing(true);
                getAllTestimonies();
                setRefreshing(false);
              }}/>}>
              <FlatList 
                  data={resQuery}
                  renderItem={({item}) => <TestiItem id={item.id} idUser={item.idUser} usFirst={item.usFirst} usName={item.usName} usAvatar={item.usAvatar} usPesudo={item.usPseudo} before={item.shortBefore} during={item.shortDuring} after={item.shortAfter} />}
                  keyExtractor={item => item.id}
                  style={{width:"100%"}}
              />
          </ScrollView>
        </SafeAreaView>
    )
}
export default TestiList;