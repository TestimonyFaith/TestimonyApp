import { View,Text,Image,FlatList } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { TouchableOpacity,ScrollView } from "react-native";
import {COLORS,icons,images,SIZES} from '../../../../constants';
import styleCom from '../../../../styles/common'
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import  styleFont from '../../../../styles/fonts';
import { StyleSheet } from "react-native";
import { Avatar,ListItem,CheckBox } from '@rneui/themed';
import { Badge } from '@rneui/themed';

import Toast from 'react-native-simple-toast';
import * as ImagePicker from 'expo-image-picker';
import moment from 'moment'; 
import * as userBackEnd from '../../../../backend/Users'
import AsyncStorage from '@react-native-async-storage/async-storage';


const EditUser = ({ navigation }) =>{
  
    const [isFocused1, setIsFocused1] = useState(false);
    const [isFocused2, setIsFocused2] = useState(false);
    const [isFocused3, setIsFocused3] = useState(false);

    const [newEmail, setNewEmail] = useState('');
    const [Punchline, setPunchline] = useState('');
    const [newAvatar, setNewAvatar] = useState('');

    const DATA = [
      {
        name:'Sans abri',
        logo:'../../../assets/logo/humanity.png',
        id:0,
        descr:'Agit contre la faim'
      },
      {
        name:'Sans abri',
        logo:'../../../assets/logo/humanity.png',
        id:1,
        descr:'Agit contre la faim'
      }


    ]

    const pickAvatar = async () => {
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
          setNewAvatar(base64Icon);
          
          // Add a Toast on screen.
          let toast = Toast.show('image uploaded.', {
            duration: Toast.durations.LONG,
          });
    
          // You can manually hide the Toast, or it will automatically disappear after a `duration` ms timeout.
          setTimeout(function hideToast() {
            Toast.hide(toast);
          }, 500);
    
        }
      };

      _disconnect = async () => {
        try {
          AsyncStorage.setItem(
            'USER_EMAIL',
            '',
          );
        } catch (error) {
          // Error saving data
          alert(error.message)
        }
      };

      const Item = ({name,logo,descr,id}) => (

        <TouchableOpacity onPress={()=>{}}>
          <ListItem bottomDivider style={{width:"100%"}}>
          <Avatar
            rounded
            source={{ uri: logo}}
          />
          <Badge
              status="primary"
              value={"+1"}
              containerStyle={{ position: 'absolute', top: 40, left:40 }}
            />
          <ListItem.Content>
            <ListItem.Title>{name}</ListItem.Title>
            <ListItem.Subtitle>
              {descr}
            </ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      </TouchableOpacity>

      );
    
    return (
        <View style={{flex:1,backgroundColor:COLORS.lightWhite,padding:0,alignItems:"center",justifyContent:"center",gap:10}}>

        <Avatar
          rounded
          source={{ uri:userBackEnd.getAvatar() }}
        />

        <TouchableOpacity style={[styleCom.button,{backgroundColor:COLORS.green}]} 
               onPress={pickAvatar}>
            <Text style={styleCom.textButton}>Changer ta photo</Text>
        </TouchableOpacity>

        <Text style={styleFont.message} >{userBackEnd.getFirstname() +' '+ userBackEnd.getName()}</Text>

                <TextInput 
                    onBlur={() => setIsFocused1(false)}
                    onFocus={() => setIsFocused1(true)}
                    onChangetext ={text => setNewEmail(text)}
                    style={[styleCom.input, isFocused1 && {borderBottomColor:COLORS.red}]} secureTextEntry={false} placeholder="joe@humanity.io" autoComplete="email" inputMode="email" keyboardType="email-address">
                        {userBackEnd.getEmail()}
                </TextInput>
                <TouchableOpacity style={[styleCom.button,{backgroundColor:COLORS.green}]} 
                      onPress={
                          userBackEnd.UpdateUserEmail(newEmail)
                      }>
                    <Text style={styleCom.textButton}>Changer ton email</Text>
                </TouchableOpacity>

                <TextInput 
                    onBlur={() => setIsFocused2(false)}
                    onFocus={() => setIsFocused2(true)}
                    onChangetext ={text => setPunchline(text)}
                    style={[styleCom.input, isFocused2 && {borderBottomColor:COLORS.red}]} secureTextEntry={false} placeholder="Decris-toi en une phrase !?"  inputMode="text" keyboardType="default" >
                        {userBackEnd.getPunchline()}
                </TextInput>

                <Text style={styleFont.label}>
                    Causes défendues
                </Text>

                <ScrollView style={{width:'100%',padding:0,gap:0}}>
                    <FlatList
                        data={DATA}
                        renderItem={({item}) => <Item name={item.name} id={item.id} descr={item.descr} logo={item.logo}/>}
                        keyExtractor={item => item.id
                        }
                        style={{width:"100%"}}
                    />
                </ScrollView>
                

                <TouchableOpacity style={[styleCom.button,{backgroundColor:COLORS.green}]} 
                      onPress={()=>{

                        //Go to causes page 
                        navigation.navigate('Causes')

                      }}>
                    <Text style={styleCom.textButton}>Editer</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styleCom.button,{backgroundColor:COLORS.green}]} 
                      onPress={()=>{

                        _disconnect()

                      }}>
                    <Text style={styleCom.textButton}>Se déconnecter</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styleCom.button,{backgroundColor:COLORS.green}]} 
                      onPress={()=>{

                        userBackEnd.resetPassword()

                      }}>
                    <Text style={styleCom.textButton}>Reset password</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styleCom.button,{backgroundColor:COLORS.green}]} 
                      onPress={userBackEnd.DeleteUser()}>
                    <Text style={styleCom.textButton}>Supprimer mon compte</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styleCom.button,{backgroundColor:COLORS.green}]} 
                      onPress={()=>{
                        datUpdate = {
                          nom: Name,
                          prenom:Firstname,
                          pseudo:Pseudo,
                          avatar: AvatarImg,
                          email: Email,
                          punchline: Punchline,
                          causses: Causes,
                          date: moment().format("DD/MM/YYYY"),
                        }

                        userBackEnd.UpdateUser(datUpdate);
                      }}>
                    <Text style={styleCom.textButton}>Appliquer</Text>
                </TouchableOpacity>

      
    </View>
    )
}
export default EditUser;