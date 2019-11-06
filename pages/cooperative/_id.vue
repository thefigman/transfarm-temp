<template lang="pug">
  section.coop-profile-section
    .img-container(v-bind:style="{backgroundImage:'url(' + coop.imgUrl + ')'}")
    .text-container
      .coop-title {{coop.title}}
      .coop-details-heading 6 members

      p.q-heading Crops sold
      crops-list
        
    .join-coop-btn-container(v-if="membership == false")
      v-btn.join-coop-btn(@click="joinCoop") Join Cooperative

    .view-members-btn-container(v-if="membership == true")
      v-btn.view-members-btn(@click="viewMembers") View Members

</template>

<script lang="ts">
import Vue from 'vue'
import Coops from '../../assets/scripts/firebends/Coops'
import AppUsers from '../../assets/scripts/firebends/AppUsers'
import firebase from 'firebase'
import CropsList from '../../components/crops-list/crops-list.vue'

export default Vue.extend({
  components: {
    CropsList
  },
  async mounted() {
    this.coopId = this.$route.params.id
    this.coop = await Coops.getOne(this.coopId)
    this.userId = await firebase.auth().currentUser.uid
    this.membership = this.coop.farmers.includes(this.userId)
  },
  data() {
    return {
      coop: '',
      coopId: '',
      userId: '',
      membership: ''
    }
  },
  methods: {
    joinCoop() {
      this.coop.farmers.push(this.userId);
      Coops.update('farmers',this.coop.farmers);
    },
  }
})
</script>

<style lang="scss">
@import '~scss/main';
.coop-profile-section {
  position: relative;
  min-height: 100vh;

  .q-heading {
    padding: 2.5rem 0 1rem;
  }

  .img-container {
    padding-bottom: 66.25%;
    background: url('../../assets/images/sample.jpg') center no-repeat;
    background-size: cover;
  }

  .text-container {
    background: #f7f7f7;
    border-radius: 50px 50px 0 0;
    transform: translateY(-50px);
    padding: 4rem;
    height: 100%;

    .coop-title {
      font-size: 1.8rem;
      font-weight: 600;
    }
  }

  .coop-details {
    margin-top: 3rem;

    &-heading {
      font-weight: 600;
      color: $c-gray;
      font-size: 1.2rem;
      text-transform: uppercase;
      letter-spacing: 0.05rem;
    }

    &-text {
      font-size: 1.6rem;
      padding-top: 0.7rem;
    }
  }

  .join-coop-btn,
  .view-members-btn {
    display: block;
    width: 100%;
    background-color: transparent !important;
    color: white;
    letter-spacing: 0.2rem;
    font-size: 1.2rem;
    padding: 2rem !important;
    height: auto !important;

    &-container {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: $c-primary;
    }
  }
}
</style>