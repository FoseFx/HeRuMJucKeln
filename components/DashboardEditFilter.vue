<template>
  <div>
    <VBtn size="small" icon="mdi-pencil">
      <VIcon icon="mdi-pencil"></VIcon>
      <VDialog v-model="showModal" activator="parent" width="60%">
        <VCard class="pa-5">
          <VCardTitle>Element editieren</VCardTitle>
          <VCardText>
            <VTextField v-model="nameTitel" label="Titel"></VTextField>
            <VSelect
              v-model="schluessel"
              :items="['Linie', 'Unternehmen', 'Zustand']"
              label="Schlüssel"
            ></VSelect>
            <VSelect
              v-model="metrik"
              :items="['Durchschnittliche Zeit', 'Fahrten']"
              label="Metrik"
            ></VSelect>
            <VCardText>Filter</VCardText>
            <VRow>
              <VCol cols="7">
                <VSelect
                  v-model="linienFilter"
                  :items="linien"
                  label="Linien"
                  multiple
                ></VSelect>
              </VCol>
              <VCol>
                <VBtn class="select" @click="linienFilter = linien"
                  >Alle<br />auswählen</VBtn
                >
              </VCol>
              <VCol>
                <VBtn class="select" @click="linienFilter = []"
                  >Zurück-<br />setzen</VBtn
                >
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="7">
                <VSelect
                  v-model="diensleisterFilter"
                  :items="unternehmen"
                  label="Dienstleister"
                  multiple
                ></VSelect>
              </VCol>
              <VCol>
                <VBtn class="select" @click="diensleisterFilter = unternehmen"
                  >Alle<br />auswählen</VBtn
                >
              </VCol>
              <VCol>
                <VBtn class="select" @click="diensleisterFilter = []"
                  >Zurück-<br />setzen</VBtn
                >
              </VCol>
            </VRow>
            <VTextField
              v-show="schluessel === 'Linie' || schluessel === 'Unternehmen'"
              v-model="zeitab"
              type="number"
              label="Zeit ab (Minuten)"
            />
            <VTextField
              v-show="schluessel === 'Linie' || schluessel === 'Unternehmen'"
              v-model="zeitbis"
              type="number"
              label="Zeit bis (Minuten)"
            />

            <p v-if="errorMessage">{{ errorMessage }}</p>
          </VCardText>
          <VCardActions>
            <VBtn color="purple lighten-2" @click="editFilter"
              >Änderungen übernehmen</VBtn
            >
            <VBtn color="green-darken-2" @click="addFilter"
              >Neu hinzufügen</VBtn
            >
            <VBtn color="red-darken-4" @click="abbrechen">Abbrechen</VBtn>
          </VCardActions>
        </VCard>
      </VDialog>
    </VBtn>
  </div>
</template>

<script setup lang="ts">
import { defineProps, watch } from "vue";
import { DashboardConfig } from "~/types/dashboard";
const props = defineProps<{ filter: DashboardConfig }>();
const linien = useAlleLinien();
const unternehmen = useAlleUnternehmen();

const showModal = ref(false);
const chartFilter = useFilter();
const nameTitel = ref(props.filter.name);
const zeitab = ref(props.filter.filterZeit[0]);
const zeitbis = ref(props.filter.filterZeit[1]);
const errorMessage = ref("");
const linienFilter = ref<number[]>(props.filter.filterLinie);
const diensleisterFilter = ref<string[]>(props.filter.filterUnternehmen);
const metrik = ref(props.filter.metrik);
const schluessel = ref(props.filter.schluessel);

const abbrechen = () => {
  showModal.value = false;
  nameTitel.value = props.filter.name;
  zeitab.value = props.filter.filterZeit[0];
  zeitbis.value = props.filter.filterZeit[1];
  errorMessage.value = "";
  linienFilter.value = props.filter.filterLinie;
  diensleisterFilter.value = props.filter.filterUnternehmen;
  metrik.value = props.filter.metrik;
  schluessel.value = props.filter.schluessel;
};
const editFilter = () => {
  check();
  if (errorMessage.value) {
    return;
  }
  chartFilter.value.splice(chartFilter.value.indexOf(props.filter), 1, {
    id: Math.random(),
    name: nameTitel.value,
    schluessel: schluessel.value,
    metrik: metrik.value,
    filterZeit: [Number(zeitab.value), Number(zeitbis.value)],
    filterLinie: linienFilter.value,
    filterUnternehmen: diensleisterFilter.value,
  });
  showModal.value = false;
};

const addFilter = () => {
  check();
  if (errorMessage.value) {
    return;
  }
  chartFilter.value.push({
    id: Math.random(),
    name: nameTitel.value,
    schluessel: schluessel.value,
    metrik: metrik.value,
    filterZeit: [Number(zeitab.value), Number(zeitbis.value)],
    filterLinie: linienFilter.value,
    filterUnternehmen: diensleisterFilter.value,
  });
  showModal.value = false;
};

const check = () => {
  errorMessage.value = "";
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
  if (linienFilter.value.length === 0) {
    linienFilter.value = linien.value;
  }
  if (diensleisterFilter.value.length === 0) {
    diensleisterFilter.value = unternehmen.value;
  }
  if (schluessel.value === "Zustand") {
    zeitab.value = -3000;
    zeitbis.value = 6000;
  }
  if (!(Number(zeitab.value) < Number(zeitbis.value))) {
    zeitab.value = -3000;
    zeitbis.value = 6000;
  }

  if (JSON.stringify(linienFilter.value) === JSON.stringify([])) {
    linienFilter.value = linien.value;
  }
  if (JSON.stringify(diensleisterFilter.value) === JSON.stringify([])) {
    diensleisterFilter.value = unternehmen.value;
  }
};

const sortLinien = () => {
  linienFilter.value.sort((n1, n2) => n1 - n2);
};

const sortUnternehmen = () => {
  diensleisterFilter.value.sort();
};

watch(linienFilter, sortLinien, { immediate: false });
watch(diensleisterFilter, sortUnternehmen, { immediate: false });
</script>

<style scoped>
.buttonCard {
  height: 100%;
  width: 100%;
}

.select {
  height: 73%;
  width: 100%;
}
.addButton {
  height: 100%;
  width: 100%;
  font-size: 40px;
}

p {
  color: red;
  margin-top: 10px;
}
</style>
