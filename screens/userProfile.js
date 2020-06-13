import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import *  as React from 'react';
import { useEffect } from 'react';

import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { RectButton, ScrollView, FlatList } from 'react-native-gesture-handler';

import { f, auth, database, storage } from '../config/config'
import UploadScreen from './upload';

export default function User() {

    const [loggedIn, setLoggedIn] = React.useState(true);

    useEffect(effect => {
        f.auth().onAuthStateChanged((user) => {
            if (user) {
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
            <View style={styles.container}>
                <View style={{ flex: 1 }}>
                    {/* <View style={{ height: 70, paddingTop: 30, backgroundColor: 'white', borderColor: 'lightgrey', borderBottomWidth: 0.5, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>Profile</Text>
                    </View> */}
                    <View style={{ justifyContent: 'space-evenly', alignItems: 'center', flexDirection: "row", padding: 10 }} >
                        <Image source={{ uri: 'https://api.adorable.io/avatars/285/test@user.i.png' }} style={{ marginLeft: 10, width: 100, height: 100, borderRadius: 50 }}></Image>
                        <View style={{ marginRight: 10 }}>

                            <Text>Name</Text>
                            <Text>@VijaySahu</Text>
                        </View>
                    </View>
                    <View style={{ paddingBottom: 20, borderBottomWidth: 1 }}>
                        <TouchableOpacity style={styles.TouchableO}>
                            <Text style={styles.TouchableOText}>Logout</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.TouchableO}>
                            <Text style={styles.TouchableOText}>Edit Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                        onPress={() => {this.props.navigation.navigate(UploadScreen)}}
                        style={styles.TouchableOUpload }>
                            <Text style={{ textAlign: 'center'  ,color: 'white'}}>Upload New +</Text>
                        </TouchableOpacity>

                    </View>
                </View>

                <View style={{flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor:'green'}}>
                    <Text>Loading Photos....</Text>
                </View>
            </View>
        )
    } else {
        return (
            <View style={styles.container}>
                <Text>You are not logged in</Text>
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
