<template lang='pug'>
  .app-index
    AppHeader
    component(:is="focusedTab")
    BottomNav(@tabChanged='onTabChanged')
</template>
<script lang='ts'>
import Vue from 'vue'
import firebase from 'firebase'
import { mapMutations } from 'vuex'
import BottomNav from '../components/mobile-nav/bottom-nav-1.vue'
import AppHeader from '../components/app-header/app-header-1.vue'
import Users from '../assets/scripts/firebase/Users'
export default Vue.extend({
  data() {
    return {
      tabIndex: 0
    }
  },
  components: {
    BottomNav,
    AppHeader
  },
  methods: {
    onTabChanged(index) {
      if (index == 2) {
        this.$router.push('/post-contract');
      } else {
        this.tabIndex = index;
      }
    }
  },
  computed: {
    focusedTab() {
      const t = this.tabIndex
      return () => import(`../components/tabs/tab${t}.vue`)
    }
  },
  mounted() {
    // Users.test()
    // Init.init()
    console.log(firebase.auth().currentUser)

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user
        console.log(user.email)
      } else {
        this.$router.push('/login')
      }
    })
  }
})
</script>
<style lang='scss'>
@import '~scss/variables.scss';
body, html {
  background-color: rgb(247, 247, 247) !important;
}
.app-index {
  padding: 5.5rem 0 5.5rem 0;
  
}
</style>