import *  as React from 'react';
import { useEffect } from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { database } from '../config/config'

export default function EditUserProfile({route }) {

    
    const [] = React.useState(true);
    const [loaded,setLoaded] = React.useState(false);
    const [, setUserId] = React.useState(0);
    const [, setUserName] = React.useState('');
    const [, setName] = React.useState('');
    const [, setAvatar] = React.useState('');

    const[user,setUser] = React.useState({
        Name: 'Vijay Sahu',
        UserName: '',
        Description: 'july 9 Wish Me @Scorpion @vijaysahu.in',
        PortfolioUrl: 'www.vijaysahu.in',
        Posts: 109,
        Followers: 100,
        Following: 52,
        profileImage: 'https://api.adorable.io/avatars/285/test@user.k.png'
    })
    useEffect(() => { 
        checkParams();
    }, []);

    const checkParams = () => {
        console.log('Check Params for comment screen');
        console.log('route: ' + JSON.stringify(route) );
        console.log('props: ' + route.params.userId );
        // {"key":"UserProfileScreen-ZE1sUAWrzW5ZHpR-HkfFk","name":"UserProfileScreen","params":{"userId":"exampleUserId"}}
        var params = route.params;
        if(params){
            setUserId(params.userId);
            setUser.userId = params.userId;
            fetchUserInfo(params.userId);
        }
    }
    const fetchUserInfo =(userId) => {
        console.log('Fetch user info: ' + userId);
        
        database.ref('users').child(userId).child('username').once('value').then((snapshot) => {
            const exists = snapshot.val() != null;
            if(exists) {
                // setUserName(snapshot.val());
                setUser.UserName = snapshot.val()
                console.log('UserName: ' + snapshot.val());
            }
        }).catch(error => console.log(error)); // db ref end

        database.ref('users').child(userId).child('name').once('value').then((snapshot) => {
            const exists = snapshot.val() != null;
            if(exists) {
                // setName(snapshot.val());
                setUser.Name = snapshot.val()
                console.log('Name: ' + snapshot.val());

            }
        }).catch(error => console.log(error)); // db ref end

        database.ref('users').child(userId).child('avatar').once('value').then((snapshot) => {
            const exists = snapshot.val() != null;
            if(exists) {
                // setAvatar(snapshot.val());
                setUser.ProfileImage = snapshot.val()
                setLoaded(true);
                console.log('user avatar: ' + snapshot.val());

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
                <Text>Loading Profile Details</Text>
                {/* <Button onPress={()=> { navigation.goBack() }} title="Go Back" > </Button> */}
            </View>
        )
    }
}



