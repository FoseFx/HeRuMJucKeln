<template>
  <VRow no-gutters style="height: 100%">
    <VCol style="position: relative">
      <RawMap>
        <BussesOnMap
          @click="onBusClick"
          @vehicle-hover="onVehicleHover"
          @vehicle-hover-end="onVehicleHoverEnd"
        />
        <LineOnMap
          v-if="lineVehicleId"
          :key="lineVehicleId"
          :vehicle-id="lineVehicleId"
        />
        <GeolocationFilterCircle />
        <BusPopup v-if="popupInformation" :info="popupInformation" />
      </RawMap>
      <FilterSidebarBtn v-if="!isFilterSidebarOpen" :state="filterSidebar" />
    </VCol>
    <VCol v-if="isFilterSidebarOpen" :cols="3" style="height: 100%">
      <FilterSidebar context="map" />
    </VCol>
    <VCol v-if="sidebarOpen" :cols="5" style="height: 100%">
      <SidebarPageRouterWrapper />
    </VCol>
  </VRow>
</template>

<script setup lang="ts">
import { Position } from "geojson";
import { PopupInformation } from "~/components/BusPopup.vue";
import { VehicleState } from "~/swagger/Api";

useHead({
  title: "Karte",
});

const filterSidebar = useFilterSidebar();
const { isFilterSidebarOpen, closeFilterSidebar } = filterSidebar;

useItinerariesForAllVehicles(); // fetch, so data available faster when needed

onMounted(() => {
  filterSidebar.openIfFiltered();
});

// State
const popupInformation = ref<PopupInformation | null>(null);

const onVehicleHover = (e: {
  coordinates: Position;
  vehicleState: VehicleState;
}) => {
  popupInformation.value = {
    position: e.coordinates,
    vehicleState: e.vehicleState,
  };
};

const onVehicleHoverEnd = () => {
  popupInformation.value = null;
};

//
// Click
//

const route = useRoute();
const router = useRouter();

const mapRoutePath = route.matched[0].path;

const sidebarOpen = computed(() => route.params.busId);

watch(
  sidebarOpen,
  (v) => {
    v && closeFilterSidebar();
  },
  {
    immediate: true,
  }
);

const clickedVehicle = ref<VehicleState | undefined>(undefined);

function onBusClick(vehicle: VehicleState) {
  clickedVehicle.value = vehicle;
  const path = mapRoutePath + `/${vehicle.identification.uid}`;
  router.push(path);
}

const lineVehicleId = computed(() =>
  popupInformation.value
    ? popupInformation.value.vehicleState.identification.uid
    : clickedVehicle.value?.identification?.uid
);
</script>

<style scoped>
.map-container {
  height: calc(100vh - 3.5rem);
}
</style>
