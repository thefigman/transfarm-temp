<template lang='pug'>
  button(@click='login') Login
</template>
<script lang="ts">
import Vue from 'vue'
import firebase from 'firebase'
export default Vue.extend({
  methods: {
    login() {
      let provider = new firebase.auth.GoogleAuthProvider()
      firebase
        .auth()
        .signInWithPopup(provider)
        .then((result)=> {
          // This gives you a Google Access Token. You can use it to access the Google API.
          // @ts-ignore
          let token = result.credential.accessToken
          // The signed-in user info.
          let user = result.user
          this.$emit('login', user)
          // ...
        })
        .catch(function(error) {
          console.log(error)
          // Handle Errors here.
          let errorCode = error.code
          let errorMessage = error.message
          // The email of the user's account used.
          let email = error.email
          // The firebase.auth.AuthCredential type that was used.
          let credential = error.credential
          // ...
        })
    }
  }
})
</script>