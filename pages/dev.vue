<template>
  <div>
    <h1>Development Page</h1>
    <v-btn @click="addNotification">Add new notification</v-btn>
  </div>
</template>

<script setup lang="ts">
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
</script>
