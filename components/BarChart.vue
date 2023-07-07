<template>
  <VContainer>
    <Bar
      v-if="chartOptions && chartData && loaded"
      :options="chartOptions"
      :data="chartData"
    />
  </VContainer>
  <VCardText v-if="isZustand" class="Legend">
    <p v-for="index in props.labelsParent.length" :key="index">
      <VIcon
        v-if="index === 1"
        icon="mdi-square"
        class="legendBox"
        color="green"
      ></VIcon>
      <VIcon
        v-else-if="index === 2"
        icon="mdi-square"
        class="legendBox"
        color="#D18700"
      ></VIcon>
      <VIcon
        v-else-if="index === 3"
        icon="mdi-square"
        class="legendBox"
        color="red"
      ></VIcon>
      <VIcon
        v-else-if="index === 4"
        icon="mdi-square"
        class="legendBox"
        color="grey"
      ></VIcon
      >{{ " " + props.labelsParent[index - 1] }}
    </p>
  </VCardText>
  <VCardText
    v-else-if="props.labelsParent.length < 6 && !isMinuten"
    class="Legend"
  >
    <p v-for="index in props.labelsParent.length" :key="index">
      <VIcon
        v-if="index === 1"
        icon="mdi-square"
        class="legendBox"
        color="#36a2eb"
      ></VIcon>
      <VIcon
        v-else-if="index === 2"
        icon="mdi-square"
        class="legendBox"
        color="#ff6384"
      ></VIcon>
      <VIcon
        v-else-if="index === 3"
        icon="mdi-square"
        class="legendBox"
        color="#4bc0c0"
      ></VIcon>
      <VIcon
        v-else-if="index === 4"
        icon="mdi-square"
        class="legendBox"
        color="#ff9f40"
      ></VIcon>
      <VIcon
        v-else-if="index === 5"
        icon="mdi-square"
        class="legendBox"
        color="rgb(153,102,255)"
      ></VIcon
      >{{ " " + props.labelsParent[index - 1] }}
    </p>
  </VCardText>
  <VCardText v-else-if="!isMinuten" class="flexBox">
    <VContainer class="flexLegend">
      <p v-for="index in 5" :key="index">
        <VIcon
          v-if="index === 1"
          icon="mdi-square"
          class="legendBox"
          color="#36a2eb"
        ></VIcon>
        <VIcon
          v-else-if="index === 2"
          icon="mdi-square"
          class="legendBox"
          color="#ff6384"
        ></VIcon>
        <VIcon
          v-else-if="index === 3"
          icon="mdi-square"
          class="legendBox"
          color="#4bc0c0"
        ></VIcon>
        <VIcon
          v-else-if="index === 4"
          icon="mdi-square"
          class="legendBox"
          color="#ff9f40"
        ></VIcon>
        <VIcon
          v-else-if="index === 5"
          icon="mdi-square"
          class="legendBox"
          color="rgb(153,102,255)"
        ></VIcon
        >{{ " " + props.labelsParent[index - 1] }}
      </p>
    </VContainer>
    <VContainer class="flexLegend">
      <p v-for="index in props.labelsParent.length - 5" :key="index">
        <VIcon
          v-if="index === 1"
          icon="mdi-square"
          class="legendBox"
          color="#ffcd56"
        ></VIcon>
        <VIcon
          v-else-if="index === 2"
          icon="mdi-square"
          class="legendBox"
          color="#c9cbcf"
        ></VIcon>
        <VIcon
          v-else-if="index === 3"
          icon="mdi-square"
          class="legendBox"
          color="#75ba75"
        ></VIcon>
        <VIcon
          v-else-if="index === 4"
          icon="mdi-square"
          class="legendBox"
          color="#6dbfb8"
        ></VIcon>
        <VIcon
          v-else-if="index === 5"
          icon="mdi-square"
          class="legendBox"
          color="#fec76f"
        ></VIcon
        >{{ " " + props.labelsParent[index + 4] }}
      </p>
    </VContainer>
  </VCardText>
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
const isZustand = computed(() => {
  return props.filterParent === "Zustand";
});
const isMinuten = computed(() => {
  return props.filterParent === "Minuten";
});
const loaded = ref(false);
const props = defineProps<{
  dataParent: number[];
  labelsParent: String[];
  filterParent: string;
}>();
const backgroundColors = [
  "#36a2eb",
  "#ff6384",
  "#4bc0c0",
  "#ff9f40",
  "rgb(153,102,255)",
  "#ffcd56",
  "#c9cbcf",
  "#75ba75",
  "#6dbfb8",
  "#fec76f",
];
const backgroundColorsZustand = ["green", "#D18700", "red", "grey"];
const dark = useDark();
const chartOptions = computed(() => {
  const chartOptionsNew = {
    barPercentage: 0.5,
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        display: isMinuten.value,
        ticks: {
          color: dark.value ? "#FFF" : "#000",
        },
        grid: {
          color: dark.value ? "grey" : "#D3D3D3",
        },
      },
      y: {
        ticks: {
          color: dark.value ? "#FFF" : "#000",
        },
        grid: {
          color: dark.value ? "grey" : "#D3D3D3",
        },
      },
    },
    plugins: {
      colors: {
        enabled: true,
      },
      legend: {
        display: false,
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
          backgroundColor: backgroundColorsZustand,
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
          backgroundColor: backgroundColors,
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
.legendBox {
  font-size: small;
}
.Legend {
  padding: 0%;
  margin-left: 10%;
}
.flexBox {
  margin-left: 10%;
  padding: 0%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
</style>
