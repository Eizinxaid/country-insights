<template>
  <div>
    <h1>Visitor's country {{ country }}</h1>
    <Map v-if="generalStat && newsStat" :currentCountry="country || ''" :countryData="generalStat" :newsData="newsStat" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import Map from '../components/Map.vue';
import { getCountry, getGeneralStatistics, getNewsStatistics } from '../services/infoService';
import type { GeneralStatistics } from '../services/infoService';

export default defineComponent({
  name: 'App',
  components: {
    Map
  },
  setup() {
    const country = ref<string>('');
    const generalStat = ref<GeneralStatistics | undefined>(undefined);
    const newsStat = ref<GeneralStatistics | undefined>(undefined);
    
    const fetchCountryAndInfo = async () => {
      try {
        country.value = await getCountry() || '';
        generalStat.value = await getGeneralStatistics();
        newsStat.value = await getNewsStatistics();
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error (e.g., show error message to user)
      }
    };

    onMounted(() => {
      fetchCountryAndInfo();
    });

    return { country, generalStat, newsStat }
  }
});
</script>