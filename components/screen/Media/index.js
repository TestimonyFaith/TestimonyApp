import { View,Text,Image } from "react-native";
import { ScrollView,FlatList, TextInput } from "react-native-gesture-handler";
import { TouchableOpacity, ActivityIndicator } from "react-native";
import {COLORS,icons,images,SIZES} from '../../../constants';
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
import CardMedia from '../Media/MediaCard'

import * as convBackEnd from '../../../backend/Conversation'
import * as msgBackEnd from '../../../backend/Messages'

const Home = ({ navigation }) =>{

  const [resQuery, setResQuery] = useState([]);
  const [showActivty , setShowActivity] = useState(false);

  DATA = [
    {
      id:'0',
      value:'hgdfd'
    },
    {
      id:'0',
      value:'hgdfd'
    },
    {
      id:'0',
      value:'hgdfd'
    },
    {
      id:'0',
      value:'hgdfd'
    },
  ]

  useEffect(() => {
    // write your code here, it's like componentWillMount
    //setShowActivity(true);
    //getConv();
  }, [])

  const getConv = async() =>{

    console.log('---------- INIT HOME SCREEN --------')

    //const q = query(collection(db, "cities"), where("capital", "==", true));

    await convBackEnd.getAllConv()
    .then((arrQuery)=>{
      console.log('await succesful');
      setResQuery(arrQuery);
      setShowActivity(false);
    })
  }

      const CardMediaItem = ({name,id,image,date,members}) => (

        <CardMedia navigation={navigation}/>
  
      );

    return (
        <View style={{flex:1,backgroundColor:COLORS.lightWhite,padding:0,alignItems:"center",gap:10, padding:5}}>
          <ScrollView style={{width:'100%',padding:0}}>
            <Text style={styleFont.hastag}># Prédication </Text>
              <FlatList 
                  data={DATA}
                  horizontal={true}
                  renderItem={({item}) => <CardMediaItem  />}
                  keyExtractor={item => item.id}
                  style={{width:"100%"}}
              />
            <Text style={styleFont.hastag}># Podcast </Text>
              <FlatList 
                  data={DATA}
                  horizontal={true}
                  renderItem={({item}) => <CardMediaItem  />}
                  keyExtractor={item => item.id}
                  style={{width:"100%"}}
              />
            <Text style={styleFont.hastag}># Meditation </Text>
              <FlatList 
                  data={DATA}
                  horizontal={true}
                  renderItem={({item}) => <CardMediaItem  />}
                  keyExtractor={item => item.id}
                  style={{width:"100%"}}
              />
            <Text style={styleFont.hastag}># Prière </Text>
              <FlatList 
                  data={DATA}
                  horizontal={true}
                  renderItem={({item}) => <CardMediaItem  />}
                  keyExtractor={item => item.id}
                  style={{width:"100%"}}
              />
          </ScrollView>
        </View>
    )
}
export default Home;