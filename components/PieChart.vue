<template>
  <VContainer>
    <Pie
      v-if="chartOptions && chartData && loaded"
      :options="chartOptions"
      :data="chartData"
      class="pie"
    >
    </Pie>
  </VContainer>
</template>

<script setup lang="ts">
import { Pie } from "vue-chartjs";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  PieController,
  Title,
  Colors,
} from "chart.js";
const loaded = ref(false);
ChartJS.register(Title, Tooltip, Legend, PieController, ArcElement, Colors);
const props = defineProps<{
  dataParent: number[];
  labelsParent: String[];
  filterParent: string;
}>();
const dark = useDark();

const chartOptions = computed(() => {
  const chartOptionsNew = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      colors: {
        enabled: true,
      },
      legend: {
        layout: {
          autoPadding: true,
        },
        position: "right" as const,
        labels: {
          color: dark.value ? "#FFF" : "#000",
          boxWidth: 12,
          boxHeight: 12,
          font: {
            size: 14,
          },
        },
      },
    },
  };
  return chartOptionsNew;
});
function padding(str: String) {
  return str.padEnd(45, " ");
}
const chartData = computed(() => {
  if (props.filterParent === "Zustand") {
    const chartDataNew = {
      labels: props.labelsParent.map(padding),
      datasets: [
        {
          backgroundColor: ["green", "#D18700", "red", "grey"],
          data: props.dataParent,
        },
      ],
    };
    return chartDataNew;
  } else {
    const chartDataNew = {
      labels: props.labelsParent.map(padding),
      datasets: [
        {
          data: props.dataParent,
        },
      ],
    };
    return chartDataNew;
  }
});

onMounted(() => {
  while (!props.dataParent && !props.labelsParent); // <div>
  loaded.value = true;
});
</script>
<style>
.height {
  margin-top: 0%;
  margin-bottom: 0%;
}
</style>
