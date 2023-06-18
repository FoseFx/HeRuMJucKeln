<template>
  <VCard class="ma-0 pa-2 rounded-0" variant="flat" density="compact">
    <VRow>
      <VCol>
        {{ vehicleState.identification.displayText }}
        {{ formatDestination(vehicleState.destination) }}
      </VCol>
    </VRow>
    <VDivider class="border-opacity-100"></VDivider>
    <VCardItem density="compact">
      <VIcon
        v-if="
          vehicleState.deviation != null && vehicleState.deviation.value != null
        "
        icon="mdi-clock-alert-outline"
        :color="getDeviationColor(vehicleState.deviation.value)"
      >
      </VIcon>
      {{ formatDeviation(vehicleState.deviation) }}
    </VCardItem>
  </VCard>
</template>

<script setup lang="ts">
import { BusDestination, VehicleState, Deviation } from "~/swagger/Api";

// Property vehicleState can be used to retrieve information on the bus to display
defineProps<{
  vehicleState: VehicleState;
}>();
function formatDestination(destination: BusDestination | undefined) {
  if (destination != null) {
    return "(" + destination.lastStopName + ")";
  }
}

function formatDeviation(deviation: Deviation | undefined) {
  /**
   * we consider a deviation only when the vehicle is at least 3 minutes late
   * or 1 minute too early
   */
  if (deviation != null && deviation.value != null) {
    return (deviation.value as unknown) + " min";
  }
}
</script>
