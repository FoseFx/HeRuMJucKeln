<template>
  <NuxtLink :to="`/table/${vehicle?.identification.uid}`">{{
    vehicle?.identification.displayText
  }}</NuxtLink>
</template>

<script setup lang="ts">
import { VehicleState } from "~/swagger/Api";

defineProps<{ vehicle?: VehicleState }>();
</script>
