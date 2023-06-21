<template>
  <div>
    <h1>
      Development Page
      <img
        style="display: inline-block"
        height="40"
        src="~/assets/potato.png"
      />
    </h1>
    <VBtn @click="addNotification">Add new notification</VBtn>
    <VBtn @click="fetchVehicles()">Get Vehicles (open console)</VBtn>
    <br />
    <br />
    <section>
      <h2>Map: Linie</h2>
      <RawMap @map="onLineMapAvailable()">
        <LineOnMap
          v-if="vehicleIdForLine"
          :vehicle-id="vehicleIdForLine"
          @error="onLineError"
        />
      </RawMap>
    </section>
  </div>
</template>

<script setup lang="ts">
import { VehicleRegistrationState } from "~/swagger/Api";

useHead({
  title: "Developer Page",
});

definePageMeta({
  middleware: () => useRuntimeConfig().public.isDev || abortNavigation(),
});

const notifications = useNotifications();

const addNotification = () => {
  notifications.value.push({
    date: new Date(),
    id: Math.random(),
    message: "" + Math.random(),
  });
};

function fetchVehicles() {
  api.vehicles
    .retrieveSelectableVehicles({
      tenant: ["IVU", "STO"],
      registrationState: [VehicleRegistrationState.OPERATIONAL],
    })
    .then((d) => console.log(d))
    .catch((e) => console.error(e));
}

const vehicleIdForLine: Ref<string | undefined> = ref(undefined);

async function onLineMapAvailable() {
  const vehicles = await api.vehicles.retrieveSelectableVehicles({
    tenant: ["IVU", "STO"],
    registrationState: [VehicleRegistrationState.OPERATIONAL],
  });
  if (!vehicles || !vehicles[0]) {
    throw new Error("no vehicle available");
  }
  vehicleIdForLine.value = vehicles[0].identification.uid;
}

function onLineError(e: Error) {
  console.error(e);
}
</script>

<style scoped>
.map-container {
  width: 500px;
  height: 400px;
}
</style>
