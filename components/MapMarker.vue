<template>
  <MapboxMarker :lng-lat="position">
    <div
      style="cursor: pointer"
      @mouseover="$emit('mouseover')"
      @click="$emit('click')"
    >
      <slot>
        <div
          :style="{
            background: color ?? (dark ? 'black' : 'white'),
            width: size,
            height: size,
            borderColor: borderColor ?? (dark ? 'white' : 'black'),
          }"
          class="marker"
          :class="type"
        ></div>
      </slot>
    </div>
  </MapboxMarker>
</template>

<script setup lang="ts">
import { MapboxMarker } from "@studiometa/vue-mapbox-gl";

defineProps<{
  color?: string;
  borderColor?: string;
  size?: string | number;
  position: [number, number];
  type?: "circle" | "rectangle";
}>();

defineEmits(["mouseover", "click"]);

const dark = useDark();
</script>

<style scoped>
.marker {
  border: 2px solid;

  /* Default values for rectangular marker */
  width: 15px;
  height: 15px;
}

.circle {
  -webkit-border-radius: 25px;
  -moz-border-radius: 25px;
  border-radius: 25px;
}
</style>
