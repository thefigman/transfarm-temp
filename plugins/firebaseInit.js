import firebase from 'firebase'
var firebaseConfig = {
  apiKey: "AIzaSyCHe0WoNtC4SVBaRz1ygG4fQcjk2RPnR1U",
  authDomain: "quavinuxt.firebaseapp.com",
  databaseURL: "https://quavinuxt.firebaseio.com",
  projectId: "quavinuxt",
  storageBucket: "quavinuxt.appspot.com",
  messagingSenderId: "886373296399",
  appId: "1:886373296399:web:72a1a616b0944db761767a"
};
if (firebase.apps.length == 0) {
  firebase.initializeApp(firebaseConfig);
}