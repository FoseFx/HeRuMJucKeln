<template>
  <span>
    <v-list-item
      :class="{ unread: !notification.read }"
      class="m-3 notification"
    >
      <div>
        {{ notification.message }}
      </div>
      <div class="date-display">
        {{ date.format(notification.date, "DD.MM, HH:mm") }}
      </div>
    </v-list-item>
  </span>
</template>

<script setup lang="ts">
import date from "date-and-time";
import { InternalNotification } from "~/composables/states";

defineProps<{ notification: InternalNotification }>();
</script>

<style scoped>
.date-display {
  font-size: 12px;
}

.notification {
  border: black solid 1px;
  margin: 3px;
}

.unread {
  border: blue solid 1px;
}
</style>
