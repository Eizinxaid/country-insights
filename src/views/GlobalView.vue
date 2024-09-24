<template>
  <div>
    <h1>Visitor's country {{ country }}</h1>
    <Map :highlighted-country="country"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import Map from '../components/Map.vue';
import { getCountry } from '../services/infoService';
import { getGeneralStatistics } from '../services/infoService';
import type { GeneralStatistics } from '../services/infoService';

export default defineComponent({
  name: 'App',
  components: {
    Map
  },
  setup() {
    const country = ref<string | undefined>(undefined);
    const generalStat = ref<GeneralStatistics | null>(null);
    const fetchCountryAndInfo = async () => {
      country.value = await getCountry();
      generalStat.value = await getGeneralStatistics();
    };

    onMounted(() => {
      fetchCountryAndInfo();
    });

    return { country }

  }
});

</script>