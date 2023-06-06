<template>
  <template v-if="source">
    <MapboxSource :id="CIRCLE_SOURCE_ID" :options="source"></MapboxSource>
    <MapboxLayer :id="CIRCLE_LAYER_ID" :options="layer"></MapboxLayer>
    <MapboxLayer :id="CIRCLE_BORDER_LAYER_ID" :options="border"></MapboxLayer>
    <MapboxMarker
      v-if="filter.geolocationFilter.value"
      draggable
      :lng-lat="[
        filter.geolocationFilter.value.lngLat.lng,
        filter.geolocationFilter.value.lngLat.lat,
      ]"
      @mb-dragend="onDragend"
    />
  </template>
</template>

<script setup lang="ts">
import {
  MapboxLayer,
  MapboxMarker,
  MapboxSource,
} from "@studiometa/vue-mapbox-gl";
import { Marker } from "mapbox-gl";
import { createGeoJSONCircle } from "~/utils/map";

const CIRCLE_SOURCE_ID = "circle-source";
const CIRCLE_LAYER_ID = "circle-layer";
const CIRCLE_BORDER_LAYER_ID = "circle-layer-border";

const filter = useFilterSidebar();

const source = computed(() => {
  if (!filter.geolocationFilter.value) {
    return null;
  }
  const {
    lngLat: { lng, lat },
    radius,
  } = filter.geolocationFilter.value;
  return createGeoJSONCircle([lng, lat], radius);
});

const layer = {
  id: CIRCLE_LAYER_ID,
  type: "fill",
  source: CIRCLE_SOURCE_ID,
  layout: {},
  paint: {
    "fill-color": "blue",
    "fill-opacity": 0.2,
  },
};

const border = {
  id: CIRCLE_BORDER_LAYER_ID,
  type: "line",
  source: CIRCLE_SOURCE_ID,
  layout: {},
  paint: {
    "line-color": "blue",
    "line-width": 2,
  },
};

function onDragend(marker: { target: Marker }) {
  filter.geolocationFilter.value = {
    lngLat: marker.target.getLngLat(),
    radius: filter.geolocationFilter.value?.radius ?? 2,
  };
}
</script>
