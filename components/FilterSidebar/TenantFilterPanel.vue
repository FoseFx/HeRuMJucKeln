<template>
  <FilterPanel
    id="tenant"
    title="Dienstleister"
    :filter-state="tenantFilterState"
  >
    <VCheckbox
      v-for="tenant of tenants"
      :key="tenant"
      v-model="tenantFilterState.model.value"
      :label="tenant"
      :value="tenant"
      class="half-cb"
    />
  </FilterPanel>
</template>

<script setup lang="ts">
const tenantFilterState = useTenantFilterState();
const tenants = useTenants();
</script>
