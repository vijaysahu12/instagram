import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import *  as React from 'react';
import { useEffect } from 'react';

import { TouchableOpacity, StyleSheet, Text, View, Image } from 'react-native';
import { RectButton, ScrollView, FlatList } from 'react-native-gesture-handler';

import { f, auth, database, storage } from '../config/config'
export default function FeedScreen() {

    const [refresh, setRefresh] = React.useState(false);
    const [photofeed, setPhotoFeed] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const loadNew = () => {
        loadFeed();
    };

    useEffect(effect => {
        if (loading) {
            loadNew();
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
    const loadFeed = () => {
        console.log('load feed called');

        setRefresh(true);
        setPhotoFeed([]);

        database.ref('photos').orderByChild('posted').once('value').then((snapshot) => {

            var data = {};
            if ((snapshot.val() !== null)) { data = snapshot.val(); }

            console.log('snapshot into data: ' + JSON.stringify(data));
            console.log('1');
            for (var photo in data) {
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

                    console.log(' photo_Feed: ' + JSON.stringify(photofeed));

                    setRefresh(false);
                    setLoading(false);
                }).catch(error => { alert(error) });
            }
        }).catch((error) => { alert(error) });
    };
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View>
                <View style={{ height: 70, paddingTop: 30, backgroundColor: 'white', borderColor: 'lightgrey', borderBottomWidth: 0.5, justifyContent: 'center', alignItems: 'center' }}>
                </View>
            </View>


            <FlatList
                refreshing={refresh}
                onRefresh={loadNew}
                data={photofeed}
                keyExtractor={(item, index) => index.toString()}
                style={{ flex: 1, backgroundColor: "#eee" }}
                renderItem={({ item, index }) => (
                    <View key={index} style={{ width: '95%', marginLeft: 12, marginRight: 0, overflow: 'hidden', marginBottom: 5, justifyContent: 'space-between', borderBottomWidth: 1, borderColor: 'grey' }}>
                        <View style={{ padding: 5, width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={() => {alert('clicked posted')}}>
                                <Text>{item.posted}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                        alert('clicked author')
                                        
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
                            <Text style={{ marginTop: 10, textAlign: 'center' }}>View Comments...</Text>
                        </View>
                    </View>
                )}
            >

            </FlatList>
        </ScrollView>
    );
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