<template lang="pug">
  section.checkout-section
    .checkout-bg
    .checkout-heading Checkout Contract
    // Payment Dialog
    v-dialog(v-model="paymentDialog" scrollable max-width="300px")
      template(v-slot:activator="{ on }")
        .checkout-card.checkout-card-payment(v-on="on")
          p.checkout-card-payment-heading Select Payment Method
          font-awesome-icon(:icon="['fas', 'chevron-right']")

          .payment-item.no-border.selected-payment(:class="{ 'no-padding' : selectedPaymentGateway=='' }")
            img(:src="selectedPaymentGateway.logo")
            p {{selectedPaymentGateway.name}}
      .checkout-card
        p.payment-item-heading Select Payment Method
        .payment-item(v-for="paymentGateway in paymentGateways" @click="setPaymentGateway(paymentGateway)")
          img(:src="paymentGateway.logo")
          p {{paymentGateway.name}}
    
    // Shipping Option
    v-dialog(v-model="shippingDialog" scrollable max-width="300px")
      template(v-slot:activator="{ on }")
        .checkout-card.checkout-card-shipping(v-on="on")
          p.checkout-card-payment-heading Select Shipping Option
          font-awesome-icon(:icon="['fas', 'chevron-right']")

          .payment-item.no-border.selected-shipping(:class="{ 'no-padding' : selectedShipping=='' }")
            p {{selectedShipping}}
      .checkout-card
        p.payment-item-heading Select Shipping Option
        .payment-item.shipping-item(v-for="shippingOption in shippingOptions" @click="setShippingOption(shippingOption)")
          p {{shippingOption}}

    // Payment Details
    .checkout-card.checkout-card-bottom
      .text-container
        .checkout-title {{contract.title}}
        .checkout-price ₱ {{contract.price}}

      .checkout-details
        .heading-wrapper
          .checkout-details-heading Buyer Address
          a.view-map(href="https://maps.google.com/?q=San Vicente Road, Bamban, Tarlac")
            font-awesome-icon(:icon="['fas', 'map-marker-alt']") 
            p View map
        .checkout-details-text Green Hills, San Juan, Pasig City

      .checkout-details
        .heading-wrapper
          .checkout-details-heading Seller Address
          a.view-map(href="https://maps.google.com/?q=San Vicente Road, Bamban, Tarlac")
            font-awesome-icon(:icon="['fas', 'map-marker-alt']") 
            p View map
        .checkout-details-text San Vicente Road, Bamban, Tarlac

    .checkout-btn-container
      v-btn.checkout-btn(@click="checkout") Checkout
</template>

<script lang="ts">
import Vue from 'vue'
import ListingItems from '../../assets/scripts/firebends/ListingItems'
import AppUsers from '../../assets/scripts/firebends/AppUsers'
import firebase from 'firebase'

