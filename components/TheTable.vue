<template>
  <VDataTable :headers="headers" :items="items" must-sort sort-desc />
</template>
<script setup lang="ts">
// TODO: fix prefix sorting
import { VDataTable } from "vuetify/labs/VDataTable";
type DataTableHeader = {
  key: string;
  title: string;
  colspan?: number;
  rowspan?: number;
  fixed?: boolean;
  align?: "start" | "end";
  width?: number;
  minWidth?: string;
  maxWidth?: string;
  sortable?: boolean;
};
const headers: DataTableHeader[] = [
  { title: "FahrzeugID", align: "start", sortable: true, key: "fahrzeugId" },
  { title: "Fahrer", align: "start", sortable: true, key: "fahrerName" },
  {
    title: "Dienstleister",
    align: "start",
    sortable: true,
    key: "dienstleister",
  },
  { title: "Linie", align: "start", sortable: true, key: "linie" },
  { title: "Ziel", align: "start", sortable: true, key: "ziel" },
  { title: "Abweichung", align: "start", sortable: true, key: "abweichung" },
  { title: "Vorgänger", align: "start", sortable: true, key: "vorgaenger" },
  { title: "Nachfolger", align: "start", sortable: true, key: "nachfolger" },
];
const items = [
  {
    fahrzeugId: "AVV/123",
    fahrerName: "Rossmanith",
    dienstleister: "ASEAG",
    linie: 24,
    ziel: "Uniklinik",
    abweichung: +10,
    vorgaenger: "6 min",
    nachfolger: "7 min",
  },
  {
    fahrzeugId: "DB/12",
    fahrerName: "Giesl",
    dienstleister: "Arriva",
    linie: 73,
    ziel: "Uniklinik",
    abweichung: -5,
    vorgaenger: "2 min",
    nachfolger: "10 min",
  },
  {
    fahrzeugId: "DB/36",
    fahrerName: "Rumpe",
    dienstleister: "Arriva",
    linie: 33,
    ziel: "Fuchserde",
    abweichung: +2,
    vorgaenger: "3 min",
    nachfolger: "4 min",
  },
  {
    fahrzeugId: "AVV/123",
    fahrerName: "Mustermann",
    dienstleister: "ASEAG",
    linie: 34,
    ziel: "Uniklinik",
    abweichung: +5,
    vorgaenger: "4 min",
    nachfolger: "8 min",
  },
  {
    fahrzeugId: "AVV/123",
    fahrerName: "Kowalewski",
    dienstleister: "Taeter3000",
    linie: 12,
    ziel: "Elisenbrunnen",
    abweichung: 0,
    vorgaenger: "1 min",
    nachfolger: "11 min",
  },
];
</script>
