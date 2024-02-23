import { View,Text,Image, ActivityIndicator} from "react-native";
import { FlatList, TextInput } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native";
import {COLORS,icons,images,SIZES} from '../../../constants';
import styleCom from '../../../styles/common'
import { useState,useEffect } from "react";
import { Avatar,ListItem,CheckBox } from '@rneui/themed';

import * as userBackEnd from '../../../backend/Users';


const SearchForUsers = ({navigation}) =>{

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
     const [userName, setUserName] = useState('');
     const [members, setMembers] = useState({});
     const [error, setError] = useState('');
     const [resUsers, setResUsers] = useState([]);
     const [showActivty , setShowActivity] = useState(false);


     useEffect(() => {
      // write your code here, it's like componentWillMount
      getUser();
    }, [])

     {/*Liste des contacts de l'utilisateur pour le moment afficher tous les utilisateurs pour le beta test */}

      const getUser = async() =>{
        
        setResUsers({});

        setShowActivity(true);
        console.log('---------- INIT USER SCREEN --------')

        if(userName !== ''){

          console.log('serach by name')
            userBackEnd.SearchUserByName('userName')
            .then((arrQueryUsers)=>{
              setResUsers(arrQueryUsers);
              setShowActivity(false);
            })
        }else{
          console.log('serach all')
            userBackEnd.getAllUsers()
            .then((arrQueryUsers)=>{
              setResUsers(arrQueryUsers);
              setShowActivity(false);
            })
        }
      }
    

      const Item = ({nom,prenom,avatar,email}) => (
      <TouchableOpacity 
        onPress={()=>{
          navigation.navigate('UserView',{emailUser :email});
        }}>
        <ListItem bottomDivider style={{width:"100%"}}>
          <Avatar
            rounded
            source={{ uri: avatar}}
          />
          <ListItem.Content>
            <ListItem.Title>{prenom +' '+ nom}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </TouchableOpacity>
      );

    return (
        <View style={{flex:1,backgroundColor:COLORS.lightWhite,padding:0,alignItems:"center",gap:10}}>
          {/* La liste des utilisateurs  */}

            {showActivty&&
              <View style={{flex:1,flexDirection:"column",alignItems:"center"}}>
                  <ActivityIndicator size="large" color={COLORS.green} />
              </View>
            }

          <TextInput
              onBlur={() => setIsFocused(false)}
              onFocus={() => setIsFocused(true)}
              onChangeText={text => setUserName(text)}
              style={[styleCom.input, isFocused && {borderBottomColor:COLORS.red}]} secureTextEntry={false} placeholder="Nom de l'utilisateur" inputMode="text" keyboardType="default"
          />
          <TouchableOpacity style={[styleCom.button,{backgroundColor:COLORS.green}]} 
                onPress={getUser}>
              <Text style={styleCom.textButton}>Rechercher</Text>
          </TouchableOpacity>

          {showActivty && <ActivityIndicator size="large" color={COLORS.red} />}

        <FlatList
                data={resUsers}
                renderItem={({item}) => <Item nom={item.nom} prenom={item.prenom} avatar={item.avatar} email={item.email} />}
                keyExtractor={item => item.id}
                style={{width:"100%"}}
        />
        </View>
    )
}
export default SearchForUsers;