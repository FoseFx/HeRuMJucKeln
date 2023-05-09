<template>
  <div class="notification-popup-list">
    <VAlert
      v-for="notification in recentNotifications.reverse()"
      :key="notification.id"
      type="info"
      width="300px"
      color="red"
      class="mb-1"
      closable
      >{{ notification.message }}</VAlert
    >
  </div>
</template>

<script setup lang="ts">
import { InternalNotification } from "../composables/states";
const notifications = useNotifications();
const timeout = ref<NodeJS.Timeout | null>(null);
const recentNotifications = ref<InternalNotification[]>([]);

const updateRecentNotifications = () => {
  if (timeout.value !== null) {
    clearTimeout(timeout.value);
  }
  timeout.value = null;
  recentNotifications.value = notifications.value.filter(
    (n) => Date.now() - n.date.getTime() < 10 * 1000
  );

  if (recentNotifications.value.length > 0) {
    // Update again as soon as one notification reaches an age of 10 seconds
    timeout.value = setTimeout(
      updateRecentNotifications,
      10 * 1000 -
        Math.max(
          ...recentNotifications.value.map((n) => Date.now() - n.date.getTime())
        )
    );
  }
};

watch(notifications, updateRecentNotifications, { deep: true });

onMounted(updateRecentNotifications);
</script>

<style>
.notification-popup-list {
  position: absolute;
  bottom: 20px;
  left: 100px;
  z-index: 99;
}
</style>
