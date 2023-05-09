<template>
  <VRow style="overflow: hidden">
    <VCol :cols="open ? 8 : 12">
      <slot name="content"></slot>
    </VCol>
    <VCol v-if="open" cols="4">
      <VCard class="sidebar">
        <template #prepend>
          <VBtn icon @click="closeSidebar">
            <VIcon icon="mdi-close" />
          </VBtn>
        </template>
        <template #title>
          <VCardTitle>{{ title }}</VCardTitle>
        </template>
        <slot name="sidebar"></slot>
      </VCard>
    </VCol>
  </VRow>
</template>

<script lang="ts" setup>
const open = ref(true);

const emit = defineEmits(["close"]);

function closeSidebar() {
  open.value = false;
  emit("close");
}

defineProps<{ title: string }>();
</script>

<style scoped>
.v-col {
  padding-left: 0px;
  padding-right: 0px;
}

.v-col > .v-card {
  padding: 1em;
  height: 100%;
}
</style>
