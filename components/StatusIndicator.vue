<template>
  <div class="status-indicator">
    <div v-if="!itineratiesLoaded" class="warning">
      <VIcon icon="mdi-alert" color="orange" />
      Stopps werden noch geladen
    </div>
    <div v-else-if="showReady" class="ready">Bereit</div>
  </div>
</template>

<script setup lang="ts">
const itineraties = useItinerariesForAllVehicles();
const itineratiesLoaded = computed(() => itineraties.value.size !== 0);

const ready = computed(() => itineratiesLoaded.value);

// short flash of "ok we done now"
const showReady = refAutoReset(false, 5000);
watch(ready, (isReady) => isReady && (showReady.value = true));
</script>

<style scoped>
.status-indicator {
  padding-left: 1rem;
  padding-right: 1rem;
  font-size: 0.85rem;
}
.warning {
  color: var(--color-warning);
}

.ready {
  color: var(--color-ok);
}
</style>
