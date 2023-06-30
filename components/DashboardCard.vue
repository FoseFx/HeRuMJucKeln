<template>
  <VCard @click="applyFilterOnMap">
    <h2 class="card-title">{{ filter.name }}</h2>
    <PieChart
      class="PieChart"
      :labels-parent="labelsCut"
      :data-parent="dataCut"
      :filter-parent="filter.schluessel"
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
import { useIntervalFn } from "@vueuse/core";
import DashboardEditFilter from "../components/DashboardEditFilter.vue";
import PieChart from "./PieChart.vue";
import { DashboardConfig } from "~/types/dashboard";
import { VehicleState } from "~/swagger/Api";

const chartFilter = useFilter();
const props = defineProps<{ filter: DashboardConfig }>();

const labelvalues = ref<string[]>([]);
const labels = ref<string[]>([]);
const labelsCut = ref<string[]>([]);
const data = ref<number[]>([]);
const dataCut = ref<number[]>([]);
let count = new Array<number>();
const fahrzeuge = useVehicleStates$();
let gesamt = 0;
const dialog2 = ref(false);

// aktuelle Filter auf Map anwenden
const applyFilterOnMap = () => {
  const filterState = useLineFilterState();
  const timeFilter = useTimeFilterState();
  const linesID = props.filter.filterLinie;
  filterState.model.value = linesID.map((l) => l.replace("/", "~"));
  timeFilter.model.value = [
    props.filter.filterZeit[0],
    props.filter.filterZeit[1],
  ];
  navigateTo("/map");
};

// aktuellen Filter löschen
const deleteFilter = () => {
  chartFilter.value.splice(chartFilter.value.indexOf(props.filter), 1);
  dialog2.value = false;
};

//
// Set up der Arrays in Abhängigkeit des Schlüssels
//
if (props.filter.schluessel === "Unternehmen") {
  labelvalues.value = [...props.filter.filterUnternehmen];
  labels.value = [...props.filter.filterUnternehmen];
  data.value = new Array(props.filter.filterUnternehmen.length);
  data.value.fill(0);
  count = new Array(props.filter.filterUnternehmen.length);
  count.fill(0);
} else if (props.filter.schluessel === "Linie") {
  labelvalues.value = [...props.filter.filterLinie];
  labels.value = [...props.filter.filterLinie];
  data.value = new Array(props.filter.filterLinie.length);
  data.value.fill(0);
  count = new Array(props.filter.filterLinie.length);
  count.fill(0);
} else if (props.filter.schluessel === "Zustand") {
  labelvalues.value = ["On Time", "Problematic", "Suboptimal", "Waiting"];
  labels.value = ["On Time", "Problematic", "Suboptimal", "Waiting"];
  data.value = [0, 0, 0, 0];
}

const checkLineTenent = (bus: VehicleState) => {
  if (
    bus.deviation?.value &&
    bus.operational?.line?.displayText &&
    props.filter.filterUnternehmen.includes(bus.tenant) &&
    props.filter.filterLinie.includes(bus.operational?.line?.displayText)
  ) {
    return true;
  }
  return false;
};

const checkTime = (bus: VehicleState) => {
  if (
    bus.deviation?.value &&
    props.filter.filterZeit[0] < bus.deviation?.value &&
    props.filter.filterZeit[1] > bus.deviation?.value
  ) {
    return true;
  }
  return false;
};

//
// Update unter Abhängigkeit der Metrik
//

// Metrik = Anteil der Fahrten unter Zeitfilter
const updateAnteil = (vehicles: VehicleState[]) => {
  if (props.filter.schluessel === "Unternehmen") {
    vehicles.forEach((bus) => {
      if (checkLineTenent(bus)) {
        count[props.filter.filterUnternehmen.indexOf(bus.tenant)] += 1;
        if (checkTime(bus)) {
          data.value[props.filter.filterUnternehmen.indexOf(bus.tenant)] += 1;
        }
      }
    });
  } else if (props.filter.schluessel === "Linie") {
    vehicles.forEach((bus) => {
      if (checkLineTenent(bus)) {
        count[
          props.filter.filterLinie.indexOf(bus.operational!.line!.displayText!)
        ] += 1;
        if (checkTime(bus)) {
          data.value[
            props.filter.filterLinie.indexOf(
              bus.operational!.line!.displayText!
            )
          ] += 1;
        }
      }
    });
  } else if (props.filter.schluessel === "Zustand") {
    vehicles.forEach((bus) => {
      if (checkLineTenent(bus)) {
        if (bus.deviation?.semantics === "ON_TIME") {
          count[0] += 1;
        } else if (bus.deviation?.semantics === "PROBLEMATIC") {
          count[1] += 1;
        } else if (bus.deviation?.semantics === "SUBOPTIMAL") {
          count[2] += 1;
        } else if (bus.deviation?.semantics === "WAITING") {
          count[3] += 1;
        }
        if (checkTime(bus)) {
          if (bus.deviation?.semantics === "ON_TIME") {
            data.value[0] += 1;
          } else if (bus.deviation?.semantics === "PROBLEMATIC") {
            data.value[1] += 1;
          } else if (bus.deviation?.semantics === "SUBOPTIMAL") {
            data.value[2] += 1;
          } else if (bus.deviation?.semantics === "WAITING") {
            data.value[3] += 1;
          }
        }
      }
    });
  }
  data.value = data.value.map((dat) => {
    return Math.round((dat * 100) / count[data.value.indexOf(dat)]);
  });
};

