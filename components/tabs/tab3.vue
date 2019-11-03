<template lang="pug">
  section.logistic-home
    app-header
    .products-list
      .item-wrapper.q-shadow(v-for="item in items" :key="item.id" @click="openContract(item.id)")
        .info
          p.q-title {{item.title}}
          p.item__price P{{item.price}}
          p.item__heading BUYER
          p.item__heading SELLER
          p.item__buyer {{user.name}}
          p.item__seller {{otherUser.name}}
          p.item__buyer-address {{userLocation}}
          p.item__seller-address {{otherUserLocation}}
        p.status DELIVERED
        
          
</template>

<script lang="ts">
  import Vue from 'vue'
  import AppHeader from '../../components/app-header/app-header-1.vue';
  import Items from '../../assets/scripts/firebends/ListingItems'
  import AppUsers from '../../assets/scripts/firebends/AppUsers';

  export default Vue.extend({
    components: {
      AppHeader
    },
    data() {
      return {
        items: [],
        user: '',
        otherUser: '',
        userLocation: '',
        otherUserLocation:''
      }
    },
    mounted() {
      const _this = this
      Items.listenToAll({
        added(doc) {
          const item = doc.data()
          if(item.contractStatus == 2) {
            AppUsers.getOne(item.userId).then((userData) => {
              _this.user = userData;
              _this.otherUserLocation = userData.userLocation.address;
            });

            AppUsers.getOne(item.otherUser).then((userData) => {
              _this.otherUser = userData;
              _this.userLocation = userData.userLocation.address;
            });

            item.id = doc.id
            _this.items.unshift(item)
            _this.items.sort((a, b) => {
              return a.timestamp - b.timestamp
            })
          }
        },
        removed() {},
        modified(doc) {
          const item = doc.data()
          if(item.contractStatus == 2) {
            AppUsers.getOne(item.userId).then((userData) => {
              _this.user = userData;
              _this.otherUserLocation = userData.userLocation.address;
            });

            AppUsers.getOne(item.otherUser).then((userData) => {
              _this.otherUser = userData;
              _this.userLocation = userData.userLocation.address;
            });

            item.id = doc.id
            _this.items.unshift(item)
            _this.items.sort((a, b) => {
              return a.timestamp - b.timestamp
            })
          }
        }
      })
    },
    methods: {
      openContract(id) {
        this.$router.push('/logistic/'+id);
      }
    }
  })
</script>

<style lang="scss">
@import "~scss/main";
.products-list {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1rem;
  padding: 1rem;

  .info {
    border-bottom: 1px solid $c-light-gray;
  }

  .status {
    padding: 1.5rem;
    font-weight: 700;
    color: $c-primary;
    font-size: 1.8rem;
    text-align: center;
  }

  .item-wrapper {
    position: relative;
    border-radius: $b-radius;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 80px;
    background-color: white;


    .bg-img {
      width: 80px;
      height: auto;
      background-size: cover;
    }
    .info {
      padding: 1.5rem;
      font-size: 1.2rem;
      display: flex;
      flex-wrap: wrap;
      flex: 100%;
      max-width: 100%;

      .q-title {
        font-size: 1.6rem;
      }

      p {
        flex: 50%;
        max-width: 50%;
      }

      .item__heading {
        font-weight: 600;
        color: $c-gray;
        margin-top: 1rem;
      }

      .item__price {
        font-size: 1.6rem;
        font-weight: 700;
        color: $c-green;
        text-align: right;
      }
    }

    button {
      flex: 100%;
      max-width: 100%;
      font-size: 1.4rem;
      padding: 1rem !important;

      &.view-map-btn {
        background: transparent !important;
        color: $c-primary;
        box-shadow: none;
      }

      &.delivered-btn {
        color: white;
        background: $c-primary !important;
        border-radius: 0 !important;
      }
    }
  }
}
</style>