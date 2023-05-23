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
            :disabled="!isFiltered"
            :variant="!isFiltered ? 'text' : undefined"
            @click="resetAll()"
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
                  :disabled="!isLinesFiltered"
                  :variant="!isLinesFiltered ? 'text' : undefined"
                  @click.stop="resetLinesFilter()"
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
const dark = useDark();
const { data: lines, isResolved: linesFetched } = useLines();

const filterSidebar = useFilterSidebar();

const panel = ref(
  filterSidebar.onlyShowLinesFilter.value.length > 0 ? ["line"] : []
);

const isLinesFiltered = computed(
  () =>
    linesFetched && (filterSidebar.onlyShowLinesFilter.value?.length ?? 0) > 0
);

function resetLinesFilter() {
  filterSidebar.onlyShowLinesFilter.value = [];
}

function resetAll() {
  resetLinesFilter();
}

const isFiltered = isLinesFiltered; // compute multiple filters together when we have more
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
