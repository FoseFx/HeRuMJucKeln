import { UsePromiseResult, usePromise } from "vue-promised";
import { VehicleState, Line } from "~/swagger/Api";

export function useVehicleStates(tenants?: string[]) {
  const vehicleStates = ref<VehicleState[]>([]);
  const request = async () => {
    if (!tenants) {
      tenants = await api.tenants.retrieveTenants();
    }
    const states = await api.vehicles.retrieveVehicleStates({
      tenant: tenants,
    });
    if (states !== undefined) {
      vehicleStates.value = states;
    }
  };

  request();

  return vehicleStates;
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
