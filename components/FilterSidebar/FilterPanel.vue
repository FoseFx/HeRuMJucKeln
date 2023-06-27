<template>
  <VExpansionPanel :value="id" eager>
    <VExpansionPanelTitle style="justify-content: space-between">
      <div>{{ title }}</div>
      <div style="flex: 1"></div>
      <VBtn
        style="margin-right: 1rem"
        density="comfortable"
        :disabled="!filterState.isFiltered.value"
        @click.stop="filterState.clear"
      >
        Clear
      </VBtn>
    </VExpansionPanelTitle>
    <VExpansionPanelText>
      <slot />
    </VExpansionPanelText>
  </VExpansionPanel>
</template>

<script setup lang="ts">
import { Filter } from "~/composables/filter";

defineProps<{
  id: string;
  title: string;
  filterState: Filter<unknown>;
}>();

defineEmits(["clear"]);
</script>
