
<template lang="pug">
  ul.bottom-nav-1.q-shadow-up
    li.active
      font-awesome-icon(:icon="['fas', 'home']")
      a Home
    li
      font-awesome-icon(:icon="['fas', 'users']")
      a Cooperatives
    li.center-btn.q-center-content
      a POST
    li
      font-awesome-icon(:icon="['fas', 'history']")
      a History
    li
      font-awesome-icon(:icon="['fas', 'user']")
      a Account

</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  mounted() {
    const tabs = document.querySelectorAll('.bottom-nav-1 li')
    tabs.forEach((li, index) => {
      li.addEventListener('click', () => {
        if (index != 2) {
          tabs.forEach(tab => tab.classList.remove('active'))
          li.classList.add('active')
        }
        this.$emit('tabChanged', index)
      })
    })
  }
})
</script>
<style lang="scss">
@import '~scss/variables';
.bottom-nav-1 {
  $nav-height: 5.5rem;
  background-color: $c-white;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: $nav-height;
  display: flex;
  align-items: center;
  justify-content: space-around;
  list-style: none;
  text-align: center;
  z-index: 9999;

  li {
    flex: 1;
    font-size: 1rem;
    color: $c-dark-gray;
    transition: $a-timing;

    a {
      display: block;
    }

    svg {
      font-size: 1.4rem;
    }

    &.active {
      color: $c-primary;
    }
  }

  .center-btn {
    flex: none;
    width: 70px;
    height: 70px;
    border-radius: 100%;
    background-color: $c-primary;
    color: $c-white;
    font-size: 1.6rem;
    font-weight: 500;
    transform: translateY(-40%);

    a {
      font-size: 1.2rem;
    }
  }
}
</style>
