<template>
  <MapboxSource :id="BUS_SOURCE_ID" :options="source"></MapboxSource>
  <MapboxLayer :id="BUS_LAYER_ID" :options="busLayer"></MapboxLayer>
</template>

<script setup lang="ts">
import { MapboxLayer, MapboxSource } from "@studiometa/vue-mapbox-gl";
import { GeoJSONSourceRaw, Layer, Map, MapLayerMouseEvent } from "mapbox-gl";
import { FilterSidebarState } from "~/composables/states";

const props = defineProps<{ filterSidebarState: FilterSidebarState }>();

// Constants
const BUS_LAYER_ID = "busses";
const BUS_SOURCE_ID = "busses-source";

const emit = defineEmits(["click", "vehicle-hover", "vehicle-hover-end"]);

// mapbox-map is provided by the MapboxMap component
const map = inject<Ref<Map>>("mapbox-map");
if (!map) {
  throw new Error("mapbox-map could not be injected into BussesOnMap");
}

//
// Mouse Enter
//

const onBusLayerMouseEnter = (e: MapLayerMouseEvent) => {
  // See example at https://docs.mapbox.com/mapbox-gl-js/example/popup-on-hover/

  // Change the cursor style as a UI indicator.
  map.value.getCanvas().style.cursor = "pointer";

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
map.value.on("mouseenter", "busses", onBusLayerMouseEnter);
onUnmounted(() => map.value.off("mouseenter", "busses", onBusLayerMouseEnter));

//
// Mouse Leave
//

const onBusLayerMouseLeave = () => {
  map.value.getCanvas().style.cursor = "";
  emit("vehicle-hover-end");
};
map.value.on("mouseleave", "busses", onBusLayerMouseLeave);
onUnmounted(() => map.value.off("mouseleave", "busses", onBusLayerMouseLeave));

//
// Mouse Click
//

const onBusLayerMouseClick = (e: MapLayerMouseEvent) => {
  const vehicle = vehicleForMapboxEvent(e);
  if (!vehicle) {
    return;
  }
  const id = vehicle.identification.uid;
  emit("click", id);
};
map.value.on("click", "busses", onBusLayerMouseClick);
onUnmounted(() => map.value.off("click", "busses", onBusLayerMouseClick));

//
// Data
//

const busLayer: Layer = {
  id: BUS_LAYER_ID,
  type: "circle",
  source: BUS_SOURCE_ID, // reference the data source
  layout: {},
  paint: {
    "circle-radius": 6,
    // TODO: Change color for different busses. Or one layer for each color?
    "circle-color": "#B42222",
  },
};

const allVehicles = useVehicleStates();

const filteredVehicles = computed(() => {
  if (!allVehicles.value) {
    return [];
  }
  let filtered = allVehicles.value.filter((vehicle) => vehicle.gpsPosition);

  const onlyShowLinesFilter =
    props.filterSidebarState.onlyShowLinesFilter.value;

  if (onlyShowLinesFilter !== null) {
    filtered = filtered.filter((v) =>
      onlyShowLinesFilter.find((l) => v.operational?.line?.uid === l)
    );
  }

  return filtered;
});

// Transform API-Data to source for map
const source: Ref<GeoJSONSourceRaw> = computed(
  () =>
    ({
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: filteredVehicles.value.map((vehicle, i) => ({
          type: "Feature",
          properties: {
            vehicleIndex: i,
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
</script>
