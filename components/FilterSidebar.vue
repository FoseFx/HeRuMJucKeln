<template>
  <aside>
    <VRow>
      <VCol>
        <VSheet :elevation="0" :color="dark ? undefined : 'grey-lighten-3'">
          <VBtn
            class="close-button"
            block
            color="transparent"
            :elevation="0"
            prepend-icon="mdi-chevron-right"
            @click="filterSidebar.closeFilterSidebar()"
          />
        </VSheet>
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <VContainer style="display: flex; justify-content: end">
          <VBtn
            density="comfortable"
            :disabled="!filterSidebar.isFiltered.value"
            @click="filterSidebar.clear"
          >
            Clear All
          </VBtn>
        </VContainer>
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <VContainer>
          <VExpansionPanels v-model="panel" multiple>
            <VExpansionPanel value="line" eager>
              <VExpansionPanelTitle style="justify-content: space-between">
                <div>Linien</div>
                <div style="flex: 1"></div>
                <VBtn
                  class="inner-clear-btn"
                  density="comfortable"
                  :disabled="!filterSidebar.isLinesFiltered.value"
                  @click.stop="filterSidebar.clearLinesFilter"
                >
                  Clear
                </VBtn>
              </VExpansionPanelTitle>
              <VExpansionPanelText>
                <div
                  style="
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                  "
                >
                  <VCheckbox
                    v-for="line of lines"
                    :key="line.id"
                    v-model="filterSidebar.onlyShowLinesFilter.value"
                    :label="line.name"
                    :value="line.id"
                    class="half-cb"
                  />
                </div>
              </VExpansionPanelText>
            </VExpansionPanel>
            <VExpansionPanel value="geolocation" eager>
              <VExpansionPanelTitle style="justify-content: space-between">
                <div>Ort</div>
                <div style="flex: 1"></div>
                <VBtn
                  class="inner-clear-btn"
                  density="comfortable"
                  :disabled="!filterSidebar.isGeolocationFiltered.value"
                  @click.stop="filterSidebar.clearGeolocationFilter"
                >
                  Clear
                </VBtn>
              </VExpansionPanelTitle>
              <VExpansionPanelText>
                <div
                  style="
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                  "
                >
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
                        <VIcon
                          style="cursor: grab"
                          disabled
                          icon="mdi-map-marker"
                        />
                      </VBtn>
                    </template>
                  </VTextField>
                </div>
              </VExpansionPanelText>
            </VExpansionPanel>
            <VExpansionPanel>
              <VExpansionPanelTitle style="justify-content: space-between">
                <div>TODO</div>
                <div style="flex: 1"></div>
                <VBtn
                  class="inner-clear-btn"
                  density="comfortable"
                  @click.stop="() => {}"
                >
                  Clear
                </VBtn>
              </VExpansionPanelTitle>
              <VExpansionPanelText> TODO </VExpansionPanelText>
            </VExpansionPanel>
          </VExpansionPanels>
        </VContainer>
      </VCol>
    </VRow>
  </aside>
</template>

<script setup lang="ts">
defineProps<{ context: "map" | "table" }>();
const dark = useDark();
const { data: lines } = useLines();

const filterSidebar = useFilterSidebar();

const panel = ref(
  filterSidebar.onlyShowLinesFilter.value.length > 0 ? ["line"] : []
);

const map = useMap();

const radius = ref(2);

watch(radius, () => {
  if (filterSidebar.geolocationFilter.value) {
    filterSidebar.geolocationFilter.value = {
      lngLat: filterSidebar.geolocationFilter.value.lngLat,
      radius: radius.value,
    };
  }
});

function onMapMarkerDropped() {
  // Right after dropping, we get a "mousemove" event from which we can obtain the coordinates
  map.value?.once("mousemove", updateGeofilterCoordinates);
}

function updateGeofilterCoordinates({
  lngLat,
}: mapboxgl.MapMouseEvent & mapboxgl.EventData) {
  filterSidebar.geolocationFilter.value = { lngLat, radius: radius.value };
}
</script>

<style scoped>
aside {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
.close-button {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  justify-content: start;
  font-size: 1.2rem;
}
.inner-clear-btn {
  margin-right: 1rem;
}
.half-cb {
  width: 50%;
  display: flex;
  align-items: center;
}
</style>
