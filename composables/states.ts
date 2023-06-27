export type InternalNotification = {
  id: number;
  message: string;
  date: Date;
  read?: boolean;
};

export type Filter = {
  id: number;
  name: string;
  schluessel: string;
  metrik: string;
  filterZeit: number[];
  filterLinie: number[];
  filterUnternehmen: string[];
};

export const useNotifications = () =>
  useState<InternalNotification[]>("notifications", () => []);

export const useAlleLinien = () =>
  useState<number[]>("alleLinien", () => [1, 2, 3, 4]);

export const useAlleUnternehmen = () =>
  useState<string[]>("alleUnternehmen", () => [
    "Aseag",
    "Bseag",
    "Cseag",
    "Dseag",
  ]);

export const useFilter = () =>
  useState<Filter[]>("filters", () => [
    {
      id: 1,
      name: "Verspätete Busse pro Unternehmen",
      schluessel: "Unternehmen",
      metrik: "Fahrten",
      filterZeit: [-3000, 6000],
      filterLinie: [1, 2, 3, 4],
      filterUnternehmen: ["Aseag", "Bseag", "Cseag", "Dseag"],
    },
    {
      id: 2,
      name: "Verspätete Busse pro Linie",
      schluessel: "Linie",
      metrik: "Fahrten",
      filterZeit: [-3000, 6000],
      filterLinie: [1, 2, 3, 4],
      filterUnternehmen: ["Aseag", "Bseag", "Cseag", "Dseag"],
    },
    {
      id: 3,
      name: "Lage Linie 1",
      schluessel: "Zustand",
      metrik: "Fahrten",
      filterZeit: [-3000, 6000],
      filterLinie: [1],
      filterUnternehmen: ["Aseag", "Bseag", "Cseag", "Dseag"],
    },
    {
      id: 4,
      name: "Lage Aseag",
      schluessel: "Zustand",
      metrik: "Fahrten",
      filterZeit: [-3000, 6000],
      filterLinie: [1, 2, 3, 4],
      filterUnternehmen: ["Aseag"],
    },
    {
      id: 5,
      name: "Verspätungsminuten pro Unternehmen",
      schluessel: "Unternehmen",
      metrik: "Durchschnittliche Zeit",
      filterZeit: [-3000, 6000],
      filterLinie: [1, 2, 3, 4],
      filterUnternehmen: ["Aseag", "Bseag", "Cseag", "Dseag"],
    },
  ]);
