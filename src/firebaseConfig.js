import firebase from 'firebase';

var config = {
    apiKey: "AIzaSyC3xN6Yvp6z3olImMs804hzQIVwEDaqDbI",
    authDomain: "mystreet-e4dc1.firebaseapp.com",
    databaseURL: "https://mystreet-e4dc1.firebaseio.com",
    projectId: "mystreet-e4dc1",
    storageBucket: "gs://mystreet-e4dc1.appspot.com/",
    messagingSenderId: "282824749644"
};

var app = firebase.initializeApp(config);

export default app;