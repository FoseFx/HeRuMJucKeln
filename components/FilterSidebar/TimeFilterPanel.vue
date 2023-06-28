<template>
  <FilterPanel
    id="time"
    title="Verspätungslage"
    :filter-state="timeFilterState"
  >
    <div ref="slider" style="padding-top: 2rem">
      <VRangeSlider
        v-model="timeFilterState.model.value"
        :min="timeFilterState.metadata!.value.timeFilterRange[0]"
        :max="timeFilterState.metadata!.value.timeFilterRange[1]"
        :step="1"
        thumb-label="always"
        strict
      />
    </div>
  </FilterPanel>
</template>

<script setup lang="ts">
import _ from "lodash";

const timeFilterState = useTimeFilterState();
const slider = ref(null);
const mouseDown = useMousePressed({ target: slider });

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

watch(range, (newRange) => {
  // Set range once as soon as vehicles have loaded
  if (newRange !== null && !_.isEqual(range, newRange)) {
    timeFilterState.metadata!.value.setTimeFilterRange(
      newRange,
      !mouseDown.pressed
    );
  }
});
</script>
