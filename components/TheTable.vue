<template>
  <VTextField
    v-model="search"
    append-icon="mdi-magnify"
    label="Search"
    single-line
    hide-details
    class="searchbar"
  >
  </VTextField>
  <VDataTable
    height="80vh"
    :headers="headers"
    fixed-header
    :items="items"
    must-sort
    sort-desc
    :items-per-page="40"
  >
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
        {{ value.deviation.value }} min
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

const search = ref("");

interface TableEntry {
  vehicleId?: string;
  driverName?: string;
  tenant?: string;
  line?: string;
  destination?: string;
  deviation?: VehicleState["deviation"];
  predecessor?: VehicleState;
  successor?: VehicleState;
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
      vehicleId: vehicle.identification.displayText,
      driverName: vehicle.operational?.driver?.displayText,
      tenant: vehicle.tenant,
      line: vehicle.operational?.line?.displayText as string,
      deviation: vehicle.deviation,
      destination: vehicle.destination?.lastStopName,
      predecessor: nb?.prev,
      successor: nb?.next,
    };
  })
);
</script>

<style scoped>
.searchbar {
  width: 50%;
}
</style>
