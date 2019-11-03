<template lang="pug">
  .app-header-1.q-shadow
    img.app-logo(src="../../assets/images/logo.png")
    span TransFarm
</template>
<style lang="scss">
@import '~scss/variables';
.app-header-1 {
  position: fixed;
  top: 0;
  left: 0;
  height: 5.5rem;
  width: 100vw;
  display: flex;
  align-items: center;
  z-index: 10;
  background: white;
  padding: 0.4rem;
  .app-logo {
    height: 100%;
    margin-right: 1rem;
  }

  span {
    padding-left: 1rem;
    font-size: 1.5rem;
    font-weight: 500;
    color: $c-primary;
  }
}
</style>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({})
</script>