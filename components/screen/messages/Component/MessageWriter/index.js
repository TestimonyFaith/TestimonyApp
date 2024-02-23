import { View,Text,Image } from "react-native";
import { FlatList, TextInput } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native";
import {COLORS,icons,images,SIZES} from '../../../constants';
import styleCom from '../../../../../styles/common'
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import  styleFont from '../../../../../styles/fonts';
import Navbar from '../../navbar-header'
import Icon from 'react-native-vector-icons/dist/FontAwesome';

const MessageWriter = props =>{

    {/* Props à ajouter quand le message est modifié :
        - Expéditeur ou destinataire du message 
        - photo profil 
        - ...
     */}

    return (
        <View></View>
    )
}
export default MessageWriter;