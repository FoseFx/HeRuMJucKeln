<template>
  <VCardTitle> {{ vehicleState.operational?.line?.displayText }}</VCardTitle>
  <VCardSubtitle>
    {{ firstStop }}
    <VIcon icon="mdi-arrow-right" />
    {{ vehicleState.destination?.lastStopName }}
  </VCardSubtitle>
  <VRow>
    <VCol>
      <VTable>
        <TBody>
          <Tr v-if="vehicleState.operational?.driver">
            <Td>Fahrer</Td>
            <Td>{{ vehicleState.operational?.driver?.displayText }}</Td>
          </Tr>
          <Tr>
            <Td>Fahrzeug</Td>
            <Td>{{ vehicleState.identification.displayText }}</Td>
          </Tr>
          <Tr>
            <Td>Dienstleister</Td>
            <Td>{{ vehicleState.tenant }}</Td>
          </Tr>
          <Tr v-if="vehicleState.occupancy?.range">
            <Td>Auslastung</Td>
            <Td :style="{ color: getOccupancyColor(vehicleState.occupancy) }">
              {{ vehicleState.occupancy?.range?.[0] }}% -
              {{ vehicleState.occupancy?.range?.[1] }}%
            </Td>
          </Tr>
          <Tr v-if="nextTrip">
            <Td>Nächste Fahrt</Td>
            <Td>
              <VTooltip location="bottom">
                <template #activator="{ props: tooltipProps }">
                  <span v-bind="tooltipProps">
                    {{ nextTrip.identification.displayText }}
                  </span>
                </template>
                Geplant: {{ plannedStartForNextTrip }} <br />
                {{ nextTrip.firstTripItineraryNode?.netPoint?.displayText }}
                <VIcon icon="mdi-arrow-right" />
                {{ nextTrip.lastTripItineraryNode?.netPoint?.displayText }}
              </VTooltip>
            </Td>
          </Tr>
        </TBody>
      </VTable>
    </VCol>
    <VCol>
      <VTimeline class="trip-timeline" truncate-line="start" dense side="end">
        <BusStopInfo :net-point="lastStation" :trip="trip" />
        <BusStopInfo
          :net-point="vehicleState.positionState?.toNetPoint"
          :trip="trip"
        />
        <VTimelineItem size="x-small" dot-color="red"></VTimelineItem>
        <BusStopInfo
          :net-point="vehicleState.positionState?.fromNetPoint"
          :trip="trip"
        />
      </VTimeline>
    </VCol>
  </VRow>
  <VRow>
    <VCol>
      <VBtn style="width: 100%" @click="openPreviousBus">
        <VIcon icon="mdi-arrow-left" /> Vorgänger
      </VBtn>
    </VCol>
    <VCol>
      <VBtn style="width: 100%" @click="openNextBus">
        Nachfolger <VIcon icon="mdi-arrow-right" />
      </VBtn>
    </VCol>
  </VRow>
</template>

<script setup lang="ts">
import date from "date-and-time";
import { useBlocks } from "~/composables/api";
import { NetPoint, VehicleState } from "~/swagger/Api";

const props = defineProps<{ vehicleState: VehicleState }>();

const tripUid = computed(() => props.vehicleState.operational?.trip?.uid);

const itineraries = computed(() =>
  useItineraries({
    tripUid: tripUid.value ? [tripUid.value] : [],
  })
);

const trip = computed(() =>
  itineraries.value.data.value?.find(
    (it) => it.identification?.uid === props.vehicleState.operational?.trip?.uid
  )
);

const firstStop = computed(
  () => trip.value?.links?.[0].start?.identification?.netPoint?.displayText
);

const blocks = computed(() =>
  useBlocks({ vehicleUid: [props.vehicleState.identification.uid] })
);

const nextTrip = computed(() => {
  const currentNumberInBlock =
    props.vehicleState.operational?.trip?.numberInBlock;

  const vehicleBlock = blocks.value.data.value?.[0];

  if (
    currentNumberInBlock === undefined ||
    currentNumberInBlock + 1 >= (vehicleBlock?.trips?.length ?? 0)
  ) {
    // There is no next trip
    return undefined;
  } else {
    return vehicleBlock?.trips?.[currentNumberInBlock + 1];
  }
});

const plannedStartForNextTrip = computed(() =>
  date.format(new Date(nextTrip.value?.plannedTimes.start), "HH:mm")
);

const lastStation = computed<NetPoint>(() => ({
  posInRoute: trip.value?.links?.length
    ? trip.value.links.length - 1
    : undefined,
  netPoint: {
    displayText: props.vehicleState.destination?.lastStopName,
    type: "STOP_POINT",
  },
}));

function openPreviousBus() {
  // TODO #49
}

function openNextBus() {
  // TODO #49
}
</script>

<style>
/* Add dashed line between next and last bus-stop */
.trip-timeline .v-timeline-item:first-child .v-timeline-divider__after,
.trip-timeline .v-timeline-item:nth-child(2) .v-timeline-divider__before {
  border: rgba(var(--v-border-color), var(--v-border-opacity)) dashed 1px;
  background: none;
}

/* Remove line after first bus-stop */
.trip-timeline .v-timeline-item:last-child .v-timeline-divider__after {
  background: none;
}

/* Decrease opacity of last item (first stop in trip) as it is in the past */
.trip-timeline .v-timeline-item:nth-last-child(2) .v-timeline-divider__after,
.trip-timeline .v-timeline-item:last-child .v-timeline-divider__after {
  opacity: 0.3;
}
.trip-timeline .v-timeline-item:last-child div {
  opacity: 0.5;
}
</style>
