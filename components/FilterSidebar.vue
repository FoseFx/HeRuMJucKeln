<template>
  <aside>
    <VRow>
      <VCol>
        <VSheet :elevation="0" :color="dark ? undefined : 'grey-lighten-3'">
          <VBtn
            class="close-button"
            block
            color="transparent"
            :elevation="0"
            prepend-icon="mdi-chevron-right"
            @click="$emit('close')"
          />
        </VSheet>
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <VContainer style="display: flex; justify-content: end">
          <VBtn
            density="comfortable"
            :color="dark ? 'grey-darken-3' : 'grey-darken-4'"
          >
            Clear All
          </VBtn>
        </VContainer>
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <VContainer>
          <VExpansionPanels> TODO </VExpansionPanels>
        </VContainer>
      </VCol>
    </VRow>
  </aside>
</template>

<script setup lang="ts">
defineEmits(["close"]);
const dark = useDark();
</script>

<style scoped>
.close-button {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  justify-content: start;
  font-size: 1.2rem;
}
</style>
