<template>
  <v-row>
    <v-col cols="12">
      <v-data-table
        :headers="headers"
        :items="requests"
        :items-per-page="15"
        :loading="loading"
        :search="searchRequests"
        class="elevation-7"
        item-key="_id"
        multi-sort
        show-expand
        show-select
        v-model="selectedRequests"
      >
        <template v-slot:top>
          <v-toolbar
            rounded
          >
            <v-toolbar-title class="primary--text" v-if="$vuetify.breakpoint.mdAndUp">
              Requests
            </v-toolbar-title>
            <v-spacer/>
            <v-text-field dense filled hide-details prepend-inner-icon="mdi-magnify" rounded v-model="searchRequests"/>
            <v-spacer/>
            <v-btn color="info" icon>
              <v-icon>mdi-printer-eye</v-icon>
            </v-btn>
            <v-btn @click="dialogCreate = true" color="success" icon>
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-btn @click="getRequests" color="orange" icon>
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
            <v-btn color="red" icon v-if="selectedRequests.length > 0">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-toolbar>
        </template>
        <template v-slot:item.user="{item}">
          <v-btn color="primary" v-if="item.user && item.user.displayName">View User</v-btn>
          <span class="grey--text">Unknown User</span>
        </template>
        <template v-slot:item.pickup.location.street="{ item }">
          <!--          <v-btn color="primary" outlined rounded small>-->
          <!--            <v-icon left>mdi-map-marker</v-icon>-->
          <!--            Map-->
          <!--          </v-btn>-->
          <router-link to="#">
            <v-icon left x-small>mdi-map-marker</v-icon>
            {{item.pickup.location.street}}
          </router-link>
        </template>
        <template v-slot:item.delivery.date="{item}">
          <span v-if="item.delivery.date">
              {{$dayjs(item.delivery.date).format('DD/MM/YYYY')}}
            <!--              {{ item.delivery.date.substr(0,10)}}-->
          </span>
        </template>
        <template v-slot:item.createdAt="{item}">
          <span v-if="item.createdAt">
            {{item.createdAt.substr(0, 10)}}
          </span>
        </template>
        <template v-slot:item.pickup.date="{item}">
          <span v-if="item.pickup.date">
              {{$dayjs(item.pickup.date).format('DD/MM/YYYY')}}
          </span>
        </template>
        <template v-slot:item.delivery.location.street="{ item }">
          <!--          <v-btn color="primary" outlined rounded small>-->
          <!--            <v-icon left>mdi-map-marker</v-icon>-->
          <!--            map-->
          <!--          </v-btn>-->
          <router-link to="#">
            <v-icon left x-small>mdi-map-marker</v-icon>
            {{item.delivery.location.street}}
          </router-link>
        </template>
        <template v-slot:item.status="{ item }">
          <v-chip color="secondary" rounded small v-if="item.status === 'pending'">
            PENDING
          </v-chip>
        </template>
        <template v-slot:item.assign="{ item }">
          <v-btn :to="`/requests/${item._id}`" color="primary" rounded>
            <v-icon left>mdi-truck</v-icon>
            Assign
          </v-btn>
        </template>
        <template v-slot:expanded-item="{item, headers }">
          <td :colspan="headers.length">
            <span>
              <v-icon left>mdi-pound</v-icon>
               {{item._id}}
            </span>
            <span v-if="item.user && item.user._id">
              <v-icon left>mdi-badge-account</v-icon>
               {{item.user._id}}
            </span>

            <v-row>
              <v-col cols="12" sm="6">
                <div>
                  <v-icon left small>mdi-package-up</v-icon>
                  Pick up
                </div>
                <div>
                  <v-icon left small>mdi-phone</v-icon>
                  <a :href="`tel:${item.pickup.phoneNumber}`">
                    {{item.pickup.phoneNumber}}
                  </a>
                </div>
              </v-col>
              <v-col cols="12" sm="6">
                <div>
                  <v-icon left small>mdi-package-down</v-icon>
                  Delivery
                </div>
                <div>
                  <v-icon left small>mdi-phone</v-icon>
                  <a :href="`tel:${item.delivery.phoneNumber}`">
                    {{item.delivery.phoneNumber}}
                  </a>
                </div>
              </v-col>
            </v-row>
          </td>
        </template>
      </v-data-table>
    </v-col>
    <v-dialog max-width="520" v-model="dialogCreate">
      <v-card>
        <v-card-title class="primary white--text">
          Create a pick up and drop off request
          <v-spacer></v-spacer>
          <v-btn @click="dialogCreate = false" color="white" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-card-subtitle class="body-1 px-0 pb-0">
            Pick Up Details
          </v-card-subtitle>
          <v-row>
            <v-col cols="12">
              <v-text-field :value="newRequestForm.pickup.location.street" @focus="openMap(setPickUplocation)" dense
                            filled
                            hide-details
                            placeholder="Pick Up Location"
                            prepend-inner-icon="mdi-map-search" readonly/>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field dense filled
                            hide-details
                            hint="The phone number to call" name="pickup_tel" placeholder="Pick Up Phone Number"
                            prepend-inner-icon="mdi-phone" type="tel"
                            v-model.trim="newRequestForm.pickup.phoneNumber"/>
            </v-col>
            <v-col cols="12" sm="6">
              <v-menu
                transition="scale-transition"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field dense filled hide-details
                                hint="Date for pick up" placeholder="Pick Up Date"
                                prepend-inner-icon="mdi-calendar-clock"
                                readonly
                                v-model="newRequestForm.pickup.date"
                                v-on="on"/>
                </template>
                <v-date-picker
                  no-title
                  v-model="newRequestForm.pickup.date"
                >
                </v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-card-subtitle class="body-1 px-0 pb-0">
            Drop Off Details
          </v-card-subtitle>
          <v-row>
            <v-col cols="12">
              <v-text-field :value="newRequestForm.delivery.location.street"
                            @focus="openMap(setDeliverylocation)" dense filled
                            hide-details
                            placeholder="Drop Off Location"
                            prepend-inner-icon="mdi-map-search"
                            readonly readonly/>
            </v-col>
            <v-checkbox hide-details label="Drop off date and phone are the same as pick up"
                        v-model="dateAndPhoneAreSame"></v-checkbox>
            <v-col cols="12" sm="6" v-if="!dateAndPhoneAreSame">
              <v-text-field dense filled hide-details hint="The phone number to call" name="drop_off_tel"
                            placeholder="Pick Up Phone Number"
                            prepend-inner-icon="mdi-phone" type="tel"
                            v-model.trim="newRequestForm.delivery.phoneNumber"/>
            </v-col>
            <v-col cols="12" sm="6" v-if="!dateAndPhoneAreSame">
              <v-menu
                transition="scale-transition"
              >
                <template v-slot:activator="{ on, attrs }">

                  <v-text-field dense filled hide-details hint="Date for drop off" placeholder="Drop off Date"
                                prepend-inner-icon="mdi-calendar-clock"
                                readonly
                                v-model="newRequestForm.delivery.date"/>
                </template>
                <v-date-picker
                  no-title
                  v-model="newRequestForm.delivery.date"
                />
              </v-menu>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn :loading="creating_request" @click="createRequest" block color="primary">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog max-width="540" v-model="map.show">
      <v-card>
        <v-card-title>
          <v-menu offset-y v-model="map.places.show_suggestions">
            <template v-slot:activator="{on}">
              <v-text-field
                :loading="map.places.loading"
                @keypress.enter="searchPlaces"
                dense
                filled
                hide-details
                placeholder="Search place"
                solo
                v-model="map.places.search_phrase">
                <v-icon @click="searchPlaces" slot="append" v-show="map.places.search_phrase">mdi-magnify</v-icon>
                <v-icon @click="map.show = false" slot="append-outer">mdi-close</v-icon>
              </v-text-field>
            </template>
            <v-list dense>
              <v-list-item :key="index" @click="selectPlace(place)" v-for="(place, index) in map.places.results">
                <v-list-item-title>
                  {{place.formatted_address}}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-card-title>
        <client-only>
          <gmap-map
            :center="map.default_location"
            :options="{
              zoomControl: true,
              mapTypeControl: false,
              scaleControl: false,
              streetViewControl: false,
              rotateControl: false,
              fullscreenControl: false,
            }"
            :zoom="13"
            @click="selectPoint"
            language="en"
            ref="gmap"
            style="height: 400px"
            v-if="map.show"
          >
            <gmap-marker
              :position="map.marker_location"
              v-if="map.marker_location"
            ></gmap-marker>
          </gmap-map>
        </client-only>
        <v-btn :disabled="!map.marker_location"
               @click="mapContinue" block color="primary"
               large tile>Continue
        </v-btn>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
  interface ILatLng {
    lat: number
    lng: number
  }

  interface IMapOptions {
    show: boolean,
    callback: (arg?: any) => any | undefined
    places: {
      search_phrase: string
      results: IPlacesResult[]
      loading: boolean
      show_suggestions: boolean
    }
    location: ILocation
    default_location: ILatLng
    marker_location: ILatLng | null
  }

  interface ILocation {
    street?: string,
    coordinates: [number?, number?]
  }

  interface IPlacesResult {
    formatted_address: string
    geometry: {
      location: ILatLng
    }
  }

  interface IRequestDetails {
    date: string,
    phoneNumber: string,
    location: ILocation
  }

  interface IRequest {
    user: string
    delivery: IRequestDetails,
    pickup: IRequestDetails
  }

  const newRequestForm: IRequest = {
    user: '',
    delivery: {
      date: new Date().toISOString().substr(0, 10),
      phoneNumber: '',
      location: {
        street: '',
        coordinates: []
      }
    },
    pickup: {
      date: new Date().toISOString().substr(0, 10),
      phoneNumber: '',
      location: {
        street: '',
        coordinates: []
      }
    }
  }
  const map: IMapOptions = {
    show: false,
    marker_location: null,
    default_location: { lng: -0.1984131, lat: 5.6505673 },
    places: {
      loading: false,
      show_suggestions: false,
      results: [],
      search_phrase: ''
    },
    location: {
      street: '',
      coordinates: []
    },
    callback: (location: ILocation) => {
      console.log({ location })
    }
  }


  import Vue from 'vue'

  export default Vue.extend({
    name: 'requests',
    metaInfo: {
      title: 'Requests'
    },
    data() {
      return {
        map,
        loading: false,
        creating_request: false,
        dialogCreate: false,
        dialogDelete: false,
        requests: [],
        selectedRequests: [],
        searchRequests: '',
        headers: [
          { text: 'Customer', value: 'user', align: 'center' },
          { text: 'Pickup Address', value: 'pickup.location.street', sortable: false, align: 'center' },
          { text: 'Drop Off Address', value: 'delivery.location.street', sortable: false, align: 'center' },
          // {text: 'Item', value: 'item', sortable: false},
          { text: 'Pick Up Date ', value: 'pickup.date', align: 'center' },
          { text: 'Drop Off Date ', value: 'delivery.date', align: 'center' },
          { text: 'Status', value: 'status', align: 'center' },
          { text: 'Assign', value: 'assign', align: 'center' }
        ],
        dateAndPhoneAreSame: true,
        newRequestForm
      }
    },
    methods: {

      async createRequest(): Promise<void> {
        this.creating_request = true
        if (
          this.newRequestForm.pickup.phoneNumber &&
          this.newRequestForm.pickup.date &&
          this.newRequestForm.pickup.location.street
        ) {
          if (this.dateAndPhoneAreSame) {
            this.newRequestForm.delivery.date = this.newRequestForm.pickup.date
            this.newRequestForm.delivery.phoneNumber = this.newRequestForm.pickup.phoneNumber
          }
          if (
            this.newRequestForm.delivery.phoneNumber &&
            this.newRequestForm.delivery.date &&
            this.newRequestForm.delivery.location.street
          ) {
            try {
              let new_request = await this.$axios.post('/api/request', {
                data: this.newRequestForm
              })
              this.getRequests()
              this.dialogCreate = false
            } catch (e) {
              console.error(e.message)
            }

          } else {
            console.error({ message: 'new Request Forms delivery validation error' })
          }
        } else {
          console.error({ message: 'new Request Forms pickup validation error' })
        }
        this.creating_request = false
      },

      openMap(callback: (arg?: any) => any): void {
        this.map.callback = callback
        this.map.show = true
      },

      setPickUplocation(location: ILocation): void {
        this.newRequestForm.pickup.location = location
        this.map.show = false
      },

      setDeliverylocation(location: ILocation): void {
        this.newRequestForm.delivery.location = location
        this.map.show = false
      },

      async searchPlaces() {
        this.map.places.loading = true
        await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${this.map.places.search_phrase}&region=gh&key=AIzaSyDm15qiJQxUMuuUPmB0XTwbwfd1ELN9ml0`)
          .then(res => res.json())
          .then(({ results }: { results: IPlacesResult[] }) => {
            if (results.length > 0) {
              this.map.places.results = results
              this.map.places.show_suggestions = true
            }
          }).catch(err => {
            console.error(err)
          }).finally(() => {
            this.map.places.loading = false
          })
      },
      selectPlace(place: IPlacesResult) {
        let location = place.geometry.location
        this.map.default_location = location
        // @ts-ignore
        this.panToLocation(location)
      },
      selectPoint(event: any) {
        console.log()
        let location = { lng: event.latLng.lng(), lat: event.latLng.lat() }
        this.map.marker_location = location
        this.panToLocation(location)
      },
      panToLocation(location: ILatLng): void {
        let gmap: any = this.$refs.gmap
        gmap.$mapPromise.then((map: any) => {
          map.panTo(location)
        })
      },
      async mapContinue() {
        if (this.map.marker_location) {
          console.log('street search...')
          const location = this.map.marker_location
          await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&region=gh&key=AIzaSyDm15qiJQxUMuuUPmB0XTwbwfd1ELN9ml0`)
            .then(res => res.json())
            .then(res => {
              this.map.location.street = res.results[0].formatted_address
              this.map.location.coordinates = [location.lng, location.lat]
              console.log('callback fired...')
              this.map.callback({ ...this.map.location })
            })
        }
      },
      async getRequests() {
        this.loading = true
        const { data } = await this.$axios.get('/api/request', {
          params: {
            sort: { 'pickup.date': 1, 'delivery.date': 1, createdAt: -1 }
          }
        })
        this.requests = data
        this.loading = false
      }
    },
    created() {
      this.getRequests()
    }
  })
</script>

<style scoped>

</style>
