<template>
  <MapboxSource v-if="ready" :id="sourceId" :options="sourceOptions" />
  <MapboxLayer v-if="ready" :id="layerId" :options="layerOptions" />
</template>

<script setup lang="ts">
import { MapboxLayer, MapboxSource } from "@studiometa/vue-mapbox-gl";
import { Layer as LayerOptions, Source as SourceOptions } from "mapbox-gl";
import { TripItineraryLink } from "~/swagger/Api";

const props = defineProps<{
  vehicleId: string;
}>();

const emit = defineEmits(["error"]);

const layerId = computed(() => "layer-line-vehicle-" + props.vehicleId);
const sourceId = computed(() => "source-line-vehicle-" + props.vehicleId);

//
// Data Fetching
//

// outer ref changes when vehicelId changes,
// inner ref changes when the promise is settled
const itinerariesResponseRef = computed(() =>
  useItineraries({ vehicleUid: [props.vehicleId] })
);
const data = computed(() => itinerariesResponseRef.value.data.value);
const error = computed(() => itinerariesResponseRef.value.error.value);

// notify parent about request error
watch(error, (err) => err && emit("error", err));

const links = computed<TripItineraryLink[] | undefined>(() => {
  if (!data.value) {
    return undefined;
  }
  const vehicleItineraries = data.value[0];

  if (!vehicleItineraries) {
    // we expect exactly one vehicle
    emit(
      "error",
      new Error("No route information for vehicle found", {
        cause: props.vehicleId,
      })
    );
    return undefined;
  }

  return vehicleItineraries.links;
});

//
// Map Options
//

const layerOptions = computed<LayerOptions>(() => ({
  id: layerId.value,
  type: "line",
  // TODO: change style
  paint: {
    "line-color": "red",
    "line-width": 5,
  },
  layout: {
    "line-cap": "round",
  },
  source: sourceId.value,
}));

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
