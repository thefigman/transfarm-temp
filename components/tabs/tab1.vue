<template lang="pug">
  section.coop-tab
    p.q-heading Cooperatives near you
    coops-list
</template>
<style lang="scss">

</style>
<script lang="ts">
import Vue from 'vue'
import CoopsList from '../coops-list/coops-list.vue';
export default Vue.extend({
  components: {
    CoopsList,
  }
  
})
</script>