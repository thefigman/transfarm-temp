import * as firebase from 'firebase'
import 'firebase/storage'

function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function uploadFile(file) {
  const ref = firebase.storage().ref('img' + makeid(10))

  return new Promise((resolve, reject) => {
    ref.put(file).then(snapshot => {
      console.log(snapshot)
      resolve(snapshot)
    }).catch(error => {
      reject(error)
    })
  })
}

export default {
  uploadFile
}