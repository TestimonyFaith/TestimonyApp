import { View,Text,Image } from "react-native";
import { ScrollView,FlatList, TextInput } from "react-native-gesture-handler";
import { TouchableOpacity, ActivityIndicator } from "react-native";
import {COLORS,icons,images,SIZES} from '../../../../constants';
import styleCom from '../../../../styles/common'
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import stylePod from '../../../../styles/podcast'
import styleFont from '../../../../styles/fonts'
import { Avatar } from '@rneui/themed';
import { ListItem } from '@rneui/themed';
import { Badge } from '@rneui/themed';
import { Tab } from "@rneui/base";
import cardVerse from '../../../Book/CardVerse';

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc,  query, where, getDocs, collection } from "firebase/firestore";
import {auth,db} from "../../../../firebase"
import * as convBackEnd from '../../../../backend/Conversation'
import TrackPlayer, {
    Capability,
    Event,
    RepeatMode,
    State,
    usePlaybackState,
    useProgress,
    useTrackPlayerEvents,
  } from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import styleFonts from "../../../../styles/fonts";

import * as DocumentPicker from 'expo-document-picker';


const Studio = () =>{

  //FETCH DES DATAS A L'INIT
  //--------------------------------------
  useEffect(() => {

  }, []);

  //VARIABLES 
  //--------------------------------------

  //States
  const [image,setImage]=useState('');
  const [imageURI,setImageURI]=useState('');
  const [audioFileName,setAudioFileName]=useState('');

  //List of interact 
  const [listInteract,setListInteract]=useState([]);

  //States media player 
  const playBackState = usePlaybackState();
  const progress = useProgress();
  const [songIndex, setsongIndex] = useState(0);
  const [repeatMode, setRepeatMode] = useState('off');
  const [trackTitle, setTrackTitle] = useState();
  const [trackArtist, setTrackArtist] = useState();
  const [trackArtwork, setTrackArtwork] = useState();
  const scrollX = useRef(new Animated.Value(0)).current;
  const songSlider = useRef(null);

  //FONCTIONS 
  //--------------------------------------

  //Chargement image du podcats 
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
     const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, { encoding: 'base64' });

     setImageURI(result.assets[0].uri);

     var base64Icon = 'data:image/png;base64,'+base64;
      setImage(base64Icon);
    }
  };

  //Charge le fichier audio 

  const pickAudio = async () => {

    let result = await DocumentPicker.getDocumentAsync({
      type:'audio/*'
    });

    console.log(result);

    if (!result.canceled) {

     setAudioFileName(result.assets[0].uri);

    }
  
  }

  //Ajoute le podcast à la base de données 

  const addPodcast = async() =>{

  }

  //-----------------------------
  //FONCTIONS DU MEDIA PLAYER 
  //-----------------------------

  const setupPlayer = async () => {
    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.Stop,
        ],
      });
      await TrackPlayer.add(songs);
    } catch (error) {
      console.log(error);
    }
  };

const togglePlayBack = async playBackState => {
    // Ou getActiveTrackIndex ...
    const currentTrack = await TrackPlayer.getActiveTrack();
    console.log(currentTrack, playBackState, State.Playing);
    if (currentTrack != null) {
      if (playBackState == State.Paused) {
        await TrackPlayer.play();
      } else {
        await TrackPlayer.pause();
      }
    }
  };

const addPause = async(instruction) =>{

  var arrInteract = listInteract;
  arrInteract.push({
    audioTag : progress.position,
    comp:pause(instruction)
  })

}

const addQuestion = async(text) =>{

  var arrInteract = listInteract;
  arrInteract.push({
    audioTag : progress.position,
    comp:question(text)
  })

}

const addChoice = async(textQuestion,arrChoice) =>{
  var arrInteract = listInteract;
  arrInteract.push({
    audioTag : progress.position,
    comp:choice(textQuestion,arrChoice)
  })
}

const addVerse = async(text,ref) =>{
  var arrInteract = listInteract;
  arrInteract.push({
    audioTag : progress.position,
    comp:verse(text,ref)
  })
}

