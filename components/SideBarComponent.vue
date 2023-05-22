<template>
  <VCard v-if="vehicle" class="sidebar">
    <template #prepend>
      <VBtn icon @click="$emit('close')">
        <VIcon icon="mdi-close" />
      </VBtn>
    </template>
    <template #title>
      <VCardTitle>{{ vehicle.identification.displayText }}</VCardTitle>
    </template>
    <slot />
  </VCard>
  <VCard v-else> Loading... </VCard>
</template>

<script lang="ts" setup>
import { VehicleState } from "~/swagger/Api";

defineEmits(["close"]);
const props = defineProps<{ id: string; vehicleState?: VehicleState }>();

const vehicles = computed(() =>
  props.vehicleState
    ? ref([props.vehicleState])
    : useVehicleStates(undefined, [props.id])
);

const vehicle = computed(() => vehicles.value.value[0]);
</script>

<style scoped>
.v-card {
  padding: 1em;
  height: 100%;
}
</style>
