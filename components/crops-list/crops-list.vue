<template lang="pug">
  .crops-list
    .item-wrapper.q-shadow(v-for="item in items" :key="item.id")
      .item
        .bg-img(v-bind:style="{backgroundImage:'url(' + item.imgUrl + ')'}")
        .info
          p.q-title {{item.title}}
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      items: [
        {
          imgUrl: 'https://firebasestorage.googleapis.com/v0/b/quavinuxt.appspot.com/o/imgwmAnYv6oZo?alt=media&token=9d5bfe6f-a234-462a-a714-8ca49a9ada4a',
          title: 'Fresh Coconut'
        },
        {
          imgUrl: 'https://firebasestorage.googleapis.com/v0/b/quavinuxt.appspot.com/o/imgaZCMgTow0P?alt=media&token=5e36be81-d0ab-4f03-bd75-3c9c78353b78',
          title: 'Premium Local Rice'
        },
        {
          imgUrl: 'https://firebasestorage.googleapis.com/v0/b/quavinuxt.appspot.com/o/imgM23YNNYkpV?alt=media&token=aef51040-89eb-4005-b4da-d3cf79e504bf',
          title: 'Bitter Gourd'
        }
      ]
    }
  },
  methods: {
  },
  mounted() {
  }
})
</script>

<style lang="scss">
@import '~scss/variables.scss';
.crops-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
  padding: 1rem 0;

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