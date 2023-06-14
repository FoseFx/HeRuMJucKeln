<template>
  <nav>
    <NuxtLink to="/map" title="Karte anzeigen">
      <VIcon icon="mdi-map" />
    </NuxtLink>
    <NuxtLink to="/table" title="Tabelle anzeigen">
      <VIcon icon="mdi-table" />
    </NuxtLink>
    <NuxtLink
      v-if="config.public.isDev"
      to="/log"
      title="Ereignistabelle anzeigen"
    >
      <VIcon icon="mdi-format-list-bulleted" />
    </NuxtLink>
    <NuxtLink
      v-if="config.public.isDev"
      to="/dev"
      title="Entwicklerseite anzeigen"
    >
      <VIcon icon="mdi-wrench" />
    </NuxtLink>
    <NuxtLink to="/dashboard" title="Dashboard anzeigen">
      <VIcon icon="mdi-chart-pie" />
    </NuxtLink>
    <div style="flex: 1"></div>
    <ThemeSwitch />
  </nav>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
</script>

<style scoped>
/*
  Structure
*/
nav {
  position: fixed;
  height: calc(100vh - 3.5rem); /* height of top-bar */
  display: flex;
  flex-direction: column;
}
i {
  --size: 2rem;
  height: var(--size);
  width: var(--size);
}
a {
  padding: 0.75rem;
  text-decoration: none;
}

/*
  Colors
*/
a {
  color: black;
}
.dark a {
  color: white;
}

.router-link-active {
  background: #e1e1e1;
}
.dark .router-link-active {
  background: #444;
}
</style>
