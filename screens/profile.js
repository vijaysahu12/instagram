import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import *  as React from 'react';
import { useEffect } from 'react';

import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { RectButton, ScrollView, FlatList } from 'react-native-gesture-handler';
import  PhotoList from '../components/photoList'
import { f, auth, database, storage } from '../config/config'
import UploadScreen from './upload';

export default function ProfileScreen({navigation}) {

    const [refresh, setRefresh] = React.useState(false);
    const [photofeed, setPhotoFeed] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [loggedIn, setLoggedIn] = React.useState(true);
    const [userId,setUserId] = React.useState('');

    const[user,setUser] = React.useState({
        userId: '',
        Name: 'Vijay Sahu',
        Description: 'july 9 Wish Me @Scorpion @vijaysahu.in',
        portfolioUrl: 'www.vijaysahu.in',
        Posts: 109,
        Followers: 100,
        Following: 52,
        profileImage: 'https://api.adorable.io/avatars/285/test@user.k.png'
    })
    useEffect(effect => {
        f.auth().onAuthStateChanged((user) => {
            console.log('userDetails: ' + JSON.stringify(user))
            if (user) {
                // logged in
                setLoggedIn(true);
                setUserId(user.uid);
                console.log(user.uid);
                setUser({userId: user.uid});
            } else {
                // not logged in 
                setLoggedIn(false);
                setUserId(user.uid);
                console.log(user.uid);
                setUser({userId: user.uid});
            }
        });
        console.log('userId: ' + userId);
    }, []);


    if (loggedIn == true) {
        return (
            <View style={styles.container}>
                <View style={{ flex: 1 }}>
                    <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: "row", padding: 10 }} >
                        <Image source={{ uri: user.profileImage }} style={{ marginLeft: 10, width: 100, height: 100, borderRadius: 50 }}></Image>
                        <View style={{ marginRight: 10 }}>
                            <Text style={{textAlign:'center'}}>{user.Posts}</Text>
                            <Text>Posts</Text>
                        </View>
                        <View style={{ marginRight: 10 }}>
                            <Text style={{textAlign:'center'}}>{user.Followers}</Text>
                            <Text>Followers</Text>
                        </View>
                        <View style={{ marginRight: 10 }}>
                            <Text style={{textAlign:'center'}}>{user.Following}</Text>
                            <Text>Following</Text>
                        </View>
                    </View>
                    <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: "column", padding: 10 }} >
                        <Text>{user.Name}</Text>
                        <Text>{user.Description}</Text>
                        <Text>{user.portfolioUrl}</Text>
                    </View>
                    <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: "row", padding: 10 }} >
                        <TouchableOpacity style={styles.TouchableO}>
                            <Text style={styles.TouchableOText}>Logout</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                        

                        onPress={() => {
                            navigation.navigate('EditUserProfile', {
                                userId: userId
                            });
                        }}
                        
                        style={styles.TouchableO}>
                            <Text style={styles.TouchableOText}>Edit Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                        onPress={() => {navigation.navigate('Root', { screen: 'UploadScreen'})}}
                        style={styles.TouchableOUpload }>
                            <Text style={{ textAlign: 'center'  ,color: 'white'}}>Upload New +</Text>
                        </TouchableOpacity>
                    </View>  
                    <View style={{ flex:1, paddingBottom: 2, borderBottomWidth: 1 , flexDirection:'row' , justifyContent: 'center', alignItems: 'flex-start'}}>
                        {/* <PhotoList isUser={true} userId ={userId} navigation={navigation}  /> */}
                    </View> 
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
        marginHorizontal: 4,
        paddingVertical: 15,
        borderRadius: 20,
        borderColor: 'grey',
        borderWidth: 1.5,
        width: "32%"
    }, 
    TouchableOText: {
        textAlign: 'center',
        color: 'grey'
    },
    TouchableOUpload: {
        marginTop: 10,
        marginHorizontal: 4,
        paddingVertical: 15,
        borderRadius: 20,
        backgroundColor: 'grey',
        borderWidth: 1.5,
        width:"32%"
    }
});
