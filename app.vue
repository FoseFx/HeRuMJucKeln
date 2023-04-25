<template>
  <div>
    <TopBar />
    <NavMenu />
    <div class="content">
      <NuxtPage />
    </div>
  </div>
</template>

<style>
html.dark {
  background: #0b0b0b;
  color: white;
}
</style>

<style scoped>
.content {
  margin-left: 3.5rem;
}
</style>
