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
              :items="[
                'Durchschnittliche Abweichung',
                'Fahrten',
                'Anteil der Fahrten unter Zeitfilter',
              ]"
              label="Metrik"
            ></VSelect>
            <VCardText>Filter</VCardText>
            <VRow>
              <VCol cols="7">
                <VSelect
                  v-model="linesFilter"
                  multiple
                  :items="filteredLines"
                  label="Linien"
                ></VSelect>
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
import { UsePromiseResult, usePromise } from "vue-promised";
import { DashboardConfig } from "~/types/dashboard";
const props = defineProps<{ filter: DashboardConfig }>();
// const linien = useAlleLinien();
// const unternehmen = useAlleUnternehmen();

const showModal = ref(false);
const chartFilter = useFilter();
const nameTitel = ref(props.filter.name);
const zeitab = ref(props.filter.filterZeit[0]);
const zeitbis = ref(props.filter.filterZeit[1]);
const errorMessage = ref("");
// const linienFilter = ref<number[]>(props.filter.filterLinie);
// const diensleisterFilter = ref<string[]>(props.filter.filterUnternehmen);
const linesFilter = ref<string[]>(props.filter.filterLinie);
const tenantsFilter = ref<string[]>(props.filter.filterUnternehmen);
const metrik = ref(props.filter.metrik);
const schluessel = ref(props.filter.schluessel);

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
const tenantsList = computed(() => {
  if (tenants.value != null) {
    return tenants.value.filter((tenant) => {
      return tenant;
    });
  }
});
const abbrechen = () => {
  showModal.value = false;
  nameTitel.value = props.filter.name;
  zeitab.value = props.filter.filterZeit[0];
  zeitbis.value = props.filter.filterZeit[1];
  errorMessage.value = "";
  //  linienFilter.value = props.filter.filterLinie;
  //  diensleisterFilter.value = props.filter.filterUnternehmen;
  linesFilter.value = props.filter.filterLinie;
  tenantsFilter.value = props.filter.filterUnternehmen;
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
    filterLinie: linesFilter.value,
    filterUnternehmen: tenantsFilter.value,
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
    filterLinie: linesFilter.value,
    filterUnternehmen: tenantsFilter.value,
  });
  showModal.value = false;
  abbrechen();
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
  if (linesFilter.value.length === 0) {
    linesFilter.value = filteredLines.value;
  }
  if (tenantsFilter.value.length === 0) {
    tenantsFilter.value = tenantsList.value ? tenantsList.value : [];
  }
  if (schluessel.value === "Zustand") {
    zeitab.value = -3000;
    zeitbis.value = 6000;
  }
  if (!(Number(zeitab.value) < Number(zeitbis.value))) {
    zeitab.value = -3000;
    zeitbis.value = 6000;
  }
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
