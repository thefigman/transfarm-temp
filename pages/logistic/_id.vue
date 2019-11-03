<template lang="pug">
  section.logistic-section
    app-header
    google-map
    v-btn.delivered-btn(@click="updateDelivery") Delivered
    .pin
      font-awesome-icon(:icon="['fas', 'map-pin']")
</template>

<script lang="ts">
  import Vue from 'vue'
  import AppHeader from '../../components/app-header/app-header-1.vue';
  import GoogleMap from '../../components/map/google-map-test.vue';
  import firebase from 'firebase';
  import AppUsers from '../../assets/scripts/firebends/AppUsers';
import ListingItems from '../../assets/scripts/firebends/ListingItems';

  export default Vue.extend({
    components: {
      AppHeader,
      GoogleMap
    },
    data() {
      return {
        user: '',
      }
    },
    async mounted() {
      // this.user = await AppUsers.getOne(firebase.auth().currentUser.uid);
      // await console.log(firebase.auth().currentUser);
      let vue = this;
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          AppUsers.getOne(user.uid).then((userData) => {
            let location;
            // location.lat = userData.userLocation.lat;
            // location.long = userData.userLocation.long;
            // vue.locations.push(location);
          });
          
          
        } else {
          console.log('LOGGED OUT')
        }
      })
    },
    methods: {
      updateDelivery() {
        ListingItems.update(this.$route.params.id, {
          contractStatus: 2
        }).then(()=> {
          this.$router.push('/logistic-home');
        });
      }
    }
  })
</script>

<style lang="scss">
@import "~scss/main";
.logistic-section {
  position: relative;
  .GMap {
    height: 100vh;
    padding-top: 55px;
    &__Wrapper {
      height: 100%;
    }
  }

  .delivered-btn {
    position: absolute;
    bottom: 3rem;
    left: 3rem;
    right: 3rem;
    width: 80%;
    background-color: $c-primary !important;
    color: white !important;
    border-radius: 50px !important;
    font-size: 1.4rem;
    padding: 1.5rem !important;
    height: auto !important;
  }

  .pin {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(5);
    color: $c-red;
  }
}
</style>