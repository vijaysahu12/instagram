import *  as React from 'react';
import { useEffect } from 'react';

import { StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { f, database, storage } from '../config/config'

export default function UploadScreen() {

  const s4 = () => {
    return Math.floor((1 + Math.random()) * 10000).toString().substring(1);
  }
  const uniqueId = () => {

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4();
  }

  const [imageId, setImageId] = React.useState(null);

  const [loggedIn, setLoggedIn] = React.useState(true);
  const [, setPermission] = React.useState({
    status: false,
    camera: false,
    cameraRoll: false
  });
  const [caption, setCaption] = React.useState('');
  const [state, setState] = React.useState({
    imageId: '',
    imageSelected: false,
    uri: '',
    progress: 0,
    fileType: '',
    uploading: false,
    caption: '',
  });
  // const [fileType, setFileType] = React.useState('');

  useEffect(() => {
    setState({
      imageSelected: false,
      uri: '',
      imageId: '',
      uploading: false,
      caption: '',
      fileType: '',
      progress: 0
    });
    console.log('useEffect..');
    f.auth().onAuthStateChanged((user) => {
      if (user) {
        // logged in
        setLoggedIn(true);
      } else {
        // not logged in 
        setLoggedIn(false);
      }
    });
    setImageId(uniqueId);
  }, []);

  const checkPermissions = async () => {
    try {

      const status = await Permissions.getAsync(
        Permissions.CAMERA,
        Permissions.CAMERA_ROLL,
      );


      if (status !== 'granted') {
        alert('Hey! You have not enabled selected permissions');
      } else {
        setPermission({
          camera: true,
          cameraRoll: true,
          status: true
        });
      }

    } catch (error) {
      console.warn(err);
    }
  }

  const uploadNewImage = async () => {
    checkPermissions();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      // aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setState({
        imageSelected: true,
        uri: result.uri,
        imageId: imageId,
        uploading: false
      });
    } else {
      console.log('cancel');
    }
  }

  const uploadPublish = () => {
    if (state.uploading == false) {
      console.log('upload and publishing image-' + state.uri);
      state.caption = caption;
      console.log('caption -' + caption);
      console.log('state.caption -' + state.caption);

      if (caption != '' || caption != undefined) {
        // 
        state.uploading = true;
        console.log('state.progress: '+ state.progress)
        uploadImage(state.uri);
      } else {
        alert('Please enter a caption..');
      }
    } else { console.log('you have already uploaded.') }
  };
  const uploadImage = async (uri) => {
    var userId = f.auth().currentUser.uid;

    var re = /(?:\.([^.]+))?$/;
    var ext = re.exec(uri)[1];

    setState({
      fileType: ext,
      uploading: true,
    })

    const response = await fetch(uri);
    const blob = await response.blob();
    var filePath = imageId + '.' + ext;

    const uploadTask = storage.ref('user/' + userId + '/img').child(filePath).put(blob);
    // var snapshot = ref.put(blob).on('state_changed', snapshot => {
    //   console.log('Progress', snapshot.bytesTransferred, snapshot.totalBytes);
    // });

    uploadTask.on('state_changed', (snapshot) => {
      var progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
      console.log('Upload is ' + progress + '% complete');
      setState({
        progress: progress
      });
    }, (error) => {
      console.warn('while uploading byes to server - ' + error);
    }, () => {
      // complete
      uploadTask.snapshot.ref.getDownloadURL().then(function (downloadUrl) {
        console.log(downloadUrl);
        alert(downloadUrl);
        processUpload(downloadUrl);
      })
    });
  };

  const processUpload = (imageUri) => {
    var userId = f.auth().currentUser.uid;
    var dateTime = Date.now();
    var timestamp = Math.floor(dateTime / 1000);
    var caption = state.caption;
    var imageId = state.imageId;

    const photoObj = {
      author: userId,
      caption: caption,
      posted: timestamp,
      url: imageUri
    }
    //Update database

    // Add to main feed
    database.ref('/photos/' + imageId).set(photoObj);

    //set the user object
    database.ref('/users/' + userId + '/photos/' + imageId).set(photoObj);
    alert('Image Uploaded');

    setState({
      uploading: false,
      imageSelected: false,
      caption: '',
      uri: '',
      caption: '',
      fileType: '',
      imageId: '',
      progress: 0
    });
  }





  if (loggedIn == true) {
    return (
      <View style={{ flex: 1 }}>


        {state.imageSelected
          ?
          (
            <View style={{ flex: 1 }}>
              {/* <View style={{height:70, width:'100%', paddingTop:30, backgroundColor: 'white', borderColor: 'lightgrey',borderBottomWidth:0.5, justifyContent:'center', alignItems: 'center'}}> */}
              <View style={{ paddingTop: 5 }}>
                <Text style={{ marginTop: 5 }}> Caption:  </Text>
                <TextInput
                  editable={true}
                  placeholder={"Enter your caption"}
                  maxLength={150}
                  multiline={true}
                  numberOfLines={4}
                  onChangeText={(text) => {  setCaption(text); }}
                  style={{
                    marginVertical: 5, padding: 5, borderColor: 'grey', borderWidth: 1,
                    borderRadius: 3, backgroundColor: 'white', color: 'black'
                  }}
                />
              </View>
              <TouchableOpacity onPress={() => uploadPublish()} style={{ alignSelf: 'center', width: 170, marginHorizontal: 'auto', backgroundColor: 'purple', borderRadius: 5, paddingVertical: 10, paddingHorizontal: 20 }}>
                <Text style={{ textAlign: 'center', color: 'white' }}>Upload & Publish</Text>
              </TouchableOpacity>

              {state.uploading ? (
                <View style={{marginLeft:10}}>
                  <Text>{state.progress}%</Text>
                  {
                    state.progress != 100 ? (
                      <ActivityIndicator size="small" color="blue" />
                    ) : (<Text>Processing..</Text>)
                  }
                </View>
              ) : <View style={{marginLeft:10}}><Text>{state.progress}%</Text></View>}

              <Image
                style={{ marginTop: 10, resizeMode: 'cover', width: '100%', height: 275 }}
                source={{ uri: state.uri }} />
            </View>
          )
          : (
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 28, paddingBottom: 15 }}>Upload</Text>

                <TouchableOpacity
                  onPress={() => uploadNewImage()}
                  style={{ paddingVertical: 10, paddingHorizontal: 20, backgroundColor: 'blue', borderRadius: 5 }}>
                  <Text style={{ color: 'white' }}>Select Photo</Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        }
      </View>
    )
  } else {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>You are not logged in</Text>
        <Text>Please login to upload a photo</Text>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Button title="Pick an image from camera roll" onPress={pickImage} />
          {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
        </View>
      </View>
    )
  }

}



