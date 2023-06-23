<template>
  <VCardTitle> {{ vehicleState.operational?.line?.displayText }}</VCardTitle>
  <VCardSubtitle v-if="firstStop && vehicleState.destination?.lastStopName">
    {{ firstStop }}
    <VIcon icon="mdi-arrow-right" />
    {{ vehicleState.destination.lastStopName }}
  </VCardSubtitle>
  <VRow>
    <VCol>
      <VTable>
        <tbody>
          <tr v-if="vehicleState.operational?.driver">
            <td>Fahrer</td>
            <td>{{ vehicleState.operational?.driver?.displayText }}</td>
          </tr>
          <tr>
            <td>Fahrzeug</td>
            <td>{{ vehicleState.identification.displayText }}</td>
          </tr>
          <tr>
            <td>Dienstleister</td>
            <td>{{ vehicleState.tenant }}</td>
          </tr>
          <tr v-if="vehicleState.occupancy?.range">
            <td>Auslastung</td>
            <td :style="{ color: getOccupancyColor(vehicleState.occupancy) }">
              {{ prettifyOccupancy(vehicleState.occupancy) }}
            </td>
          </tr>
          <tr>
            <td>Nächste Fahrt</td>
            <td>
              <VTooltip v-if="nextTrip" location="bottom">
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
            </td>
          </tr>
        </tbody>
      </VTable>
    </VCol>
    <VCol>
      <VTimeline class="trip-timeline" truncate-line="start" dense side="end">
        <BusStopInfo :net-point="lastStation" :trip="trip" />
        <BusStopInfo
          :net-point="vehicleState.positionState?.toNetPoint"
          :trip="trip"
        />
        <VTimelineItem size="small" dot-color="red">
          <template #icon>
            <div class="circle" />
            <div class="ring" />
          </template>
        </VTimelineItem>
        <BusStopInfo
          :net-point="vehicleState.positionState?.fromNetPoint"
          :trip="trip"
        />
      </VTimeline>
    </VCol>
  </VRow>
  <VRow>
    <VCol>
      <VBtn
        v-if="neighbouringVehicle?.value.prev"
        :title="neighbouringVehicle.value.prev.identification.displayText"
        style="width: 100%"
        @click="openPreviousBus"
      >
        <VIcon icon="mdi-arrow-left" /> Vorgänger
      </VBtn>
    </VCol>
    <VCol>
      <VBtn
        v-if="neighbouringVehicle?.value.next"
        :title="neighbouringVehicle.value.next.identification.displayText"
        style="width: 100%"
        @click="openNextBus"
      >
        Nachfolger <VIcon icon="mdi-arrow-right" />
      </VBtn>
    </VCol>
  </VRow>
</template>

<script setup lang="ts">
import date from "date-and-time";
import { NetPoint, VehicleState } from "~/swagger/Api";

const router = useRouter();
const route = useRoute();

const props = defineProps<{
  vehicleState: VehicleState;
}>();

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

const neighbouringVehicle = computed(() => {
  if (!trip.value) {
    return null;
  } else {
    return useNeighbouringVehiclesForSingleVehicle(props.vehicleState, [
      trip.value,
    ]);
  }
});

function openPreviousBus() {
  router.push(
    `${getParentPage(route)}/${
      neighbouringVehicle.value?.value.prev?.identification.uid
    }`
  );
}

function openNextBus() {
  router.push(
    `${getParentPage(route)}/${
      neighbouringVehicle.value?.value.next?.identification.uid
    }`
  );
}
</script>

<style lang="scss">
.divider-past {
  opacity: 0.3;
}

.dot-past {
  opacity: 0.5;
}

.trip-timeline {
  /* Add dashed line between next and last bus-stop */
  .v-timeline-item:first-child .v-timeline-divider__after,
  .v-timeline-item:nth-child(2) .v-timeline-divider__before {
    border: rgba(var(--v-border-color), var(--v-border-opacity)) dashed 1px;
    background: none;
  }

  /* Current position */
  .v-timeline-item:nth-last-child(2) {
    .v-timeline-divider__after {
      @extend .divider-past;
    }
    /* Remove grey background */
    .v-timeline-divider__dot {
      border-style: none !important;
      background: none !important;
    }
    /* Decrease size */
    .v-timeline-divider__inner-dot {
      width: 15px;
      height: 15px;
    }
  }

  /* Last stop */
  .v-timeline-item:last-child {
    .v-timeline-divider__after {
      @extend .divider-past;
    }
    div {
      @extend .dot-past;
    }
  }
}

.circle {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  position: absolute;
}

.ring {
  border: 3px solid red;
  border-radius: 30px;
  height: 25px;
  width: 25px;
  position: absolute;
  animation: pulsate 1s ease-out;
  animation-iteration-count: infinite;
  opacity: 0;
}
@keyframes pulsate {
  0% {
    transform: scale(0.1, 0.1);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: scale(1.2, 1.2);
    opacity: 0;
  }
}
</style>
