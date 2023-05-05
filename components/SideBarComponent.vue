<template>
  <v-row style="overflow: hidden">
    <v-col :cols="open ? 8 : 12">
      <slot name="content"></slot>
    </v-col>
    <v-col v-if="open" cols="4">
      <v-card class="color" :class="{ dark }" style="height: 100%">
        <template #prepend>
          <v-btn :color="dark ? 'black' : 'white'" icon @click="closeSidebar"
            ><v-icon icon="mdi-close"></v-icon
          ></v-btn>
        </template>
        <template #title>
          <v-card-title>{{ title }}</v-card-title>
        </template>
        <slot name="sidebar"></slot>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
const open = ref(true);
const dark = useDark();

const emit = defineEmits(["close"]);

function closeSidebar() {
  open.value = false;
  emit("close");
}

defineProps<{ title: string }>();
</script>
