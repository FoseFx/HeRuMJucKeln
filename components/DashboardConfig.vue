<template>
  <VCard height="100%">
    <VBtn class="addButton">
      +

      <VDialog v-model="showModal" activator="parent" width="60%">
        <VCard class="pa-5">
          <VCardTitle>Neues Dashboardelement</VCardTitle>
          <VCardText>
            <VTextField v-model="nameTitel" label="Titel"></VTextField>
            <VSelect
              v-model="schluessel"
              :items="['Linie', 'Unternehmen', 'Zustand', 'Minuten']"
              label="Schlüssel"
            ></VSelect>
            <VSelect
              v-model="metrik"
              :items="[
                'Durchschnittliche Abweichung',
                'Fahrten',
                'Anteil der Fahrten unter Zeitfilter',
              ]"
              label="Metrik"
            ></VSelect>
            <VSelect
              v-model="typeChart"
              :items="['Bar', 'Pie']"
              label="Charttyp"
            >
            </VSelect>
            <VRow class="titles">Filter</VRow>
            <VRow>
              <VCol cols="7">
                <VAutocomplete
                  v-model="linesFilter"
                  multiple
                  :items="filteredLines"
                  label="Linien"
                ></VAutocomplete>
              </VCol>
              <VCol>
                <VBtn class="select" @click="linesFilter = filteredLines"
                  >Alle<br />auswählen</VBtn
                >
              </VCol>
              <VCol>
                <VBtn class="select" @click="linesFilter = []"
                  >Zurück-<br />setzen</VBtn
                >
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="7">
                <VSelect
                  v-model="tenantsFilter"
                  :items="tenantsList"
                  label="Dienstleister"
                  multiple
                ></VSelect>
              </VCol>
              <VCol>
                <VBtn
                  class="select"
                  @click="
                    tenantsList
                      ? (tenantsFilter = tenantsList)
                      : (tenantsList = [])
                  "
                  >Alle<br />auswählen</VBtn
                >
              </VCol>
              <VCol>
                <VBtn class="select" @click="tenantsFilter = []"
                  >Zurück-<br />setzen</VBtn
                >
              </VCol>
            </VRow>
            <VRow
              v-show="schluessel === 'Linie' || schluessel === 'Unternehmen'"
              class="titles"
              >Zeitfilter</VRow
            >
            <VRow
              v-show="schluessel === 'Linie' || schluessel === 'Unternehmen'"
            >
              <VCol cols="1">
                <p v-if="range[0] > -100" class="text">{{ range[0] }}</p>
                <p v-else class="infty">-&#8734;</p>
              </VCol>
              <VCol cols="10">
                <VRangeSlider
                  v-model="range"
                  :max="20"
                  :min="-100"
                  :step="1"
                  hide-details
                  strict
                ></VRangeSlider>
              </VCol>
              <VCol cols="1">
                <p v-if="range[1] < 20" class="text">{{ range[1] }}</p>
                <p v-else class="infty">&#8734;</p>
              </VCol>
            </VRow>
            <p v-if="errorMessage">{{ errorMessage }}</p>
          </VCardText>
          <VCardActions>
            <VBtn color="green-darken-2" @click="addFilter">Hinzufügen</VBtn>
            <VBtn color="red-darken-4" @click="showModal = false"
              >Abbrechen</VBtn
            >
          </VCardActions>
        </VCard>
      </VDialog>
    </VBtn>
  </VCard>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { UsePromiseResult, usePromise } from "vue-promised";
const range = ref([-6000, 3000]);
const typeChart = ref("");
const showModal = ref(false);
const chartFilter = useFilter();
const nameTitel = ref("");
const errorMessage = ref("");
const metrik = ref("");
const schluessel = ref("");
const linesFilter = ref<string[]>([]);
const { data: lines } = useLines();
const filteredLines = computed(() => {
  if (lines.value != null) {
    return lines.value.map((line) => {
      return line.name;
    });
  } else {
    return [];
  }
});
let ten: UsePromiseResult<string[]> | null = null;
function useTenants() {
  if (ten === null || !ten.isRejected) {
    const promiseRef = ref(api.tenants.retrieveTenants());
    ten = usePromise(promiseRef);
  }

  return { ...ten };
}
const { data: tenants } = useTenants();
const tenantsFilter = ref<string[]>([]);
const tenantsList = computed(() => {
  if (tenants.value != null) {
    return tenants.value.filter((tenant) => {
      return tenant;
    });
  }
});
const addFilter = () => {
  if (nameTitel.value === "") {
    errorMessage.value = "Gib einen Titel ein";
    return;
  }
  if (schluessel.value === "") {
    errorMessage.value = "Wähle einen Schlüssel";
    return;
  }
  if (metrik.value === "") {
    errorMessage.value = "Wähle eine Metrik";
    return;
  }
  if (
    schluessel.value === "Minuten" &&
    (metrik.value === "Anteil der Fahrten unter Zeitfilter" ||
      metrik.value === "Durchschnittliche Abweichung")
  ) {
    errorMessage.value = "Metrik und Schlüssel passen nicht zusammen";
    return;
  }
  if (linesFilter.value.length === 0) {
    linesFilter.value = filteredLines.value;
  }
  if (tenantsFilter.value.length === 0) {
    tenantsFilter.value = tenantsList.value ? tenantsList.value : [];
  }
  if (schluessel.value === "Zustand") {
    range.value[0] = -3000;
    range.value[1] = 6000;
  }
  if (!(Number(range.value[0]) < Number(range.value[1]))) {
    range.value[0] = -3000;
    range.value[1] = 6000;
  }
  if (range.value[0] <= -100) {
    range.value[0] = -3000;
  }
  if (range.value[1] >= 20) {
    range.value[1] = 6000;
  }
  if (typeChart.value === "") {
    typeChart.value = "Pie";
  }
  chartFilter.value.push({
    id: Math.random(),
    name: nameTitel.value,
    schluessel: schluessel.value,
    metrik: metrik.value,
    filterZeit: [Number(range.value[0]), Number(range.value[1])],
    filterLinie: linesFilter.value,
    filterUnternehmen: tenantsFilter.value,
    chartTyp: typeChart.value,
  });

  showModal.value = false;
  nameTitel.value = "";
  range.value[0] = -3000;
  range.value[1] = 6000;
  linesFilter.value = [];
  tenantsFilter.value = [];
  schluessel.value = "";
  metrik.value = "";
  typeChart.value = "";
  errorMessage.value = "";
};
const sortLinien = () => {
  linesFilter.value.sort();
};
const sortUnternehmen = () => {
  tenantsFilter.value.sort();
};
watch(linesFilter, sortLinien, { immediate: false });
watch(tenantsFilter, sortUnternehmen, { immediate: false });
</script>

<style scoped>
.select {
  height: 73%;
  width: 100%;
}
.addButton {
  height: 100%;
  width: 100%;
  font-size: 40px;
}

.text {
  padding-top: 10%;
  font-size: medium;
}
.infty {
  font-size: x-large;
}
.titles {
  padding-top: 3%;
}
</style>
