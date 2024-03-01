import { View,Text,Image, Alert } from "react-native";
import { ScrollView,FlatList, TextInput } from "react-native-gesture-handler";
import { TouchableOpacity, ActivityIndicator,RefreshControl } from "react-native";
import {COLORS,icons,images,SIZES} from '../../../../constants';
import styleCom from '../../../../styles/common'
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import  styleFont from '../../../../styles/fonts'
import { Avatar,CheckBox } from '@rneui/themed';
import { ListItem, BottomSheet } from '@rneui/themed';
import { Badge } from '@rneui/themed';
import { Tab } from "@rneui/base";

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc,  query, where, getDocs, collection } from "firebase/firestore";
import {auth,db} from "../../../../firebase"
import CardConv from './NoteCard'

import * as noteBackEnd from '../../../../backend/Notes'
import * as bicollabBackEnd from '../../../../backend/BiCollab'
import * as bookBackEnd from '../../../../backend/importBook'
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import NoteCard from "./NoteCard";
//import * from '../../../../'

const NoteList = ({ navigation,route }) =>{

  const [resQuery, setResQuery] = useState([]);
  const [showActivty , setShowActivity] = useState(false);
  const isFocusedSc = useIsFocused();
  const [refreshing, setRefreshing] = useState(false);
  const [allVerses,setAllVerse]=useState([]);
  const [isSelectVisible,setIsSelectVisible]=useState(false);

  const [resBook,setResBook]=useState([]);
  const [resQueryt1, setResQueryt1] = useState([]);
  const [resQueryt2, setResQueryt2] = useState([]);
  const [resQueryt3, setResQueryt3] = useState([]);
  const [resQueryt4, setResQueryt4] = useState([]);

  const [bicollabArr,setBicollabArr]=useState([]);
  const [bicollabName,setBicollabName]=useState([]);

  const [arrCheckedBicollab,setArrCheckedBicollab]=useState([false,false,false,false,false,false,false,false,false,false]);
  
  var arrName = [];

  useEffect(() => {
    // write your code here, it's like componentWillMount
    setShowActivity(true);
    getAllNotes();

  }, [])



  async function getAllVerse(book,num,numVerse,idTest){
    var dataVers = '';
    const vers = await AsyncStorage.getItem('VERS_BI');
    if(vers !=''){
        dataVers=vers;
    }else{
        dataVers= 'Colombe'
    }

    bookBackEnd.searchVerse('fr',dataVers,book,num,numVerse,idTest);
  }

  const getAllNotes = async() =>{
      console.log('---------- INIT CONV SCREEN --------')

      //const q = query(collection(db, "cities"), where("capital", "==", true));

      await noteBackEnd.readAllNotes()
      .then(async(arrQuery)=>{
          
          await bicollabBackEnd.getAllBicollab()
          .then(async(arrBook)=>{
            console.log('version',arrBook);
            setTimeout(async function hideToast() {
              setResQuery(arrQuery);
              setResBook(arrBook)
              setShowActivity(false);

            }, 2000);
          })
        
      })
  }

function setCheckedLine(index,idLine,nameBicollab){
  
  arrName = bicollabName;
    var arrBuffer =[];
    arrCheckedBicollab.map((a,i)=>{
      console.log('index :'+i+' '+index)
      if(i == index){
        arrBuffer.push(!a);
        console.log('checked or not : '+a)
        if(a){
          var idx = arrName.indexOf(idLine);
          arrName.splice(idx,1);
        }else{
          arrName.push(idLine);
        }
      }else{
        arrBuffer.push(a);
      }
    })
    setTimeout(()=>{
      setArrCheckedBicollab(arrBuffer);
      setBicollabName(arrName);  
    },500)

    console.log('arrCheck state '+index+'/'+arrCheckedBicollab)
    console.log('arrCheck state '+bicollabName);

}

async function resetFilter(){

  
  for(let r=0;r<resBook.length;r++){
    arrCheck.push(false)
    setBicollabArr(arrCheck);
    setBicollabName([]);

  }
  console.log('arrCheck state  : '+arrCheck)

}

async function tagFilter(bicollab){

  console.log('filter : '+bicollabName)
  await noteBackEnd.readAllNotesInBicollab(bicollab)
  .then((arrRes)=>{
    console.log('NOTE RESULT BICOL : \n '+JSON.stringify(arrTag) );

    setTimeout(async function hideToast() {

      setResQuery(arrRes);
      setShowActivity(false);
      }, 2000)

      
    });
}


const SelectConv = ({index,id,name,version,image,date}) => (

  <View style={{flex:1,flexDirection:'row',minWidth:'90%',backgroundColor:'#fff',alignItems:'center'}}>
      <CheckBox
          checked={arrCheckedBicollab[index]}
          onPress={()=>{setCheckedLine(index,id,name)}}
          iconType="material-community"
          checkedIcon="checkbox-outline"
          uncheckedIcon={'checkbox-blank-outline'}
          checkedColor={COLORS.green}

      />
      <Text style={styleFont.message}>{name}</Text>
  </View>
        );




    return (
      <SafeAreaView style={{flex:1,flexDirection:"column",padding:0,alignItems:"center",padding:10,backgroundColor:'#ffffff'}}>

      {/*View header => plus tard le cacher comme une option ... et afficher plutôt le chapitre et un bouton
          Cacher aussi dans le menu annotations            
      */}
            {showActivty&&
              <View style={{flex:1,flexDirection:"column",alignItems:"center"}}>
                  <ActivityIndicator style={{marginTop:15}} size="large" color={COLORS.green} />
              </View>
            }

            {/* Header */}
            <View style={{flex:1,flexDirection:'row',maxHeight:50,minHeight:50,justifyContent:'center',alignItems:'center',minWidth:'100%',maxWidth:'100%',borderBottomColor:COLORS.green,borderBottomWidth:2}}>
                <Text style={styleFont.message}>Annotations</Text>
                <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',marginLeft:'auto',padding:10,gap:10}}>
               
                    
                    <TouchableOpacity style={{}} onPress={()=>{
                      setIsSelectVisible(true);
                    }}>
                        <Image style={{width:30,height:30}} source={require('../../../../assets/icons/choice.png')}/>
                    </TouchableOpacity>
                </View>
            </View>

          {/* CONTENT */}
          <ScrollView style={{width:'100%',padding:0}}
            contentContainerStyle={{width:'100%',minHeight:'90%',padding:0}}
            refreshControl={
            <RefreshControl                   
              refreshing={refreshing}
              colors={[COLORS.green]}
              tintColor={COLORS.green}
              onRefresh={()=>{
                setRefreshing(true);
                getAllNotes();
                setRefreshing(false);
              }}/>}>
              <View style={{flex:1,flexDirection:'column',minWidth:'90%',borderBottomWidth:3,borderBottomColor:COLORS.green}}>

              {resQuery.map((n)=>{

                return(
                <View style={{flex:1,flexDirection:'column',minWidth:'90%',minHeight:100}}>
                    <Text style={styleFont.title}>
                        {n.refBook +' '+n.refChapter+' '+n.refVerse}
                    </Text>
                    <Text style={styleFont.subtitle}>
                        {getAllVerse(n.refBook,n.refChapter,n.refVerse,n.refTest)}
                    </Text>
                    <View style={{flex:1,flexDirection:'column'}}>
                    {n.contArray.map((c)=>{
                        return(
                          <View style={{flex:1,flexDirection:"column",minWidth:'90%',minHeight:100,backgroundColor:'#ffffff',padding:10,gap:5,marginBottom:5,borderRadius:10}}>
                          <View style={{flex:1,flexDirection:"row",minWidth:'90%'}}>
                          <View style={{marginTop:15}}>
                              <TouchableOpacity onPress={()=>{
                                      navigation.navigate('ViewProfile',{emailUser:usId});
                                      
                                  }}>
                                      <Avatar
                                      rounded
                                      source={{ uri: c.usAvatar }}
                                      
                                      />
                              </TouchableOpacity>
                          </View>
                  
                          <View style={{flex:1,flexDirection:"column",minWidth:'90%',borderRadius:15}}>
                  
                              {/* Content header */}
                              <View style={{flex:1,flexDirection:"row",minWidth:'90%'}}>
                                  <View style={{flex:1,flexDirection:"column",minWidth:'90%',padding:10}}>
                                      <View style={{flex:1,flexDirection:"row",minWidth:'90%'}}>
                                          <TouchableOpacity onPress={()=>{
                                              navigation.navigate('ViewProfile',{emailUser:c.userId});
                                          }}>
                                              <Text>{c.usFirst + ' ' +c.usName+' - '}</Text>
                                          </TouchableOpacity>
                                          <TouchableOpacity>
                                              <Text style={{color:COLORS.green}}>Follow</Text>
                                          </TouchableOpacity>
                                      </View>
                                      <Text style={{color:"#BEBEBE"}}>{'@'+c.usPseudo}</Text>
                                  </View>
                                  <TouchableOpacity style={{justifyContent:'flex-end', marginLeft:"auto",paddingRight:20,justifyContent:'center'}}
                                      onPress={
                                          ()=>{
                                              /*if(owner)
                                                  //setIsOwnerVisible(true);
                                              else{
                                                  //setIsNoteVisible(true);
                                              }*/
                                          }
                                      }>
                                              <Image style={{width:30,height:30}} source={require('../../../../assets/icons/list.png')} />
                                  </TouchableOpacity>
                              </View>
                  
                                  {/* Content com */}
                                  <View style={{flex:1,flexDirection:"column",minWidth:'90%',padding:10}}>
                                          <Text>
                                              {c.content}
                                          </Text>
                                          <Text style={{fontSize:12,fontStyle:"italic",color:"#BEBEBE"}}>
                                              {c.dateCont}
                                          </Text>
                                  </View>
                                  <View style={{flex:1,flexDirection:"row",minWidth:'90%',padding:10}}>
                                          <TouchableOpacity onPress={()=>{
                                                  addPrayerNote(c.id,c.contId)
                                              }}>
                                              <Image style={{width:30,height:30}} source={require('../../../../assets/icons/pray.png')} />
                                          </TouchableOpacity>
                                          <Text>{c.nbLikes}</Text>
                                  </View>
                          </View>
                        </View>
                                    
                        </View>
                        );
                      })
                    }
                    </View>
                </View>
                );
                  
                
              })}
              </View>
          </ScrollView>

          {/* BOTTOM SETTINGS */}
          <BottomSheet modalProps={{}} isVisible={isSelectVisible}>
            <View style={{flex:1,flexDirection:'column',minWidth:'90%',backgroundColor:'#fff',borderTopLeftRadius:20,borderTopRightRadius:20}}>
              <View style={{flex:1,alignItems:'center',justifyContent:'center',minHeight:50,borderBottomColor:COLORS.green,borderBottomWidth:2}}>
                  <Text style={[styleCom.message,{alignItems:'center',justifyContent:'center'}]}>Trier par bible créée </Text>
              </View>
                <ScrollView contentContainerStyle={{flex:1,flexDirection:"column",padding:10}}>
                  <FlatList 
                    data={resBook}
                    renderItem={({item,index}) => <SelectConv index={index} id={item.id} name={item.nom} version={item.version} image={item.image} date={item.date} />}
                    keyExtractor={item => item.id}
                    style={{width:"100%"}}
                  />
                </ScrollView>
                <TouchableOpacity style={{backgroundColor:COLORS.green,alignItems:'center',justifyContent:'center',minHeight:40}} onPress={()=>{
                  tagFilter(bicollabName);
                }}>
                    <Text style={[styleFont.message,{color:'#fff'}]}>Filtrer</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{backgroundColor:COLORS.green,alignItems:'center',justifyContent:'center',minHeight:40}} onPress={()=>{
                  resetFilter();
                }}>
                    <Text style={[styleFont.message,{color:'#fff'}]}>Effacer les filtres</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{backgroundColor:COLORS.darkGrayMsg,alignItems:'center',justifyContent:'center',minHeight:40}} onPress={()=>{
                  setIsSelectVisible(false);
                }}>
                    <Text style={[styleFont.message,{color:'#fff'}]}>Annuler</Text>
                </TouchableOpacity>
            </View>
          </BottomSheet>
        </SafeAreaView>
    )
}
export default NoteList;