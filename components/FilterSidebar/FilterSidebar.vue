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
            @click="filterState.closeFilterSidebar()"
          />
        </VSheet>
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <VContainer style="display: flex; justify-content: end">
          <VBtn
            density="comfortable"
            :disabled="!filterState.isFiltered.value"
            @click="filterState.clear"
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
            <LineFilterPanel />
            <GeoFilterPanel :context="context" />
            <TimeFilterPanel />
          </VExpansionPanels>
        </VContainer>
      </VCol>
    </VRow>
  </aside>
</template>

<script setup lang="ts">
import LineFilterPanel from "./LineFilterPanel.vue";
import GeoFilterPanel from "./GeoFilterPanel.vue";
import TimeFilterPanel from "./TimeFilterPanel.vue";

defineProps<{ context: "map" | "table" }>();
const dark = useDark();

const filterState = useFilterSidebar();

const panel = ref(filterState.isLinesFiltered.value ? ["line"] : []);
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
</style>
