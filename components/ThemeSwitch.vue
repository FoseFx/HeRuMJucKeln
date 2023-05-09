<template>
  <button :title="dark ? 'Hell machen' : 'Dunkel machen'" @click="toggleDark()">
    <VIcon icon="mdi-theme-light-dark" />
  </button>
</template>

<script setup lang="ts">
const dark = useDark();
const toggleDark = useToggle(dark);
</script>
<style scoped>
button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.7rem;
  background: transparent;
  cursor: pointer;
}
</style>
