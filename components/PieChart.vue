<template>
  <Pie :options="chartOptions" :data="chartData" />
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

ChartJS.register(Title, Tooltip, Legend, PieController, ArcElement, Colors);

const props = defineProps<{
  dataParent: number[];
  labelsParent: String[];
}>();

const dataChart = toRef(props, "dataParent");
const labels = toRef(props, "labelsParent");
const chartData = {
  labels: labels.value,
  datasets: [
    {
      data: dataChart.value,
    },
  ],
};
const chartOptions = {
  responsive: true,
  plugins: {
    colors: {
      enabled: true,
    },
    legend: {
      labels: {
        font: {
          size: 17,
        },
      },
    },
  },
};
</script>
