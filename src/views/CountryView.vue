<template>
  <div>
    <h1>Visitor's Country: {{ country }}</h1>
    <p v-if="countryInfo">Country Info: {{ countryInfo.data }}</p>
    <p v-else-if="loading">Loading country information...</p>
    <p v-else>Error fetching country information.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { getCountry, getCountryInfo, CountryInfo } from '../services/infoService';

export default defineComponent({
  setup() {
    const country = ref<string | null>(null);
    const countryInfo = ref<CountryInfo | null>(null);
    const loading = ref<boolean>(true);

    const fetchCountryAndInfo = async () => {
      loading.value = true;
      country.value = await getCountry();
      
      if (country.value) {
        // Fetch additional information based on the country
        countryInfo.value = await getCountryInfo(country.value);
      }
      
      loading.value = false;
    };

    onMounted(() => {
      fetchCountryAndInfo();
    });

    return { country, countryInfo, loading };
  },
});
</script>

<style scoped>
/* Add your styles here */
</style>