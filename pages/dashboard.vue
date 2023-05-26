<template>
  <VRow>
    <VCol v-for="filter in chartFilter" :key="filter.id" cols="4">
      <DashboardCard :filter="filter" />
    </VCol>
  </VRow>
</template>

<script setup lang="ts">
import DashboardCard from "../components/DashboardCard.vue";
import chartFilter from "../components/MockDataDashboard/chartFilter.json";
</script>
