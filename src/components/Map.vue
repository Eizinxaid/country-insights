<template>
  <div v-html="svgContent" @click="handleClick"></div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  name: 'Map',
  setup() {
    const svgContent = ref('');

    onMounted(async () => {
      try {
        const response = await fetch('/world.svg');
        svgContent.value = await response.text();
      } catch (error) {
        console.error('Error loading SVG:', error);
      }
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

    return {
      svgContent,
      handleClick
    };
  }
});
</script>

<style scoped></style>