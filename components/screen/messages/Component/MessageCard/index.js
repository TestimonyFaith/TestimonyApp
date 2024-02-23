import { View,Text,Image } from "react-native";
import { FlatList, TextInput } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native";
import {COLORS,icons,images,SIZES} from '../../../constants';
import styleCom from '../../../../../styles/common'
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import  styleFont from '../../../../../styles/fonts';
import Navbar from '../../navbar-header'
import Icon from "react-native-multi-selectbox/src/components/Icon";

const MessageCard = props =>{

    {/* Props à ajouter :
        - Expéditeur ou destinataire du message 
        - photo profil 
        - ...
     */}

    return (
        <View style={[styleCom.MessageCard, props.sender && {borderBottomColor:COLORS.red}]}>
            <View >
                {/* HEADER de la carte */}
                {/* Photo de profil de l'utilisateur from firebase Auth */}
                <Image  />

                {/* Nom profil de l'utilisateur from firebase Auth */}
                <Text style={styleFont.headerMessage}>Nom du contact </Text>    
            </View>
            <View>
                {/* Corps du message  - attention vignette ligne hypertext */}
                <Text style={styleFont.message}>
                    Corps du message 
                </Text>
            </View>
            <View>
                {/* FOOTER de la carte */}
                {/* Photo de profil de l'utilisateur from firebase Auth */}
                <Text style={styleFont.footerMessage}>Date</Text>
                <Text style={styleFont.footerMessage}>Heure</Text>
                <Text style={styleFont.footerMessage}>Lu - Non lu - Modifié </Text>
            </View>
        </View>
    )
}
export default MessageCard;