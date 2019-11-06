<template lang="pug">
  .coops-list
    .item-wrapper.q-shadow(v-for="item in items" :key="item.id"  @click="openContract(item)")
      .item
        .bg-img(v-bind:style="{backgroundImage:'url(' + item.imgUrl + ')'}")
        .info
          p.q-title {{item.title}}
</template>

<script lang="ts">
import Vue from 'vue'
import Coops from '../../assets/scripts/firebends/Coops'
import { Coop } from '../../assets/scripts/model/app/Coop'
import { firestore } from 'firebase'

export default Vue.extend({
  data() {
    return {
      items: []
    }
  },
  methods: {
    openContract(item) {
      // this.$router.push('/contract/' + item.id)
    }
  },
  mounted() {
    const _this = this
    Coops.listenToAll({
      added(doc) {
        const item = doc.data()
        if (item.contractStatus == 0) {
          item.id = doc.id
          _this.items.unshift(item)
          _this.items.sort((a, b) => {
            return a.timestamp - b.timestamp
          })
        }
      },
      removed() {},
      modified() {}
    })
  }
})
</script>

<style lang="scss">
@import '~scss/variables.scss';
.coops-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
  padding: 1rem;

  .item-wrapper {
    position: relative;
    border-radius: $b-radius;
    overflow: hidden;
    background: white;
    z-index: 2;

    .item {
      background: white;
      .bg-img {
        padding-top: 70%;
        background-image: url('../../assets/images/sample.jpg');
        background-size: cover;
      }
      .info {
        padding: 1.5rem;
        font-size: 1.2rem;

        .item__price {
          font-size: 1.4rem;
          font-weight: 700;
          color: $c-green;
        }
      }
    }
  }
}
</style>