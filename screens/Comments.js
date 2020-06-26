import { Ionicons } from '@expo/vector-icons';
import *  as React from 'react';
import { useEffect } from 'react';

import { Button, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { RectButton, ScrollView, FlatList, TextInput } from 'react-native-gesture-handler';

import { f, auth, database, storage } from '../config/config'
import UploadScreen from './upload';
import { requestCameraPermissionsAsync } from 'expo-image-picker';

export default function Comments({ route, navigation }) {


    const [loggedIn, setLoggedIn] = React.useState(true);
    const [loaded, setLoaded] = React.useState(false);
    const [userName, setUserName] = React.useState('');
    const [name, setName] = React.useState('');
    const [avatar, setAvatar] = React.useState('');
    const [state, setState] = React.useState({
        refresh: false,
        loggedIn: false
    });
    const [commentList, setCommentList] = React.useState([]);
    useEffect(effect => {
        checkParams();
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

    const checkParams = () => {
        console.log('checkParams: ' + JSON.stringify(route));
        var params = route.params;
        if (params) {
            fetchComments(params.photoId);
            
        }
    }

    
    const addCommentToList = (data, comment) => {
        var commentObj = data[comment];
        // console.log(commentObj ) 
        // console.log( data);
        // console.log(comment);

        database.ref('users').child(commentObj).child('username').once('value').then((snapshot) =>{
            const exists = (snapshot.val() != null);
          
            if(exists) data = snapshot.val();
 
           let objMessage = {
                id: comment,
                comment: commentObj.comment,
                posted: timeConverter(commentObj.posted),
                author: data,
                authorId: commentObj.author
            };
            // console.log('Pushing: ' + JSON.stringify({
                
            //     id: comment,
            //     comment: commentObj.comment,
            //     posted: timeConverter(commentObj.posted),
            //     author: data,
            //     authorId: commentObj.author
            // }));

            try {
                setCommentList(item => [...item, objMessage]);            
                console.log('objMessage: '+ JSON.stringify(objMessage));
                console.log('list:' + commentList);
            } catch (error) {
                console.log("vj Error: "+ error);                
            }

            // setState({
            //     loggedIn: true,
            //     refresh: false,
            //     loading:false
            // });
        }).catch((error)=>{ console.warn(error)});

    }


    const fetchComments= (photoId) => {
        state.loggedIn = true;
        database.ref('comments').child(photoId).orderByChild('posted').once('value').then((snapshot) => {
            if(snapshot.val() !== null){
                var data = snapshot.val();

                // console.log('data: ' + JSON.stringify(data));
                for(var comment in data){
                    addCommentToList(data , comment);
                }
                
                // add comments to flatlist 
            } else {
                console.log("There is no comment available..");
                setState.commentList = [];
            }
        }).catch((error)=>{console.warn('while calling comments: ' + error)});
        setLoaded(true);
        setState({
            loggedIn: true
        });
    }

    if (loaded == true) {
        return (
            (state.loggedIn == true) ?
                (
                    <View style={{ flex: 1, flexDirection: 'column', margin: 5, backgroundColor: 'white' , 
                    borderColor: 'grey',
                    borderWidth: 2, 
                    borderColor: 'black'}}>

                        <FlatList

                            data={state.commentList} 
                            keyExtractor={(item,index) => index.toString()}
                            style={{flex:1, backgroundColor: '#eee'}}
                            renderItem={({item,index}) => {
                                <View key={index} style={{
                                    overflow: 'hidden',
                                    width: '100%' , 
                                    overflow: 'hidden', 
                                    marginBottom: 5, 
                                    justifyContent: 'space-between', 
                                    borderColor: 'grey',
                                    borderWidth: 1, 
                                    borderColor: 'black'
                                    }}>
                                    <View style={{padding: 5, width: '100%', flexDirection: 'row', justifyContent:'space-between'}}>
                                        <Text>{item.posted}</Text>
                                        <TouchableOpacity>
                                            <Text>{item.author}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            }}
                        />
                        {/* <TextInput style={{ color: 'black', height: 30, borderColor: 'black', borderRadius: 5, paddingLeft: 5, marginTop: 10, borderWidth: 1 }} placeholder={"Enter your comment"} />
                        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', marginTop: 5, height: 30 ,borderRadius: 5 , backgroundColor: 'grey' , borderColor: 'black' }}>
                            <Text style={{textAlign: 'center'}}> Submit</Text>
                        </TouchableOpacity> */}
                    </View>
                ) :
                (
                    <View style={{ flex: 1, margin: 10, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 22, fontWeight: '800' }}>You are not authorised..</Text>
                    </View>
                )
        )
    } else {
        return (
            <View style={{ flex: 1, flexDirection: 'column', margin: 10, backgroundColor: 'white' }}>
                <Text>Loading Comments....</Text>
                <TextInput style={{ color: 'black', height: 30, borderColor: 'black', borderRadius: 5, paddingLeft: 5, borderWidth: 1 }} placeholder={"Enter your comment"} />
                <TouchableOpacity style={{ marginTop: 5, height: 20 }}>
                    <Text> Submit</Text>
                </TouchableOpacity>
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
