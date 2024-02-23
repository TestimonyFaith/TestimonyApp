import { View,Text,Image,FlatList } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native";
import {COLORS,icons,images,SIZES} from '../../../../constants';
import styleCom from '../../../../styles/common'
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import  styleFont from '../../../../styles/fonts';
import { StyleSheet } from "react-native";
import { Avatar,ListItem,CheckBox } from '@rneui/themed';

const DATA = [
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'First Item',
      },
      {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Second Item',
      },
      {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
      },
]



const DetailsConv = () =>{
    const [isFocused, setIsFocused] = useState(false);
    const [isFocusedPwd, setIsFocusedPwd] = useState(false);

    const [selectedTeam, setSelectedTeam] = useState({});
    const [selectedTeams, setSelectedTeams] = useState([]);

    
    return (
        <SafeAreaView style={{flex:1,backgroundColor:COLORS.lightWhite,justifyContent:"center",padding:10,alignItems:"center",gap:10}}>

        <Avatar
          rounded
          source={{ uri:'https://firebasestorage.googleapis.com/v0/b/humanity1-7edc2.appspot.com/o/logo%2Fhumanity.png?alt=media&token=56b409f5-559b-46b8-82dd-6df07c8dbae6' }}
        />

        <Text style={styleFont.title} >
            Nom du groupe
        </Text>

        <Text style={styleFont.label}>
            Membre du groupe
        </Text>

        <Avatar
          rounded
          source={{ uri:'https://cdn-icons-png.flaticon.com/512/197/197560.png'}}
        />

        <Text style={styleFont.label}>
            Date de création
        </Text>

        <Text style={styleFont.subtitle} >
            XX-XX-XXXX
        </Text>

        <TouchableOpacity style={[styleCom.button,{backgroundColor:COLORS.green}]} 
               onPress={() => {
              }}>
            <Text style={styleCom.textButton}>Retour</Text>
        </TouchableOpacity>
    </SafeAreaView>
    )
}
export default DetailsConv;