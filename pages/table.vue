<template>
  <VRow no-gutters>
    <VCol style="position: relative">
      <TheTable />
      <FilterSidebarBtn v-if="!isFilterSidebarOpen" :state="filterSidebar" />
    </VCol>
    <VCol v-if="isFilterSidebarOpen" :cols="3">
      <FilterSidebar context="table" />
    </VCol>
    <VCol v-if="sidebarOpen">
      <SidebarPageRouterWrapper />
    </VCol>
  </VRow>
</template>

<script setup lang="ts">
const filterSidebar = useFilterSidebar();
const { isFilterSidebarOpen } = filterSidebar;

const route = useRoute();

const sidebarOpen = computed(() => route.params.busId);

onMounted(() => {
  filterSidebar.openIfFiltered();
});
</script>
