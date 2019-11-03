<template lang="pug">
  section.home-section
    p.q-heading Explore TransFarm

    .home-selection
      .q-btn-container
        .q-btn.q-btn-buying
          img(src="../../assets/images/icons/shopping-cart-solid.svg")
        p Buying

      .q-btn-container
        .q-btn.q-btn-selling
          img(src="../../assets/images/icons/money-bill-wave-solid.svg")
        p Selling
    p.q-heading All Contracts
    ProductsList
</template>
<script lang="ts">
import Vue from 'vue'
import ProductsList from '../products-list/products-list.vue'
export default Vue.extend({
  components: {
    ProductsList
  }
})
</script>
<style lang="scss">
@import "~scss/main";
.home-section {
  padding-top: 2rem;
}
.home-selection {
  @include flex-center;
  padding: 3rem 0 3rem;

  .q-btn {
    background: $c-primary;
    border-radius: 50%;
    width: 70px;
    height: 70px;
    @include flex-center;

    &-container {
      cursor: pointer;
      flex: 1;
      @include flex-center;
      flex-direction: column;
    }
  }

  img {
    max-height: 30px;
    max-width: 30px;
  }

  p {
    font-size: 1.4rem;
    padding-top: 1rem;
  }
}
</style>
