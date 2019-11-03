<template lang="pug">
  v-dialog(ref="dialog" v-model="modal" :return-value.sync="content" persistent width="290px")
    template(v-slot:activator="{ on }")
      v-text-field(v-model="content" :label="label" readonly v-on="on")
    v-date-picker(v-model="content" scrollable)
      v-spacer
      v-btn(text color="primary" @click="modal = false") Cancel
      v-btn(text color="primary" @click="$refs.dialog.save(content)") OK
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: ['label', 'value'],
  data() {
    return {
      date: new Date().toISOString().substr(0, 10),
      modal: false,
      content: new Date().toISOString().substr(0, 10)
    }
  },
  methods: {
    handleInput(e) {
      this.$emit('input', this.content)
    }
  },
  watch: {
    content() {
      this.$emit('input', this.content)
    }
  }
})
</script>

<style lang="scss">
</style>