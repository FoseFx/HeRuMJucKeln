<template>
  <VCard class="ma-0 pa-2 rounded-0" variant="flat" density="compact">
    <VRow>
      <VCol>
        {{ vehicleState.identification.displayText }}
        {{ formatDestination(vehicleState.destination) }}
      </VCol>
    </VRow>
    <template
      v-if="
        vehicleState.deviation &&
        vehicleState.deviation.value &&
        vehicleState.deviation.semantics
      "
    >
      <VDivider class="border-opacity-100"></VDivider>
      <VCardItem density="compact">
        <VIcon
          icon="mdi-clock-alert-outline"
          :color="getDeviationSemanticsColor(vehicleState.deviation.semantics)"
        >
        </VIcon>
        {{ formatDeviation(vehicleState.deviation) }}
      </VCardItem>
    </template>
  </VCard>
</template>

<script setup lang="ts">
import { BusDestination, VehicleState } from "~/swagger/Api";

// Property vehicleState can be used to retrieve information on the bus to display
defineProps<{
  vehicleState: VehicleState;
}>();
function formatDestination(destination: BusDestination | undefined) {
  if (destination != null) {
    return "(" + destination.lastStopName + ")";
  }
}
</script>
