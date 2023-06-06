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
        v-if="vehicleState.deviation != null"
        icon="mdi-clock-alert-outline"
        :color="getIconColor(vehicleState.deviation)"
      >
      </VIcon>
      {{ formatDeviation(vehicleState.deviation) + " min." }}
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
  if (deviation != null) {
    return deviation.value;
  }
}

function getIconColor(vehicleDeviation: Deviation | undefined) {
  const deviation = formatDeviation(vehicleDeviation);
  if (deviation != null) {
    if (
      (deviation >= 0 && deviation <= 3) ||
      (deviation < 0 && deviation > -1)
    ) {
      return "#388B66"; // green
    } else if (
      (deviation > 3 && deviation <= 6) ||
      (deviation <= -1 && deviation >= -3)
    ) {
      return "#F98C11"; // orange
    } else {
      return "#FF0000"; // red
    }
  }
}
</script>
