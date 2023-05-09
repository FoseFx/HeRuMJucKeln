<template>
  <VRow no-gutters>
    <VCol style="position: relative">
      <TheTable />
      <FilterSidebarBtn
        v-if="!isFilterSidebarOpen"
        @click="openFilterSidebar()"
      />
    </VCol>
    <VCol v-if="isFilterSidebarOpen" :cols="3">
      <FilterSidebar @close="closeFilterSidebar()" />
    </VCol>
  </VRow>
</template>

<script setup lang="ts">
const { isFilterSidebarOpen, openFilterSidebar, closeFilterSidebar } =
  useFilterSidebar("table");
</script>
