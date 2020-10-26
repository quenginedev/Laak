<template>
  <v-app dark>
    <v-app-bar app color="primary" clipped-right clipped-left>
      <v-spacer/>
      <v-btn dark icon>
        <v-icon>mdi-bell-outline</v-icon>
      </v-btn>
      <v-btn @click="openNav = !openNav" dark icon>
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer app clipped v-model="openNav">
      <v-list nav>
        <v-list-item to="/" active-class="primary white--text ">
          <v-list-item-avatar tile>
            <img src="../assets/svg/029-online order.svg"></img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              Dashboard
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/requests"  active-class="primary white--text">
          <v-list-item-avatar tile>
            <img src="../assets/svg/041-on time.svg"></img>
          </v-list-item-avatar>
          <v-list-item-title>
            Requests
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
            <img src="../assets/svg/005-truck.svg">
          </v-list-item-avatar>
          <v-list-item-title>
            Drivers
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
  </v-app>
</template>

<script>
  export default {
    data() {
      return {
        openNav: false
      }
    }
  }
</script>