export default Vue.extend({
  data() {
    return {
      contract: '',
      user: '',
      otherUser: '',
      contractId: '',
      paymentDialog: false,
      selectedPaymentGateway: '',
      shippingDialog: false,
      selectedShipping: '',
      shippingOptions: ['Cash On Delivery', 'Pick Up'],
      paymentGateways: [
        {
          name: '7-eleven Cliqq',
          logo:
            'https://firebasestorage.googleapis.com/v0/b/quavinuxt.appspot.com/o/paymentLogos%2F711_cliqq.png?alt=media&token=6e9e6d8d-4c96-4858-896e-4be9eec532a7'
        },
        {
          name: 'Bayad Center',
          logo:
            'https://firebasestorage.googleapis.com/v0/b/quavinuxt.appspot.com/o/paymentLogos%2Fbayad_center_logo.jpg?alt=media&token=a93f4a89-8aa3-4e8e-b59e-b0860c05a61f'
        },
        {
          name: 'ECpay',
          logo:
            'https://firebasestorage.googleapis.com/v0/b/quavinuxt.appspot.com/o/paymentLogos%2Fecpay.png?alt=media&token=5d16390d-f6e9-4105-b50b-fb6f7a612301'
        },
        {
          name: 'GCash',
          logo:
            'https://firebasestorage.googleapis.com/v0/b/quavinuxt.appspot.com/o/paymentLogos%2Fgcash.png?alt=media&token=6bd47e58-b47d-4022-a526-22be68341e0c'
        },
        {
          name: 'LBC Bills Payment',
          logo:
            'https://firebasestorage.googleapis.com/v0/b/quavinuxt.appspot.com/o/paymentLogos%2Flbc.jpg?alt=media&token=9cdd602a-98a5-4bf2-929e-b8ead7a042c0'
        },
        {
          name: 'M Lhuiller',
          logo:
            'https://firebasestorage.googleapis.com/v0/b/quavinuxt.appspot.com/o/paymentLogos%2Fmlhullier.png?alt=media&token=5886f8bb-23fd-42f9-9f99-2dea19ca749e'
        },
        {
          name: 'Paymaya',
          logo:
            'https://firebasestorage.googleapis.com/v0/b/quavinuxt.appspot.com/o/paymentLogos%2Fpaymaya.png?alt=media&token=8b56d057-dcc2-461c-ba14-62474888cec4'
        },
        {
          name: 'SM Bills Payment',
          logo:
            'https://firebasestorage.googleapis.com/v0/b/quavinuxt.appspot.com/o/paymentLogos%2Fsm.jpg?alt=media&token=2b78c626-9d49-4bec-8dc8-ed09a96b4a18'
        },
        {
          name: 'Union Bank',
          logo:
            'https://firebasestorage.googleapis.com/v0/b/quavinuxt.appspot.com/o/paymentLogos%2Funion_bank.jpg?alt=media&token=343d4cd3-4a59-40d0-a12a-530f0849cacb'
        }
      ]
    }
  },
  async mounted() {
    this.contractId = this.$route.params.id
    this.contract = await ListingItems.getOne(this.contractId)
    this.user = await AppUsers.getOne(this.contract.userId)
  },
  methods: {
    setPaymentGateway(paymentGateway) {
      this.paymentDialog = false
      this.selectedPaymentGateway = paymentGateway
    },
    setShippingOption(shippingOption) {
      this.shippingDialog = false
      this.selectedShipping = shippingOption
    },
    checkout() {
      console.log('TEST')
      ListingItems.update(this.contractId, {
        otherUser: firebase.auth().currentUser.uid,
        contractStatus: 1
      }).then(()=> {
        this.$router.push('/')
      })
    }
  }
})
</script>

<style lang="scss">
@import '~scss/main';
.checkout-section {
  padding: 2.5rem;
  padding-bottom: 5.5rem;
  position: relative;
  overflow: hidden;
  z-index: 0;

  .checkout-bg {
    display: block;
    position: absolute;
    top: -100px;
    left: 50%;
    transform: translate(-50%, 0) scale(1.5);
    height: 200px;
    width: 100%;
    background: $c-primary !important;
    border-radius: 0 0 100% 100%;
    z-index: -1;
  }

  .payment-item {
    padding: 1.5rem 0;
    display: flex;
    align-items: center;
    border-bottom: 1px solid $c-light-gray;

    &-heading {
      font-weight: 700;
      font-size: 1.6rem;
      padding-bottom: 1rem;
    }

    img {
      max-width: 30px;
      max-height: 30px;
    }

    p {
      padding-left: 1.5rem;
      font-size: 1.4rem;
    }

    &.no-border {
      border: none;
    }

    &.no-padding {
      padding: 0;
    }

    &.selected-payment,
    &.selected-shipping {
      padding-bottom: 0;
    }

    &.selected-shipping p {
      padding-left: 0;
    }

    &.shipping-item p {
      padding-left: 0;
    }
  }

  .checkout-heading {
    color: white;
    text-align: center;
    font-size: 1.6rem;
    font-weight: 700;
    margin-top: 1rem;
  }

  .checkout-card {
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.12);
    background: white;
    padding: 2.5rem;
    border-radius: 8px;
    width: 100%;
    height: 100%;
    z-index: 2 !important;

    .checkout-card-payment-heading {
      font-size: 1.4rem;
    }

    &.checkout-card-payment,
    &.checkout-card-shipping {
      margin-top: 3rem;

      p {
        display: inline-block;
      }

      svg {
        float: right;
        transform: translateY(5px);
      }
    }

    &.checkout-card-bottom {
      margin-top: 1.5rem;
    }

    &.checkout-card-shipping {
      margin-top: 0;
    }
  }

  .text-container {
    .checkout-title {
      font-size: 1.8rem;
      font-weight: 600;
    }
    .checkout-price {
      font-size: 1.8rem;
      font-weight: bold;
      color: $c-primary;
      padding-top: 1rem;
    }
  }

  .checkout-details {
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

    .heading-wrapper {
      & * {
        display: inline-block;
      }

      .view-map {
        float: right;

        p {
          padding-left: 0.5rem;
        }
      }
    }
  }

  .checkout-btn {
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