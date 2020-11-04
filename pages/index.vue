<template>
  <v-row justify="center">
    <v-col cols="12" sm="4">
      <v-card>
        <v-card-title>
          <v-icon left>mdi-clock</v-icon>9 Pending Requests
        </v-card-title>
        <v-card-subtitle>
          You have request's you haven't assigned to drivers yet
        </v-card-subtitle>
        <v-card-actions>
          <v-btn block color="primary" to="/requests">
            View
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col cols="12" sm="4">
      <v-card>
        <v-card-title>
          <v-icon left>mdi-truck</v-icon>2 awaiting dispatch
        </v-card-title>
        <v-card-subtitle>
          There are drivers waiting to be dispatched
        </v-card-subtitle>
        <v-card-actions>
          <v-btn block color="primary" to="/requests">
            View
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
    name: 'home',
    data() {
      return {
        openSide: false
      }
    },
    created(): void {
    }
  })
</script>
