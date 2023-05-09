<template>
  <VBtn class="filter-button" icon="mdi-filter" @click="$emit('click')" />
</template>

<script setup lang="ts">
defineEmits(["click"]);
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
