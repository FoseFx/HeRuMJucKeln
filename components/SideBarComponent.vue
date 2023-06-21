<template>
  <VCard v-if="vehicle" class="sidebar">
    <template #prepend>
      <VBtn icon @click="$emit('close')">
        <VIcon icon="mdi-close" />
      </VBtn>
    </template>
    <template #append>
      <VBtn>
        <VIcon icon="mdi-phone" color="green" />
        <span class="hide-small">Anrufen</span>
      </VBtn>
      <VBtn>
        <VIcon icon="mdi-cancel" color="red" />
        <span class="hide-mid">Fahrt abbrechen</span>
      </VBtn>
    </template>
    <BusSidebar :vehicle-state="vehicle" />
  </VCard>
  <VCard v-else>
    <div class="text-center">
      <VProgressCircular :size="100" indeterminate />
    </div>
  </VCard>
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
  overflow-y: auto;
  overflow-x: hidden;
}
@media (max-width: 1200px) {
  .hide-mid {
    display: none;
  }
}
@media (max-width: 800px) {
  .hide-small {
    display: none;
  }
}
</style>
