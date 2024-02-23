import { View,Text,Image } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native";
import {COLORS,icons,images,SIZES} from '../../constants';
import styleCom from '../../styles/common'
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import  styleFont from '../../styles/fonts';

import { Avatar } from '@rneui/themed';
import { Badge } from '@rneui/themed';
import * as userBack from '../../backend/Users'
import AsyncStorage from '@react-native-async-storage/async-storage';


const AVHeader = ({navigation}) =>{

    const [urlAv,setUrlAv] = useState('');

    useEffect(()=>{
        async function getUrl(){

        const value = await AsyncStorage.getItem('USER_EMAIL')
        if(value !== null){
            console.log('av header : '+value);
            await userBack.SearchAvatarByEmail(value)
            .then((arr)=>{
                setUrlAv(arr[0].avatar);
                console.log('avatar hedaer : '+urlAv);

            })
        }

  }
  getUrl()
}, [])

    return (
    <View>
        <TouchableOpacity onPress={()=>{
            navigation.navigate('UserDetails')
        }}>
            <Avatar
                    rounded
                    source={{ uri: urlAv}}
            />
        </TouchableOpacity>
        <Badge
        badgeStyle={{backgroundColor:COLORS.green}}
        status="primary"
        value={"Converti"}
        containerStyle={{ position: 'absolute', top: 20, left:-40 }}
        />
    </View>  
    )
}
export default AVHeader;