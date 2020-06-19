import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import *  as React from 'react';
import { useEffect } from 'react';

import { StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native';
import { RectButton, ScrollView, FlatList, TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { f, auth, database, storage } from '../config/config'
import Constants, { UserInterfaceIdiom } from 'expo-constants';
import { preventAutoHide } from 'expo-splash-screen';

export default function PhotoList({ isUser, userId }) {

    const [refresh, setRefresh] = React.useState(false);
    const [photofeed, setPhotoFeed] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const [state, setState] = React.useState({
        photofeed: [],
        refresh: false,
        loading: true
    });

    useEffect(effect => {
        console.log('isUser: ' + isUser)
        console.log('userId : ' + userId)

        if (isUser == true) {
            // Profile 
            // UserId
            loadFeed(userId);
        } else {
            loadFeed('');
        }
    }, []);

    const pluralCheck = (s) => {
        if (s == 1) {
            return ' ago'
        } else {
            return ' agos'
        }
    }
    const timeConverter = (timestamp) => {
        var a = new Date(timestamp * 1000);
        var seconds = Math.floor((new Date() - a) / 1000);


        var interval = Math.floor(seconds / 31536000);

        if (interval > 1) {
            return interval + ' year' + pluralCheck(interval);
        }

        interval = Math.floor(seconds / 25292000);
        if (interval > 1) {
            return interval + ' month' + pluralCheck(interval);
        }

        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            return interval + ' day' + pluralCheck(interval);
        }

        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return interval + ' hour' + pluralCheck(interval);
        }

        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return interval + ' minute' + pluralCheck(interval);
        }
        return Math.floor(seconds) + ' second' + pluralCheck(seconds);

    }
    const addToFlatList = (photo_feed, data, photo) => {
        var photoObj = data[photo];
        console.log('photoObj data: ' + JSON.stringify(photoObj));

        database.ref('users').child(photoObj.author).child('username').once('value').then((snapshot) => {
            console.log(photoObj.url);
            setPhotoFeed(item => [...item, {
                id: photo,
                url: photoObj.url,
                caption: photoObj.caption,
                posted: timeConverter(photoObj.posted),
                author: snapshot.val(),
                authorId: photoObj.author
            }]);

            console.log(' photo_feed: ' + JSON.stringify(photo_feed));
        }).catch(error => { alert(error) });
    }
    const loadFeed = (userId = '') => {
        console.log('load feed called');

        setRefresh(true);
        setPhotoFeed([]);


        var loadRef = database.ref('photos');

        if (userId != '') {
            loadRef = database.ref('users').child(userId).child('photos');
        }
        database.ref('photos').orderByChild('posted').once('value').then((snapshot) => {
            var data = {};

            if ((snapshot.val() !== null)) { data = snapshot.val(); }
            console.log('snapshot into data: ' + JSON.stringify(data));
            console.log('1');
            for (var photo in data) {
                addToFlatList(photofeed, data, photo);
                setRefresh(false);
            }
        }).catch((error) => { alert(error) });

    };

    const loadNew = () => {
        loadFeed('');
    };

    return (

        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>


            <View>

                <FlatList
                    refreshing={refresh}
                    onRefresh={loadNew}
                    data={photofeed}
                    keyExtractor={(item, index) => index.toString()}
                    style={{ flex: 1, backgroundColor: "#eee" }}
                    renderItem={({ item, index }) => (
                        <View key={index} style={{ width: '95%', marginLeft: 12, marginRight: 0, overflow: 'hidden', marginBottom: 5, justifyContent: 'space-between', borderBottomWidth: 1, borderColor: 'grey' }}>
                            <View style={{ padding: 5, width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TouchableOpacity onPress={() => { alert('clicked posted') }}>
                                    <Text>{item.posted}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.navigate('UserProfileScreen', {
                                            userId: item.authorId
                                        });
                                    }}>
                                    <Text>{item.author}</Text>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <Image source={{ uri: item.url }}
                                    style={{ resizeMode: 'cover', width: '100%', height: 275 }}
                                />
                            </View>
                            <View style={{ padding: 5, }}>
                                <Text>{item.caption}</Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        // navigation.navigate("Comments", {
                                        //     userId: item.authorId
                                        // })
                                        navigation.navigate('Comments', {
                                            userId: item.authorId
                                        });
                                    }}
                                >
                                    <Text style={{ marginTop: 10, color: 'blue', textAlign: 'center' }}>[ View Comments ]</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                >
                </FlatList>
            </View>
        </ScrollView>
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