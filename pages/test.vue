<template lang='pug'>
  div
    h1 Functionality test cases
    h2 From test store: {{val}}
    h2 Store from component
    TestComp
    h2 Google login
    GoogleAuth
    h2 Google user
    p {{user.displayName}}
    h2.red This has red class
    v-color-picker
    font-awesome-icon(:icon="['fas', 'home']")
    GoogleMapTest
    BottomNav

</template>
<script lang='ts'>
import Vue from 'vue'
import firebase from 'firebase'
import { mapMutations } from 'vuex'
import GoogleAuth from '../components/auth/google-auth.vue'
import TestComp from '../components/testcomp.vue'
import GoogleMapTest from '../components/map/google-map-test.vue'
import BottomNav from '../components/mobile-nav/bottom-nav-1.vue'

export default Vue.extend({
  components: {
    BottomNav,
    GoogleAuth,
    GoogleMapTest,
    TestComp
  },
  data() {
    return {
      user: {}
    }
  },
  mounted() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user
        console.log(user.email)
      } else {
        console.log('LOGGED OUT')
      }
    })

    console.log("WIW")

    if (navigator.geolocation) {
      console.log("SUPPORTED")
      navigator.geolocation.getCurrentPosition(pos => {
        console.log(pos, 'test')
      })
    } else {
      console.log('Geo Location not supported by browser')
    }
  },
  computed: {
    val() {
      return this.$store.state.test.val
    }
  },
  methods: {
    inc() {
      this.increment()
    },
    ...mapMutations({
      increment: 'test/increment'
    })
  }
})
</script>
<style lang="scss">
@import '~scss/variables.scss';
</style>