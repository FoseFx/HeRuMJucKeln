<template>
  <div>
    <NotificationPopup />
    <TopBar />
    <NavMenu />
    <div class="content">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from "vuetify";

const dark = useDark();
const theme = useTheme();

watch(
  dark,
  (isDark: boolean) => {
    // Synchronize useDark and vuetify dark-mode
    theme.global.name.value = isDark ? "dark" : "light";
  },
  { immediate: true }
);
</script>

<style scoped>
.content {
  margin-left: 3.5rem;
  height: calc(100vh - 3.5rem);
}
</style>
