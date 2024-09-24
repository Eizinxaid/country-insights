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

export default defineComponent({
  name: 'App',
  components: {
    Map
  },
  setup() {
    const country = ref<string | undefined>(undefined);
    const fetchCountryAndInfo = async () => {
      country.value = await getCountry();
    };

    onMounted(() => {
      fetchCountryAndInfo();
    });

    return { country }

  }
});

</script>