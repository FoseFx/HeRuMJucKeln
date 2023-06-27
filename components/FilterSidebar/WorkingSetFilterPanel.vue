<template>
  <FilterPanel
    id="working-set"
    title="Working Set"
    :filter-state="workingSetFilterState"
  >
    <VCheckbox
      v-for="workingSet of workingSets"
      :key="workingSet.uid"
      v-model="workingSetFilterState.model.value"
      :label="workingSet.displayText ?? workingSet.uid"
      :value="workingSet.uid"
    />
  </FilterPanel>
</template>

<script setup lang="ts">
import _ from "lodash";
const workingSetFilterState = useWorkingSetFilterState();

const vehicleStates = useVehicleStates$();

const workingSets = computed(() =>
  _.uniqBy(
    vehicleStates.value.map(
      (vs) =>
        vs.workingSet ?? { uid: undefined, displayText: "Kein Working-Set" }
    ),
    (ws) => ws.uid
  )
);
</script>
