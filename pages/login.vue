<template lang="pug">
  GoogleAuth(@login="onLogin")
</template>
<script lang="ts">
import Vue from 'vue'
import GoogleAuth from '../components/auth/google-auth.vue'
import Users from '../assets/scripts/firebase/Users'
import { AppUser, AccountType } from '../assets/scripts/model/app/AppUser'
import { firestore } from 'firebase'

export default Vue.extend({
  methods: {
    onLogin(googleUser: firebase.User) {
      let user: AppUser = {
        name: googleUser.displayName,
        email: googleUser.email,
        userLocation: {
          address: 'TODO PLAIN ADDRESS',
          lat: 1.5,
          lng: 2.4
        },
        phone: '091111',
        accountType: AccountType.FARMER
      }
      Users.queryOnce(user.email).then(
        (users: firebase.firestore.QuerySnapshot) => {
          firestore()
            .collection('users')
            .doc(googleUser.uid).set(user)
        }
      )
    }
  },
  components: {
    GoogleAuth
  }
})
</script>
<style lang="scss">
</style>