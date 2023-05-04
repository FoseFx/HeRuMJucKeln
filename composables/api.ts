import { Api } from "../swagger/Api";

const client = new Api({ baseUrl: "https://rwth.ivu.de" });

export function useAPI(): typeof client {
  return client;
}
