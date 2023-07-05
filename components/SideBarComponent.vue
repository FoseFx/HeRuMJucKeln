<template>
  <VCard class="sidebar">
    <template #prepend>
      <VBtn icon @click="$emit('close')">
        <VIcon icon="mdi-close" />
      </VBtn>
    </template>
    <template v-if="vehicle" #append>
      <VBtn elevation="10" class="mr-5">
        <VIcon icon="mdi-phone" color="green" />
        <span class="hide-small">Anrufen</span>
      </VBtn>
      <VBtn elevation="10">
        <VIcon icon="mdi-cancel" color="red" />
        <span class="hide-mid">Fahrt abbrechen</span>
      </VBtn>
    </template>
    <BusSidebar v-if="vehicle" :vehicle-state="vehicle" />
    <div v-else class="text-center">
      <VProgressCircular v-if="!notFound" :size="100" indeterminate />
      <VAlert v-else icon="none" type="error" title="Fahrzeug nicht gefunden"
        >Es wurde kein Fahrzeug mit der ID {{ id }} gefunden.
      </VAlert>
    </div>
  </VCard>
</template>

<script lang="ts" setup>
defineEmits(["close"]);
const props = defineProps<{ id: string }>();

const allVehicles = refThrottled(useVehicleStates$(), 60_000);

const vehicle = computedWithControl(allVehicles, () =>
  allVehicles.value.find((v) => v.identification.uid === props.id)
);

watch(() => props.id, vehicle.trigger);

const notFound = computed(() => !vehicle.value && allVehicles.value.length > 0);
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
