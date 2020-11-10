<template>
  <v-row>
    <v-col cols="12">
      <v-data-table
        :headers="headers"
        :items="drivers"
        class="elevation-7"
      >
        <template v-slot:top="{}">
          <v-toolbar flat>
            <v-toolbar-title class="primary--text">
              Shipping
            </v-toolbar-title>
            <v-spacer/>
            <v-btn color="info" disabled icon>
              <v-icon>mdi-printer-eye</v-icon>
            </v-btn>
          </v-toolbar>
        </template>
      </v-data-table>
      <v-dialog max-width="500" v-model="dialogCreate">
        <v-card>
          <v-card-title>
            Create A Shipping
          </v-card-title>
          <v-card-text>
            <v-text-field
              filled
              placeholder="Name"
              prepend-inner-icon="mdi-account"
              rounded
              dense
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn block color="success">Create</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
    name: 'drivers',
    data() {
      return {
        drivers: [],
        headers: [
          {}
        ],
        dialogCreate: false
      }
    }
  })
</script>

<style scoped>

</style>
