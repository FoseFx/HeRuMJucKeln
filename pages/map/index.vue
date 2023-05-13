<template>
  <VRow no-gutters style="height: 100%">
    <VCol style="position: relative">
      <RawMap>
        <BussesOnMap
          :filterSidebarState="filterSidebarState"
          @click="onBusClick"
        />
      </RawMap>
      <FilterSidebarBtn
        v-if="!isFilterSidebarOpen"
        :state="filterSidebarState"
      />
    </VCol>
    <VCol v-if="isFilterSidebarOpen" :cols="3" style="height: 100%">
      <FilterSidebar :state="filterSidebarState" />
    </VCol>
  </VRow>
</template>

<script setup lang="ts">
const filterSidebarState = useFilterSidebar("map");
const { isFilterSidebarOpen } = filterSidebarState;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function onBusClick(id: string) {
  // Open sidebar
}
</script>