const question = (textQuestion) =>{

  return(
    <View style={{flex:1,flexDirection:'column',backgroundColor:COLORS.white,borderColor:COLORS.green,borderWidth:3}}>
      <Text style={styleFont.message}>{textQuestion}</Text>
      <TextInput style={{}} keyboardType="default" inputMode="default" />
      <TouchableOpacity style={[styleCom.button,{backgroundColor:COLORS.green}]}>
        <Text style={styleFont.message}>
          Envoyer
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const pause = (textInstruction) =>{

  return(
    <View style={{flex:1,flexDirection:'column',backgroundColor:COLORS.white,borderColor:COLORS.green,borderWidth:3}}>
      <Text style={styleFont.message}>{textInstruction}</Text>
      <TouchableOpacity style={[styleCom.button,{backgroundColor:COLORS.green}]}>
        <Text style={styleFont.message}>
          Reprendre
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const choice = (textQuextion, arrChoice) =>{

  return(
    <View style={{flex:1,flexDirection:'column',backgroundColor:COLORS.white,borderColor:COLORS.green,borderWidth:3}}>
      {arrChoice.map((a)=>{
        <View style={{flex:1,flexDirection:'row'}}>
          <CheckBox
              checked={{}}
              onPress={()=>{}}
              iconType="material-community"
              checkedIcon="checkbox-outline"
              uncheckedIcon={'checkbox-blank-outline'}
              checkedColor={COLORS.green}
          />
          <Text style={styleFont.message}>{a}</Text>
        </View>

      })}
      <TouchableOpacity style={[styleCom.button,{backgroundColor:COLORS.green}]}>
        <Text style={styleFont.message}>
          Envoyer
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const verse = (text,ref) =>{
  return(
    <View style={{flex:1,flexDirection:'column',backgroundColor:COLORS.white,borderColor:COLORS.green,borderWidth:3}}>
      <cardVerse verseText={text} verseReference={ref}/>
      <TouchableOpacity style={[styleCom.button,{backgroundColor:COLORS.green}]}>
        <Text style={styleFont.message}>
          Reprendre
        </Text>
      </TouchableOpacity>
    </View>
  );
}


    return (
        <SafeAreaView style={{flex:1,flexDirection:"column",maxWidth:'100%',minWidth:'100%',backgroundColor:'#fff',alignItems:"center",padding:10,gap:10}}>
            
            {/* Header */}
            <View style={{flex:1,flexDirection:'row',maxHeight:50,minHeight:50,justifyContent:'center',alignItems:'center',minWidth:'100%',maxWidth:'100%',borderBottomColor:COLORS.green,borderBottomWidth:2}}>
                <Text style={styleFont.message}>Studio</Text>
                <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',marginLeft:'auto',padding:10,gap:10}}>
              
                    <TouchableOpacity style={{}} onPress={()=>{
                      setIsSelectVisible(true);
                    }}>
                        <Image style={{width:30,height:30}} source={require('../../../../assets/icons/choice.png')}/>
                    </TouchableOpacity>
                </View>
            </View>

            {/* DESCRIPTION */}

            <View style={{flex:1,flexDirection:'column',backgroundColor:COLORS.lightWhite,padding:0,alignItems:"center",gap:10,width:"100%"}}>
                <Text style={styleFont.message}>Nom du podcast</Text>
                <TextInput keyboardType="default" inputMode="default" />
                <Text style={styleFont.message}>Description du podcast</Text>
                <TextInput keyboardType="default" inputMode="default" multiline={true} />
            </View>

            {/* CONTENT LOADING */}

            <View style={{flex:1,backgroundColor:COLORS.lightWhite,padding:0,alignItems:"center",gap:10,width:"100%"}}>
              <Avatar
                rounded
                source={{ uri: image }}
              />
              <TouchableOpacity style={[styleCom.button,{backgroundColor:COLORS.green}]} 
                    onPress={ pickImage }>
                  <Text style={styleCom.textButton}>Charger l'image</Text>
              </TouchableOpacity>
            </View>

            <View style={{flex:1,backgroundColor:COLORS.lightWhite,padding:0,alignItems:"center",gap:10,width:"100%"}}>
              <Text style={styleFont.message}>{audioFileName}</Text>
              <TouchableOpacity style={[styleCom.button,{backgroundColor:COLORS.green}]} 
                    onPress={ pickAudio }>
                  <Text style={styleCom.textButton}>Charger le fichier son</Text>
              </TouchableOpacity>
            </View>

            {/* CONTENT READING */}

             {/* Title & Artist Name */}
             <View>
                    <Text style={[stylePod.songContent, stylePod.songTitle]}>
                        {/* {songs[songIndex].title} */ trackTitle}
                    </Text>
                    <Text style={[stylePod.songContent, stylePod.songArtist]}>
                        {/* {songs[songIndex].artist} */ trackArtist}
                    </Text>
            </View>

            {/* songslider */}
            <View>
                    <Slider
                        style={stylePod.progressBar}
                        value={progress.position}
                        minimumValue={0}
                        maximumValue={progress.duration}
                        thumbTintColor={COLORS.green}
                        minimumTrackTintColor={COLORS.green}
                        maximumTrackTintColor={COLORS.green}
                        onSlidingComplete={async value => {
                        await TrackPlayer.seekTo(value);
                        }}
                    />

                    {/* Progress Durations */}
                    <View style={stylePod.progressLevelDuraiton}>
                        <Text style={stylePod.progressLabelText}>
                        {new Date(progress.position * 1000)
                            .toLocaleTimeString()
                            .substring(3)}
                        </Text>
                        <Text style={stylePod.progressLabelText}>
                        {new Date((progress.duration - progress.position) * 1000)
                            .toLocaleTimeString()
                            .substring(3)}
                        </Text>
                    </View>

                    {/* music control */}
                    <View style={stylePod.musicControlsContainer}>
                        <TouchableOpacity onPress={skipToPrevious}>
                            <Ionicons name="play-skip-back-outline" size={35} color="#FFD369" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => togglePlayBack(playBackState)}>
                            <Ionicons
                            name={
                                playBackState === State.Playing
                                ? 'ios-pause-circle'
                                : 'ios-play-circle'
                            }
                            size={75}
                            color={COLORS.green}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={skipToNext}>
                            <Ionicons
                            name="play-skip-forward-outline"
                            size={35}
                            color="#FFD369"
                            />
                        </TouchableOpacity>
                    </View>
              </View>

              {/* TAG PROGRAMING */}
              <View style={{flex:1,flexDirection:'row'}}>
                <ScrollView horizontal={true}>
                  <TouchableOpacity style={styleCom.button} onPress={()=>{
                      addPause();
                  }}>
                      <Text style={styleFont.message}>
                          Ajouter une instruction
                      </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styleCom.button} onPress={()=>{
                      addQuestion();
                  }}>
                      <Text style={styleFont.message}>
                          Ajouter une question ouverte 
                      </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styleCom.button} onPress={()=>{
                      addChoice();
                  }}>
                      <Text style={styleFont.message}>
                          Ajouter une question à choix 
                      </Text>
                  </TouchableOpacity>

                  
                  <TouchableOpacity style={styleCom.button} onPress={()=>{
                      addVerse();
                  }}>
                      <Text style={styleFont.message}>
                          Afficher un verset
                      </Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>

              {/* LIST OF INTERACT */}
              <View style={{flex:1,flexDirection:'column',backgroundColor:COLORS.lightWhite}}>
                <FlatList
                  data={listInteract}
                  renderItem={({item}) => 
                    item.comp
                  }
                  keyExtractor={item => item.id}
                  contentContainerStyle={{width:"100%",gap:10,alignItems:'center',justifyContent:'center',paddingBottom:10}} 
                />
              </View>

              {/* BOTTOM STUDIO */}
              <TouchableOpacity style={[styleCom.button,{backgroundColor:COLORS.green}]} onPress={()=>{
                addPodcast();
              }}>
                  <Text style={styleFont.message}>Publier</Text>
              </TouchableOpacity>

        </SafeAreaView>
    );
}
export default Studio;