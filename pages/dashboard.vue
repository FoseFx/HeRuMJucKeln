<template>
  <VRow>
    <VCol v-for="filter in chartFilter" :key="filter.id" cols="3">
      <DashboardCard :filter="filter" />
    </VCol>
    <VCol cols="3">
      <DashboardConfigurate />
    </VCol>
  </VRow>
</template>

<script setup lang="ts">
import DashboardCard from "../components/DashboardCard.vue";
import DashboardConfigurate from "../components/DashboardConfig.vue";

useHead({
  title: "Dashboard",
});

const chartFilter = useFilter();
</script>
