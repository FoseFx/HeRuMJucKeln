<template>
  <FilterPanel
    id="time"
    title="Verspätungslage"
    :filter-state="timeFilterState"
  >
    <div ref="slider" style="padding-top: 2rem">
      <VRangeSlider
        :model-value="displayedFilterModel"
        :min="min"
        :max="max"
        :step="1"
        thumb-label="always"
        @update:model-value="updateFilterModel"
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
    timeFilterState.metadata.value.setTimeFilterRange(
      newRange,
      !mouseDown.pressed
    );
  }
});

function swapSignOfInterval(interal: [number, number]) {
  return interal.map((v) => -1 * v).sort((a, b) => a - b) as [number, number];
}

const swapSign = useWeUseMinusForDelay();
const displayedFilterModel = computed(() =>
  !swapSign.value
    ? timeFilterState.model.value
    : swapSignOfInterval(timeFilterState.model.value)
);

function updateFilterModel(newInterval: [number, number]) {
  if (!swapSign.value) {
    timeFilterState.model.value = newInterval;
  } else {
    timeFilterState.model.value = swapSignOfInterval(newInterval);
  }
}

const max = computed(() =>
  !swapSign.value
    ? timeFilterState.metadata.value.timeFilterRange[1]
    : -1 * timeFilterState.metadata.value.timeFilterRange[0]
);

const min = computed(() =>
  !swapSign.value
    ? timeFilterState.metadata.value.timeFilterRange[0]
    : -1 * timeFilterState.metadata.value.timeFilterRange[1]
);
</script>
