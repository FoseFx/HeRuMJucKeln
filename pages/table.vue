<template>
  <VRow no-gutters>
    <VCol style="position: relative">
      <TheTable />
      <FilterSidebarBtn v-if="!isFilterSidebarOpen" :state="filterSidebar" />
    </VCol>
    <VCol v-if="isFilterSidebarOpen" :cols="3">
      <FilterSidebar />
    </VCol>
  </VRow>
</template>

<script setup lang="ts">
const filterSidebar = useFilterSidebar();
const { isFilterSidebarOpen } = filterSidebar;

onMounted(() => {
  filterSidebar.openIfFiltered();
});
</script>
