<template>
  <VCard>
    <h2 class="card-title">{{ filter.name }}</h2>
    <PieChart
      class="PieChart"
      :labels-parent="labels"
      :data-parent="data"
      :filter-parent="filter.schluessel"
      textcolor=""
    />
    <VContainer class="flex-gap" style="display: flex; justify-content: end">
      <DashboardEditFilter :filter="props.filter" />
      <VBtn icon="mdi-close" size="small">
        <VIcon icon="mdi-close"></VIcon>
        <VDialog v-model="dialog2" activator="parent" width="auto">
          <VCard class="pa-2" style="height: 120px">
            <VCardText class="pa-3">
              Soll die Chart wirklich gelöscht werden?
            </VCardText>
            <VCardActions>
              <VBtn color="success" @click="dialog2 = false">Abbrechen</VBtn>
              <VBtn color="red" @click="deleteFilter">Löschen</VBtn>
            </VCardActions>
          </VCard>
        </VDialog>
      </VBtn>
    </VContainer>
  </VCard>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import DashboardEditFilter from "../components/DashboardEditFilter.vue";
import currentState from "./MockDataDashboard/currentState";
import PieChart from "./PieChart.vue";
import { DashboardConfig } from "~/types/dashboard";

const chartFilter = useFilter();
const props = defineProps<{ filter: DashboardConfig }>();
const data = ref<number[]>([]);
const labels = ref<string[]>([]);
const countforAv = ref<number[]>([]);
let gesamt = 0;
const dialog2 = ref(false);
// aktuellen Filter löschen
const deleteFilter = () => {
  chartFilter.value.splice(chartFilter.value.indexOf(props.filter), 1);
  dialog2.value = false;
};

// Setup der Arrays in Abhängigkeit des Schlüssels
if (props.filter.schluessel === "Unternehmen") {
  for (let index = 0; index < props.filter.filterUnternehmen.length; index++) {
    data.value.push(0);
    labels.value.push(props.filter.filterUnternehmen[index]);
    countforAv.value.push(0);
  }
}

if (props.filter.schluessel === "Linie") {
  for (let index = 0; index < props.filter.filterLinie.length; index++) {
    data.value.push(0);
    labels.value.push(`${props.filter.filterLinie[index]}`);
    countforAv.value.push(0);
  }
}

if (props.filter.schluessel === "Zustand") {
  data.value.push(0, 0, 0);
  labels.value.push("Verfrüht", "Pünktlich", "Verspätet");
  countforAv.value.push(0, 0, 0);
}

// Auswertung der Daten als loop über alle Busse
currentState.value.forEach((bus) => {
  // muss dieser Bus unter diesem props.filter betrachtet werden
  if (
    props.filter.filterLinie.includes(bus.linie) &&
    props.filter.filterUnternehmen.includes(bus.unternehmer) &&
    props.filter.filterZeit[0] < bus.verspaetung &&
    props.filter.filterZeit[1] > bus.verspaetung
  ) {
    // wenn Metrik Fahrten ist dann geeignete Zelle finden und updaten
    if (props.filter.metrik === "Fahrten") {
      if (props.filter.schluessel === "Unternehmen") {
        data.value[props.filter.filterUnternehmen.indexOf(bus.unternehmer)]++;
      }
      if (props.filter.schluessel === "Linie") {
        data.value[props.filter.filterLinie.indexOf(bus.linie)]++;
      }
      if (props.filter.schluessel === "Zustand") {
        if (bus.verspaetung < -120) {
          data.value[0]++;
        } else if (bus.verspaetung > 180) {
          data.value[2]++;
        } else {
          data.value[1]++;
        }
      }
    }

    // wenn Metrik Durchschnittliche Zeit ist, dann Hilfsarray mit Anzahlen füllen und data addieren
    if (props.filter.metrik === "Durchschnittliche Zeit") {
      if (props.filter.schluessel === "Unternehmen") {
        countforAv.value[
          props.filter.filterUnternehmen.indexOf(bus.unternehmer)
        ]++;
        data.value[props.filter.filterUnternehmen.indexOf(bus.unternehmer)] =
          data.value[props.filter.filterUnternehmen.indexOf(bus.unternehmer)] +
          bus.verspaetung;
      }
      if (props.filter.schluessel === "Linie") {
        countforAv.value[props.filter.filterLinie.indexOf(bus.linie)]++;
        data.value[props.filter.filterLinie.indexOf(bus.linie)] =
          data.value[props.filter.filterLinie.indexOf(bus.linie)] +
          bus.verspaetung;
      }
      if (props.filter.schluessel === "Zustand") {
        if (bus.verspaetung < -120) {
          countforAv.value[0]++;
          data.value[0] = data.value[0] + bus.verspaetung;
        } else if (bus.verspaetung > 180) {
          countforAv.value[2]++;
          data.value[2] = data.value[2] + bus.verspaetung;
        } else {
          countforAv.value[1]++;
          data.value[1] = data.value[1] + bus.verspaetung;
        }
      }
    }
  }
});

if (props.filter.metrik === "Durchschnittliche Zeit") {
  for (let index = 0; index < data.value.length; index++) {
    data.value[index] = Number(
      (data.value[index] / countforAv.value[index]).toFixed(0)
    );
  }
}

data.value.forEach((dat) => {
  gesamt = gesamt + dat;
});

if (props.filter.metrik === "Fahrten") {
  for (let index = 0; index < labels.value.length; index++) {
    const percentage = (data.value[index] / gesamt) * 100;
    labels.value[index] = `${labels.value[index]}:  ${percentage
      .toFixed()
      .toString()}%, ${data.value[index]} Fahrten   `;
  }
}

if (props.filter.metrik === "Durchschnittliche Zeit") {
  for (let index = 0; index < labels.value.length; index++) {
    labels.value[index] = `${labels.value[index]}:    ${data.value[
      index
    ].toString()} Minuten`;
  }
}
</script>

<style scoped>
.card-title {
  text-align: center;
}
.PieChart {
  padding: 3%;
}
.flex-gap {
  gap: 13px;
}
</style>
