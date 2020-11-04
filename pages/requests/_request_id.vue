<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        {{ $route.params }}
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
    export default {
        name: "request_id"
    }
</script>

<style scoped>

</style>
