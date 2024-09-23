<template>
    <div>
      <h1>Visitor's Country: {{ country }}</h1>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { getCountry } from '../services/geo-service';
  
  export default defineComponent({
    setup() {
      const country = ref<string | null>(null);
  
      onMounted(async () => {
        country.value = await getCountry();
      });
  
      return { country };
    },
  });
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>