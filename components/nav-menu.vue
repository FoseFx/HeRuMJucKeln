<template>
  <nav>
    <NuxtLink to="/map" title="Karte anzeigen">
      <v-icon icon="mdi-map" />
    </NuxtLink>
    <NuxtLink to="/table" title="Tabelle anzeigen">
      <v-icon icon="mdi-table" />
    </NuxtLink>
    <NuxtLink to="/log" title="Ereignistabelle anzeigen">
      <v-icon icon="mdi-format-list-bulleted" />
    </NuxtLink>
    <NuxtLink v-if="config.isDev" to="/dev" title="Entwicklerseite anzeigen">
      <v-icon icon="mdi-wrench" />
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
  background: #1e1e1e;
}
</style>
