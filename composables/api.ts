import type {
  VehicleStatesResponse,
  VehicleRegistrationState,
} from "~/swagger/Api";

export function useAPI() {
  const { apiHost } = useRuntimeConfig().public;

  return {
    vehicles: {
      retrieveSelectableVehicles(
        params: {
          tenant?: string[];
          registrationState?: VehicleRegistrationState[];
        } = {}
      ) {
        const url = new URL(apiHost + "/gw/selectableVehicles");
        const queryParams = new URLSearchParams();
        appendArrToQueryParams("tenant", queryParams, params.tenant);
        appendArrToQueryParams(
          "registrationState",
          queryParams,
          params.registrationState
        );
        url.search = queryParams.toString();
        return $fetch<VehicleStatesResponse>(url.toString()).then(
          (r) => r.data
        );
      },
    },
  };
}

function appendArrToQueryParams(
  key: string,
  queryParams: URLSearchParams,
  arr?: Object[]
) {
  if (arr) {
    for (const el of arr) {
      queryParams.append(key, el.toString());
    }
  }
}
