import { View,Text,Image } from "react-native";
import { ScrollView,FlatList, TextInput } from "react-native-gesture-handler";
import { TouchableOpacity, ActivityIndicator } from "react-native";
import {COLORS,icons,images,SIZES} from '../../../../constants';
import styleCom from '../../../../styles/common'
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import  stylePod from '../../../../styles/podcast'
import { Avatar } from '@rneui/themed';
import { ListItem } from '@rneui/themed';
import { Badge } from '@rneui/themed';
import { Tab } from "@rneui/base";

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

const PodcastPlayer = () =>{

  const [resQuery, setResQuery] = useState([]);
  const [showActivty , setShowActivity] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showDescr, setShowDescr] = useState(true);
  const playBackState = usePlaybackState();
  const progress = useProgress();
  //   custom states
  const [songIndex, setsongIndex] = useState(0);
  const [repeatMode, setRepeatMode] = useState('off');
  const [trackTitle, setTrackTitle] = useState();
  const [trackArtist, setTrackArtist] = useState();
  const [trackArtwork, setTrackArtwork] = useState();
  // custom referecnces
  const scrollX = useRef(new Animated.Value(0)).current;
  const songSlider = useRef(null);

 //   changing the track on complete
 useTrackPlayerEvents([Event.PlaybackActiveTrackChanged], async event => {
        if (event.type === Event.PlaybackActiveTrackChanged && event.nextTrack !== null) {
          const track = await TrackPlayer.getTrack(event.nextTrack);
          const {title, artwork, artist} = track;
          setTrackTitle(title);
          setTrackArtist(artist);
          setTrackArtwork(artwork);
        }
    });

  useEffect(() => {
    setupPlayer();

    return () => {
      TrackPlayer.destroy();
    };
  }, []);

    return (
        <View style={{flex:1,flexDirection:"column",maxWidth:'100%',minWidth:'100%',backgroundColor:'#fff',alignItems:"center",padding:10}}>
            
          {/* Half View for podcast player  */}
          <View style={{flex:1,flexDirection:"column",maxWidth:'100%',minWidth:'100%',alignItems:"center",padding:10}}>

          {/* En fonction du codage effectué chnager l'image par d'autres vue comme les verses, ou des sondages ou des inputs ... */}
            {/* Image podcast */}
            <Image
                source={''}
                style={{}}
            />

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
                            color="#FFD369"
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
                    <View style={{flex:1,flexDirection:"row",gap:10}}>
                        <TouchableOpacity onPress={()=>{
                        }}>
                            <Image style={{width:30,height:30}} source={require('../../../../assets/icons/pray.png')} />
                        </TouchableOpacity>
                        <Text>{nbLike}</Text>
                        <TouchableOpacity onPress={()=>{
                        }}>
                            <Image style={{width:30,height:30}} source={require('../../../../assets/icons/Comment.png')} />
                        </TouchableOpacity>
                        <Text>{nbCom}</Text>
                        <TouchableOpacity         onPress={async () => {
                        }}>
                            <Image style={{width:30,height:30}} source={require('../../../../assets/icons/share.png')} />
                        </TouchableOpacity>
                    </View>
              </View>
          </View>

          {/* Half View for notes */}
          <View style={{flex:1,flexDirection:"column",maxWidth:'100%',minWidth:'100%',alignItems:"center",padding:10}}>

            <View style={{flex:1,flexDirection:'row',width:'100%',height:'10%'}}>

                <TouchableOpacity onPress={()=>{
                  setShowNotes(false)
                  setShowDescr(true)
                }} style={[{backgroundColor:COLORS.green,minWidth:'50%',height:50,alignItems:'center',justifyContent:'center'},showMessage&&{borderBottomWidth:2,borderBottomColor:'#fff'}]}>
                  <Text style={{fontSize:12,color:'#fff'}}>Description</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>{
                  setShowNotes(true)
                  setShowDescr(false)
                }} style={[{backgroundColor:COLORS.green,minWidth:'50%',height:50,alignItems:'center',justifyContent:'center'},showTheme&&{borderBottomWidth:2,borderBottomColor:'#fff'}]}>
                  <Text style={{fontSize:12,color:'#fff'}}>Notes</Text>
                </TouchableOpacity>

            </View>

            {showNotes&&
                /* Input to take notes : 
                if this compoenent is focus or textChange so stop the podcast player if this component is release start the podcast payer.
                (May be set this option by a podcast player button control). */

                  <TextInput 
                  editable
                  multiline
                  style={{backgroundColor:'none',width:'100%',height:'auto',backgroundColor:'#fff',minHeight:150,borderRadius:10,maxHeight:200,padding:20}} 
                  onChangeText={text => onChangeText(text)}
                  onPressOut={()=>{}}
                  value={value}
                />
            }

            {showDescr&&
                  <ScrollView style={{width:'90%',height:'auto'}}>
                                    {/* Horizontal lits for verses */}
                        <View style={{flex:1,flexDirection:'column',gap:10}}>
                          <FlatList            
                          data={DATA}
                          horizontal={true}
                          renderItem={({item}) => <Text>Verse ...</Text>}
                          keyExtractor={item => item.id}
                          style={{width:"100%"}}
                          />
                          <Text style={styleFonts.title}>Description </Text>
                          <Text style={styleFonts.message}>
                            Ce pdocast vous raconte .....
                          </Text>
                        </View>
                  </ScrollView>
            }

          </View>
      </View>
    );
}
export default PodcastPlayer;