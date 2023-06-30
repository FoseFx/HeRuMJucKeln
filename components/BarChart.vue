<template>
  <Bar
    v-if="chartOptions && chartData"
    :key="chartOptions.plugins.legend.labels.color"
    :options="chartOptions"
    :data="chartData"
  />
</template>
<script setup lang="ts">
import { Bar } from "vue-chartjs";
import {
  Title,
  Chart as ChartJS,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  Colors,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  Colors
);
const props = defineProps<{
  dataParent: number[];
  labelsParent: String[];
  textcolor: string;
}>();
const textcolor = toRef(props, "textcolor");
const dataChart = toRef(props, "dataParent");
const labels = toRef(props, "labelsParent");
const dark = useDark();
const chartData = ref<{
  labels: String[];
  datasets: { data: number[]; backgroundColor: string[] }[];
} | null>(null);

const chartOptions = ref<{
  responsive: boolean;
  plugins: {
    title: { display: boolean };
    colors: { enabled: boolean };
    legend: {
      display: boolean;
      labels: {
        color: string;
        font: { size: number };
      };
    };
  };
} | null>(null);

chartData.value = {
  labels: labels.value,
  datasets: [
    {
      data: dataChart.value,
      backgroundColor: [
        "#f44336",
        "#e81e63 ",
        "#9c27b0 ",
        "#673ab7 ",
        "#3f51b5",
        "#2196f3 ",
        "#03a9f4",
        "#00bcd4",
        "#009688",
        "#4caf50",
        "#8bc34a",
        "#cddc39",
        "#ffeb3b",
        "#ffc107",
        "#ffc107",
        "#ff5722",
      ],
    },
  ],
};
chartOptions.value = {
  responsive: true,
  plugins: {
    title: {
      display: false,
    },
    colors: {
      enabled: true,
    },
    legend: {
      display: false,
      labels: {
        color: textcolor.value,
        font: {
          size: 17,
        },
      },
    },
  },
};
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
