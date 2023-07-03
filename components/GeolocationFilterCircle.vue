<template>
  <MapboxSource :id="CIRCLE_SOURCE_ID" :options="source"></MapboxSource>
  <MapboxLayer :id="CIRCLE_LAYER_ID" :options="LAYER"></MapboxLayer>
  <MapboxLayer :id="CIRCLE_BORDER_LAYER_ID" :options="border"></MapboxLayer>
  <!--
    FIXME: the following mapbox marker is rendered conditionally,
           read the comment in Map.vue to see why this is bad
           It's ok for now, as we pretty much always want the marker on top
  -->
  <MapboxMarker
    v-if="geoFilterState.isFiltered && geoFilterState.model.value"
    draggable
    :lng-lat="[
      geoFilterState.model.value.lngLat.lng,
      geoFilterState.model.value.lngLat.lat,
    ]"
    @mb-dragend="onDragend"
  />
</template>

<script setup lang="ts">
import {
  MapboxLayer,
  MapboxMarker,
  MapboxSource,
} from "@studiometa/vue-mapbox-gl";
import { Marker } from "mapbox-gl";
import { createGeoJSONCircle } from "~/utils/map";

//
// Constants
//
const CIRCLE_SOURCE_ID = "circle-source";
const CIRCLE_LAYER_ID = "circle-layer";
const CIRCLE_BORDER_LAYER_ID = "circle-layer-border";

const EMPTY_SOURCE = {
  type: "geojson",
  data: {
    type: "FeatureCollection",
    features: [],
  },
};

const LAYER = {
  id: CIRCLE_LAYER_ID,
  type: "fill",
  source: CIRCLE_SOURCE_ID,
  layout: {},
  paint: {
    "fill-color": "blue",
    "fill-opacity": 0.2,
  },
};

const geoFilterState = useGeoFilterState();

const source = computed(() => {
  if (!geoFilterState.isFiltered.value || !geoFilterState.model.value) {
    return EMPTY_SOURCE;
  }
  const {
    lngLat: { lng, lat },
    radius,
  } = geoFilterState.model.value;
  return createGeoJSONCircle([lng, lat], radius);
});

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
  geoFilterState.model.value = {
    lngLat: marker.target.getLngLat(),
    radius: geoFilterState.model.value?.radius ?? 2,
  };
}
</script>
