import { Camera, CameraType } from 'expo-camera';
import { useState,useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CamPage = ({ navigation,route }) =>{

  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [picture, setPicture] = useState("");
  const cameraRef = useRef(null);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View >
        <TouchableOpacity onPress={requestPermission} >
            <Text>We need your permission to show the camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

 const takePicture = async() => {

    const options = {quality: 1, base64: true};
    await Camera.takePciture
    .then((data)=>{
        console.log(data);
        setPicture(data);
    })

}

function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
}

return (

        <View style={styles.container}>
          <Camera style={styles.camera} type={type} ref={cameraRef}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
                <Text style={styles.text}>Flip Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={async () => {
                        if (cameraRef.current) {
                        await cameraRef.current.takePictureAsync()
                        .then((photo)=>{
                            navigation.navigate('Message',{idConv:route.params.idMsgConv,uriPix:photo.uri})
                          })
                        }
                    }}>
                <Text style={styles.text}>takePicture</Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
}
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
      },
      camera: {
        flex: 1,
      },
      buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
      },
      button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
      },
      text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
      },
    });
export default CamPage;