<template>
  <VRow no-gutters style="height: 100%">
    <VCol style="position: relative">
      <RawMap>
        <!--
            IMPORTANT: The order of addition of layers imply their order in the visibility stack
                       (i.e. new layers are on top of older ones)
                       Layers WILL BE REMOVED AND NEWLY ADDED WHEN USED CONDITIONALY (e.g. using v-if)
                       This will add the layer BACK TO THE TOP.
                       This is nearly never what we want!
                       Thus one should uphold the following best practice:
                       ADD ALL NEEDED LAYERS AT THE START AND ONLY CHANGE THEIR DATA.
                       DO NOT CONDITIONALLY RENDER MAP ELEMENTS!
                       This is commonly implemented by defining
                       a valid, empty, geojson object to represent the "gone" state.
        -->
        <LineOnMap :vehicle-id="lineVehicleId || null" />
        <BussesOnMap
          @click="onBusClick"
          @vehicle-hover="onVehicleHover"
          @vehicle-hover-end="onVehicleHoverEnd"
        />
        <GeolocationFilterCircle />
        <BusPopup :info="popupInformation || null" />
      </RawMap>
      <FilterSidebarBtn v-if="!isFilterSidebarOpen" :state="filterSidebar" />
    </VCol>
    <VCol
      v-if="isFilterSidebarOpen"
      :cols="9"
      :sm="6"
      :md="5"
      :lg="3"
      style="height: 100%"
    >
      <FilterSidebar context="map" />
    </VCol>
    <VCol
      v-if="sidebarBusParam"
      :sm="9"
      :md="5"
      :cols="10"
      style="height: 100%"
    >
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

const sidebarBusParam = computed(() => route.params.busId);

const clickedVehicleId = ref<string | undefined>(undefined);

watch(
  sidebarBusParam,
  (v) => {
    if (v) {
      closeFilterSidebar();
      if (typeof v === "string") {
        clickedVehicleId.value = v;
      } else {
        clickedVehicleId.value = v[0];
      }
    } else {
      clickedVehicleId.value = undefined;
    }
  },
  {
    immediate: true,
  }
);

function onBusClick(vehicle: VehicleState) {
  const path = mapRoutePath + `/${vehicle.identification.uid}`;
  router.push(path);
}

const lineVehicleId = computed(() =>
  popupInformation.value
    ? popupInformation.value.vehicleState.identification.uid
    : clickedVehicleId.value
);
</script>

<style scoped>
.map-container {
  height: calc(100vh - 3.5rem);
}
</style>
