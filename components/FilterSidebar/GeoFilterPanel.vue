<template>
  <FilterPanel id="geolocation" title="Ort" :filter-state="geoFilterState">
    <div style="display: flex; flex-wrap: wrap; justify-content: center">
      <VTextField
        v-model="radius"
        label="Radius"
        suffix="km"
        type="number"
        :step="0.1"
      >
        <template #prepend>
          <VBtn
            icon
            title="Auf die Karte droppen"
            :disabled="context === 'table'"
            :draggable="context !== 'table'"
            style="cursor: grab"
            @dragend="onMapMarkerDropped"
          >
            <VIcon style="cursor: grab" disabled icon="mdi-map-marker" />
          </VBtn>
        </template>
      </VTextField>
      <div
        v-if="geoFilterState.isFiltered.value || context === 'map'"
        style="width: 100%; text-align: center"
      >
        {{ streetname }}
      </div>
    </div>
  </FilterPanel>
</template>

<script setup lang="ts">
defineProps<{ context: "map" | "table" }>();

const geoFilterState = useGeoFilterState();

const map = useMap();

const radius = ref(geoFilterState.model.value?.radius ?? 2); // local copy of radius, which can be 2-way bound to input

const streetname = computed(() => geoFilterState.metadata.value.streetname);

function maybeSetRadius(radius: number) {
  if (!geoFilterState.model.value) return;
  geoFilterState.model.value = {
    ...geoFilterState.model.value,
    radius,
  };
}

watch(radius, (radius) => maybeSetRadius(radius), {
  immediate: true,
}); // keep in sync with state

function setGeoFilter(
  lngLat: mapboxgl.LngLat,
  radius = geoFilterState.model.value?.radius ?? 2
) {
  geoFilterState.model.value = {
    lngLat,
    radius,
  };
}

function onMapMarkerDropped() {
  // Right after dropping, we get a "mousemove" event from which we can obtain the coordinates
  map.value?.once("mousemove", ({ lngLat }: mapboxgl.MapMouseEvent) =>
    setGeoFilter(lngLat, radius.value)
  );
}
</script>
