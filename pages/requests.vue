<template>
  <v-data-table
    :headers="headers"
    :items="requests"
    class="elevation-1"
    sort-by="calories"
  >
    <template v-slot:top>
      <v-toolbar
        color="primary"
        dark
        rounded
      >
        <v-toolbar-title>
          Requests
        </v-toolbar-title>
        <v-spacer/>
        <v-btn icon>
          <v-icon>mdi-printer-eye</v-icon>
        </v-btn>
      </v-toolbar>
    </template>
    <template v-slot:item.pickupAddress="{ item }">
      <v-chip >
        <v-icon
      </v-chip>
    </template>
  </v-data-table>
</template>

<script>
  export default {
    name: "requests",
    data() {
      return {
        dialog: false,
        dialogDelete: false,
        requests: [
          { displayName: 'Ernest Hayford' }
        ],
        headers: [
          { text: 'Customer', value: 'displayName' },
          { text: 'Pickup Address', value: 'pickupAddress', sortable: false },
          { text: 'Drop Off Address', value: 'pickupOffAddress', sortable: false },
          { text: 'Item', value: 'item', sortable: false },
          { text: 'Status', value: 'status' },
          { text: 'Drop Off Date ', value: 'dropOffDate' },
          { text: 'Date Created', value: 'createdAt' },
        ]
      }
    }
  }
</script>

<style scoped>

</style>
