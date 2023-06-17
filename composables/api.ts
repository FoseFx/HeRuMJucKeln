import { UsePromiseResult, usePromise } from "vue-promised";
import {
  VehicleState,
  Line,
  TripItineraryLink,
  TripItinerary,
  VehicleStateChange,
} from "~/swagger/Api";

// TODO: remove this cached function after merging !39
let allVehicleStates: Ref<VehicleState[]> | null = null;
export function useVehicleStatesAll() {
  if (allVehicleStates !== null) {
    return allVehicleStates;
  }

  allVehicleStates = ref<VehicleState[]>([]);

  const request = async () => {
    const tenants = await api.tenants.retrieveTenants();
    const states = await api.vehicles.retrieveVehicleStates({
      tenant: tenants,
    });
    if (states !== undefined) {
      allVehicleStates!.value = states;
    }
  };

  request();

  return allVehicleStates;
}

export function useVehicleStates(tenants?: string[], vehicleIds?: string[]) {
  if (
    (!tenants || tenants.length === 0) &&
    (!vehicleIds || vehicleIds.length === 0)
  ) {
    return useVehicleStatesAll();
  }

  const vehicleStates = ref<VehicleState[]>([]);
  const request = async () => {
    if (!tenants) {
      tenants = await api.tenants.retrieveTenants();
    }
    const states = await api.vehicles.retrieveVehicleStates({
      tenant: tenants,
      vehicleUid: vehicleIds,
    });
    if (states !== undefined) {
      vehicleStates.value = states;
    }
  };

  request();

  return vehicleStates;
}

export function useFilteredVehicleState(tenants?: string[]) {
  return filterVehicles(useVehicleStates(tenants));
}

let vuidIxMap = new Map<string, number>(); // used to quickly apply updates

export function useVehicleStates$() {
  const vehicleStates = useState<null | VehicleState[]>(
    "vehicleState",
    () => null
  );
  if (vehicleStates.value === null) {
    vehicleStates.value = [];
    vuidIxMap = new Map();

    let subscriptionId: string | null;

    (async () => {
      const tenants = await api.tenants.retrieveTenants();
      const params = { tenant: tenants };

      const initial = await api.vehicles.retrieveVehicleStates(params);
      if (initial) {
        vehicleStates.value = initial;

        for (let i = 0; i < initial.length; i++) {
          const vuid = initial[i].identification.uid;
          vuidIxMap.set(vuid, i);
        }
      }

      subscriptionId = await api.vehicles.addVehicleStateChangeListener(
        params,
        (change: VehicleStateChange) => {
          const vuid = change.value.identification.uid;
          const i = vuidIxMap.get(vuid);

          if (change.modifier === "UPDATE") {
            if (typeof i !== "undefined") {
              vehicleStates.value![i] = change.value;
            } else {
              vuidIxMap.set(vuid, vehicleStates.value!.length);
              vehicleStates!.value = [...vehicleStates.value!, change.value];
            }
          } else if (change.modifier === "CREATE") {
            vuidIxMap.set(vuid, vehicleStates.value!.length);
            vehicleStates!.value = [...vehicleStates.value!, change.value];
          } else if (change.modifier === "DELETE") {
            if (typeof i !== "undefined") {
              vuidIxMap.delete(vuid);
              vehicleStates!.value = vehicleStates.value!.filter(
                (_, j) => j !== i
              );
            }
          }
        }
      );
      return subscriptionId;
    })();

    // Removed because of CORS errors for now:
    // // we have to register the lifecycle hook synchronously
    // // onBeforeUnmount(async () => {
    // //   await Promise.allSettled([promise]); // we maybe unmounted too early
    // //   if (subscriptionId !== null) {
    // //     api.vehicles.removeVehicleStateChangeListener(subscriptionId);
    // //   }
    // // });
  }

  return vehicleStates as Ref<VehicleState[]>;
}

export function useFilteredVehicleState$() {
  return filterVehicles(useVehicleStates$());
}

