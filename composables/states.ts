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

//
// Filter Sidebar State
//

function useLineFilterState() {
  const linesFilter = useState<string[]>("show-lines-filter", () => []);
  const isLinesFiltered = computed(() => linesFilter.value.length > 0);

  function clearLinesFilter() {
    linesFilter.value = [];
  }

  return {
    linesFilter,
    isLinesFiltered,
    clearLinesFilter,
  };
}

function useGeoFilterState() {
  const geoFilter = useState<{
    lngLat: mapboxgl.LngLat;
    radius: number;
  } | null>("geo-filter", () => null);

  const isGeoFiltered = computed(() => geoFilter.value !== null);

  const fallback = "Pin auf Karte ziehen";

  const lngLat = computed(() => geoFilter.value?.lngLat);

  const geoFilterStreetname = computedAsync(
    () => (lngLat.value ? useStreename(lngLat.value) : fallback),
    fallback
  );

  function clearGeoFilter() {
    geoFilter.value = null;
  }

  function setGeoFilter(
    lngLat: mapboxgl.LngLat,
    radius = geoFilter.value?.radius ?? 2
  ) {
    geoFilter.value = {
      lngLat,
      radius,
    };
  }

  function maybeSetRadius(radius: number) {
    if (!geoFilter.value) return;
    geoFilter.value = {
      ...geoFilter.value,
      radius,
    };
  }

  return {
    geoFilter,
    isGeoFiltered,
    geoFilterStreetname,
    setGeoFilter,
    maybeSetRadius,
    clearGeoFilter,
  };
}

function useTimeFilterState() {
  const MIN = -5;
  const MAX = 20;

  const isDefaultRange = useState("time-filter/is-default-range", () => true);

  const DEFAULT_RANGE: [number, number] = [MIN, MAX];

  const timeFilter = useState<[number, number]>(
    "time-filter/value",
    () => DEFAULT_RANGE
  );

  const timeFilterRange = useState("time-filter/range", () => DEFAULT_RANGE);

  const isTimeFiltered = computed(
    () =>
      !(
        timeFilter.value[0] === timeFilterRange.value[0] &&
        timeFilter.value[1] === timeFilterRange.value[1]
      )
  );

  function clearTimeFilter() {
    console.log("Clear...", timeFilterRange.value);
    timeFilter.value = timeFilterRange.value;
  }

  function setTimeFilterRange(range: [number, number], setValue = true) {
    if (isDefaultRange.value) {
      timeFilterRange.value = range;
      if (setValue) {
        timeFilter.value = range;
        isDefaultRange.value = false;
      }
    }
  }

  return {
    timeFilter,
    timeFilterRange: readonly(timeFilterRange),
    isTimeFiltered,
    clearTimeFilter,
    isDefaultRange: readonly(isDefaultRange),
    setTimeFilterRange,
  };
}

export function useFilterSidebar(initialState = true) {
  // Open

  const isFilterSidebarOpen = useLocalStorage(
    "filter-sidebar-open",
    initialState
  );

  function openFilterSidebar() {
    isFilterSidebarOpen.value = true;
  }

  function closeFilterSidebar() {
    isFilterSidebarOpen.value = false;
  }

  // Filters

  const lineFilterState = useLineFilterState();
  const geoFilterState = useGeoFilterState();
  const timeFilterState = useTimeFilterState();

  // Computed

  const isFiltered = computed(
    () =>
      lineFilterState.isLinesFiltered.value ||
      geoFilterState.isGeoFiltered.value ||
      timeFilterState.isTimeFiltered.value
  );

  function openIfFiltered() {
    if (isFiltered.value) {
      openFilterSidebar();
    }
  }

  const clear = () => {
    lineFilterState.clearLinesFilter();
    geoFilterState.clearGeoFilter();
    timeFilterState.clearTimeFilter();
  };

  return {
    isFilterSidebarOpen: readonly(isFilterSidebarOpen),
    ...lineFilterState,
    ...geoFilterState,
    ...timeFilterState,
    isFiltered,
    openFilterSidebar,
    openIfFiltered,
    closeFilterSidebar,
    clear,
  };
}
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
