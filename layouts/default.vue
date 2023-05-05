<template>
  <div>
    <NotificationPopup />
    <TopBar />
    <NavMenu />
    <div class="content">
      <NuxtPage />
    </div>
  </div>
</template>

<style scoped>
.content {
  margin-left: 3.5rem;
  height: calc(100vh - 3.5rem);
  width: 100%;
}
</style>
