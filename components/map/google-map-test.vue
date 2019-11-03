<template lang="pug">
  GMap(:cluster="{options: {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'}}" 
  :center='{lat: locations[0].lat, lng: locations[0].lng}' 
  :options="{fullscreenControl: false, streetViewControl: false, mapTypeControl: false, zoomControl: true, gestureHandling: 'cooperative', styles: mapStyle}" 
  :zoom='10')
    GMapMarker(v-for='location in locations' 
    :key='location.id' 
    :position='{lat: location.lat, lng: location.lng}' 
    :options='{icon: location === currentLocation ? pins.selected : pins.notSelected}' 
    @click='currentLocation = location')
      GMapInfoWindow
        code
          | lat: {{ location.lat }},
          | lng: {{ location.lng }}
</template>
<script>
export default {
  props: ['trx'],
  data(){
  return{
    locations: [
      {
        lat: 15.701906,
        lng: 121.091026
      },
      
    ],
    pins: {
        selected: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB...',
        notSelected: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAM...'
    },
 
    mapStyle: [
    ],
 
    currentLocation: {}
  }
}
}
</script>