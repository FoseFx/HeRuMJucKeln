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

const props = defineProps<{ actual: string; planned: string }>();

const timeDisplay = computed(() =>
  date.format(new Date(props.actual), "HH:mm")
);

const deviation = computed(() => {
  const diff = date.subtract(new Date(props.actual), new Date(props.planned));

  const text =
    Math.abs(diff.toMinutes()) >= 1
      ? `${diff.toMinutes() > 0 ? "+" : ""}${Math.round(diff.toMinutes())} min`
      : `${diff.toSeconds() > 0 ? "+" : ""}${Math.round(diff.toSeconds())} sec`;

  const color = getDeviationColor(diff.toSeconds());

  return { text, color, seconds: diff.toSeconds() };
});
</script>
