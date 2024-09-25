<template>
  <div>
    <h1>Country: {{ countryCode }}</h1>
    <p v-if="countryStatistics">Total mentions per week: ~{{ (countryStatistics.totalCount * 100).toLocaleString('en-US') }}</p>
    <p v-else-if="loading">Loading country information...</p>
    <p v-else>Error fetching country information.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';
import countries from '../../public/countries.json'
import { useRoute } from 'vue-router';
import { getCountryStatistics } from '../services/infoService';
import type { CountryStatistics, CountryWordMap } from '../services/infoService';

export default defineComponent({
  setup() {
    const route = useRoute();
    const countryCode = ref(route.params.countryCode as string);
    const countryStatistics = ref<CountryStatistics | null>(null);
    const wordCloud = ref<CountryWordMap | null>(null);
    const loading = ref<boolean>(true);

    const fetchCountryInfo = async () => {
      loading.value = true;
      if (countryCode.value) {
        countryStatistics.value = await getCountryStatistics(countryCode.value);
      }
      loading.value = false;
    };

    onMounted(() => {
      fetchCountryInfo();
    });

    watch(() => route.params.countryCode, (newCountryCode) => {
      countryCode.value = newCountryCode as string;
      fetchCountryInfo();
    });

    const getCountryNameByCode = (countryCode: string): string => {
      const country = (countries as { Name: string; Code: string }[]).find(
        (country) => country.Code === countryCode
      );
      return country ? country.Code : '';
    };

    const countryName = getCountryNameByCode(countryCode.value);

    return { countryName, countryCode, countryStatistics, loading };
  },
});
</script>

<style scoped>
/* Add your styles here */
</style>