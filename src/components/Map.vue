<template>
  <div v-html="processedSvgContent" @click="handleClick"></div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, computed } from 'vue';

export default defineComponent({
  name: 'Map',
  props: {
    highlightedCountry: {
      type: String,
      default: ''
    }
  },
  setup(props) {
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
      if (!svgContent.value || !props.highlightedCountry) return svgContent.value;

      const parser = new DOMParser();
      const doc = parser.parseFromString(svgContent.value, 'image/svg+xml');
      
      // Reset all countries
      doc.querySelectorAll('path').forEach(path => {
        path.removeAttribute('style');
      });

      // Highlight the selected country
      const countryPath = doc.querySelector(`path[id="${props.highlightedCountry}"], path[name="${props.highlightedCountry}"], path.${props.highlightedCountry}`);
      if (countryPath) {
        countryPath.setAttribute('style', 'stroke: #000; stroke-width: 2;');
      }

      return new XMLSerializer().serializeToString(doc);
    });

    const handleClick = (event: MouseEvent) => {
      const target = event.target as SVGElement;
      if (target.tagName === 'path') {
        const countryClass = target.getAttribute('class');
        const countryName = target.getAttribute('id');
        const countryId = target.getAttribute('name');
        alert(
          `Clicked on ${countryName}` + `\n` +
          `Clicked on ${countryClass}` + `\n` +
          `Clicked on ${countryId}` + `\n`
        );
      }
    };

    watch(() => props.highlightedCountry, () => {
      // Force recomputation of processedSvgContent when highlightedCountry changes
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
}
</style>