<template>
  <div>
    <h1>Word Cloud Example</h1>
    <WordCloud :words="wordList" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import WordCloud, { type Word } from '../components/WordCloud.vue';

export default defineComponent({
  name:'About',
  components: {
    WordCloud,
  },
  setup() {
    const wordList: Word[] = [
      { text: 'Vue', weight: 13 },
      { text: 'TypeScript', weight: 10 },
      { text: 'Component', weight: 9 },
      { text: 'Reactive', weight: 7 },
      { text: 'Template', weight: 5 },
      // Add more words as needed
    ];

    return {
      wordList,
    };
  },
});
</script>