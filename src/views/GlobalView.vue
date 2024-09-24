<template>
    <div>
      <h1>World Map</h1>
      <Map />
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import Map from '../components/Map.vue';
  import { getCountry, getCountryStatistics } from '../services/infoService';
  
  export default defineComponent({
    name: 'App',
    components: {
      Map
    }
  });
  </script>