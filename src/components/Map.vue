<template>
  <div class="map-container" ref="mapContainer">
    <div v-if="processedSvgContent" v-html="processedSvgContent" @mousemove="handleMouseMove" @mouseleave="hidePopup" @click="handleCountryClick">
    </div>
    <div v-else>Loading map...</div>
    <div v-if="showPopup" class="country-popup" :style="popupStyle">
      <div class="country-flag">{{ popupData.name + countryFlag }}</div>
      <div class="country-count">{{ (popupData.count * 100).toLocaleString('en-US') }} mentions this week</div>
      <div class="articles-count"> {{  (popupData.newsCount * 100).toLocaleString('en-US') }} articles</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, computed } from 'vue';
import countries from '../../public/countries.json'
import * as d3 from 'd3';
import { useRouter } from 'vue-router';

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
    },
    newsData: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const router = useRouter();
    const svgContent = ref('');
    const showPopup = ref(false);
    const popupStyle = ref({
      left: '0px',
      top: '0px',
    });
    const popupData = ref({
      name: '',
      count: 0,
      newsCount: 0
    });
    const countryFlag = ref('');
    const mapContainer = ref<HTMLElement | null>(null);

    onMounted(async () => {
      try {
        const response = await fetch('/world.svg');
        svgContent.value = await response.text();
      } catch (error) {
        console.error('Error loading SVG:', error);
      }
    });

    const processedSvgContent = computed(() => {
      if (!svgContent.value || !props.countryData || !props.countryData.aggregations || !props.newsData || !props.newsData.aggregations) return '';

      const parser = new DOMParser();
      const doc = parser.parseFromString(svgContent.value, 'image/svg+xml');

      const countryValues = props.countryData.aggregations.countries.values;
      const newsValues = props.newsData.aggregations.countries.values;

      if (!countryValues || countryValues.length === 0 || !newsValues || newsValues.length === 0) return svgContent.value;

      // Create a map of country codes to counts
      const countryCountMap: Map<string, number> = new Map(
        countryValues.map((country: { key: string; count: number }) => [country.key.toUpperCase(), country.count])
      );

      const countryNewsMap: Map<string, number> = new Map(
        newsValues.map((country: { key: string; count: number }) => [country.key.toUpperCase(), country.count])
      );

      // Create a color scale
      const colorScale = d3.scaleSequential(d3.interpolateGreens)
        .domain([0, 500000]);

      doc.querySelectorAll('path').forEach((countryPath) => {
        let countryKey = countryPath.getAttribute('id') || '';
        if (countryKey == '') {
          countryKey = getCountryKeyByName(countryPath.getAttribute('class') || '');
        }
        const count = countryCountMap.get(countryKey.toUpperCase()) || 0;
        const newsCount = countryNewsMap.get(countryKey.toUpperCase()) || 0;

        const color = colorScale(count);
        const isCurrentCountry = props.currentCountry.toUpperCase() === countryKey.toUpperCase();
        const strokeWidth = isCurrentCountry ? '2' : '0.5';
        const strokeColor = isCurrentCountry ? '#FF0000' : '#000'; // Red border for current country

        countryPath.setAttribute('style', `fill: ${color}; stroke: ${strokeColor}; stroke-width: ${strokeWidth};`);

        // Add data attributes for click handling
        countryPath.setAttribute('data-country-key', countryKey);
        countryPath.setAttribute('data-country-count', count.toString());
        countryPath.setAttribute('data-articles-count', newsCount.toString());
      });

      return new XMLSerializer().serializeToString(doc);
    });

    const handleMouseMove = (event: MouseEvent) => {
      const target = event.target as SVGElement;
      if (target.tagName.toLowerCase() === 'path') {
        let countryKey = target.getAttribute('id') || '';
        if (countryKey == '') {
          countryKey = getCountryKeyByName(target.getAttribute('class') || '');
        }
        const countryCount = target.getAttribute('data-country-count');
        const newsCount = target.getAttribute('data-articles-count');
        const countryName = target.getAttribute('name') || target.getAttribute('id') || target.getAttribute('class');

        if (countryKey && countryCount && newsCount) {
          showPopup.value = true;
          updatePopupPosition(event);
          popupData.value = {
            name: countryName || '',
            count: parseInt(countryCount, 10),
            newsCount: parseInt(newsCount, 10)
          };
          countryFlag.value = getFlagEmoji(countryKey);
        }
      } else {
        hidePopup();
      }
    };

    const updatePopupPosition = (event: MouseEvent) => {
      if (mapContainer.value) {
        const rect = mapContainer.value.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        popupStyle.value = {
          left: `${x}px`,
          top: `${y}px`,
        };
      }
    };

    const handleCountryClick = (event: MouseEvent) => {
      const target = event.target as SVGElement;
      if (target.tagName.toLowerCase() === 'path') {
        let countryKey = target.getAttribute('id') || '';
        if (countryKey == '') {
          countryKey = getCountryKeyByName(target.getAttribute('class') || '');
        }
        if (countryKey) {
          router.push({name: 'detailed', params: {countryCode: countryKey}});
        }
      }
    };

    const getCountryKeyByName = (countryName: string): string => {
      const country = (countries as { Name: string; Code: string }[]).find(
        (country) => country.Name.toLowerCase() === countryName.toLowerCase()
      );
      return country ? country.Code : '';
    };

    const hidePopup = () => {
      showPopup.value = false;
    };

    const getFlagEmoji = (countryCode: string) => {
      const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
      return String.fromCodePoint(...codePoints);
    };

    watch(() => props.countryData, () => {
      processedSvgContent.value;
    });

    return {
      processedSvgContent,
      handleMouseMove,
      hidePopup,
      showPopup,
      popupStyle,
      popupData,
      countryFlag,
      mapContainer,
      handleCountryClick
    };
  }
});
</script>

<style scoped>
.map-container {
  position: relative;
}

:deep(path) {
  transition: fill 0.3s ease, stroke 0.3s ease, stroke-width 0.3s ease;
  cursor: pointer;
}

:deep(path:hover) {
  stroke-width: 1.5 !important;
}

.country-popup {
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  padding: 5px;
  border-radius: 4px;
  pointer-events: none;
  z-index: 1000;
}
</style>