<template>
  <MapboxMap
    :access-token="config.mapbox.pk"
    :map-style="mapStyle"
    :center="center"
    :zoom="zoom"
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
    <MapboxNavigationControl position="bottom-left" />
  </MapboxMap>
</template>

<script setup lang="ts">
import { MapboxMap, MapboxNavigationControl } from "@studiometa/vue-mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const config = useRuntimeConfig();
const dark = useDark();

const mapStyle = computed(
  () => config.mapbox.style[dark.value ? "dark" : "light"]
);

const center = [6.07998, 50.77791]; // TODO: calculate using data
const zoom = 10; // TODO: calculate using data
</script>

<style>
.mapboxgl-map {
  height: 100%;
  width: 100%;
}
</style>
