<template>
  <div>
    <h1>Country: {{ countryCode }}</h1>
    <p v-if="countryStatistics">Total mentions per week: ~{{ (countryStatistics.totalCount *
      100).toLocaleString('en-US') }}</p>
    <p v-else-if="loading">Loading country information...</p>
    <p v-else>Error fetching country information.</p>
  </div>
  <WordCloud :words="wordList" />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';
import countries from '../../public/countries.json'
import { useRoute } from 'vue-router';
import { getCountryStatistics, getCountryWordCloud } from '../services/infoService';
import type { CountryStatistics, CountryWordMap, Root } from '../services/infoService';
import type { Word } from '../components/WordCloud.vue';
import WordCloud from '../components/WordCloud.vue';

export default defineComponent({
  components: {
    WordCloud
  },
  setup() {
    const route = useRoute();
    const countryCode = ref(route.params.countryCode as string);
    const countryStatistics = ref<CountryStatistics | null>(null);
    const wordCloud = ref<CountryWordMap | null>(null);
    const loading = ref<boolean>(true);
    let wordList: Word[] = [
      { text: "вересень", weight: 141 },
      { text: "рок", weight: 134 },
      { text: "україна", weight: 129 },
      { text: "область", weight: 121 },
      { text: "рік", weight: 83 },
      { text: "фото", weight: 78 },
      { text: "джерело", weight: 77 },
      { text: "слово", weight: 76 },
      { text: "результат", weight: 64 },
      { text: "місце", weight: 62 },
      { text: "удар", weight: 62 },
      { text: "робота", weight: 60 },
      { text: "район", weight: 59 },
      { text: "ситуація", weight: 58 },
      { text: "раз", weight: 57 },
      { text: "інформація", weight: 56 },
      { text: "війна", weight: 55 },
      { text: "особа", weight: 54 },
      { text: "питання", weight: 54 },
      { text: "система", weight: 53 },
      { text: "проблема", weight: 52 },
      { text: "украина", weight: 50 },
      { text: "дія", weight: 49 },
      { text: "час", weight: 47 },
      { text: "країна", weight: 46 },
      { text: "росія", weight: 46 },
      { text: "новина", weight: 45 },
      { text: "сила", weight: 45 },
      { text: "канал", weight: 43 },
      { text: "повідомлення", weight: 43 }
    ];

    const fetchCountryInfo = async () => {
      loading.value = true;
      if (countryCode.value) {
        countryStatistics.value = await getCountryStatistics(countryCode.value);
        wordCloud.value = await getCountryWordCloud(countryCode.value);
      }
      loading.value = false;
    };

    function convertRootToWordList(root: Root): Word[] {
      const sections: (keyof Root)[] = ['actions', 'characteristics', 'objects', 'phrases', 'persons', 'organizations', 'locations'];

      const allWords: Word[] = sections.flatMap(section =>
        root[section].map(item => ({
          text: item.key,
          weight: item.metricValue
        }))
      );

      // Sort by weight in descending order
      allWords.sort((a, b) => b.weight - a.weight);

      // Remove duplicates (keeping the first occurrence, which will be the one with the highest weight)
      const uniqueWords = allWords.filter((word, index, self) =>
        index === self.findIndex((t) => t.text === word.text)
      );

      return uniqueWords;
    }

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
    if(wordCloud.value)
    {
      wordList = convertRootToWordList(wordCloud.value.data);
    }

    return { countryName, countryCode, countryStatistics, loading, wordList };
  },
});
</script>

<style scoped>
/* Add your styles here */
</style>