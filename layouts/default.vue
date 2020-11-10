<template>
  <v-app>
    <v-app-bar :color="$vuetify.theme.dark ? '': 'white'" app flat>
      <v-spacer/>
      <v-btn @click="$vuetify.theme.dark = !$vuetify.theme.dark" color="orange" icon>
        <v-icon>mdi-theme-light-dark</v-icon>
      </v-btn>
      <v-btn disabled icon>
        <v-icon>mdi-bell-outline</v-icon>
      </v-btn>
      <v-btn @click="openNav = !openNav" icon>
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer app v-model="openNav">
      <v-list nav rounded>
        <v-list-item>
          <v-list-item-avatar @click="$router.push('/')" class="pa-1" color="primary" left style="cursor: pointer">
            <v-img :src="require('../assets/logo.svg')" aspect-ratio="1" contain/>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              Admin Panel
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item active-class="primary white--text " to="/">
          <v-list-item-avatar tile>
            <img src="../assets/svg/029-online order.svg"></img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              Dashboard
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item active-class="primary white--text" to="/requests">
          <v-list-item-avatar tile>
            <img src="../assets/svg/041-on time.svg"></img>
          </v-list-item-avatar>
          <v-list-item-title>
            Requests
          </v-list-item-title>
        </v-list-item>
        <v-list-item to="/shipping" active-class="primary white--text">
          <v-list-item-avatar tile>
            <img src="../assets/svg/002-trolley.svg">
          </v-list-item-avatar>
          <v-list-item-title>
            Shipping
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-avatar tile>
            <img src="../assets/svg/049-delivery.svg"></img>
          </v-list-item-avatar>
          <v-list-item-title>
            Track
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-avatar tile>
            <img src="../assets/svg/022-courier.svg">
          </v-list-item-avatar>
          <v-list-item-title>
            Accounts
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-container>
        <v-slide-x-transition>
          <nuxt/>
        </v-slide-x-transition>
      </v-container>
    </v-main>
    <v-footer app inset>
      Socket testing 0.0.01
    </v-footer>
  </v-app>
</template>

<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
    data() {
      return {
        openNav: false
      }
    },
    created(): void {
    }
  })
</script>
