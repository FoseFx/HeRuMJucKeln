<template>
  <MapboxPopup
    :close-button="false"
    :close-on-click="false"
    :lng-lat="info.position"
  >
    <BusPopupContent :vehicle-state="info.vehicleState" />
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
  info: PopupInformation;
}>();
</script>

<style>
.mapboxgl-popup-content {
  padding: 0 !important;
  background-color: none;
}
</style>
