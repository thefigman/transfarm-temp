<template lang="pug">
  section.contract-section
    .contract-back-btn 
    .img-container(v-bind:style="{backgroundImage:'url(' + contract.imgUrl + ')'}")
    .text-container
      .contract-title {{contract.title}}
      .contract-price ₱ {{contract.price}}

      .contract-details
        .contract-details-heading Requested Quantity
        .contract-details-text {{contract.weight}} KG
      
      .contract-details
        .contract-details-heading Estimated Date of Harvest
        .contract-details-text {{new Date(contract.date).toDateString()}}

      .contract-details
        .contract-details-heading {{nameHeading}}
        .contract-details-text.q-bold {{user.name}}
        .contract-details-text {{user.address}}
      .contract-details
        .contract-details-heading Item Details
        .contract-details-text(v-for="detail in contract.details")
          | - {{detail}}
        
    .accept-offer-btn-container(:style="btnVisibility")
      v-btn.accept-offer-btn(@click="accept") Accept Offer

</template>

<script lang="ts">
import Vue from 'vue'
import ListingItems from '../../assets/scripts/firebends/ListingItems'
import AppUsers from '../../assets/scripts/firebends/AppUsers'
import firebase from 'firebase'

export default Vue.extend({
  async mounted() {
    this.contractId = this.$route.params.id
    this.contract = await ListingItems.getOne(this.contractId)
    this.user = await AppUsers.getOne(this.contract.userId)
    console.log(this.contract.userId, firebase.auth().currentUser.uid)
    if (this.contract.userId == firebase.auth().currentUser.uid) {
      this.btnVisibility.display = 'none'
    }
    if(this.user.userType = 0) {
      this.nameHeading = "SELLER DETAILS"
    }
    else {
      this.nameHeading = "MANUFACTURER DETAILS"
    }
  },
  data() {
    return {
      contract: '',
      user: '',
      contractId: '',
      btnVisibility: {
        display: 'block'
      },
      nameHeading: 'TEST'
    }
  },
  methods: {
    accept() {
      this.$router.push('/checkout/' + this.contractId)
    }
  }
})
</script>

<style lang="scss">
@import '~scss/main';
.contract-section {
  position: relative;

  .img-container {
    padding-bottom: 66.25%;
    background: url('../../assets/images/sample.jpg') center no-repeat;
    background-size: cover;
  }

  .text-container {
    background: white;
    border-radius: 50px 50px 0 0;
    transform: translateY(-50px);
    padding: 4rem;

    .contract-title {
      font-size: 1.8rem;
      font-weight: 600;
    }

    .contract-price {
      font-size: 1.8rem;
      font-weight: bold;
      color: $c-primary;
      padding-top: 1rem;
    }

    .contract-weight {
      font-size: 1.8rem;
      padding-top: 1rem;
    }
  }

  .contract-details {
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

  .accept-offer-btn {
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