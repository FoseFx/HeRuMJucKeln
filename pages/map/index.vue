<template>
  <VRow no-gutters style="height: 100%">
    <VCol style="position: relative">
      <RawMap>
        <BussesOnMap
          :filter-sidebar-state="filterSidebarState"
          @click="onBusClick"
          @vehicle-hover="onVehicleHover"
          @vehicle-hover-end="onVehicleHoverEnd"
        />
        <LineOnMap
          v-if="popupInformation?.vehicleState.identification.uid"
          :vehicle-id="popupInformation?.vehicleState.identification.uid"
          @error="onLineError"
        />
        <BusPopup v-if="popupInformation" :info="popupInformation" />
      </RawMap>
      <FilterSidebarBtn
        v-if="!isFilterSidebarOpen"
        :state="filterSidebarState"
      />
    </VCol>
    <VCol v-if="isFilterSidebarOpen" :cols="3" style="height: 100%">
      <FilterSidebar :state="filterSidebarState" />
    </VCol>
  </VRow>
</template>

<script setup lang="ts">
import { Position } from "geojson";
import { PopupInformation } from "~/components/BusPopup.vue";
import { VehicleState } from "~/swagger/Api";

const filterSidebarState = useFilterSidebar("map");
const { isFilterSidebarOpen } = filterSidebarState;

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function onBusClick(id: string) {
  // Open sidebar
}

// TODO: aggregate and show errors
function onLineError(e: Error) {
  console.error(e);
}
</script>

<style scoped>
.map-container {
  height: calc(100vh - 3.5rem);
}
</style>
