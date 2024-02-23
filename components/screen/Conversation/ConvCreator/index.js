import { View,Text,Image,ActivityIndicator} from "react-native";
import { FlatList, ScrollView, TextInput } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native";
import {COLORS,icons,images,SIZES} from '../../../../constants';
import styleCom from '../../../../styles/common'
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import  styleFont from '../../../../styles/fonts';
import { Avatar,ListItem,CheckBox } from '@rneui/themed';
import { doc, setDoc, getDoc, addDoc, collection } from "firebase/firestore"; 
import { getStorage, ref, uploadBytesResumable, getDownloadURL, uploadString,listAll } from "firebase/storage";
import { db } from "../../../../firebase";
import moment from 'moment'; 
import * as ConvBackend from '../../../../backend/Conversation'
import * as userBackEnd from '../../../../backend/Users'

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { currentUserLogged } from "../../../../global";
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as uuid from "uuid";

const ConvCreator = ({ navigation,route }) =>{

    {/* Props à ajouter :
        - Expéditeur ou destinataire du message 
        - photo profil 
        - ...
     */}

     const [checkedUser, setCheckedUser] = useState([]); 
     const [checkedType, setCheckedType] = useState([]);  
     const [isFocused, setIsFocused] = useState(false);
     const [image, setImage] = useState(null);
     const [convName, setConvName] = useState('');
     const [members, setMembers] = useState([]);
     const [error, setError] = useState('');
     const [resUsers, setResUsers] = useState([]);
     const [showActivty , setShowActivity] = useState(false);
     const [imageURI,setImageURI]=useState('')
     const [nbUsers,setNbUsers]=useState(0);
     const [typeConv, setTypeConv]=useState(0);

     DATA = [
      {id:0,theme:'Conversation'},
      {id:1,theme:'Groupe de prière'},
      {id:2,theme:'Groupe de lecteure'},
      {id:3,theme:'Etude biblique'},
    ]

     useEffect(() => {
      // write your code here, it's like componentWillMount
      getConvUsers();
    }, [])

    function setCheckedLine(idLine,emailUser){
      var arrCheck = []
      for(let r=0;r<nbUsers;r++){
          arrCheck.push(false)
      }
      arrCheck[idLine] = true;
      setCheckedUser(arrCheck);

      if(members.length>0){
        var arrMembers = [members,emailUser];
        setMembers(arrMembers);
      }else{
        var arrMembers = [emailUser];
        setMembers(arrMembers);
      }

      console.log('members : '+members+' '+arrMembers);

  }

  function setCheckedTypeLine(idLine){
    var arrCheck = []
    for(let r=0;r<DATA.length;r++){
        arrCheck.push(false)
    }
    arrCheck[idLine] = true;
    setCheckedType(arrCheck);
    setTypeConv(idLine);
}

    const getConvUsers = () =>{
      setShowActivity(true);
      userBackEnd.getAllUsers()
      .then((arrQueryUsers )=>{
          setNbUsers(arrQueryUsers.length);
          setResUsers(arrQueryUsers);
          setShowActivity(false);
      })
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

        setImageURI(result.assets[0].uri);
  
        var base64Icon = 'data:image/png;base64,'+base64;
         setImage(base64Icon);
       }
     };

     const createConv = async() =>{

      const value = await AsyncStorage.getItem('USER_EMAIL')
      if(value !== null){
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", imageURI, true);
        xhr.send(null);
      });
    
      console.log('blob OK : ');
    
      const fileRef = ref(getStorage(), '/convs/'+value+'/'+uuid.v4());
    
      // We're done with the blob, close and release it    
      const metadata = {
        contentType: 'image/jpeg',
        idUser : value
      };      
    
      const uploadTask = uploadBytesResumable(fileRef,blob,metadata);
    
      uploadTask.on("state_changed",
        (snapshot) => {
          const progressMath =
            Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          
        },
        (error) => {
          alert(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
          .then(async(downloadURL) => {
            blob.close();
            console.log('url file : '+downloadURL);
            //setDownloadFileOnGoing(false);
    
            await ConvBackend.CreateConv(convName,downloadURL,members,typeConv,currentUserLogged)
            .then((id)=>{
                   console.log('This value has been written');
                   Toast.show('La conversation a été crée.', Toast.LONG);
                   navigation.navigate('Messages');
     
                 })
            .catch((error) => {
                       alert(error.message)
                       setError(error.message)
            });
            });
          }
        );
      }
    }

    {/*Liste des contacts de l'utilisateur pour le moment afficher tous les utilisateurs pour le beta test */}

      const Item = ({id,nom,prenom,avatar,email}) => (
        <ListItem bottomDivider style={{width:"100%"}}>
        <CheckBox
           checked={checkedUser[id]}
           onPress={()=>{setCheckedLine(id,email)}}
           iconType="material-community"
           checkedIcon="checkbox-outline"
           uncheckedIcon={'checkbox-blank-outline'}
           checkedColor={COLORS.green}
         />
        <Avatar
          rounded
          source={{ uri: avatar}}
        />
        <ListItem.Content>
          <ListItem.Title>{prenom +' '+ nom}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
      );

      const ItemType = ({id,type}) => (
        <ListItem bottomDivider style={{width:"100%"}}>
        <CheckBox
           checked={checkedType[id]}
           onPress={()=>{setCheckedTypeLine(id)}}
           iconType="material-community"
           checkedIcon="checkbox-outline"
           uncheckedIcon={'checkbox-blank-outline'}
           checkedColor={COLORS.green}
         />
        <ListItem.Content>
          <ListItem.Title>{type}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
      );

    return (
        <View style={{flex:1,backgroundColor:COLORS.lightWhite,padding:0,alignItems:"center",gap:10,width:"100%"}}>
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
         {showActivty && <ActivityIndicator size="large" color={COLORS.green} />}
        <Text style={styleFont.title}>Utilisateurs</Text>
        <Text style={styleFont.subtitle}>Sélectionne un ou plusieurs utilisateurs avec qui tu veux discuter</Text>
        <ScrollView>
          <FlatList
                data={resUsers}
                renderItem={({item}) => <Item id={item.id} nom={item.nom} prenom={item.prenom} avatar={item.avatar} email={item.email}/>}
                keyExtractor={item => item.id}
                style={{width:"100%"}}
          />
        </ScrollView>

        <Text style={styleFont.title}>Type</Text>
        <Text style={styleFont.subtitle}>Sélectionne le type d'échange que tu souhaites créer</Text>
        <ScrollView>
          <FlatList
                  data={DATA}
                  renderItem={({item}) => <ItemType id={item.id} type={item.type} />}
                  keyExtractor={item => item.id}
                  style={{width:"100%"}}
          />
        </ScrollView>
        <TouchableOpacity style={[styleCom.button,{backgroundColor:COLORS.green}]} 
               onPress={ createConv }>
            <Text style={styleCom.textButton}>Créer</Text>
        </TouchableOpacity>

        </View>
    )
}
export default ConvCreator;