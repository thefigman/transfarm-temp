import firebase from 'firebase'
import {AppUser} from '../model/app/AppUser'
const db = firebase.firestore()

function add(user: AppUser) {
  return new Promise((resolve, reject) => {
    db.collection('users').add(user).then(() => {
      resolve()
    }).catch(error => {
      reject(error)
    })
  })
}

function queryOnce(email: string) {
  return new Promise((resolve, reject) => {
    db.collection('users').where('email', '==', email)
      .get().then((res: firebase.firestore.QuerySnapshot) => {
        resolve(res.docs)
      })
  })
}

function test() {
  console.log("HAHAHAHA")
}



export default {
  add, test, queryOnce
}