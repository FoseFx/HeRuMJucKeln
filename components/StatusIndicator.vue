<template>
  <div class="status-indicator">
    <div v-if="connectionError" class="error">
      <VIcon icon="mdi-alert" color="--color-alert" />
      Verbindung fehlgeschlagen. Zertifikat installiert?
    </div>
    <div v-else-if="!itineratiesLoaded" class="warning">
      <VIcon icon="mdi-alert" color="orange" />
      Stopps werden noch geladen
    </div>
    <div v-else-if="showReady" class="ready">Bereit</div>
  </div>
</template>

<script setup lang="ts">
const { isRejected: connectionError, isResolved: connectionOk } = useLines();

const itineraties = useItinerariesForAllVehicles();
const itineratiesLoaded = computed(() => itineraties.value.size !== 0);

const ready = computed(() => connectionOk.value && itineratiesLoaded.value);

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
.error {
  color: var(--color-alert);
  font-weight: bold;
}
.warning {
  color: var(--color-warning);
}

.ready {
  color: var(--color-ok);
}
</style>
