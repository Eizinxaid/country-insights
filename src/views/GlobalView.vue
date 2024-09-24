<template>
  <div>
    <h1>Visitor's country {{ country }}</h1>
    <Map v-if="generalStat" :currentCountry="country || ''" :countryData="generalStat" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import Map from '../components/Map.vue';
import { getCountry, getGeneralStatistics } from '../services/infoService';
import type { GeneralStatistics } from '../services/infoService';

export default defineComponent({
  name: 'App',
  components: {
    Map
  },
  setup() {
    const country = ref<string>('');
    const generalStat = ref<GeneralStatistics | undefined>(undefined);
    
    const fetchCountryAndInfo = async () => {
      try {
        country.value = await getCountry() || '';
        generalStat.value = await getGeneralStatistics();
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error (e.g., show error message to user)
      }
    };

    onMounted(() => {
      fetchCountryAndInfo();
    });

    return { country, generalStat }
  }
});
</script>