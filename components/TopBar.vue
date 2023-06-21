<template>
  <div class="bar">
    <StatusIndicator />
    <span style="flex: 1"></span>
    <NotificationMenu class="notification-menu" />
  </div>
</template>

<style scoped>
.bar {
  height: 3.5rem;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0.3rem;
}
</style>
