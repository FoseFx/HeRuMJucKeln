<template>
  <FilterPanel id="status" title="Status" :filter-state="statusFilterState">
    <VCheckbox
      v-model="statusFilterState.model.value"
      label="Externe ausblenden"
    />
  </FilterPanel>
</template>

<script setup lang="ts">
const statusFilterState = useStatusFilterState();
</script>
