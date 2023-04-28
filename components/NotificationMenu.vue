<template>
  <v-menu
    v-model="menuOpen"
    :close-on-content-click="false"
    location="bottom left"
  >
    <template #activator="{ props }">
      <v-badge
        bottom
        :content="unreadNotificationCount"
        :model-value="unreadNotificationCount > 0"
        location="start"
        color="red"
      >
        <v-btn icon v-bind="props"><v-icon icon="mdi-bell" /></v-btn>
      </v-badge>
    </template>
    <v-card class="notification-box">
      <v-list>
        <NotificationEntry
          v-for="notification of sortedNotifications"
          :key="notification.id"
          :notification="notification"
        />
      </v-list>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

const menuOpen = ref(false);

// TODO: Get real notifications
const notifications = useNotifications();

// Sort: Newest notification first
const sortedNotifications = computed(() =>
  [...notifications.value].sort((a, b) => b.date.getTime() - a.date.getTime())
);

const unreadNotificationCount = computed(
  () => notifications.value.filter((n) => !n.read).length
);

watch(menuOpen, (newValue) => {
  if (newValue === false) {
    // Menu closed
    notifications.value = notifications.value.map((n) => ({
      ...n,
      read: true,
    }));
  }
});
</script>

<style scoped>
.notification-box {
  max-height: 300px;
  min-height: 300px;
  width: 300px;
}
</style>
