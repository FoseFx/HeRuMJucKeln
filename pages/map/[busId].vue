<template>
  <div style="overflow: hidden">
    <SideBarComponent :title="`Bus ${$route.params.busId}`">
      <template #sidebar>Bus with id {{ $route.params.busId }}</template>
      <template #content><RawMap /></template>
    </SideBarComponent>
  </div>
</template>

<script setup lang="ts"></script>
