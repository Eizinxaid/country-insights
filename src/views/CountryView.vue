<template>
  <div>
    <h1>Visitor's Country: {{ country }}</h1>
    <p v-if="countryStatistics">Total mentions per week: ~{{ countryStatistics.totalCount * 100 }}</p>
    <p v-else-if="loading">Loading country information...</p>
    <p v-else>Error fetching country information.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { getCountry, getCountryStatistics } from '../services/infoService';
import type { CountryStatistics, CountryWordMap } from '../services/infoService';

export default defineComponent({
  setup() {
    const country = ref<string | undefined>(undefined);
    const countryStatistics = ref<CountryStatistics | null>(null);
    const countryWordMap = ref<CountryWordMap | null>(null);
    const loading = ref<boolean>(true);

    const fetchCountryAndInfo = async () => {
      loading.value = true;
      country.value = await getCountry();
      
      if (country.value) {
        // Fetch additional information based on the country
        countryStatistics.value = await getCountryStatistics(country.value);
      }
      
      loading.value = false;
    };

    onMounted(() => {
      fetchCountryAndInfo();
    });

    return { country, countryStatistics, loading };
  },
});
</script>

<style scoped>
/* Add your styles here */
</style>