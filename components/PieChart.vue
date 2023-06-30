<template>
  <Pie
    v-if="chartOptions && chartData && loaded"
    :options="chartOptions"
    :data="chartData"
  >
  </Pie>
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
    responsive: true,
    plugins: {
      colors: {
        enabled: true,
      },
      legend: {
        labels: {
          color: dark.value ? "#FFF" : "#000",
          boxWidth: 20,
          font: {
            size: 17,
          },
        },
      },
    },
  };
  return chartOptionsNew;
});

const chartData = computed(() => {
  if (props.filterParent === "Zustand") {
    const chartDataNew = {
      labels: props.labelsParent,
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
      labels: props.labelsParent,
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
