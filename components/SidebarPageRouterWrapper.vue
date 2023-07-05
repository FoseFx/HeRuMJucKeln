<template>
  <NuxtPage :page-key="busId" />
  <SideBarComponent :id="busId" @close="onSidebarClose" />
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const busId = computed(() => route.params.busId as string);

function onSidebarClose() {
  router.push(getParentPage(route));
}
</script>
