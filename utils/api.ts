import type {
  VehicleRegistrationState,
  SelectableVehiclesResponse,
  VehicleStatesResponse,
  TripItinerariesResponse,
  Line,
  VehicleStateChange,
} from "~/swagger/Api";

const { apiHost } = useRuntimeConfig().public;

type HTTPMethod =
  | "GET"
  | "HEAD"
  | "PATCH"
  | "POST"
  | "PUT"
  | "DELETE"
  | "CONNECT"
  | "OPTIONS"
  | "TRACE";

function callApi<T>(
  endpoint: string,
  queryParams?: { [param: string]: string[] },
  method?: HTTPMethod,
  body?: Object
) {
  return $fetch<T>(buildRequestUrl(endpoint, queryParams), {
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
    method,
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
    // registers a new subscription on vehicle state changes
    // resolves subscription id, please use it to unsubscribe again
    async addVehicleStateChangeListener(
      params: {
        tenant?: string[];
        vehicleUid?: string[];
      },
      updateListener: (change: VehicleStateChange) => any
    ): Promise<string> {
      // register new subscription
      let { subscriptionId } = await fetch(
        apiHost + "/vehicleStates/updates/subscriptions",
        {
          headers: { "Content-Type": "application/json" },
          // because ofetch is extra and requires this header to be lower-cased,
          // and the browsers consider Content-Type and content-type different we will get CORS error if we use ofetch here
          method: "POST",
          body: JSON.stringify({ filterKeys: [params] }),
        }
      ).then((res) => res.json());
      if (!subscriptionId) {
        throw new Error("no subscriptionId was returned");
      }

      // FIXME: For now we have to use this sub id, becuase of API issues
      subscriptionId = "c93f2c7d-ce66-4935-9330-2a8c92ff134a";

      // add update listener
      const source = new EventSource(
        `${apiHost}/vehicleStates/updates?subscriptionId=${subscriptionId}`,
        {
          withCredentials: true,
        }
      );
      source.onmessage = function ({ data }: MessageEvent<string>) {
        updateListener(JSON.parse(data) as VehicleStateChange);
      };
      source.onerror = function (e: Event) {
        console.error("error in source for ", subscriptionId, e);
      };
      return subscriptionId;
    },
    removeVehicleStateChangeListener(subscriptionId: string) {
      return callApi(
        `/vehicleStates/updates/subscriptions/${subscriptionId}`,
        undefined,
        "DELETE"
      ).then((_) => {});
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
