<template>
  <div v-if="processedSvgContent" v-html="processedSvgContent" @click="handleClick"></div>
  <div v-else>Loading map...</div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, computed } from 'vue';
import * as d3 from 'd3';

export default defineComponent({
  name: 'Map',
  props: {
    currentCountry: {
      type: String,
      default: ''
    },
    countryData: {
      type: Object,
      required: true
    }
  },
  setup(props, { emit }) {
    const svgContent = ref('');

    onMounted(async () => {
      try {
        const response = await fetch('/world.svg');
        svgContent.value = await response.text();
      } catch (error) {
        console.error('Error loading SVG:', error);
      }
    });

    const processedSvgContent = computed(() => {
      if (!svgContent.value || !props.countryData || !props.countryData.aggregations) return '';

      const parser = new DOMParser();
      const doc = parser.parseFromString(svgContent.value, 'image/svg+xml');

      const countryValues = props.countryData.aggregations.countries.values;

      if (!countryValues || countryValues.length === 0) return svgContent.value;

      // Create a map of country codes to counts
      const countryCountMap: Map<string, number> = new Map(
        countryValues.map((country: { key: string; count: number }) => [country.key.toUpperCase(), country.count])
      );

      // Create a color scale
      const counts = Array.from(countryCountMap.values());
      const colorScale = d3.scaleSequential(d3.interpolateBlues)
        .domain([Math.min(...counts), Math.max(...counts)]);

      // Color countries based on count
      countryCountMap.forEach((count, countryKey) => {
        const countryPath = doc.querySelector(`path[id="${countryKey}"], path[name="${countryKey}"], path.${countryKey}`);
        if (countryPath) {
          if (countryKey === props.currentCountry) {
            countryPath.setAttribute('style', 'fill: gold; stroke: #000; stroke-width: 1;');
          } else {
            const color = colorScale(count as number);
            countryPath.setAttribute('style', `fill: ${color}; stroke: #000; stroke-width: 0.5;`);
          }
          // Add data attributes for click handling
          countryPath.setAttribute('data-country-key', countryKey);
          countryPath.setAttribute('data-country-count', count.toString());
        }
      });

      return new XMLSerializer().serializeToString(doc);
    });

    const handleClick = (event: MouseEvent) => {
  const target = event.target as SVGElement;
  if (target.tagName.toLowerCase() === 'path') {
    const countryKey = target.getAttribute('id');
    const countryCount = target.getAttribute('data-country-count');
    const countryName = target.getAttribute('name') || target.getAttribute('id') || target.getAttribute('class');

    if (countryKey && countryCount) {
      const count = parseInt(countryCount, 10);

      alert(
        `Clicked on ${countryName}` + `\n` +
        `Country Key: ${countryKey}` + `\n` +
        `Count: ${count}`
      );

      // Emit an event with the clicked country data
      emit('country-click', {
        key: countryKey,
        name: countryName,
        count: count
      });
    }
  }
};

    watch(() => props.countryData, () => {
      // Force recomputation of processedSvgContent when countryData changes
      processedSvgContent.value;
    });

    return {
      processedSvgContent,
      handleClick
    };
  }
});
</script>

<style scoped>
:deep(path) {
  transition: fill 0.3s ease, stroke 0.3s ease;
  cursor: pointer;
}

:deep(path:hover) {
  stroke-width: 1.5;
}
</style>