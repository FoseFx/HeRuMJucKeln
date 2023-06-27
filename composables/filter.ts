export interface Filter<T, M = unknown> {
  clear: () => void;
  isFiltered: ComputedRef<boolean>;
  model: Ref<T>;
  metadata?: Ref<M>;
}

export function useLineFilterState(): Filter<string[], { streetname: string }> {
  const linesFilter = useState<string[]>("show-lines-filter", () => []);
  const isLinesFiltered = computed(() => linesFilter.value.length > 0);

  function clearLinesFilter() {
    linesFilter.value = [];
  }

  return {
    model: linesFilter,
    isFiltered: isLinesFiltered,
    clear: clearLinesFilter,
  };
}

export function useGeoFilterState(): Filter<
  {
    lngLat: mapboxgl.LngLat;
    radius: number;
  } | null,
  { streetname: string }
> {
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

  const metadata = computed(() => ({ streetname: geoFilterStreetname.value }));

  function clearGeoFilter() {
    geoFilter.value = null;
  }

  return {
    model: geoFilter,
    isFiltered: isGeoFiltered,
    metadata,
    // setGeoFilter,
    // maybeSetRadius,
    clear: clearGeoFilter,
  };
}

const MIN = -5;
const MAX = 20;
export const DEFAULT_RANGE: [number, number] = [MIN, MAX];

export function useTimeFilterState(): Filter<
  [number, number],
  {
    timeFilterRange: readonly [number, number];
    setTimeFilterRange: (range: [number, number], setValue?: boolean) => void;
    isDefaultRange: boolean;
  }
> {
  const timeFilter = useState<[number, number]>(
    "time-filter/value",
    () => DEFAULT_RANGE
  );
  const timeFilterRange = useState("time-filter/range", () => DEFAULT_RANGE);

  const isDefaultRange = useState("time-filter/is-default-range", () => true);

  const isTimeFiltered = computed(
    () =>
      !(
        timeFilter.value[0] === timeFilterRange.value[0] &&
        timeFilter.value[1] === timeFilterRange.value[1]
      )
  );

  function clearTimeFilter() {
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
    model: timeFilter,
    isFiltered: isTimeFiltered,
    clear: clearTimeFilter,
    metadata: computed(() => ({
      timeFilterRange: readonly(timeFilterRange.value),
      setTimeFilterRange,
      isDefaultRange: isDefaultRange.value,
    })),
  };
}

export function useStatusFilterState(): Filter<boolean> {
  // true -> do not show externals
  const statusFilter = useState("status-filter", () => true);

  return {
    model: statusFilter,
    isFiltered: computed(() => statusFilter.value === false),
    clear: () => (statusFilter.value = true),
  };
}

export function useTenantFilterState(): Filter<string[]> {
  const tenantFilter = useState<string[]>("tenant-filter", () => []);

  return {
    model: tenantFilter,
    isFiltered: computed(() => tenantFilter.value.length > 0),
    clear: () => (tenantFilter.value = []),
  };
}

export function useWorkingSetFilterState(): Filter<(string | undefined)[]> {
  const workingSetFilter = useState<string[]>("working-set-filter", () => []);

  return {
    model: workingSetFilter,
    isFiltered: computed(() => workingSetFilter.value.length > 0),
    clear: () => (workingSetFilter.value = []),
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
  const statusFilterState = useStatusFilterState();

  // Computed

  const isFiltered = computed(
    () =>
      lineFilterState.isFiltered.value ||
      geoFilterState.isFiltered.value ||
      timeFilterState.isFiltered.value ||
      statusFilterState.isFiltered.value
  );

  function openIfFiltered() {
    if (isFiltered.value) {
      openFilterSidebar();
    }
  }

  const clear = () => {
    lineFilterState.clear();
    geoFilterState.clear();
    timeFilterState.clear();
    statusFilterState.clear();
  };

  return {
    isFilterSidebarOpen: readonly(isFilterSidebarOpen),
    isFiltered,
    openFilterSidebar,
    openIfFiltered,
    closeFilterSidebar,
    clear,
  };
}
