<template>
  <MapMarker :position="position">
    <template #popup>
      <v-card>
        <v-card-title>Bus {{ busId }}</v-card-title> Hier stehen Infos zu dem
        Bus...
      </v-card>
    </template>
  </MapMarker>
</template>

<script setup lang="ts">
defineProps<{ busId: number }>();

// Später mit Daten von Bus berechnet
const position = computed<[number, number]>(() => [6.1, 50.8]);
</script>
