import { View,Text,Image} from "react-native";
import { FlatList, TextInput } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native";
import {COLORS,icons,images,SIZES} from '../../../../constants';
import styleCom from '../../../../styles/common'
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import  styleFont from '../../../../styles/fonts';
import { Avatar,ListItem,CheckBox } from '@rneui/themed';
import { doc, setDoc, getDoc, addDoc, collection } from "firebase/firestore"; 
import { db } from "../../../../firebase";
import moment from 'moment'; 
import Toast from 'react-native-root-toast';
import * as ConvBackend from '../../../../backend/Conversation'



import * as ImagePicker from 'expo-image-picker';
import { currentUserLogged } from "../../../../global";
import { useEffect } from "react";

const ConvEditor  = ({ idConv }) =>{

    {/* Props à ajouter :
        - Expéditeur ou destinataire du message 
        - photo profil 
        - ...
     */}

     const [isSelected, setSelection] = useState(false);
     const [checked, setChecked] = useState(true);
     const toggleCheckbox = () => setChecked(!checked);
     const [isFocused, setIsFocused] = useState(false);
     const [image, setImage] = useState(null);
     const [convName, setConvName] = useState('');
     const [members, setMembers] = useState({});
     const [error, setError] = useState('');

     useEffect(() => {
      // write your code here, it's like componentWillMount
      getInfoConv();
    }, [])

     const getInfoConv = () =>{
      var arrQueryConv = ConvBackend.SearchConvByName(idConv);
      setConvName(arrQueryConv.nom);
      setImage(arrQueryConv.image);
      setMembers(arrQueryConv.members);
     }


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

        console.log('BASE64 : '+base64)
  
        var base64Icon = 'data:image/png;base64,'+base64;
        Toast.show('Votre image a été chargée', Toast.SHORT);
        setImage(base64Icon);
       }
     };



     {/*Liste des contacts de l'utilisateur pour le moment afficher tous les utilisateurs pour le beta test */}

      const Item = ({nom, prenom, avatar}) => (
        <ListItem bottomDivider style={{width:"100%"}}>
        <CheckBox
           checked={checked}
           onPress={toggleCheckbox}
           iconType="material-community"
           checkedIcon="checkbox-outline"
           uncheckedIcon={'checkbox-blank-outline'}
         />
        <Avatar
          rounded
          source={{ uri: avatar }}
        />
        <ListItem.Content>
          <ListItem.Title>{prenom +' '+ nom}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
      );

    return (
        <View>
            {/* La liste des conversations  */}
            <Avatar
          rounded
          source={{ uri: image }}
        />
        <TouchableOpacity style={[styleCom.button,{backgroundColor:COLORS.green}]} 
               onPress={ pickImage }>
            <Text style={styleCom.textButton}>Changer l'image</Text>
        </TouchableOpacity>

        {/* Affiche une erreur de création conv */}
        <Text style={styleFont.subtitle}>
            {error}
        </Text>

        <TextInput
            onBlur={() => setIsFocused(false)}
            onFocus={() => setIsFocused(true)}
            onChangeText={text => setConvName(text)}
            style={[styleCom.input, isFocused && {borderBottomColor:COLORS.red}]} secureTextEntry={false} placeholder="Nom de la conversation" inputMode="text" keyboardType="default"
        />
        <FlatList
                data={members}
                renderItem={({item}) => <Item nom={item.nom} prenom={item.prenom} avatar={item.avatar}/>}
                keyExtractor={item => item.id}
        />
        <TouchableOpacity style={[styleCom.button,{backgroundColor:COLORS.green}]} 
               onPress={ ()=>{
                //Go to backend conv editor
                ConvBackend.UpdateConv(idConv,{
                  nom: convName,
                  image: image,
                  members: members,
                  author:currentUserLogged,
                  date: moment().format("DD/MM/YYYY"),
                })
                  //Navigate to home 
                  navigation.navigate('Home')
               } }>
            <Text style={styleCom.textButton}>Appliquer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styleCom.button,{backgroundColor:COLORS.green}]} 
               onPress={ ()=>{
                //Go to backend conv editor
                ConvBackend.DeleteConv(idConv);

                //Navigate to home 
                navigation.navigate('Home')
               } }>
            <Text style={styleCom.textButton}>Supprimer</Text>
        </TouchableOpacity>

        </View>
    )
}
export default ConvEditor;