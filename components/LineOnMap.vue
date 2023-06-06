<template>
  <MapboxSource v-if="ready" :id="sourceId" :options="sourceOptions" />
  <MapboxLayer v-if="ready" :id="layerId" :options="layerOptions" />
</template>

<script setup lang="ts">
import { MapboxLayer, MapboxSource } from "@studiometa/vue-mapbox-gl";
import { Layer as LayerOptions, Source as SourceOptions } from "mapbox-gl";

const props = defineProps<{
  vehicleId: string;
}>();

const layerId = "layer-line-vehicle-" + props.vehicleId;
const sourceId = "source-line-vehicle-" + props.vehicleId;

//
// Map Options
//

const layerOptions: LayerOptions = {
  id: layerId,
  type: "line",
  // TODO: change style
  paint: {
    "line-color": "red",
    "line-width": 5,
  },
  layout: {
    "line-cap": "round",
  },
  source: sourceId,
};

//
// Data Fetching
//

const itineraries = useItineraries$(props.vehicleId);

const links = computed(() => itineraries.value?.links);

const sourceOptions = computed<SourceOptions | undefined>(() =>
  !links.value
    ? undefined
    : {
        type: "geojson",
        data: itineraryLinksToGeoJSON(links.value),
      }
);

const ready = computed(() => !!sourceOptions.value);
</script>