function filterVehicles(allVehicles: Ref<VehicleState[]>) {
  const filterState = useFilterSidebar();

  return computed(() => {
    let result = allVehicles.value?.filter((v) => v.gpsPosition) ?? [];

    if (filterState.isLinesFiltered.value) {
      result = result.filter((v) =>
        filterState.linesFilter.value.find(
          (l) => v.operational?.line?.uid === l
        )
      );
    }

    if (filterState.isGeoFiltered.value) {
      result = result.filter((vehicle) => {
        const { lngLat: filterLocation, radius } = filterState.geoFilter.value!;
        const vehicleLocation = lngLatOfVehicle(vehicle);
        if (!vehicleLocation) return false;
        return calcDist(filterLocation, vehicleLocation) <= radius;
      });
    }

    if (filterState.isTimeFiltered.value) {
      result = result.filter((vehicle) => {
        const [lower, upper] = filterState.timeFilter.value!;
        const val = vehicle.deviation?.value;
        if (typeof val !== "number") return true;
        return lower <= val && val <= upper;
      });
    }

    return result;
  });
}

let lines: UsePromiseResult<Line[]> | null = null; // global state, don't re-fetch lines every time
export function useLines() {
  if (lines === null || !lines.isRejected) {
    const promiseRef = ref(api.custom.retrieveLines());
    lines = usePromise(promiseRef);
  }

  return { ...lines };
}

export function useItineraries(params?: {
  vehicleUid?: string[];
  tripUid?: string[];
  blockUid?: string[];
}) {
  return { ...usePromise(ref(api.trips.retrieveTripItineraries(params))) };
}

export function useItineraries$(
  vehicleUid: string
): Ref<TripItinerary | null | undefined> {
  const all = useItinerariesForAllVehicles();
  return computed(() => all.value.get(vehicleUid));
}

export function useItinerariesForLotsOfVehicles(vehicleUids: string[]) {
  // simulated data has roughly 360 vehicles
  // at this CHUNK_SIZE this requires 5 requests
  // keep in mind, that request sizes below or equal 6 will be parallelizable "for free"
  // as HTTP 1 allows for only 6 parallel connections
  const CHUNK_SIZE = 70;

  const promises = [];

  for (let i = 0; i < vehicleUids.length; i += CHUNK_SIZE) {
    const chunk = vehicleUids.slice(i, i + CHUNK_SIZE);
    promises.push(api.trips.retrieveTripItineraries({ vehicleUid: chunk })); // we don't await them here!
  }

  const promise = Promise.all(promises).then(
    (res) => res.reduce((arr, current) => arr!.concat(current!), [])!
  );

  return { ...usePromise(ref(promise)) };
}

export function useNeighbouringVehiclesForSingleVehicle(
  targetVehicle: VehicleState,
  withTargetItineraries?: Ref<TripItinerary[] | null | undefined>
): Ref<{ prev?: VehicleState; next?: VehicleState }> {
  const ERROR_VALUE = { prev: undefined, next: undefined };

  const targetVehicleId = targetVehicle.identification.uid;
  const targetLineId = targetVehicle.operational?.line?.uid;

  if (!targetLineId) return ref(ERROR_VALUE);

  const targetItineraries =
    withTargetItineraries ??
    useItineraries({
      vehicleUid: [targetVehicleId],
    }).data;

  const targetLinks = computed(() => targetItineraries.value?.[0]?.links || []);

  const allVehicles = refThrottled(useVehicleStates$(), 60_000);

  const sameLineVehicles = computedWithControl([allVehicles], () =>
    allVehicles.value.filter((v) => v.operational?.line?.uid === targetLineId)
  );

  const sameDirectionVehicles = computedWithControl([sameLineVehicles], () => {
    return sameLineVehicles.value
      .map((v) => ({
        index: candicateLinkIndexInTargetLine(v, targetLinks.value),
        vehicle: v,
        isTarget: v.identification.uid === targetVehicleId,
      }))
      .filter(({ index }) => index !== -1);
  });

  const sorted = computedWithControl([sameDirectionVehicles], () =>
    [...sameDirectionVehicles.value].sort((a, b) => {
      const indexDiff = a.index - b.index;
      if (indexDiff !== 0) return indexDiff;
      // fine-sort within link
      const aDist = a.vehicle.positionState?.distance || 0;
      const bDist = b.vehicle.positionState?.distance || 0;
      const distDiff = aDist - bDist;
      if (distDiff !== 0) return distDiff;
      // both vehicles are at the same position, move target to the right
      return a.isTarget ? 1 : b.isTarget ? -1 : 0;
    })
  );

  const targetIx = computedWithControl([sorted], () =>
    sorted.value.findIndex((v) => v.isTarget)
  );

  return computedWithControl([targetIx], () => ({
    prev: sorted.value[targetIx.value - 1]?.vehicle,
    next: sorted.value[targetIx.value + 1]?.vehicle,
  }));
}

