import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import *  as React from 'react';
import { useEffect } from 'react';

import { Button, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { RectButton, ScrollView, FlatList } from 'react-native-gesture-handler';

import { f, auth, database, storage } from '../config/config'
import UploadScreen from './upload';

export default function Comments({route,navigation }) {

    
    const [loggedIn, setLoggedIn] = React.useState(true);
    const [loaded,setLoaded] = React.useState(false);
    const [userId, setUserId] = React.useState(0);
    const [userName, setUserName] = React.useState('');
    const [name, setName] = React.useState('');
    const [avatar, setAvatar] = React.useState('');


    useEffect(effect => { 
        checkParams();
    }, []);

    const checkParams = () => {
        console.log('Check Params');
        console.log('props: ' + JSON.stringify(route) );
        console.log('props: ' + route.params.userId );
        // {"key":"UserProfileScreen-ZE1sUAWrzW5ZHpR-HkfFk","name":"UserProfileScreen","params":{"userId":"exampleUserId"}}
        var params = route.params;
        if(params){
            setUserId(params.userId);
            fetchUserInfo(params.userId);
        }
    }
    const fetchUserInfo =(userId) => {
        console.log('Fetch user info: ' + userId);
        
        database.ref('users').child(userId).child('username').once('value').then((snapshot) => {
            const exists = snapshot.val() != null;
            if(exists) {
                setUserName(snapshot.val());
            }
        }).catch(error => console.log(error)); // db ref end

        database.ref('users').child(userId).child('name').once('value').then((snapshot) => {
            const exists = snapshot.val() != null;
            if(exists) {
                setName(snapshot.val());
            }
        }).catch(error => console.log(error)); // db ref end

        database.ref('users').child(userId).child('avatar').once('value').then((snapshot) => {
            const exists = snapshot.val() != null;
            if(exists) {
                setAvatar(snapshot.val());
                setLoaded(true);
            }
        }).catch(error => console.log(error)); // db ref end
    }


    if (loaded == true) {
        return (
            
            <View style={{ flex: 1 , paddingTop: 10  }}>
               <Text>Comments</Text>
            </View>
        )
    } else {
        return (
            <View style={{ flex:1 , flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: 'green' }}>
                <Text>Loading Comments....</Text>
                {/* <Button onPress={()=> { navigation.goBack() }} title="Go Back" > </Button> */}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1
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
    TouchableO: {
        marginTop: 10,
        marginHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 20,
        borderColor: 'grey',
        borderWidth: 1.5
    }, TouchableOText: {
        textAlign: 'center',
        color: 'grey'
    },
    TouchableOUpload: {
        marginTop: 10,
        marginHorizontal: 40,
        paddingVertical: 35,
        borderRadius: 20,
        backgroundColor: 'grey',
        borderWidth: 1.5
    }
});
