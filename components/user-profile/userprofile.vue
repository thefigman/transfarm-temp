<template lang="pug">
  .user-profile 
    .user-info
      img(:src="imgUrl")
      h1 {{title}}
      p(v-for="coop in coops", @click="openCoop(coop)") {{coop.title}}
      
    .products-list
      .item-wrapper.q-shadow(v-for="item in items" :key="item.id"  @click="openContract(item)")
        .item
          .bg-img(v-bind:style="{backgroundImage:'url(' + item.imgUrl + ')'}")
          .info
            p.q-title {{item.title}}
            p.item__price P{{item.price}}
        
</template>
<style lang="scss">
.user-profile {
  .user-info {
    text-align: center;
    padding: 5rem 5rem 3rem 5rem;
    img {
      height: 10em;
      border-radius: 100%;
    }
  }
  .items-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 1rem;

    .item {
      padding-top: 100%;
      background: red;

      img {
        width: 100%;
      }
    }
  }
}
</style>
<script lang="ts">
import Vue from 'vue'
import firebase, { firestore } from 'firebase'
import Users from '../../assets/scripts/firebase/Users'
import { AppUser } from '../../assets/scripts/model/app/AppUser'
import { Coop } from '../../assets/scripts/model/app/Coop'
export default Vue.extend({
  data() {
    return {
      imgUrl: '',
      title: '',
      subtitle: '',
      items: [],
      coops: []
    }
  },
  async mounted() {
    const firebaseUser = firebase.auth().currentUser
    const user: AppUser = (await Users.queryOnce(
      firebase.auth().currentUser.uid
    )) as AppUser
    this.imgUrl = firebaseUser.photoURL
    this.title = firebaseUser.displayName

    firebase
      .firestore()
      .collection('coops')
      .where('farmers', 'array-contains', firebaseUser.uid)
      .get()
      .then(coops => {
        coops.docs.forEach(coop => {
          const c = coop.data()
          c.id = coop.id
          this.coops.push(c)
        })
      })

    firebase
      .firestore()
      .collection('listingItems')
      .where('userId', '==', firebaseUser.uid)
      .get()
      .then(i => {
        i.docs.forEach(item => {
          const i = item.data()
          i.id = item.id
          this.items.push(i)
        })
      })
  },
  methods: {
    openContract(item) {
      this.$router.push('/contract/' + item.id)
    },
    openCoop(coop) {
      this.$router.push('/cooperatives/' + coop.id)
    }
  }
})
</script>