export function useNeighbouringVehiclesForAllVehicles() {
  const itineraryMap = useItinerariesForAllVehicles();
  const states = refThrottled(useVehicleStates$(), 5 * 60_000);

  return computedWithControl([states, itineraryMap] as any, () => {
    return states.value.map((vehicle) => {
      const vuid = vehicle.identification.uid;
      const withItineraries = computedWithControl([itineraryMap], () => [
        itineraryMap.value.get(vuid)!,
      ]);

      return {
        vuid,
        ...useNeighbouringVehiclesForSingleVehicle(vehicle, withItineraries)
          .value,
      };
    });
  });
}

type VehicleUid = string;
type VehicleItineraryMap = Map<VehicleUid, TripItinerary>;
let allItineraries: Ref<VehicleItineraryMap> | null = null;

export function useItinerariesForAllVehicles(): Ref<VehicleItineraryMap> {
  if (allItineraries !== null) {
    return allItineraries;
  }

  const allVehicles = refThrottled(useVehicleStates$(), 5 * 60_000);

  // external vehicles dont have itineraries, so we filter them out
  const vehicles = computedWithControl([allVehicles], () =>
    allVehicles.value.filter((v) => v.registrationState !== "EXTERNAL")
  );

  const vehicleUids = computedWithControl([vehicles], () =>
    vehicles.value.map((v) => v.identification.uid)
  );

  // CAUTION: this is makes an expensive request everytime the vehicles change
  const itinerariesRef = computedWithControl([vehicleUids], () =>
    vehicles.value.length === 0
      ? null
      : useItinerariesForLotsOfVehicles(vehicleUids.value)
  );
  const itinerariesRaw = computed(() => itinerariesRef.value?.data.value ?? []);

  const isRejected = computed(() =>
    !itinerariesRef.value ? false : itinerariesRef.value.isRejected.value
  );
  const isPending = computed(() =>
    !itinerariesRef.value ? true : itinerariesRef.value.isPending.value
  );

  allItineraries = computedWithControl([itinerariesRaw], () => {
    const itineraries = itinerariesRaw.value;
    const map: VehicleItineraryMap = new Map();

    if (itineraries.length === 0) {
      return map;
    }

    for (const vehicle of vehicles.value) {
      const itinerary = itineraries.find(
        (i) => i.route?.uid === vehicle.operational?.route?.uid
      );

      if (!itinerary) {
        console.warn(vehicle.identification.uid + " has no itinerary", vehicle);
        continue;
      }

      map.set(vehicle.identification.uid, itinerary);
    }

    return map;
  });

  const stop = watch([isPending, isRejected], ([pending, rejected]) => {
    if (rejected) {
      allItineraries = null; // throw away ref on error, so we can retry later
    }
    if (!pending) {
      stop(); // prevent memory leaks
    }
  });

  return allItineraries;
}

function candicateLinkIndexInTargetLine(
  candidate: VehicleState,
  targetLinks: TripItineraryLink[]
) {
  if (targetLinks.length === 0) return -1;

  const cFrom = candidate.positionState?.fromNetPoint?.netPoint?.uid;
  const cTo = candidate.positionState?.toNetPoint?.netPoint?.uid;
  if (!cFrom || !cTo) return -1;
  if (cFrom === cTo) return -1; // not driving?

  for (let i = 0; i < targetLinks.length; i++) {
    const itin = targetLinks[i];

    if (
      itin.start?.identification?.netPoint?.uid === cFrom &&
      itin.end?.identification?.netPoint?.uid === cTo
    ) {
      return i;
    }
  }

  return -1;
}

export function useBlocks(params?: {
  vehicleUid?: string[];
  blockUid?: string[];
}) {
  console.log("Use block");
  return { ...usePromise(ref(api.blocks.retrieveCondensedBlocks(params))) };
}

export async function useStreename(coords: {
  lng: number;
  lat: number;
}): Promise<string> {
  const revCoding = await api.mapbox.reverseGeocoding(coords);
  if (!revCoding.features[0]) {
    return "";
  }
  return revCoding.features[0].text_de;
}
