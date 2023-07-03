<template>
  <MapboxSource :id="SOURCE_ID" :options="sourceOptions" />
  <MapboxLayer :id="LAYER_ID" :options="layerOptions" />
</template>

<script setup lang="ts">
import { MapboxLayer, MapboxSource } from "@studiometa/vue-mapbox-gl";
import { Layer as LayerOptions, Source as SourceOptions } from "mapbox-gl";

const props = defineProps<{
  vehicleId: string | undefined | null;
}>();

//
// Constants
//
const LAYER_ID = "layer-line-vehicle-layer";
const SOURCE_ID = "source-line-vehicle-source";

// The Line Layer and Source will always be available to mapbox and never "die"
// If there is no line to display, display this empty line
// We do this to maintain the order of layers (esp. vehicle layers should appear above the line layer)
const EMPTY_LINE_GEOJSON = {
  type: "geojson",
  data: {
    type: "LineString",
    coordinates: [],
  },
} as unknown as SourceOptions;

//
// Map Options
//

const layerOptions: LayerOptions = {
  id: LAYER_ID,
  type: "line",
  // TODO: change style
  paint: {
    "line-color": "red",
    "line-width": 5,
  },
  layout: {
    "line-cap": "round",
  },
  source: SOURCE_ID,
};

//
// Data Fetching
//

const itinerariesRef = computed(() =>
  !props.vehicleId ? ref(undefined) : useItineraries$(props.vehicleId)
);
const itineraries = computedWithControl(
  [itinerariesRef],
  () => itinerariesRef.value.value
);

const links = computed(() => itineraries.value?.links);

const sourceOptions = computed<SourceOptions>(() =>
  !links.value
    ? EMPTY_LINE_GEOJSON
    : {
        type: "geojson",
        data: itineraryLinksToGeoJSON(links.value),
      }
);
</script>
