<template>
  <VTimelineItem size="small" color="green" small>
    <template #opposite>
      <BusTimeDisplay
        v-if="departure.actual && departure.planned"
        :actual="departure.actual"
        :planned="departure.planned"
      />
      <BusTimeDisplay
        v-if="arrival.actual && arrival.planned"
        :actual="arrival.actual"
        :planned="arrival.planned"
      />
    </template>
    <div>
      {{ netPoint?.netPoint?.displayText }}
    </div>
  </VTimelineItem>
</template>

<script setup lang="ts">
import { NetPoint, TripItinerary } from "~/swagger/Api";

const props = defineProps<{
  netPoint?: NetPoint;
  trip?: TripItinerary;
}>();

const link = computed(() => {
  if (
    props.trip?.links === undefined ||
    props.netPoint?.posInRoute === undefined
  ) {
    return undefined;
  } else {
    return props.trip.links[props.netPoint?.posInRoute];
  }
});

const arrival = computed(() => ({
  actual: link.value?.start?.timeInfo?.actual?.times?.arrival,
  planned: link.value?.start?.timeInfo?.planned?.arrival,
}));

const departure = computed(() => ({
  actual: link.value?.start?.timeInfo?.actual?.times?.departure,
  planned: link.value?.start?.timeInfo?.planned?.departure,
}));
</script>
