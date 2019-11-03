<template lang="pug">
  h1 {{val}}
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  computed: {
    val() {
      return this.$store.state.test.val
    }
  },
})
</script>