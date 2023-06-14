<template>
  <VExpansionPanel :value="id" eager>
    <VExpansionPanelTitle style="justify-content: space-between">
      <div>{{ title }}</div>
      <div style="flex: 1"></div>
      <VBtn
        style="margin-right: 1rem"
        density="comfortable"
        :disabled="!active"
        @click.stop="$emit('clear')"
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
defineProps<{
  id: string;
  title: string;
  active: boolean;
}>();

defineEmits(["clear"]);
</script>
