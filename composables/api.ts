import { UsePromiseResult, usePromise } from "vue-promised";
import { VehicleState, Line, VehicleStateChange } from "~/swagger/Api";

export function useVehicleStates(tenants?: string[], vehicleIds?: string[]) {
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

let vehicleStates: Ref<VehicleState[]> | null = null;
let vuidIxMap = new Map<string, number>(); // used to quickly apply updates

export function useVehicleStates$() {
  if (vehicleStates !== null) {
    return vehicleStates;
  }

  vehicleStates = ref<VehicleState[]>([]);
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
            vehicleStates!.value[i] = change.value;
          } else {
            vuidIxMap.set(vuid, vehicleStates!.value.length);
            vehicleStates!.value = [...vehicleStates!.value, change.value];
          }
        } else if (change.modifier === "CREATE") {
          vuidIxMap.set(vuid, vehicleStates!.value.length);
          vehicleStates!.value = [...vehicleStates!.value, change.value];
        } else if (change.modifier === "DELETE") {
          if (typeof i !== "undefined") {
            vuidIxMap.delete(vuid);
            vehicleStates!.value = vehicleStates!.value.filter(
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

  return vehicleStates;
}

export function useFilteredVehicleState$() {
  return filterVehicles(useVehicleStates$());
}

function filterVehicles(allVehicles: Ref<VehicleState[]>) {
  const filterSidebar = useFilterSidebar();

  return computed(() => {
    let result = allVehicles.value?.filter((v) => v.gpsPosition) ?? [];

    if (filterSidebar.onlyShowLinesFilter.value.length > 0) {
      result = result.filter((v) =>
        filterSidebar.onlyShowLinesFilter.value.find(
          (l) => v.operational?.line?.uid === l
        )
      );
    }

    if (filterSidebar.geolocationFilter.value) {
      result = result.filter((v) => {
        return (
          calcDist(filterSidebar.geolocationFilter.value!.lngLat, {
            lng: v.gpsPosition!.longitude,
            lat: v.gpsPosition!.latitude,
          }) <= filterSidebar.geolocationFilter.value!.radius
        );
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

export function useBlocks(params?: {
  vehicleUid?: string[];
  blockUid?: string[];
}) {
  console.log("Use block");
  return { ...usePromise(ref(api.blocks.retrieveCondensedBlocks(params))) };
}
