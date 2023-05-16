<template>
  <VCard>
    {{ vehicleState.identification.uid }}
    Hier kann man Infos über den Bus sehen, über den man gerade hovert.
  </VCard>
</template>

<script setup lang="ts">
import { VehicleState } from "~/swagger/Api";

// Property vehicleState can be used to retrieve information on the bus to display
defineProps<{
  vehicleState: VehicleState;
}>();
</script>
