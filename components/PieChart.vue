<template>
  <Pie
    v-if="chartOptions && chartData"
    :key="chartOptions.plugins.legend.labels.color"
    :options="chartOptions"
    :data="chartData"
  />
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
  filterParent: string;
  textcolor: string;
}>();

const textcolor = toRef(props, "textcolor");
const dataChart = toRef(props, "dataParent");
const labels = toRef(props, "labelsParent");
const filter = toRef(props, "filterParent");
const dark = useDark();
const chartData = ref<{
  labels: String[];
  datasets:
    | { data: number[] }[]
    | { data: number[]; backgroundColor: string[] }[];
} | null>(null);

const chartOptions = ref<{
  responsive: boolean;
  plugins:
    | {
        colors: { enabled: boolean };
        legend: {
          labels: {
            boxWidth: number;
            color: string;
            font: { size: number };
          };
        };
      }
    | {
        colors: { enabled: boolean };
        legend: {
          labels: {
            boxWidth: number;
            color: string;
            font: { size: number };
          };
        };
      };
} | null>(null);

if (filter.value !== "Zustand") {
  chartData.value = {
    labels: labels.value,
    datasets: [
      {
        data: dataChart.value,
      },
    ],
  };
  chartOptions.value = {
    responsive: true,
    plugins: {
      colors: {
        enabled: true,
      },
      legend: {
        labels: {
          boxWidth: 20,
          color: textcolor.value,
          font: {
            size: 17,
          },
        },
      },
    },
  };
} else {
  chartData.value = {
    labels: labels.value,
    datasets: [
      {
        data: dataChart.value,
        backgroundColor: ["#F44336", "#66BB6A", "#FFA726"],
      },
    ],
  };
  chartOptions.value = {
    responsive: true,
    plugins: {
      colors: {
        enabled: false,
      },
      legend: {
        labels: {
          boxWidth: 20,
          color: textcolor.value,
          font: {
            size: 17,
          },
        },
      },
    },
  };
}
const updateLegendColor = () => {
  const legendColor = dark.value ? "#FFF" : "#000";
  if (chartOptions.value !== null) {
    const oldChartOptions = chartOptions.value;
    oldChartOptions.plugins.legend.labels.color = legendColor;
    chartOptions.value = oldChartOptions;
  }
};

watch(dark, updateLegendColor, { immediate: true });
</script>
