import { UsePromiseResult, usePromise } from "vue-promised";
import { VehicleState, Line } from "~/swagger/Api";

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
  const allVehicles = useVehicleStates(tenants);
  const filterSidebar = useFilterSidebar();

  const filteredVehicles = computed(() => {
    if (!allVehicles.value) {
      return [];
    } else if (filterSidebar.onlyShowLinesFilter.value.length === 0) {
      return allVehicles.value.filter((vehicle) => vehicle.gpsPosition);
    } else {
      return allVehicles.value
        .filter((vehicle) => vehicle.gpsPosition)
        .filter((v) =>
          filterSidebar.onlyShowLinesFilter.value.find(
            (l) => v.operational?.line?.uid === l
          )
        );
    }
  });

  return filteredVehicles;
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
