import type {
  VehicleRegistrationState,
  SelectableVehiclesResponse,
  VehicleStatesResponse,
  TripItinerariesResponse,
  Line,
} from "~/swagger/Api";

const { apiHost } = useRuntimeConfig().public;

function callApi<T>(endpoint: string, params?: { [param: string]: string[] }) {
  return $fetch<T>(buildRequestUrl(endpoint, params), {
    credentials: "include",
  });
}

export const api = {
  tenants: {
    // the retrieveTenants endpoints seems to have issues
    retrieveTenants() {
      return Promise.resolve(["IVU", "STO"]);
    },
  },
  trips: {
    retrieveTripItineraries(
      params: {
        vehicleUid?: string[];
        tripUid?: string[];
        blockUid?: string[];
      } = {}
    ) {
      return callApi<TripItinerariesResponse>(
        "/gw/tripItineraries",
        params
      ).then((res) => res.data);
    },
  },
  vehicles: {
    async retrieveSelectableVehicles(
      params: {
        tenant?: string[];
        registrationState?: VehicleRegistrationState[];
      } = {}
    ) {
      const res = await callApi<SelectableVehiclesResponse>(
        "/gw/selectableVehicles",
        params
      );
      return res.data;
    },
    async retrieveVehicleStates(params: {
      tenant?: string[];
      vehicleUid?: string[];
    }) {
      const res = await callApi<VehicleStatesResponse>(
        "/gw/vehicleStates",
        params
      );
      return res.data;
    },
  },
  custom: {
    // we aggregate the lines from all vehicles,
    // assuming that all lines are in use (i.e. there is a vehicle on it)
    // at the time of fetching
    async retrieveLines(): Promise<Line[]> {
      // fetch all vehicles for all tenants
      const vehicles = await api.vehicles.retrieveSelectableVehicles({
        tenant: await api.tenants.retrieveTenants(),
      });
      if (!vehicles) {
        throw new Error("vehicles is undefined");
      }

      // now aggregate all lines

      const linesMap = new Map<string, string>(); // id -> name

      for (const vehicle of vehicles) {
        const id = vehicle.operational?.line?.uid;
        const text = vehicle.operational?.line?.displayText;
        if (!id || !text) {
          console.debug("uid or displayText undefined", vehicle, vehicles);
          continue;
        }
        linesMap.set(id, text);
      }

      // finally reshape into an array
      return Array.from(linesMap)
        .map(([id, name]) => ({ id, name }))
        .sort((a, b) => (a.name > b.name ? 1 : a.name === b.name ? 0 : -1));
    },
  },
};

function buildRequestUrl(
  path: string,
  queryParams: { [param: string]: string[] } = {}
) {
  const query = new URLSearchParams();
  for (const [param, values] of Object.entries(queryParams)) {
    if (!values) continue;
    for (const value of values) {
      query.append(param, value);
    }
  }
  const url = new URL(apiHost + path);
  url.search = query.toString();
  return url.toString();
}
