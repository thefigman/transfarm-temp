<template lang="pug">
  section.add-contract-section
    v-row
      p.add-contract-heading Post a contract
      v-col(cols="12" @click="postContract").add-contract-picture
        font-awesome-icon(:icon="['fas', 'camera']" size="7x")
        p Take a photo of your item
        input(type="file" name="test" ref="input" @change="onFileChanged")
        .selected-img(ref="selectedImg" v-bind:style="{backgroundImage:'url(' + image + ')'}")

      v-col(cols="12")
        v-text-field(label="Title" v-model="title")

      v-col(cols="12")
        v-text-field(label="Price" v-model="price")

      v-col(cols="12")
        v-text-field(label="Weight in KG" v-model="weight")

      v-col(cols="12").add-contract-date-picker
        date-picker(:label="dateLabel" v-model="date")

      v-col(cols="12")
        v-textarea(label="Item Details" v-model="details")
      
    .add-contract-submit-btn-container
      v-btn(@click="postItem") POST NOW
          
</template>

<script lang="ts">
import Vue from 'vue'
import datePicker from '../components/picker/datepicker.vue'
import FileUploadService from '../assets/scripts/services/FileUploadService'
import ListingItems from '../assets/scripts/firebends/ListingItems'
import firebase from 'firebase'
import AppUsers from '../assets/scripts/firebends/AppUsers'
import { AppUser } from '../assets/scripts/model/app/AppUser'
import { ListingItem } from '../assets/scripts/model/app/ListingItem'
export default Vue.extend({
  components: {
    datePicker
  },
  data() {
    return {
      image: '',
      title: 'Premium Local Rice 10000kg',
      price: '400000',
      weight: '10000',
      details: 'Sweet, White, and really Soft.',
      date: '',
      expirationDate: '',
      listingType: '',
      downloadUrl: '',

      dateLabel: '',
      firebaseUser: ''
    }
  },
  methods: {
    loadHome() {
      this.$router.push('/')
    },
    postItem() {
      // ListingItems.add({
      //   title: this.title
      // })
      const item: ListingItem = {
        title: this.title,
        price: this.price,
        weight: this.weight,
        details: [this.details],
        imgUrl: this.downloadUrl,
        date: this.date,
        listingType: this.listingType,
        userId: this.firebaseUser.uid,
        timestamp: new Date().getTime(),
        contractStatus: 0
      }
      ListingItems.add(item).then(() => {
        this.loadHome()
      })
    },
    postContract() {
      this.$refs.input.click()
    },
    async onFileChanged(event) {
      const selectedFile = event.target.files[0]
      const imgUrl = await FileUploadService.uploadFile(selectedFile)
      //@ts-ignore
      this.downloadUrl = await imgUrl.ref.getDownloadURL()
      this.image = this.downloadUrl
    }
  },
  async mounted() {
    this.firebaseUser = firebase.auth().currentUser
    const appUser: AppUser = await AppUsers.getOne(this.firebaseUser.uid)
    console.log(appUser)
    if (appUser.accountType == 0) {
      this.dateLabel = 'Estimated Date of Harvest'
      this.listingType = 0
    } else {
      this.dateLabel = 'Required Delivery Date'
      this.listingType = 1
    }
  }
})
</script>

<style lang="scss">
@import '~scss/main';
.add-contract-section {
  padding: 3rem;
  position: relative;

  .row {
    width: 100%;
    margin: 0;
  }

  .col {
    padding: 0;

    .v-input {
      padding-top: 0;
    }

    &.add-contract-date-picker {
      padding-top: 2rem;
    }
  }

  .add-contract-heading {
    font-size: 2rem;
    font-weight: 700;
    padding-bottom: 2rem;
  }

  .add-contract-picture {
    @include flex-center;
    flex-direction: column;
    background-color: $c-light-gray;
    border-radius: 8px;
    padding: 2rem;
    margin-bottom: 2rem;
    position: relative;
    p {
      font-size: 1.4rem;
      padding-top: 2rem;
    }
    input {
      display: none;
    }
    .selected-img {
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background-size: cover;
    }
  }

  .add-contract-submit-btn-container {
    button {
      width: 100%;
      border-radius: 50px;
      background: $c-primary !important;
      font-size: 1.2rem;
      letter-spacing: 0.2rem;
      padding: 2rem !important;
      color: white;
      height: auto !important;
    }
  }
}
</style>