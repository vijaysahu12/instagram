import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import *  as React from 'react';
import { useEffect } from 'react';

import { StyleSheet, Text, View, Image } from 'react-native';
import { RectButton, ScrollView, FlatList } from 'react-native-gesture-handler';

import { f, auth, database, storage } from '../config/config'


export default function UploadScreen() {

    const [refresh, setRefresh] = React.useState(false);
    const [photofeed, setPhotoFeed] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const[loggedIn, setLoggedIn] = React.useState(true);

    useEffect(effect => {
            f.auth().onAuthStateChanged((user) => {
                if(user){
                    // logged in
                    setLoggedIn(true); 
                } else {
                    // not logged in 
                    setLoggedIn(false); 
                }
            });
    }, []);
      


    if (loggedIn == true) {
        return (
            <View>
                <Text>Upload</Text>
            </View>
        )
    } else {
        return (
            <View>
                <Text>You are not logged in</Text>
                <Text>Please login to upload a photo</Text>
            </View>
        )
    }

}

function OptionButton({ icon, label, onPress, isLastOption }) {
  return (
    <RectButton style={[styles.option, isLastOption && styles.lastOption]} onPress={onPress}>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.optionIconContainer}>
          <Ionicons name={icon} size={22} color="rgba(0,0,0,0.35)" />
        </View>
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionText}>{label}</Text>
        </View>
      </View>
    </RectButton>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  contentContainer: {
    paddingTop: 15,
  },
  optionIconContainer: {
    marginRight: 12,
  },
  option: {
    backgroundColor: '#fdfdfd',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: '#ededed',
  },
  lastOption: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontSize: 15,
    alignSelf: 'flex-start',
    marginTop: 1,
  },
});
