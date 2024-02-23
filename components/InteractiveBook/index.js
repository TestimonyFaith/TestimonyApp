import { View,Text,Image,Alert } from "react-native";
import { ScrollView,FlatList, TextInput } from "react-native-gesture-handler";
import { TouchableOpacity, ActivityIndicator } from "react-native";
import {COLORS,FONT,icons,images,SIZES} from '../../constants';
import styleCom from '../../styles/common'
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import  styleFont from '../../styles/fonts'
import { Avatar } from '@rneui/themed';
import { ListItem,BottomSheet } from '@rneui/themed';
import { Badge } from '@rneui/themed';
import { Tab } from "@rneui/base";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc,  query, where, getDocs, collection } from "firebase/firestore";
import {auth,db} from "../../firebase"
import * as noteBackEnd from'../../backend/Notes'
import * as userBackEnd from '../../backend/Users'
import * as tagVerseBackEnd from '../../backend/TagVerse'
import moment from 'moment';

import bibFr from '../../backend/bible/Data/json/fr_apee.json'
import * as bookBackEnd from '../../backend/importBook';
import { useIsFocused } from "@react-navigation/native";
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';

const InteractiveBook = ({navigation,route}) =>{

//show/hide states
const isFocused = useIsFocused();
const [showBook,setShowBook]=useState(true);
const [showChapter,setShowChapter]=useState(false);
const [showVerse,setShowVerse]=useState(false);
const [showAnnotations,setShowAnnotations]=useState(false);
const [showCompare,setShowCompare]=useState(false);
const [showMessageNote, setShowMessageNote]=useState(true);
const [showAllNotes, setShowAllNotes]=useState(false);
const [showOptions, setShowOptions]=useState(false);
const [noteModID,setNoteModID]=useState('');
const [contModId,setContModId]=useState('');
const [otherVersions,setOtherVersions]=useState(false);
const [otherCompVersions,setOtherCompVersions]=useState(false);
const [otherVerses,setOtherVerses]=useState(false);
const [otherCompVerses,setOtherCompVerses]=useState(false);

//Référence des sélections 
const [bookRef,setBookRef]=useState('');
const [testRef,setTestRef]=useState('');
const [bookName,setBookName]=useState('');
const [chapRef,setChapRef]=useState('');
const [verseRef,setVerseRef]=useState('');
const [nbChapBook,setNbChapBook]=useState(0);
const [idxBook,setIdxBook]=useState(0);
const [annotations,setAnnotations]=useState([]);
const [allAnnotations,setAllAnnotations]=useState([]);
const [noteContent,setNoteContent]=useState('');

//state des bottomsheet 
const [isVisible,setIsVisible]=useState(false);
const [isThemeVisible,setIsThemeVisible]=useState(false);
const [isOptionVisible,setIsOptionVisible]=useState(false);
const [isPolicyVisible,setIsPolicyVisible]=useState(false);
const [contentVerse, setContentVerse]=useState('');

//State des data
const [dataAbb, setDataAbb]=useState([]);
const [dataChap, setDataChap]=useState([]);
const [dataVerse, setDataVerse]=useState([]);

//Customization 
const [colorVerse, setColorVerse]=useState([]);
const [sizePolice, setSizePolice]=useState(14);
const [famillyPolice,setFamillyPolice]=useState('');

/*const colorUnderline = [
    {theme:'Paix',code:'#50C878'},
    {theme:'Sagesse',code:'#2AB7CA'},
    {theme:'Amour',code:'#DB0029'},
    {theme:'Joie',code:'#FFCB04'},
]*/

const colorUnderline = [
    {theme:'Paix',code:'#97C1A9'},
    {theme:'Sagesse',code:'#A3E1DC'},
    {theme:'Amour',code:'#F5D2D3'},
    {theme:'Joie',code:'#F6EAC2'},
    {theme:'Suppr.',code:'#FFFFFF'},
]

const fonctionVerse = [
    {
        title: 'Partager',
        color:COLORS.green,
        onPress:(lang,vers,book,chap,numVerse,contentVerse)=>{
        
        } 
    },
    {
        title: 'Annoter',
        color:COLORS.green,
        onPress:(lang,vers,book,chap,numVerse,contentVerse)=>{
            ()=>{
                setVerse(num,content);
            }
        } 
    },
    {
        title: 'Copier',
        color:COLORS.green,
        onPress:(lang,vers,book,chap,numVerse,contentVerse)=>{
        
        } 
    }
]

const deepFonctionVerse = [
    {
        title: 'Comparer',
        color:COLORS.green,
        onPress:async(lang,vers,book,chap,numVerse,contentVerse,testament)=>{
            
            await getOtherCompVersion(lang,'',book,chap,numVerse,testament)
            .then(()=>{
                setShowCompare(true);
            })
        } 
    },
    {
        title: 'Defintions',
        color:'#393939',
        onPress:(lang,vers,book,chap,numVerse,contentVerse)=>{
        
        } 
    },
    {
        title: 'Liens',
        color:'#393939',
        onPress:(lang,vers,book,chap,numVerse,contentVerse)=>{
        
        } 
    },
    {
        title: 'Explications',
        color:'#393939',
        onPress:(lang,vers,book,chap,numVerse,contentVerse)=>{
        
        } 
    }
]

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

useEffect(() => {
    getAllAbb();
}, [isFocused])



const getAllNotes = async() =>{

    await noteBackEnd.readAllNotes()
    .then(async(arrNotes)=>{
        setAllAnnotations(arrNotes);
        await getAllAbb()
        .then(()=>{
            console.log('abb readed')
        })
    })

}

const getAllAbb = async() =>{

    setShowActivity(true);
    var data = []

    await bookBackEnd.getAllBooks('fr',route.params.versBook)
    .then((books)=>{
        setTimeout(() => {
            setDataAbb(books);
            setShowActivity(false);
        }, 500);
    })

}

async function getAllChap(book,testament){

    setShowActivity(true);
    var data = []

    await bookBackEnd.getAllChapters('fr',route.params.versBook,book,testament)
    .then((chap)=>{
        setTimeout(() => {
            setDataChap(chap);
            setShowActivity(false);
          }, 500);
    })


}

async function getAllVerse(num){

    setShowActivity(true);
    var data = [];
    var tag = [];
    var note = [];
    var pixAvatar = [];
    var isTagged = false;
    var idxTag = '';
    var tagColor = COLORS.lightWhite;
    var i = 0;

    
    await noteBackEnd.readAvatarByRef(bookRef,num)
    .then(async(arrNote)=>{
        await tagVerseBackEnd.readTagByChapRef(bookRef,num)
        .then(async(arrTags)=>{
            await bookBackEnd.getAllVerses('fr',route.params.versBook,bookRef,num,testRef)
            .then((allVerses)=>{

                allVerses.forEach((verse)=>{

                    //console.log('get verse :'+i);

                    //Filter on tag 
                    tag = arrTags.filter((v)=>{return v.refVerse == i})
                    note = arrNote.filter((n)=>{return n.refVerse == i})

                    console.log(' ARR TAG : '+tag.length+' '+JSON.stringify(tag));
                   // console.log(' ARR NOTE : '+note.length);

                    if(tag.length >0){
                        tagColor = tag[0].backColor;
                        isTagged = true;
                        idxTag = tag[0].id;
                    }else{
                        tagColor = COLORS.lightWhite
                        isTagged = false;
                        idxTag = '';
                    }

                    if(note.length >0){
                        data.push({id:i,num:i+1,verseContent:verse.Text,color:tagColor,pictures:note[0].usAvatar,tagged:isTagged,idx:idxTag});

                    }else{
                        data.push({id:i,num:i+1,verseContent:verse.Text,color:tagColor,pictures:[],tagged:isTagged,idx:idxTag});

                    }

                    //console.log('pixavatar : '+pixAvatar)

                    i++;

                });
            })
        })
    })


    setTimeout(() => {
        setDataVerse(data);
        setShowActivity(false);
      }, 2000);

}

const setBook = async(idx,name,testament) =>{

    var idTest = 0;

    if(testament == 'ancien'){
        idTest = 0;
    }else if(testament == 'nouveau'){
        idTest = 1;
    }

    console.log('set book : '+idx+' '+name+' ')
    await getAllChap(name,idTest)
    .then(()=>{
        setBookRef(name);
        setIdxBook(idx);
        setTestRef(idTest);
        setBookName(name);
        setShowBook(false);
        setShowChapter(true);
        setShowVerse(false);
        setShowAnnotations(false);
    })

}

const setChapter = async(chap) =>{
    await getAllVerse(chap)
    .then(()=>{
        setChapRef(chap);
        setShowBook(false);
        setShowChapter(false);
        setShowVerse(true);
        setShowAnnotations(false);
    })

}

const setVerse = async(verse,contentV) =>{
   await noteBackEnd.readByRef(bookRef,chapRef,verse,route.params.idBook)
    .then((arrNotes)=>{

        console.log('set verse : '+arrNotes)
            setVerseRef(verse);
            setShowBook(false);
            setShowChapter(false);
            setShowVerse(false);
            setShowAnnotations(true);
            setContentVerse(contentV);
      
            setTimeout(() => {
                setAnnotations(arrNotes);
                console.log('annotations : '+JSON.stringify(arrNotes));
              }, 2000);


    })
}

async function createNote(){
    
    //Ajouté paramètres à CREATENOTE !!
    const value = await AsyncStorage.getItem('USER_EMAIL') 
    if(value != undefined){
        await noteBackEnd.addNote(noteContent,bookRef,chapRef,verseRef,value,'#fff',route.params.idBook)
        .then(()=>{
            let toast = Toast.show('Note ajoutée', {
                duration: Toast.durations.LONG,
            });
        
            // You can manually hide the Toast, or it will automatically disappear after a `duration` ms timeout.
            setTimeout(function hideToast() {
                setVerse(verseRef);
                Toast.hide(toast);
            }, 2000);
        })
    }
}

async function cancelModify(){
    setNoteModID('');
}


async function addPrayerNote(id,idCont){
    const value = await AsyncStorage.getItem('USER_EMAIL') 
    if(value != undefined){
        await noteBackEnd.addLikeNote(value,id,idCont)
        .then(()=>{
            let toast = Toast.show('Réaction ajoutée', {
                duration: Toast.durations.LONG,
              });
        
              // You can manually hide the Toast, or it will automatically disappear after a `duration` ms timeout.
              setTimeout(function hideToast() {
                Toast.hide(toast);
              }, 500);
        })
    }
}

function incSizePolicy(){

    setSizePolice(sizePolice+1);
    AsyncStorage.setItem('fontSize',sizePolice+1);


}

function decSizePolicy(){

    setSizePolice(sizePolice-1);
    AsyncStorage.setItem('fontSize',sizePolice-1);


}


//Decalaration des dynamic components 

const Book = ({id,name,abb,nbChapters}) => (

    <TouchableOpacity style={{minHeight:100,minWidth:'90%',borderBottomColor:COLORS.darkGrey,borderBottomWidth:1,justifyContent:'center'}} onPress={
        ()=>{
            setBook(id,name,nbChapters);
        }
    }>
        <View style={{flex:1,flexDirection:'column'}}>
            <Text style={{padding:10,fontSize:14,fontWeight:'bold'}}> {name} </Text>
            <Text style ={{padding:10,fontSize:12,color:COLORS.darkGrayMsg}}>{nbChapters+' testament'}</Text>
        </View>
    </TouchableOpacity>

  );

const Chapter = ({num}) => (

    <TouchableOpacity style={{minHeight:50,minWidth:'90%',borderBottomColor:COLORS.darkGrey,borderBottomWidth:1,justifyContent:'center'}} onPress={
        ()=>{
            setChapter(num);
        }
    }>
        <View style={{flex:1,flexDirection:'column'}}>
            <Text style={{padding:10,fontSize:14,fontWeight:'bold'}}> Chapitre {parseInt(num)+1} </Text>
        </View>
    </TouchableOpacity>

  );

const Verse = ({num,content,color,isTagged,idxTag,pix}) => {

    const [colorFixed, setColorFixed]=useState(color);
    const [isColorVisible,setIsColorVisible]=useState(false);

   async function underlineVerse(color){

        if(color != '#FFFFFF'){

            console.log('pix : '+JSON.stringify(pix));
    
            if(!isTagged){
                console.log('----- CREATE NEW TAG ------------')
                const value = await AsyncStorage.getItem('USER_EMAIL') 
                if(value != ''){
                    tagVerseBackEnd.createTag(bookRef,chapRef,num,content,value,color,route.params.nameBook,route.params.idBook)
                    .then(()=>{
                        setColorFixed(color);
                    })
                }
            }else{
                const value = await AsyncStorage.getItem('USER_EMAIL') 
                if(value != ''){
                    dataToUpdate = {
                        refBook:bookRef,
                        refChapter:chapRef,
                        refVerse:num,
                        idUser:value,
                        backColor:color,
                        biCollabName:route.params.nameBook,
                        biCollabId:route.params.idBook,
                        date: moment().format("DD/MM/YYYY")
                    }
                    tagVerseBackEnd.updateTag(idxTag,dataToUpdate)
                    .then(()=>{
                        setColorFixed(color);
                    })
                }
            }
        }else{
            tagVerseBackEnd.deleteTag(idxTag);
        }
    }

    return (
    <View>
        <TouchableOpacity style={{minHeight:50,minWidth:'90%',paddingLeft:10,paddingRight:10,gap:1}} 
            onLongPress={
                ()=>{
                    setIsColorVisible(true);
                }
            }
        >
            <View style={{flex:1,flexDirection:'column'}}>
            <View style={{flex:1,flexDirection:'row',minWidth:'90%'}}>
                <Text style={{fontSize:14,fontWeight:'bold'}}> {num} </Text>
                <Text style={{backgroundColor:colorFixed,borderRadius:5,fontSize:16,padding:5,maxWidth:'90%',fontSize:sizePolice,fontFamily:famillyPolice}}> {content} </Text>
            </View>
            {pix != ''&&
                <View style={{flex:1,flexDirection:'row',minWidth:'20%',alignItems:'center',backgroundColor:COLORS.green,marginTop:5,marginBottom:5,borderRadius:10,padding:5}}>
                    <Text style={styleFont.message}>Annoté par : </Text>
                    <Avatar
                        rounded
                        source={{ uri: pix }}
                        />
                </View>
            }
            </View>
        </TouchableOpacity>
        <BottomSheet modalProps={{}} isVisible={isColorVisible}>
                    <View style={{flex:1,flexDirection:'column',minWidth:'90%',minHeight:200,backgroundColor:'#fff',gap:10,padding:10,alignItems:'center',justifyContent:'center',borderTopLeftRadius:20,borderTopRightRadius:20}}>
                       <ScrollView contentContainerStyle={{minWidth:'90%'}}>
                        <View style={{flex:1,flexDirection:'column',minWidth:'90%'}}>
                            <Text style={styleFont.messageH2}>Surligner avec la couleur</Text>
                            <Text style={styleFont.subtitleH2}>Chaque couleur est liée à une thématique</Text>
                            <View style={{flex:1,flexDirection:'row',minWidth:'90%',minHeight:70,backgroundColor:'#fff',gap:10,padding:10,alignItems:'center',justifyContent:'center'}}>
                                <TouchableOpacity style={{alignItems:'center',justifyContent:'center',width:50,height:50,backgroundColor:colorUnderline[0].code,borderRadius:10}} onPress={()=>{underlineVerse(colorUnderline[0].code); setIsColorVisible(false)}}><Text style={styleFont.message}>{colorUnderline[0].theme}</Text></TouchableOpacity>
                                <TouchableOpacity style={{alignItems:'center',justifyContent:'center',width:50,height:50,backgroundColor:colorUnderline[1].code,borderRadius:10}} onPress={()=>{underlineVerse(colorUnderline[1].code); setIsColorVisible(false)}}><Text style={styleFont.message}>{colorUnderline[1].theme}</Text></TouchableOpacity>
                                <TouchableOpacity style={{alignItems:'center',justifyContent:'center',width:50,height:50,backgroundColor:colorUnderline[2].code,borderRadius:10}} onPress={()=>{underlineVerse(colorUnderline[2].code); setIsColorVisible(false)}}><Text style={styleFont.message}>{colorUnderline[2].theme}</Text></TouchableOpacity>
                                <TouchableOpacity style={{alignItems:'center',justifyContent:'center',width:50,height:50,backgroundColor:colorUnderline[3].code,borderRadius:10}} onPress={()=>{underlineVerse(colorUnderline[3].code); setIsColorVisible(false)}}><Text style={styleFont.message}>{colorUnderline[3].theme}</Text></TouchableOpacity>
                            </View>
                        </View>
                        <View style={{flex:1,flexDirection:'column',minWidth:'90%'}}>
                            <Text style={styleFont.messageH2}>Agir</Text>
                            <Text style={styleFont.subtitleH2}>Annotez ou partagez le verset</Text>
                            <FlatList
                                horizontal={true}
                                data={fonctionVerse}
                                renderItem={({item}) => 
                                <View style={{flex:1,flexDirection:'row',marginLeft:5,marginRight:5}}>
                                    <TouchableOpacity style={{minHeight:40,maxHeight:40,borderRadius:20,backgroundColor:COLORS.green,alignItems:'center',justifyContent:'center'}}
                                    onPress={()=>{
                                        item.onPress('fr','',bookRef,chapRef,num,content);
                                    }}>
                                        <Text style={[styleFont.message,{color:'#fff',padding:10}]}>{item.title}</Text>
                                    </TouchableOpacity>
                                </View>
                                }
                                keyExtractor={item => item.id}
                                style={{width:"100%",gap:10}} 
                            />
                        </View>
                        <View style={{flex:1,flexDirection:'column',minWidth:'90%'}}>
                            <Text style={styleFont.messageH2}>En savoir plus</Text>
                            <Text style={styleFont.subtitleH2}>Approfondissez votre compréhension</Text>
                            <FlatList
                                horizontal={true}
                                data={deepFonctionVerse}
                                renderItem={({item}) => 
                                <View style={{flex:1,flexDirection:'row',marginLeft:5,marginRight:5}}>
                                    <TouchableOpacity style={{minHeight:40,maxHeight:40,borderRadius:20,backgroundColor:item.color,alignItems:'center',justifyContent:'center'}}
                                    onPress={()=>{
                                        item.onPress('fr','',bookRef,chapRef,num,content);
                                    }}>
                                        <Text style={[styleFont.message,{color:'#fff',padding:10}]}>{item.title}</Text>
                                    </TouchableOpacity>
                                </View>
                                }
                                keyExtractor={item => item.id}
                                style={{width:"100%",gap:10}} 
                            />
                        </View>
                        </ScrollView>
                    </View>
        </BottomSheet>
    </View>
    )

};

const NoteCard = ({id,usId,usAvatar,usFirst,usName,usPseudo,content,date,color,nbLikes,owner,contId}) => {

    const [isOwnerVisible,setIsOwnerVisible]=useState(false);
    const [isNoteVisible,setIsNoteVisible]=useState(false);

    const listOwner = [
        { 
          title: 'Signaler',
          onPress:(i)=>{
            //Fonction signalement  à faire !
            setIsVisible(false)
          } 
        },
        { 
          title: 'Modifier la note',
          onPress:(i)=>{
            setNoteModID(id);
            setContModId(contId);
            setNoteContent(content);
            setIsVisible(false);
          } 
        },
        {
          title: 'Supprimer la note',
          containerStyle: { backgroundColor: 'red' },
          titleStyle: { color: 'white' },
          onPress:(i)=>{
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
  
  const list = [
      { 
        title: 'Signaler',
        onPress:(i)=>{
          //Fonction signalement  à faire !
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
  
  const createTwoButtonAlert = async(idNote) =>
    Alert.alert('Supprimer la note', 'Souhaitez-vous vraiment supprimer la note ? ', [
      {
        text: 'NON',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OUI', onPress: async() => {
        //Event Backend faire un fonction suppression commentaire
        const value = await AsyncStorage.getItem('USER_EMAIL') 
        if(value != ''){
            await noteBackEnd.deleteNote(idNote,contId,value,content,color,date)
            .then(()=>{
                setIsVisible(false)
            })
        }
      }},
  ]);



    return (

        <View style={{flex:1,flexDirection:"column",minWidth:'90%',backgroundColor:'#ffffff',padding:10,gap:5,marginBottom:5,borderRadius:10}}>

        <View style={{flex:1,flexDirection:"row",minWidth:'90%'}}>
        <View style={{marginTop:15}}>
            <TouchableOpacity onPress={()=>{
                    navigation.navigate('ViewProfile',{emailUser:usId});
                    
                }}>
                    <Avatar
                    rounded
                    source={{ uri: usAvatar }}
                    
                    />
            </TouchableOpacity>
        </View>

        <View style={{flex:1,flexDirection:"column",minWidth:'90%',borderRadius:15}}>

            {/* Content header */}
            <View style={{flex:1,flexDirection:"row",minWidth:'90%'}}>
                <View style={{flex:1,flexDirection:"column",minWidth:'90%',padding:10}}>
                    <View style={{flex:1,flexDirection:"row",minWidth:'90%'}}>
                        <TouchableOpacity onPress={()=>{
                            navigation.navigate('ViewProfile',{emailUser:usId});
                        }}>
                            <Text>{usFirst + ' ' +usName+' - '}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={{color:COLORS.green}}>Follow</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={{color:"#BEBEBE"}}>{'@'+usPseudo}</Text>
                </View>
                <TouchableOpacity style={{justifyContent:'flex-end', marginLeft:"auto",paddingRight:20,justifyContent:'center'}}
                onPress={
                    ()=>{
                        if(owner)
                            setIsOwnerVisible(true);
                        else{
                            setIsNoteVisible(true);
                        }
                    }
                }>
                            <Image style={{width:30,height:30}} source={require('../../assets/icons/list.png')} />
                </TouchableOpacity>
            </View>

                {/* Content com */}
                <View style={{flex:1,flexDirection:"column",minWidth:'90%',padding:10}}>
                        <Text>
                            {content}
                        </Text>
                        <Text style={{fontSize:12,fontStyle:"italic",color:"#BEBEBE"}}>
                            {date}
                        </Text>
                </View>
                <View style={{flex:1,flexDirection:"row",minWidth:'90%',padding:10}}>
                        <TouchableOpacity onPress={()=>{
                                addPrayerNote(id,contId)
                            }}>
                            <Image style={{width:30,height:30}} source={require('../../assets/icons/pray.png')} />
                        </TouchableOpacity>
                        <Text>{nbLikes}</Text>
                </View>
            </View>
        </View>

        { owner&&
            
                <BottomSheet modalProps={{}} isVisible={isOwnerVisible}>
                        {listOwner.map((l, i) => (
                            <ListItem
                            key={i}
                            containerStyle={l.containerStyle}
                            onPress={()=>{l.onPress(i)}}
                            >
                            <ListItem.Content>
                                <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
                            </ListItem.Content>
                            </ListItem>
                        ))}
                </BottomSheet>
            }

        {!owner&&
            
            <BottomSheet modalProps={{}} isVisible={isNoteVisible}>
                    {list.map((l, i) => (
                        <ListItem
                        key={i}
                        containerStyle={l.containerStyle}
                        onPress={()=>{l.onPress(i)}}
                        >
                        <ListItem.Content>
                            <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
                        </ListItem.Content>
                        </ListItem>
                    ))}
            </BottomSheet> 
        } 
                    


        </View>

    )
}

const VersePage = ({}) => {


    

    return(

        <ScrollView style={{flex:1,flexDirection:"column"}}>

                    <View style={{flex:1,flexDirection:'column',alignItems:'center'}}>
                        <Text style={{fontSize:26,fontWeight:'bold'}}>{bookName}</Text>
                        <Text style={{fontSize:16,fontWeight:'bold',color:COLORS.darkGrayMsg,marginBottom:10}}>Chapitre {parseInt(chapRef)+1}</Text>
                        <FlatList                   
                            data={dataVerse}
                            renderItem={({item}) => <Verse num={item.num} content={item.verseContent} color={item.color} pix={item.pictures} isTagged={item.tagged} idxTag={item.idx}/>}
                            keyExtractor={item => item.id}
                            style={{width:"100%",gap:10}} 
                        />
                    </View>
                </ScrollView>
    );
}

const moveBackward = async() =>{

    console.log('Move back function ! ')

    //Si chapter est == 1 alors change book -1
    if(chapRef>1){
        console.log('chapter - 1')
        setChapter(chapRef-1)
    }else{
        //chnage BookRef puis setVerse
        if(idxBook>1){
            console.log('Read data length ABB !')
            setBook(idxBook-1,dataAbb[idxBook-1].abbrev,dataAbb[idxBook-1].name,dataAbb[idxBook-1].testament)
            .then(()=>{
                    setChapter(dataAbb[idxBook-1].length);
            })
        }
    }   
}

const moveForward = () => {

    console.log('Move forward function ! '+idxBook+' '+dataAbb.length)


    //Si chapter est == length all chapter alors change book +1
    if(chapRef+1<=dataChap.length){
        console.log('Read data length verse !')
        setChapter(chapRef+1)
    }else{
        //change BookRef puis setVerse
        if(idxBook<dataAbb.length){
            console.log('Read data length ABB !')
            setBook(idxBook+1,dataAbb[idxBook+1].abbrev,dataAbb[idxBook+1].name,dataAbb[idxBook+1].testament).then(()=>{
                    setChapter(1);
            })
        }
    }
}

async function updateNote(idNote,contId,content,color,date){

    arrFiltered = annotations.filter((a)=>{return a.contId == contModId});

    console.log("arr filtered : "+JSON.stringify(arrFiltered));
    const value = await AsyncStorage.getItem('USER_EMAIL') 
    if(value != undefined){
        await noteBackEnd.updateContNote(noteModID,arrFiltered[0].contId,value,arrFiltered[0].content,color,arrFiltered[0].dateCont,noteContent)
        .then(()=>{

        })
    }
}

async function getOtherVersion(lang,version,book,chap,verse,testament){
    await bookBackEnd.searchAllVersionVerse('fr',book,chap,verse,testament)
    .then((verse)=>{
        console.log('verse : '+JSON.stringify(verse));
        setTimeout(()=>{
            setOtherVersions(true);
            setOtherVerses(verse);
        },500);
    })
}

async function getOtherCompVersion(lang,version,book,chap,verse,testament){
    await bookBackEnd.searchAllVersionVerse('fr',book,chap,verse,testament)
    .then((verse)=>{
        console.log('verse : '+JSON.stringify(verse));
        setTimeout(()=>{
            setOtherCompVerses(verse)
        },500);
    })
}

{/*
{Avatar,Content, nbPrayer, Comments, nbSharings, userName, userIdent, imgContent}
*/}
  const [resQuery, setResQuery] = useState([]);
  const [showActivty , setShowActivity] = useState(false);

    return (
        <SafeAreaView style={{flex:1,flexDirection:"column",padding:0,alignItems:"center",padding:10,backgroundColor:'#ffffff'}}>

            {/*View header => plus tard le cacher comme une option ... et afficher plutôt le chapitre et un bouton
                Cacher aussi dans le menu annotations            
            */}

            <View style={{flex:1,flexDirection:'column',maxHeight:100}}>
                <View style={{flex:1,flexDirection:'row',maxHeight:50,minHeight:50,minWidth:'100%',maxWidth:'100%',borderBottomColor:COLORS.green,borderBottomWidth:2}}>
                    {bookRef != ''&&
                    <View style={{flex:1,flexDirection:'row',minWidth:"90%",alignItems:'center',justifyContent:'center',padding:10}}>
                            <Text style={{fontSize:14,fontWeight:'bold'}}>{route.params.nameBook}</Text>
                    </View>
                    
                    }
                    {bookRef == ''&&
                        <View style={{flex:1,flexDirection:'row',minWidth:"90",alignItems:'center'}}>
                            <Text style={[styleFont.message,{padding:10}]}>Sélectionne un livre</Text>
                        </View>
                    }
                    <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',marginLeft:'auto',padding:10,gap:10}}>
                    {showVerse&& <TouchableOpacity  onPress={()=>{setIsPolicyVisible(true)}}>
                                    <Image style={{width:30,height:30}} source={require('../../assets/icons/font.png')} />
                        </TouchableOpacity>}
                    </View>

                </View>

                {showVerse &&
                    <View style={{flex:1,flexDirection:'row',maxHeight:50,backgroundColor:'#898989',alignItems:'center',justifyContent:'center'}}>
                        <View style={{flex:1,flexDirection:'column',alignItems:'center',maxHeight:50,padding:10,marginBottom:10}}>
                            <TouchableOpacity style={{width:30,height:30,backgroundColor:COLORS.green,alignItems:'center',justifyContent:'center',borderRadius:15}}
                                onPress={ ()=>{
                                    moveBackward();
                                }
                            }
                            >
                                <Image style={{width:20,height:20}} source={require('../../assets/icons/left-arrow.png')}/>
                            </TouchableOpacity>
                        </View>
                        <View style={{backgroundColor:COLORS.lightWhite,padding:10,borderRadius:20,maxHeight:40}}>
                            <Text style={styleFont.message}>{bookName + ' : '+parseInt(parseInt(chapRef)+1) +' '+verseRef }</Text>
                        </View>
                        <View style={{flex:1,flexDirection:'column',alignItems:'center',maxHeight:50,padding:10,marginBottom:10}}>
                            <TouchableOpacity style={{width:30,height:30,backgroundColor:COLORS.green,alignItems:'center',justifyContent:'center',borderRadius:15}}
                                onPress={ ()=>{
                                    moveForward();
                                }
                            }
                            >
                                <Image style={{width:20,height:20}} source={require('../../assets/icons/right-arrow.png')}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
            </View>
                    
            
            {/* Content card for all book */}

            {showActivty&&
                <ActivityIndicator style={{marginTop:15}} size="large" color={COLORS.green} />
            }
         
            { showMessageNote&&
                <View style={{flex:1,flexDirection:'column',minWidth:'100%',backgroundColor:COLORS.lightWhite}}>
                    
                     {showBook&& 
                        <ScrollView contentContainerStyle={{flex:1,flexDirection:"column",alignItems:'center',padding:10,minWidth:'100%',maxWidth:'100%',maxHeight:'90%'}}>

                            <FlatList     
                                contentContainerStyle={{minWidth:'100%'}}              
                                data={dataAbb}
                                renderItem={({item}) => <Book id={item.id} name={item.text} nbChapters={item.testament} />}
                                keyExtractor={item => item.id}
                                style={{width:"100%",gap:10}}
                                scrollEnabled={true} 
                                nestedScrollEnabled={true}
                            />

                        </ScrollView>

                        
                    }
                    {showChapter && 
                        <ScrollView contentContainerStyle={{flex:1,flexDirection:"column",alignItems:'center',padding:10,minWidth:'100%',maxWidth:'100%',maxHeight:'90%'}}>
                            <FlatList                   
                                data={dataChap}
                                renderItem={({item}) => <Chapter num={item.num} />}
                                keyExtractor={item => item.id}
                                contentContainerStyle={{minWidth:"90%",maxWidth:'90%',alignItems:'left',gap:10}}   
                            />
                        </ScrollView>
                    }
                    {showVerse&& 
                    
                        <VersePage />

                    }
                    {showAnnotations&&

                        <View style={{flex:1,flexDirection:'column',minWidth:'90%',minHeight:'80%'}}>


                            {/*Show all annotations from users or annotations seleted by user or by conv */}
                            <ScrollView style={{minHeight:'50%',minWidth:'90%'}}>
                                <View style={{flex:1,flexDirection:'column',alignItems:'center',margin:10,gap:10}}>
                                    <Text style={styleFont.title}>Verset</Text>
                                    <Text style={styleFont.messageH2}>{contentVerse}</Text>
                                    {!otherVersions&&
                                        <TouchableOpacity style={styleCom.button} onPress={()=>{
                                            getOtherVersion('fr',route.params.versBook,bookRef,chapRef,verseRef,testRef);
                                        }}>
                                            <Text style={styleFont.button}>Voir d'autres versions</Text>
                                        </TouchableOpacity>
                                    }
                                    {otherVersions&&
                                    <View style={{flex:1,flexDirection:'column'}}>
                                        <FlatList 
                                            data={otherVerses}
                                            renderItem={({item}) => 
                                            <View style={{flex:1,flexDirection:'column',marginBottom:10}}> 
                                                <Text style={styleFont.message}>{item.content.Text}</Text>
                                                <Text style={[styleFont.message,{fontStyle:'italic'}]}>{item.vers}</Text>
                                            </View>
                                            }
                                            keyExtractor={item => item.id}
                                            style={{width:"100%",gap:10}} 
                                        />
                                        <TouchableOpacity style={styleCom.button} onPress={()=>{
                                            setOtherVersions(false);
                                        }}>
                                            <Text style={styleFont.button}>Cacher les versions</Text>
                                        </TouchableOpacity>
                                    </View>
                                    }
                                    <FlatList                   
                                        data={annotations}
                                        renderItem={({item}) => <NoteCard id={item.id} contId={item.contId} usId={item.idUser} usAvatar={item.usAvatar} usFirst={item.usFirst} usName={item.usName} usPseudo={item.usPseudo} content={item.content} date={item.date} color={item.backColor} nbLikes={item.nbLikes} owner={item.owner} />}
                                        keyExtractor={item => item.id}
                                        style={{width:"100%",gap:10}} 
                                    />
                                </View>
                            </ScrollView>

                            <View style={{flex:1,flexDirection:"row",padding:0,alignItems:"center",gap:10,maxHeight:"50%",minHeight:"20%",minWidth:'90%',marginTop:'auto',justifyContent:'flex-end',padding:10}}>
                    

                                {/* Permet d'écrire le message  */}
                                <TextInput 
                                    editable = {true}
                                    multiline = {true}
                                    numberOfLines = {2}
                                    value={noteContent}
                                    onChangeText={
                                    (text)=>{
                                        setNoteContent(text)
                                    }
                                    } 
                                    style={{height:'auto',minHeight:50,borderRadius:10,maxHeight:200,padding:20,width:"90%",marginLeft:"5%",borderRadius:15,backgroundColor:"#fff",color:"#000000"}} />


                                <View style={{flex:1,flexDirection:'column'}}>
                                    {false &&
                                    <TouchableOpacity onPress={()=>{cancelModify()}}>
                                        <Image style={{ width: 30, height: 30}} source={require('../../assets/icons/close.png')}/>
                                    </TouchableOpacity>}

                                
                                    {/* Permet d'envoyer le message */}
                                    <TouchableOpacity onPress={()=>{
                                        if(noteModID == ''){
                                            createNote()
                                        }else{
                                            updateNote(noteModID,contModId)
                                        }}}>
                                        <Image style={{ width: 30, height: 30}} source={require('../../assets/icons/post.png')}/>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View>

                    }

                    {showCompare&&

                    <View style={{flex:1,flexDirection:'column',minWidth:'90%'}}>

                        {/*Show all annotations from users or annotations seleted by user or by conv */}
                        <ScrollView style={{minHeight:'50%',minWidth:'90%'}}>
                            <View style={{flex:1,flexDirection:'column',alignItems:'center',margin:10,gap:10}}>
                                <Text style={styleFont.title}>Verset</Text>                                
                                <View style={{flex:1,flexDirection:'column'}}>
                                    <FlatList 
                                        data={otherCompVersions}
                                        renderItem={({item}) => 
                                        <View style={{flex:1,flexDirection:'column',marginBottom:10}}> 
                                            <Text style={styleFont.message}>{item.content.Text}</Text>
                                            <Text style={[styleFont.message,{fontStyle:'italic'}]}>{item.vers}</Text>
                                        </View>
                                        }
                                        keyExtractor={item => item.id}
                                        style={{width:"100%",gap:10}} 
                                    />
                                    <TouchableOpacity style={styleCom.button} onPress={()=>{
                                        setShowCompare(false);
                                    }}>
                                        <Text style={styleFont.button}>Cacher les versions</Text>
                                    </TouchableOpacity>
                                </View>
                                
                            </View>
                        </ScrollView>
                    </View>
                    }
                </View>
            }


            

            <BottomSheet modalProps={{}} isVisible={isPolicyVisible}>
                <View style={{flex:1,flexDirection:'column',minWidth:'90%',minHeight:200,backgroundColor:'#fff',gap:10,padding:10,alignItems:'center',justifyContent:'center'}}>
                    {/*Choisir une police  */}

                    <ScrollView style={{flex:1,flexDirection:"column",padding:10,maxHeight:'90%'}}>
                        <FlatList                   
                            data={policeAvailable}
                            renderItem={({item}) => 
                                <TouchableOpacity onPress={()=>{
                                    setFamillyPolice(item.fontName);
                                    AsyncStorage.setItem('fontFamillyName',item.fontName);
                                    setIsPolicyVisible(false);
                                }}>
                                    <Text style={{fontFamily:item.fontName,fontSize:14}}>{item.fontName}</Text>
                                </TouchableOpacity>
                            }
                            keyExtractor={item => item.id}
                            style={{width:"100%",gap:10}} 
                        />
                    </ScrollView>

                    {/*Choisir la taille de la police  */}

                    <View style={{flex:1,flexDirection:'row'}}>
                        <TouchableOpacity style={styleCom.button} onPress={()=>{
                            incSizePolicy();
                        }}>
                            <Text style={styleFont.title}> - </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styleCom.button} onPress={()=>{
                            decSizePolicy();
                        }}>
                            <Text style={styleFont.title}> + </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </BottomSheet>
        </SafeAreaView>
    );
}
export default InteractiveBook;