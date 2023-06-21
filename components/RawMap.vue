<template>
  <div class="map-container">
    <MapboxMap
      :key="key"
      :access-token="mapboxConfig.pk"
      :map-style="mapStyle"
      :center="center"
      :zoom="zoom"
      @mb-created="onMapCreated"
    >
      <slot />
      <MapboxNavigationControl position="bottom-left" />
    </MapboxMap>
  </div>
</template>

<script setup lang="ts">
import { MapboxMap, MapboxNavigationControl } from "@studiometa/vue-mapbox-gl";
import { Map, ScaleControl } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const emit = defineEmits(["map"]);

const config = useRuntimeConfig();
const mapboxConfig = config.public.mapbox;
const dark = useDark();

const mapStyle = computed(
  () => mapboxConfig.style[dark.value ? "dark" : "light"]
);

const center = useState("map-center", () => [6.07998, 50.77791]);
const zoom = useState("map-zoom", () => 10);

// the map will rerender, when key changes
const key = computed(
  () => mapStyle.value + center.value.toString() + zoom.value.toString()
);

// Adds an indicator that gives the user a sense for the scale of the map.
// I tries to keep the number on the scale simple and changes in width acordingly
// Related Documentation:
// - https://docs.mapbox.com/mapbox-gl-js/api/markers/#scalecontrol
function addScaleIndicator(map: Map) {
  const scale = new ScaleControl();
  map.addControl(scale);
}

const map = useMap();

function onMapCreated(m: Map) {
  addScaleIndicator(m);
  emit("map", m);

  map.value = m;
}

const vehicleStates = useVehicleStates();
watch(
  vehicleStates,
  (vs) => {
    console.log(vs.length);
    if (!vs || vs.length === 0) return;

    let maxLng = -Infinity;
    let minLng = Infinity;

    let maxLat = -Infinity;
    let minLat = Infinity;

    for (const vehicle of vs) {
      const pos = vehicle.gpsPosition;
      if (!pos || !pos.longitude || !pos.latitude) continue;

      const { longitude: lng, latitude: lat } = pos;

      if (lng > maxLng) maxLng = lng;
      if (lng < minLng) minLng = lng;

      if (lat > maxLat) maxLat = lat;
      if (lat < minLat) minLat = lat;
    }

    center.value[0] = (maxLng + minLng) / 2;
    center.value[1] = (maxLat + minLat) / 2;

    const zoomLat = Math.log2(360 / Math.abs(maxLng - minLng)) + 1;
    const zoomLng = Math.log2(180 / Math.abs(maxLat - minLat)) + 1;
    zoom.value = Math.min(zoomLat, zoomLng, 23);
  },
  { immediate: true }
);
</script>

<style>
.mapboxgl-map {
  height: 100%;
  width: 100%;
}
</style>
