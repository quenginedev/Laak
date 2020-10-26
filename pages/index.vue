<template>
<v-row justify="center">
  <v-col cols="12" sm="10" md="11">
    <v-row>
      <v-col cols="12" sm="4" >
        <v-card>
          <v-card-text>
            <v-row class="text-center" align="center">
              <v-col cols="4">
                <v-avatar color="primary" rounded size="72">
                  <v-icon color="white" size="42">mdi-package-variant-closed</v-icon>
                </v-avatar>
              </v-col>
              <v-col cols="4">
                <v-icon color="primary">mdi-truck-delivery</v-icon>
                <p class="text-h4 mb-0">15</p>
              </v-col>
              <v-col cols="4">
                <v-icon color="warning">mdi-clock</v-icon>
                <p class="text-h4 mb-0">3</p>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn to="/requests" block color="primary">
              Requests
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
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
