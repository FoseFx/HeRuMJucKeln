<template>
  <div class="map-container">
    <MapboxMap
      :access-token="config.mapbox.pk"
      :map-style="mapStyle"
      :center="center"
      :zoom="zoom"
      @mb-created="onMapCreated"
    >
      <!-- TODO: Place markers according to busses
        All properties but position can be left out
    -->
      <MapMarker
        :position="[6.07998, 50.77791]"
        type="rectangle"
        color="blue"
        border-color="red"
        @mouseover="() => {}"
        @click="() => {}"
      />
      <!-- Custom Marker -->
      <MapMarker :position="[6.083, 50.77791]">
        <template #default>
          <v-icon icon="mdi-map-marker"></v-icon>
        </template>
      </MapMarker>
      <!-- Bus marker with popup can be placed on the map -->
      <BusMarker :bus-id="123"></BusMarker>
      <MapboxNavigationControl position="bottom-left" />
    </MapboxMap>
  </div>
</template>

<script setup lang="ts">
import { MapboxMap, MapboxNavigationControl } from "@studiometa/vue-mapbox-gl";
import { Map, ScaleControl } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const config = useRuntimeConfig();
const dark = useDark();

const mapStyle = computed(
  () => config.mapbox.style[dark.value ? "dark" : "light"]
);

const center = [6.07998, 50.77791]; // TODO: calculate using data
const zoom = 10; // TODO: calculate using data

// Adds an indicator that gives the user a sense for the scale of the map.
// I tries to keep the number on the scale simple and changes in width acordingly
// Related Documentation:
// - https://docs.mapbox.com/mapbox-gl-js/api/markers/#scalecontrol
function addScaleIndicator(map: Map) {
  const scale = new ScaleControl();
  map.addControl(scale);
}

function onMapCreated(map: Map) {
  addScaleIndicator(map);
}
</script>

<style>
.mapboxgl-map {
  height: 100%;
  width: 100%;
}
</style>