// Wenn Metrik Fahrten ist
const updateFahrten = (vehicles: VehicleState[]) => {
  if (props.filter.schluessel === "Unternehmen") {
    vehicles.forEach((bus) => {
      if (checkLineTenent(bus) && checkTime(bus)) {
        data.value[props.filter.filterUnternehmen.indexOf(bus.tenant)] += 1;
      }
    });
  } else if (props.filter.schluessel === "Linie") {
    vehicles.forEach((bus) => {
      if (checkLineTenent(bus) && checkTime(bus)) {
        data.value[
          props.filter.filterLinie.indexOf(bus.operational!.line!.displayText!)
        ] += 1;
      }
    });
  } else if (props.filter.schluessel === "Zustand") {
    vehicles.forEach((bus) => {
      if (checkLineTenent(bus) && checkTime(bus)) {
        if (bus.deviation?.semantics === "ON_TIME") {
          data.value[0] += 1;
        } else if (bus.deviation?.semantics === "PROBLEMATIC") {
          data.value[1] += 1;
        } else if (bus.deviation?.semantics === "SUBOPTIMAL") {
          data.value[2] += 1;
        } else if (bus.deviation?.semantics === "WAITING") {
          data.value[3] += 1;
        }
      }
    });
  }
  gesamt = data.value.reduce((a, b) => a + b, 0);
};

// wenn Metrik durchschnittliche Abweichung ist
const updateAbweichung = (vehicles: VehicleState[]) => {
  if (props.filter.schluessel === "Unternehmen") {
    vehicles.forEach((bus) => {
      if (checkLineTenent(bus) && checkTime(bus)) {
        count[props.filter.filterUnternehmen.indexOf(bus.tenant)] += 1;
        data.value[props.filter.filterUnternehmen.indexOf(bus.tenant)] =
          data.value[props.filter.filterUnternehmen.indexOf(bus.tenant)] +
          Math.abs(bus.deviation!.value!);
      }
    });
  } else if (props.filter.schluessel === "Linie") {
    vehicles.forEach((bus) => {
      if (checkLineTenent(bus) && checkTime(bus)) {
        count[
          props.filter.filterLinie.indexOf(bus.operational!.line!.displayText!)
        ] += 1;
        data.value[
          props.filter.filterLinie.indexOf(bus.operational!.line!.displayText!)
        ] =
          data.value[
            props.filter.filterLinie.indexOf(
              bus.operational!.line!.displayText!
            )
          ] + Math.abs(bus.deviation!.value!);
      }
    });
  } else if (props.filter.schluessel === "Zustand") {
    vehicles.forEach((bus) => {
      if (checkLineTenent(bus) && checkTime(bus)) {
        if (bus.deviation?.semantics === "ON_TIME") {
          count[0] += 1;
          data.value[0] = data.value[0] + bus.deviation!.value!;
        } else if (bus.deviation?.semantics === "PROBLEMATIC") {
          count[1] += 1;
          data.value[1] = data.value[1] + bus.deviation!.value!;
        } else if (bus.deviation?.semantics === "SUBOPTIMAL") {
          count[2] += 1;
          data.value[2] = data.value[2] + bus.deviation!.value!;
        } else if (bus.deviation?.semantics === "WAITING") {
          count[3] += 1;
          data.value[3] = data.value[3] + bus.deviation!.value!;
        }
      }
    });
  }
  for (let index = 0; index < data.value.length; index += 1) {
    if (count[index] !== 0) {
      data.value[index] = Number((data.value[index] / count[index]).toFixed(0));
    }
  }
};

const updateLabelAnteil = () => {
  for (let index = 0; index < labels.value.length; index += 1) {
    labels.value[index] = `${labelvalues.value[index]}: ${data.value[
      index
    ].toString()} %          `;
  }
  labelsCut.value = labels.value.slice(0, 10);
};

const updateLabelFahrten = () => {
  for (let index = 0; index < labels.value.length; index += 1) {
    const percentage = (data.value[index] / gesamt) * 100;
    labels.value[index] = `${labelvalues.value[index]}:  ${percentage
      .toFixed()
      .toString()}%, ${data.value[index]} Fahrten   `;
  }
  labelsCut.value = labels.value.slice(0, 10);
};

const updateLabelAbweichung = () => {
  for (let index = 0; index < labels.value.length; index += 1) {
    labels.value[index] = `${labelvalues.value[index]}:  ${data.value[
      index
    ].toString()} Minuten      `;
  }
  labelsCut.value = labels.value.slice(0, 10);
};

const sortLinesData = () => {
  if (props.filter.schluessel === "Linie") {
    labelvalues.value.sort(
      (a, b) =>
        data.value[labelvalues.value.indexOf(b)] -
        data.value[labelvalues.value.indexOf(a)]
    );
    data.value.sort((a, b) => (a < b ? 1 : -1));
  }

  dataCut.value = data.value.slice(0, 10);
};

const update = (vehicles: VehicleState[]) => {
  data.value.fill(0);
  count.fill(0);

  if (props.filter.metrik === "Anteil der Fahrten unter Zeitfilter") {
    updateAnteil(vehicles);
    sortLinesData();
    updateLabelAnteil();
  } else if (props.filter.metrik === "Fahrten") {
    updateFahrten(vehicles);
    sortLinesData();
    updateLabelFahrten();
  } else if (props.filter.metrik === "Durchschnittliche Abweichung") {
    updateAbweichung(vehicles);
    sortLinesData();
    updateLabelAbweichung();
  }
};

watchAtMost(fahrzeuge, () => update(fahrzeuge.value), { count: 2 });

onMounted(() => {
  update(fahrzeuge.value);
  useIntervalFn(() => update(fahrzeuge.value), 3000);
  update(fahrzeuge.value);
});
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
h2 {
  padding: 3%;
  height: 5rem;
}
</style>
