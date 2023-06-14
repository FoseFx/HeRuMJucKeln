<template>
  <FilterPanel
    id="geolocation"
    title="Ort"
    :active="filterState.isGeoFiltered.value"
    @clear="filterState.clearGeoFilter()"
  >
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
    </div>
  </FilterPanel>
</template>

<script setup lang="ts">
defineProps<{ context: "map" | "table" }>();

const filterState = useFilterSidebar();

const map = useMap();

const radius = ref(filterState.geoFilter.value?.radius ?? 2); // local copy of radius, which can be 2-way bound to input

watch(radius, (radius) => filterState.maybeSetRadius(radius), {
  immediate: true,
}); // keep in sync with state

function onMapMarkerDropped() {
  // Right after dropping, we get a "mousemove" event from which we can obtain the coordinates
  map.value?.once("mousemove", ({ lngLat }: mapboxgl.MapMouseEvent) =>
    filterState.setGeoFilter(lngLat, radius.value)
  );
}
</script>
