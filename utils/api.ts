import type {
  VehicleRegistrationState,
  SelectableVehiclesResponse,
  VehicleStatesResponse,
} from "~/swagger/Api";

const { apiHost } = useRuntimeConfig().public;

function callApi<T>(endpoint: string, params?: { [param: string]: string[] }) {
  return $fetch<T>(buildRequestUrl(endpoint, params));
}

export const api = {
  vehicles: {
    async retrieveSelectableVehicles(
      params: {
        tenant?: string[];
        registrationState?: VehicleRegistrationState[];
      } = {}
    ) {
      const res = await callApi<SelectableVehiclesResponse>(
        "gw/selectableVehicles",
        params
      );
      return res.data;
    },
    async retrieveVehicleStates(params: { tenant?: string[] }) {
      const res = await callApi<VehicleStatesResponse>(
        "gw/vehicleStates",
        params
      );
      return res.data;
    },
  },
};

function buildRequestUrl(
  endpoint: string,
  params?: { [param: string]: string[] }
) {
  let query = "";
  if (params !== undefined) {
    query =
      "?" +
      Object.keys(params)
        .map((param) =>
          params[param].map((value) => `${param}=${value}`).join("&")
        )
        .join("&");
  }
  return `${apiHost}/${endpoint}${query}`;
}
