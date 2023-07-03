<template>
  <div style="white-space: nowrap">
    {{ timeDisplay }}
    (
    <span :style="{ color: deviation.color }">{{ deviation.text }}</span>
    )
  </div>
</template>

<script setup lang="ts">
import date from "date-and-time";
import { useWeUseMinusForDelay } from "~/composables/api";

const props = defineProps<{ actual: string; planned: string }>();

const weUseMinusForDelay = useWeUseMinusForDelay();

const timeDisplay = computed(() =>
  date.format(new Date(props.actual), "HH:mm")
);

const deviation = computed(() => {
  const diff = date.subtract(new Date(props.actual), new Date(props.planned));

  const mins = Math.round(diff.toMinutes());
  const secs = Math.round(diff.toSeconds());

  const sanePrefix = secs > 0 ? "+" : "-";
  const inversePrefix = secs > 0 ? "-" : "+";

  const prefix = weUseMinusForDelay.value ? inversePrefix : sanePrefix;

  const text =
    Math.abs(mins) >= 1
      ? `${prefix}${Math.abs(mins)} min`
      : `${prefix}${Math.abs(secs)} sec`;

  const color = getDeviationColor(diff.toSeconds());

  return { text, color };
});
</script>
