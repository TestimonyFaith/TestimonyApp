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

const MessageToolbar = props =>{

    {/* Props à ajouter quand le message est sélectionné :
        - ID du message
     */}

    return (
        <View style={styleCom.button}>

            {/* Permet de liker le message ou d'exprimer une émotion */}
            <TouchableOpacity>
                <Image source=""/>
            </TouchableOpacity>

            {/* Permet de répondre au message */}
            <TouchableOpacity>
                <Image source =""/>
            </TouchableOpacity>

            {/* Permet de copier le message*/}
            <TouchableOpacity>
                <Icon icon="fas fa-paper-plane" />
            </TouchableOpacity>

            {/* Permet de supprimer le message quand on est expéditeur du message.*/}
            <TouchableOpacity>
                <Icon icon="fas fa-paper-plane" />
            </TouchableOpacity>

            {/* Permet de signaler le message*/}
            <TouchableOpacity>
                <Icon icon="fas fa-paper-plane" />
            </TouchableOpacity>
        </View>
    )
}
export default MessageToolbar;