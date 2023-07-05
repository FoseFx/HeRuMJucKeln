<template>
  <MapboxSource :id="BUS_SOURCE_ID" :options="source"></MapboxSource>
  <MapboxLayer :id="BUS_LAYER_ID" :options="busLayer"></MapboxLayer>
  <MapboxMarker
    v-if="focusedBus"
    :lng-lat="[
      focusedBus.gpsPosition?.longitude,
      focusedBus.gpsPosition?.latitude,
    ]"
  >
    <div class="ring"></div>
  </MapboxMarker>
</template>

<script setup lang="ts">
import {
  MapboxLayer,
  MapboxMarker,
  MapboxSource,
} from "@studiometa/vue-mapbox-gl";
import { GeoJSONSourceRaw, Layer, MapLayerMouseEvent } from "mapbox-gl";
import { VehicleState } from "~/swagger/Api";

const route = useRoute();

// Constants
const BUS_LAYER_ID = "busses";
const BUS_SOURCE_ID = "busses-source";

const emit = defineEmits(["click", "vehicle-hover", "vehicle-hover-end"]);

// mapbox-map is provided by the MapboxMap component
const map = useMap();
//
// Mouse Enter
//

const onBusLayerMouseEnter = (e: MapLayerMouseEvent) => {
  // See example at https://docs.mapbox.com/mapbox-gl-js/example/popup-on-hover/

  // Change the cursor style as a UI indicator.
  if (map.value) {
    map.value.getCanvas().style.cursor = "pointer";
  }

  // get selected feature
  // a feature is an element on the map we added
  const selectedFeature = e.features?.[0];

  if (!selectedFeature) {
    return; // mouse is not on a feature
  }

  const { properties, geometry } = selectedFeature;

  if (geometry.type !== "Point" || !properties) {
    return; // we are not on a bus, as busses are points and have custom properties
  }

  emit("vehicle-hover", {
    coordinates: geometry.coordinates.slice(), // copy coords
    vehicleState: vehicleForMapboxEvent(e),
  });
};
map.value?.on("mouseenter", "busses", onBusLayerMouseEnter);
onUnmounted(() => map.value?.off("mouseenter", "busses", onBusLayerMouseEnter));

//
// Mouse Leave
//

const onBusLayerMouseLeave = () => {
  if (map.value) {
    map.value.getCanvas().style.cursor = "";
  }
  emit("vehicle-hover-end");
};
map.value?.on("mouseleave", "busses", onBusLayerMouseLeave);
onUnmounted(() => map.value?.off("mouseleave", "busses", onBusLayerMouseLeave));

//
// Mouse Click
//

const onBusLayerMouseClick = (e: MapLayerMouseEvent) => {
  const vehicle = vehicleForMapboxEvent(e);
  if (!vehicle) {
    return;
  }
  emit("click", vehicle);
};
map.value?.on("click", "busses", onBusLayerMouseClick);
onUnmounted(() => map.value?.off("click", "busses", onBusLayerMouseClick));

//
// Data
//

const busLayer: Layer = {
  id: BUS_LAYER_ID,
  type: "circle",
  source: BUS_SOURCE_ID, // reference the data source
  layout: {},
  paint: {
    "circle-radius": ["get", "radius"],
    "circle-color": ["get", "color"],
    "circle-opacity": ["get", "opacity"],
    "circle-stroke-color": ["get", "circleStrokeColor"],
    "circle-stroke-width": ["get", "circleStrokeWidth"],
  },
};

const filteredVehicles = useFilteredVehicleState$();

const dark = useDark();

function getVehicleStyle(vehicle: VehicleState) {
  const complementaryColor = dark.value ? "white" : "black";
  const style: {
    color?: string;
    opacity: number;
    radius: number;
    circleStrokeColor?: string;
    circleStrokeWidth?: number;
  } = {
    color:
      vehicle.identification.uid === busId.value
        ? "purple"
        : getDeviationSemanticsColor(vehicle.deviation?.semantics) ??
          complementaryColor,
    opacity: 1,
    radius: 6,
  };
  if (busId.value) {
    if (
      vehicle.operational?.line?.uid !==
      focusedBus.value?.operational?.line?.uid
    ) {
      style.opacity = 0.6;
    } else {
      style.circleStrokeColor = complementaryColor;
      style.circleStrokeWidth = 2;
    }
  }
  return style;
}

// Transform API-Data to source for map
const source: ComputedRef<GeoJSONSourceRaw> = computed(
  () =>
    ({
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: filteredVehicles.value.map((vehicle, i) => ({
          type: "Feature",
          properties: {
            vehicleIndex: i,
            ...getVehicleStyle(vehicle),
          },
          geometry: {
            type: "Point",
            coordinates: [
              vehicle.gpsPosition!.longitude,
              vehicle.gpsPosition!.latitude,
            ],
          },
        })),
      },
    } as GeoJSONSourceRaw)
);

function vehicleForMapboxEvent(e: MapLayerMouseEvent) {
  const vehicleIndex = e.features?.[0].properties?.vehicleIndex;
  if (typeof vehicleIndex !== "number") {
    return null; // not a bus
  }
  const vehicle = filteredVehicles.value[vehicleIndex];
  if (!vehicle) {
    console.warn("a feature has an invalid vehicle index", vehicleIndex, e);
    return null;
  }
  return vehicle;
}

const busId = computed(() => route.params.busId as string | undefined);

const focusedBus = computed(
  () =>
    filteredVehicles.value.find((v) => v.identification.uid === busId.value) ??
    null
);
</script>

<style scoped>
.ring {
  position: relative;
  border: purple solid 4px;
  width: 40px;
  height: 40px;
  border-radius: 50%;

  animation: pulsate 1s ease-out;
  animation-iteration-count: infinite;
  opacity: 1;
}

@keyframes pulsate {
  0% {
    transform: scale(0.1, 0.1);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: scale(1.2, 1.2);
    opacity: 0;
  }
}
</style>
