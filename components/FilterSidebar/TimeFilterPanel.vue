<template>
  <FilterPanel
    id="time"
    title="Verspätungslage"
    :active="filterState.isTimeFiltered.value"
    @clear="filterState.clearTimeFilter()"
  >
    <div ref="slider" style="padding-top: 2rem">
      <VRangeSlider
        v-model="filterState.timeFilter.value"
        :min="filterState.timeFilterRange.value[0]"
        :max="filterState.timeFilterRange.value[1]"
        :step="1"
        thumb-label="always"
        strict
      />
    </div>
  </FilterPanel>
</template>

<script setup lang="ts">
const slider = ref(null);
const mouseDown = useMousePressed({ target: slider });
const filterState = useFilterSidebar();

const vehicles = useVehicleStates$();
const deviations = computed(
  () =>
    vehicles.value
      .map((v) => v.deviation?.value)
      .filter((d) => d !== undefined) as number[]
);
const range = computed<[number, number] | null>(() => {
  if (deviations.value.length === 0) {
    return null;
  } else {
    return [Math.min(...deviations.value), Math.max(...deviations.value)];
  }
});

watch(range, (range) => {
  // Set range once as soon as vehicles have loaded
  if (range !== null && filterState.isDefaultRange.value) {
    filterState.setTimeFilterRange(range, !mouseDown.pressed);
  } else if (range !== null) {
    const newRange = filterState.timeFilter.value;
    if (range[0] < filterState.timeFilter.value[0]) {
      newRange[0] = range[0];
    }
    if (range[1] > filterState.timeFilter.value[1]) {
      newRange[1] = range[1];
    }
    filterState.setTimeFilterRange(newRange, !mouseDown.pressed);
  }
});
</script>
