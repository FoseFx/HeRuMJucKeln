import { VehicleState } from "~/swagger/Api";

export function useVehicleStates(tenant: string[]) {
  const vehicleStates = ref<VehicleState[]>([]);
  const request = async () => {
    const states = await api.vehicles.retrieveVehicleStates({ tenant });
    if (states !== undefined) {
      vehicleStates.value = states;
    }
  };

  request();

  return vehicleStates;
}
