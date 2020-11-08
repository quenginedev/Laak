import Vue from 'vue'
// @ts-ignore
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDm15qiJQxUMuuUPmB0XTwbwfd1ELN9ml0',
    libraries: 'places'
  }
})
