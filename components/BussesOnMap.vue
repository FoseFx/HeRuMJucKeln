<template>
  <MapboxSource id="busses-source" :options="source"></MapboxSource>
  <MapboxLayer id="busses" :options="layer"></MapboxLayer>
  <MapboxPopup
    v-if="popupCoordinates && popupVehicleState"
    :close-button="false"
    :close-on-click="false"
    :lng-lat="popupCoordinates"
  >
    <BusPopup :vehicle-state="popupVehicleState" />
  </MapboxPopup>
</template>

<script setup lang="ts">
import {
  MapboxLayer,
  MapboxPopup,
  MapboxSource,
} from "@studiometa/vue-mapbox-gl";
import { VehicleState } from "~/swagger/Api";

const emit = defineEmits(["click"]);

const popupCoordinates = ref<null | [number, number]>(null);

const popupVehicleState = ref<null | VehicleState>(null);

// Use injected value as in https://github.com/studiometa/vue-mapbox-gl/blob/develop/packages/vue-mapbox-gl/composables/useMap.js
const map = inject<any>("mapbox-map");

// See example at https://docs.mapbox.com/mapbox-gl-js/example/popup-on-hover/
map.value.on("mouseenter", "busses", (e: any) => {
  // Change the cursor style as a UI indicator.
  map.value.getCanvas().style.cursor = "pointer";

  popupCoordinates.value = e.features[0].geometry.coordinates.slice();

  popupVehicleState.value = getVehicle(e.features[0].properties.vehicle);
});
map.value.on("mouseleave", "busses", () => {
  map.value.getCanvas().style.cursor = "";

  popupCoordinates.value = null;
});
map.value.on("click", "busses", (e: any) => {
  const id = getVehicle(e.features[0].properties.vehicle).identification.uid;
  emit("click", id);
});

const layer = {
  type: "circle",
  source: "busses-source", // reference the data source
  layout: {},
  paint: {
    "circle-radius": 6,
    // TODO: Change color for different busses. Or one layer for each color?
    "circle-color": "#B42222",
  },
};

// Get data from API
const tenants = ["IVU", "STO"];

const vehicles = useVehicleStates(tenants);

const vehiclesWithPosition = computed(() => {
  return (
    vehicles.value?.filter((vehicle) => vehicle.gpsPosition !== undefined) ?? []
  );
});

// Transform API-Data to source for map
const source = computed(() => ({
  type: "geojson",
  data: {
    type: "FeatureCollection",
    // These coordinates outline Maine.
    features: vehiclesWithPosition.value.map((vehicle) => ({
      type: "Feature",
      properties: {
        vehicle,
      },
      geometry: {
        type: "Point",
        coordinates: [
          vehicle.gpsPosition?.longitude,
          vehicle.gpsPosition?.latitude,
        ],
      },
    })),
  },
}));

function getVehicle(vehicle: string): VehicleState {
  return JSON.parse(vehicle);
}
</script>
