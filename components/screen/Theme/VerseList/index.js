import { View,Text,Image, Alert } from "react-native";
import { ScrollView,FlatList, TextInput } from "react-native-gesture-handler";
import { TouchableOpacity, ActivityIndicator,RefreshControl } from "react-native";
import {COLORS,icons,images,SIZES} from '../../../../constants';
import styleCom from '../../../../styles/common'
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import  styleFont from '../../../../styles/fonts'
import { Avatar } from '@rneui/themed';
import { ListItem, BottomSheet,CheckBox  } from '@rneui/themed';
import { Badge } from '@rneui/themed';
import { Tab } from "@rneui/base";

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc,  query, where, getDocs, collection } from "firebase/firestore";
import {auth,db} from "../../../../firebase"

import * as tagBackEnd from '../../../../backend/TagVerse'
import * as biCollabBackEnd from '../../../../backend/BiCollab'
import * as bookBackEnd from '../../../../backend/importBook'
import { useIsFocused } from "@react-navigation/native";
import bibFr from '../../../../backend/bible/Data/json/fr_apee.json';

const TagList = ({ navigation }) =>{

  const [resBook,setResBook]=useState([]);
  const [resQuery, setResQuery] = useState([]);
  const [resQueryt1, setResQueryt1] = useState([]);
  const [resQueryt2, setResQueryt2] = useState([]);
  const [resQueryt3, setResQueryt3] = useState([]);
  const [resQueryt4, setResQueryt4] = useState([]);

  const [showActivty , setShowActivity] = useState(false);
  const isFocusedSc = useIsFocused();
  const [refreshing, setRefreshing] = useState(false);
  const [allVerses,setAllVerse]=useState([]);
  const [isSelectVisible,setIsSelectVisible]=useState(false);
  const [bicollabArr,setBicollabArr]=useState([]);
  const [bicollabName,setBicollabName]=useState([]);
  const [arrCheckedBicollab,setArrCheckedBicollab]=useState([false,false,false,false,false,false,false,false,false,false]);

  var arrName = [];


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
    getAllTags();
    

  }, [isFocusedSc])




  const getBook = async() =>{

    console.log('---------- INIT TAG SCREEN --------')

    //const q = query(collection(db, "cities"), where("capital", "==", true));

    await resetFilter()
    .then(async()=>{
  
    await biCollabBackEnd.getAllBicollab()
    .then((arrQuery)=>{
      setTimeout(function hideToast() {
        console.log('await succesful BOOK : '+JSON.stringify(arrQuery));

        setResBook(arrQuery);
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
}

async function tagFilter(bicollab){
  await tagBackEnd.readTagsInBicollab(bicollab)
  .then((arrTag)=>{
    console.log('TAG RESULT : \n '+JSON.stringify(arrTag) );

    setTimeout(async function hideToast() {

      //Filtre par thème 

      var theme1 = arrTag.filter((c)=>{return c.backColor == '#97C1A9'})
      var theme2 = arrTag.filter((c)=>{return c.backColor == '#A3E1DC'})
      var theme3 = arrTag.filter((c)=>{return c.backColor == '#F5D2D3'})
      var theme4 = arrTag.filter((c)=>{return c.backColor == '#F6EAC2'})

      setResQuery(arrTag);

      setResQueryt1(theme1);
      setResQueryt2(theme2);
      setResQueryt3(theme3);
      setResQueryt4(theme4);


      setShowActivity(false);
      }, 2000)

      
    });
}




  const getAllTags = async() =>{
      console.log('---------- TAG SCREEN --------')



      await tagBackEnd.readAllTags()
      .then((arrQuery)=>{
        setTimeout(async function hideToast() {
          console.log('TAG RESULT : \n '+JSON.stringify(arrQuery) );

          //Filtre par thème 

          var theme1 = arrQuery.filter((c)=>{return c.backColor == '#97C1A9'})
          var theme2 = arrQuery.filter((c)=>{return c.backColor == '#A3E1DC'})
          var theme3 = arrQuery.filter((c)=>{return c.backColor == '#F5D2D3'})
          var theme4 = arrQuery.filter((c)=>{return c.backColor == '#F6EAC2'})

          setResQuery(arrQuery);

          setResQueryt1(theme1);
          setResQueryt2(theme2);
          setResQueryt3(theme3);
          setResQueryt4(theme4);

          await getBook()
          .then(async()=>{

            setShowActivity(false);
          })

          
        }, 2000);
      })
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

            {showActivty&&
              <View style={{flex:1,flexDirection:"column",alignItems:"center"}}>
                  <ActivityIndicator style={{marginTop:15}} size="large" color={COLORS.green} />
              </View>
            }

            {/* Header */}
            <View style={{flex:1,flexDirection:'row',maxHeight:50,minHeight:50,justifyContent:'center',alignItems:'center',minWidth:'100%',maxWidth:'100%',borderBottomColor:COLORS.green,borderBottomWidth:2}}>
                <Text style={styleFont.message}>Versets marqués</Text>
                <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',marginLeft:'auto',padding:10,gap:10}}>
               
                    
                    <TouchableOpacity style={{}} onPress={()=>{
                      setIsSelectVisible(true);
                    }}>
                        <Image style={{width:30,height:30}} source={require('../../../../assets/icons/choice.png')}/>
                    </TouchableOpacity>
                </View>
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
                getAllTags();
                setRefreshing(false);
              }}/>}>
              <View style={{flex:1,flexDirection:'column',minWidth:'90%',borderBottomWidth:3,borderBottomColor:COLORS.green}}>

              <Text style={[styleFont.title,{backgroundColor:colorUnderline[0].code,alignItems:'center',justifyContent:'center',height:40,borderRadius:20,paddingLeft:10,paddingRight:10}]}>
                  {colorUnderline[0].theme}
              </Text>
                {resQueryt1.map((t)=>{
                  var numChap = parseInt(t.refChapter)+1;
                  return(
                    <View style={{flex:1,flexDirection:'column',minWidth:'90%',minHeight:100}}>
                      <Text style={styleFont.subtitle}>
                          {t.refBook+' '+numChap+' '+t.refVerse}
                      </Text>
                      <Text style={styleFont.message}>
                          {
                            t.verseText
                        }
                      </Text>
                    </View>
                  );
                })}
              <Text style={[styleFont.title,{backgroundColor:colorUnderline[1].code,alignItems:'center',justifyContent:'center',height:40,borderRadius:20,paddingLeft:10,paddingRight:10}]}>
                  {colorUnderline[1].theme}
              </Text>
                {resQueryt2.map((t)=>{
                  var numChap = parseInt(t.refChapter)+1;
                    return(
                      <View style={{flex:1,flexDirection:'column',minWidth:'90%',minHeight:100}}>
                        <Text style={styleFont.subtitle}>
                            {t.refBook+' '+numChap+' '+t.refVerse}
                        </Text>
                        <Text style={styleFont.message}>
                            {
                              t.verseText
                          }
                        </Text>
                      </View>
                    );
                })}
                <Text style={[styleFont.title,{backgroundColor:colorUnderline[2].code,alignItems:'center',justifyContent:'center',height:40,borderRadius:20,paddingLeft:10,paddingRight:10}]}>
                  {colorUnderline[2].theme}
                </Text>
                {resQueryt3.map((t)=>{
                  var numChap = parseInt(t.refChapter)+1;
                  return(
                    <View style={{flex:1,flexDirection:'column',minWidth:'90%',minHeight:100}}>
                      <Text style={styleFont.subtitle}>
                          {t.refBook+' '+numChap+' '+t.refVerse}
                      </Text>
                      <Text style={styleFont.message}>
                          {
                            t.verseText
                        }
                      </Text>
                    </View>
                  );
                })}
                <Text style={[styleFont.title,{backgroundColor:colorUnderline[3].code,alignItems:'center',justifyContent:'center',height:40,borderRadius:20,paddingLeft:10,paddingRight:10}]}>
                  {colorUnderline[3].theme}
                </Text>
                {resQueryt4.map((t)=>{
                  var numChap = parseInt(t.refChapter)+1;
                  return(
                    <View style={{flex:1,flexDirection:'column',minWidth:'90%',minHeight:100}}>
                      <Text style={styleFont.subtitle}>
                          {t.refBook+' '+numChap+' '+t.refVerse}
                      </Text>
                      <Text style={styleFont.message}>
                          {
                            t.verseText
                        }
                      </Text>
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
export default TagList;