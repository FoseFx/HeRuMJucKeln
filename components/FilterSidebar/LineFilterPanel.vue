<template>
  <FilterPanel id="line" title="Linien" :filter-state="lineFilterState">
    <div class="cb-wrapper">
      <VTextField
        v-model="search"
        class="searchbar"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        single-line
        hide-details
        clearable
        @click:clear="resetSearchBar()"
      >
      </VTextField>
      <VCheckbox
        v-for="line of filteredLines"
        :key="line.id"
        v-model="lineFilterState.model.value"
        :label="line.name"
        :value="line.id"
        class="half-cb"
      />
    </div>
  </FilterPanel>
</template>

<script setup lang="ts">
const lineFilterState = useLineFilterState();

const { data: lines } = useLines();

const search = ref("");
const filteredLines = computed(() => {
  if (lines.value != null && search.value != null) {
    return lines.value.filter((line) => {
      return line.name.toLowerCase().includes(search.value.toLowerCase());
    });
  }
});

// function resetLinesFilter() {
//   lineFilterState.clear();
//   resetSearchBar();
// }

function resetSearchBar() {
  search.value = "";
}
</script>

<style scoped>
.cb-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.half-cb {
  width: 50%;
  display: flex;
  align-items: center;
}

.searchbar {
  width: 100%;
}
</style>
