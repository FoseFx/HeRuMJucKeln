<template>
  <MapboxPopup
    :close-button="false"
    :close-on-click="false"
    :lng-lat="info?.position || [0, 0]"
    class="ma-0 pa-0"
    :class="{ hidden: !info }"
  >
    <BusPopupContent v-if="info" :vehicle-state="info.vehicleState" />
  </MapboxPopup>
</template>

<script setup lang="ts">
import { MapboxPopup } from "@studiometa/vue-mapbox-gl";
import { Position } from "geojson";

import { VehicleState } from "~/swagger/Api";

export type PopupInformation = {
  position: Position;
  vehicleState: VehicleState;
};

// Property vehicleState can be used to retrieve information on the bus to display
defineProps<{
  info: PopupInformation | null | undefined;
}>();
</script>

<style>
.mapboxgl-popup-content {
  padding: 0 !important;
  background-color: none;
}

/* Hide whole marker, if content is hidden (i.e. contains .hidden element) */
.mapboxgl-popup:has(.mapboxgl-popup-content > .hidden) {
  display: none;
}
</style>
