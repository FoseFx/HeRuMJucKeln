<template>
  <div>
    <h1>Development Page</h1>
    <VBtn @click="addNotification">Add new notification</VBtn>
    <VBtn @click="fetchVehicles()">Get Vehicles (open console)</VBtn>
  </div>
</template>

<script setup lang="ts">
import { VehicleRegistrationState } from "~/swagger/Api";

definePageMeta({
  middleware: () => useRuntimeConfig().isDev || abortNavigation(),
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
  const client = useAPI();
  client.vehicles
    .retrieveSelectableVehicles({
      tenant: ["IVU", "STO"],
      registrationState: [VehicleRegistrationState.OPERATIONAL],
    })
    // eslint-disable-next-line no-console
    .then((d) => console.log(d))
    // eslint-disable-next-line no-console
    .catch((e) => console.error(e));
}
</script>
