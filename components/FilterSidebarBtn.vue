<template>
  <VBtn
    class="filter-button"
    icon="mdi-filter"
    @click="props.state.openFilterSidebar()"
  />
</template>

<script setup lang="ts">
import { FilterSidebarState } from "~/composables/states";

const props = defineProps<{ state: FilterSidebarState }>();
</script>

<style scoped>
.filter-button {
  position: absolute;
  top: 0;
  right: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
</style>
