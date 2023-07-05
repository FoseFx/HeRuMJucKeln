<template>
  <div>
    <span
      v-for="issue of issues"
      :key="issue.id"
      :style="{ color: `var(--color-${issue.level})` }"
    >
      <VIcon icon="mdi-information" />
      {{ issue.text }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { Occupancy, VehicleState } from "~/swagger/Api";

enum IssueLevel {
  Ok = "ok",
  Warning = "warning",
  Alert = "alert",
}

function levelValue(level: IssueLevel) {
  if (level === IssueLevel.Alert) {
    return 1;
  }
  if (level === IssueLevel.Warning) {
    return 2;
  }
  return Infinity;
}

type Issue = {
  id: number;
  text: string;
  level: IssueLevel;
};

const props = defineProps<{
  vehicleState: VehicleState;
}>();

const waiting = computed<Issue>(() => ({
  id: 1,
  text: "Fahrzeug wartet",
  level:
    props.vehicleState.deviation?.semantics === "WAITING"
      ? IssueLevel.Warning
      : IssueLevel.Ok,
}));

const tooEarly = computed<Issue>(() => ({
  id: 2,
  text: `Verfrühung: ${formatDeviation(props.vehicleState.deviation)}`,
  level:
    (props.vehicleState.deviation?.value as number) < 0 &&
    props.vehicleState.deviation?.semantics !== "ON_TIME"
      ? props.vehicleState.deviation?.semantics === "PROBLEMATIC"
        ? IssueLevel.Alert
        : IssueLevel.Warning
      : IssueLevel.Ok,
}));

const tooLate = computed<Issue>(() => ({
  id: 3,
  text: `Verspätung: ${formatDeviation(props.vehicleState.deviation)}`,
  level:
    (props.vehicleState.deviation?.value as number) > 0 &&
    props.vehicleState.deviation?.semantics !== "ON_TIME"
      ? IssueLevel.Warning
      : IssueLevel.Ok,
}));

function occupancyLevel(occ: Occupancy | undefined): IssueLevel {
  if (!occ?.range || occ.range.length === 0) return IssueLevel.Ok;
  const sorted = occ.range.sort((a, b) => a - b); // I dont trust them
  const first = sorted[0] ?? Infinity;
  const second = sorted[1] ?? Infinity;
  const min = Math.min(first, second);
  if (min >= 75) {
    return IssueLevel.Alert;
  } else if (min >= 50) {
    return IssueLevel.Warning;
  } else {
    return IssueLevel.Ok;
  }
}

const highOccupancy = computed<Issue>(() => ({
  id: 4,
  text: `Hohe Auslastung: ${prettifyOccupancy(props.vehicleState.occupancy)}`,
  level: occupancyLevel(props.vehicleState.occupancy),
}));

const issues = computed<Issue[]>(() =>
  [waiting.value, tooEarly.value, tooLate.value, highOccupancy.value]
    .filter(({ level }) => level !== IssueLevel.Ok)
    .sort(({ level: a }, { level: b }) => levelValue(a) - levelValue(b))
);
</script>

<style scoped>
div {
  padding: 0.5rem 1rem;
}
span {
  font-weight: bold;
  display: inline-flex;
  align-items: center;
  margin: 0.2rem;
}
</style>
