<template>
  <VTextField
    v-model="search"
    class="searchbar"
    label="Suche nach Attributen..."
    prepend-inner-icon="mdi-magnify"
    single-line
    hide-details
    clearable
    @click:clear="resetSearchBar()"
  >
  </VTextField>
  <VDataTable
    height="80vh"
    :headers="headers"
    fixed-header
    :items="filteredItems"
    must-sort
    sort-desc
    :items-per-page="40"
  >
    <template
      #[`item.vehicleId`]="{ item: { value } }: { item: { value: TableEntry } }"
    >
      <NuxtLink :to="`/table/${value.identification?.uid}`">{{
        value.identification?.displayText
      }}</NuxtLink>
    </template>
    <template
      #[`item.deviation`]="{ item: { value } }: { item: { value: TableEntry } }"
    >
      <div
        v-if="value.deviation"
        :title="getDeviationSemanticsText(value.deviation.semantics)"
        :style="{
          color: getDeviationSemanticsColor(value.deviation.semantics),
        }"
      >
        {{ formatDeviation(value.deviation) }}
      </div>
    </template>
    <template
      #[`item.predecessor`]="{
        item: { value },
      }: {
        item: { value: TableEntry },
      }"
    >
      <TablePredecessorSuccessor :vehicle="value.predecessor" />
    </template>
    <template
      #[`item.successor`]="{ item: { value } }: { item: { value: TableEntry } }"
    >
      <TablePredecessorSuccessor :vehicle="value.successor" />
    </template>
  </VDataTable>
</template>
<script setup lang="ts">
import { VDataTable } from "vuetify/labs/VDataTable";
import { VehicleState } from "~/swagger/Api";
import { DataTableHeader } from "~/types/vuetify";

interface TableEntry {
  identification?: VehicleState["identification"];
  driverName?: string;
  tenant?: string;
  line?: string;
  destination?: string;
  deviation?: VehicleState["deviation"];
  predecessor?: VehicleState;
  successor?: VehicleState;
  vehicleId?: string;
}
const headers: DataTableHeader[] = [
  {
    title: "FahrzeugID",
    align: "start",
    sortable: true,
    key: "vehicleId",
    width: "10%" as unknown as number,
  },
  {
    title: "Fahrer",
    align: "start",
    sortable: true,
    key: "driverName",
    // VDataTable seems to only accept numbers as width but also works with percentage-strings
    width: "20%" as unknown as number,
  },
  {
    title: "Dienstleister",
    align: "start",
    sortable: true,
    key: "tenant",
  },
  {
    title: "Linie",
    align: "start",
    sortable: true,
    key: "line",
    width: "10%" as unknown as number,
  },
  {
    title: "Ziel",
    align: "start",
    sortable: true,
    key: "destination",
    width: "10%" as unknown as number,
  },
  {
    title: "Abweichung",
    align: "start",
    sortable: true,
    key: "deviation",
    sort: (a: TableEntry["deviation"], b: TableEntry["deviation"]) =>
      (a?.value ?? 0) - (b?.value ?? 0),
  },
  { title: "Vorgänger", align: "start", sortable: true, key: "predecessor" },
  { title: "Nachfolger", align: "start", sortable: true, key: "successor" },
];

const filteredVehicles = refThrottled(useFilteredVehicleState$(), 2000);

const neighbouringVehicles = useNeighbouringVehiclesForAllVehicles();

const items = computed<TableEntry[]>(() =>
  filteredVehicles.value.map((vehicle) => {
    const nb = neighbouringVehicles.value.find(
      (n) => vehicle.identification.uid === n.vuid
    );
    return {
      identification: vehicle.identification,
      driverName: vehicle.operational?.driver?.displayText,
      tenant: vehicle.tenant,
      line: vehicle.operational?.line?.displayText as string,
      deviation: vehicle.deviation,
      destination: vehicle.destination?.lastStopName,
      predecessor: nb?.prev,
      successor: nb?.next,
      vehicleId: vehicle.identification.uid,
    };
  })
);

const search = ref("");
const filteredItems = computed(() => {
  if (items.value != null && search.value != null) {
    return items.value.filter((item) => {
      return (
        item.driverName?.toLowerCase().includes(search.value.toLowerCase()) ||
        item.line?.toLowerCase().includes(search.value.toLowerCase()) ||
        item.predecessor?.identification.displayText
          .toLowerCase()
          .includes(search.value.toLowerCase()) ||
        item.successor?.identification.displayText
          .toLowerCase()
          .includes(search.value.toLowerCase()) ||
        item.identification?.displayText
          .toLowerCase()
          .includes(search.value.toLowerCase()) ||
        item.tenant?.toLowerCase().includes(search.value.toLowerCase()) ||
        item.destination?.toLowerCase().includes(search.value.toLowerCase()) ||
        item.identification?.uid
          .toLowerCase()
          .includes(search.value.toLowerCase()) ||
        item.deviation?.value
          ?.toString()
          .toLowerCase()
          .includes(search.value.toLowerCase())
      );
    });
  }
});
function resetSearchBar() {
  search.value = "";
}
</script>

<style scoped>
.searchbar {
  width: 50%;
}
</style>
