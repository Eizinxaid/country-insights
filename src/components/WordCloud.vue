// WordCloud.vue
<template>
  <div class="word-cloud">
    <div v-for="word in processedWords" :key="word.text" :style="getWordStyle(word)">
      {{ word.text }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import type { PropType } from 'vue';

export interface Word {
  text: string;
  weight: number;
}

export interface ProcessedWord extends Word {
  fontSize: number;
}

export default defineComponent({
  name: 'WordCloud',
  props: {
    words: {
      type: Array as PropType<Word[]>,
      required: true,
    },
    maxFontSize: {
      type: Number,
      default: 50,
    },
    minFontSize: {
      type: Number,
      default: 12,
    },
  },
  setup(props) {
    const processedWords = computed<ProcessedWord[]>(() => {
      const maxWeight = Math.max(...props.words.map(w => w.weight));
      const minWeight = Math.min(...props.words.map(w => w.weight));

      return props.words.map(word => ({
        ...word,
        fontSize: calculateFontSize(word.weight, minWeight, maxWeight),
      }));
    });

    const calculateFontSize = (weight: number, minWeight: number, maxWeight: number): number => {
      const normalized = (weight - minWeight) / (maxWeight - minWeight);
      return props.minFontSize + normalized * (props.maxFontSize - props.minFontSize);
    };

    const getWordStyle = (word: ProcessedWord) => {
      return {
        fontSize: `${word.fontSize}px`,
        padding: '5px',
        display: 'inline-block',
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
      };
    };

    return {
      processedWords,
      getWordStyle,
    };
  },
});
</script>

<style scoped>
.word-cloud {
  width: 50%;
  height: 400px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
</style>