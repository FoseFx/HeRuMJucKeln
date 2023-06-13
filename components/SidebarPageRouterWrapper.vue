<template>
  <NuxtPage :page-key="busId" />
  <SideBarComponent
    :id="busId"
    :vehicle-state="vehicle"
    @close="onSidebarClose"
  />
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const busId = computed(() => route.params.busId as string);

const vehicles = useVehicleStates$();

const vehicle = computed(() =>
  vehicles.value.find((v) => v.identification.uid === busId.value)
);

function onSidebarClose() {
  router.push(getParentPage(route));
}
</script>
