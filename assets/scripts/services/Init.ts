import firebase from 'firebase'
import {Coop} from '../model/app/Coop'
import Coops from '../firebends/Coops'

export default {
  init: () => {
    const coop0: Coop = {
      title: "Farmers Cooperative in Davao",
      details: "We are composed of 100 industrious farmers",
      farmers: [
        "ID OF FARMER0",
        "ID OF FARMER1",
        "ID OF FARMER2"
      ],
      creator: "ID OF CREATOR",
      imgUrl: ''
    }

    Coops.add(coop0)
  }
}