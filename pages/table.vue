<template>
  <VRow no-gutters style="position: relative">
    <VCol>
      <TheTable />
      <FilterSidebarBtn v-if="!isFilterSidebarOpen" :state="filterSidebar" />
    </VCol>
    <VCol
      v-if="isFilterSidebarOpen"
      :cols="9"
      :sm="6"
      :md="5"
      :lg="3"
      class="sidebar"
    >
      <FilterSidebar context="table" />
    </VCol>
    <VCol v-if="sidebarOpen" :cols="5" class="sidebar">
      <SidebarPageRouterWrapper />
    </VCol>
  </VRow>
</template>

<script setup lang="ts">
const filterSidebar = useFilterSidebar();
const { isFilterSidebarOpen } = filterSidebar;

useHead({
  title: "Tabelle",
});

const route = useRoute();

const sidebarOpen = computed(() => route.params.busId);

onMounted(() => {
  filterSidebar.openIfFiltered();
});
</script>

<style scoped>
.sidebar {
  position: absolute;
  z-index: 3;
  top: 0;
  right: 0;
  height: 100%;
  background: white;
}

.dark .sidebar {
  background: black;
}
</style>
