<template>
  <h1>Development Page</h1>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: () => useRuntimeConfig().isDev || abortNavigation(),
});
</script>
