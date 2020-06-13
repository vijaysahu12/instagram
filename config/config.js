import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyD_ABDkFeH2rnmqJENBH2CPPKscdsarNj0",
    authDomain: "instagram-66620.firebaseapp.com",
    databaseURL: "https://instagram-66620.firebaseio.com",
    projectId: "instagram-66620",
    storageBucket: "instagram-66620.appspot.com",
    messagingSenderId: "507321506050",
    appId: "1:507321506050:web:4ceaa1eb1ca38b34cf8a1b",
    measurementId: "G-PT4ZG7C3YH"
  };


  firebase.initializeApp(firebaseConfig);


  export const f = firebase;
  export const database = firebase.database();
  export const storage = firebase.storage();
  export const auth = firebase.auth();



