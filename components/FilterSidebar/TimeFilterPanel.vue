<template>
  <FilterPanel
    id="time"
    title="Verspätungslage"
    :active="filterState.isTimeFiltered.value"
    @clear="filterState.clearTimeFilter()"
  >
    <div style="padding-top: 2rem">
      <VRangeSlider
        v-model="filterState.timeFilter.value"
        :min="filterState.DEFAULT_RANGE[0]"
        :max="filterState.DEFAULT_RANGE[1]"
        :step="1"
        thumb-label="always"
        strict
      />
    </div>
  </FilterPanel>
</template>

<script setup lang="ts">
const filterState = useFilterSidebar();
</script>
