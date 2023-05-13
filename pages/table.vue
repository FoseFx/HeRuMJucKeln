<template>
  <VRow no-gutters>
    <VCol style="position: relative">
      <TheTable />
      <FilterSidebarBtn
        v-if="!isFilterSidebarOpen"
        :state="filterSidebarState"
      />
    </VCol>
    <VCol v-if="isFilterSidebarOpen" :cols="3">
      <FilterSidebar :state="filterSidebarState" />
    </VCol>
  </VRow>
</template>

<script setup lang="ts">
const filterSidebarState = useFilterSidebar("table");
const { isFilterSidebarOpen } = filterSidebarState;
</script>
