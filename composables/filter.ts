import _ from "lodash";

export interface BaseFilter<T> {
  clear: () => void;
  isFiltered: ComputedRef<boolean>;
  model: Ref<T>;
}

export interface FilterWithMetadata<T, M> extends BaseFilter<T> {
  metadata: Ref<M>;
}

export type Filter<T, M = unknown> = BaseFilter<T> | FilterWithMetadata<T, M>;

export function useLineFilterState(): BaseFilter<string[]> {
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

export function useGeoFilterState(): FilterWithMetadata<
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

  const geoFilterStreetname = computedAsync(async function () {
    if (!lngLat.value) {
      return fallback;
    }
    return await useStreename(lngLat.value);
  }, fallback);

  const metadata = computedWithControl([geoFilterStreetname], () => ({
    streetname: geoFilterStreetname.value,
  }));

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

export function useTimeFilterState(): FilterWithMetadata<
  [number, number],
  {
    timeFilterRange: readonly [number, number];
    setTimeFilterRange: (range: [number, number], setValue?: boolean) => void;
  }
> {
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
    timeFilter.value = timeFilterRange.value;
  }

  function setTimeFilterRange(range: [number, number], setValue = true) {
    if (
      _.isEqual(timeFilterRange.value, DEFAULT_RANGE) ||
      (isTimeFiltered.value && setValue)
    ) {
      const newRange = timeFilterRange.value;
      newRange[0] = Math.min(newRange[0], range[0]);
      newRange[1] = Math.max(newRange[1], range[1]);
      timeFilterRange.value = newRange;
      if (setValue) {
        timeFilter.value = newRange;
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
    })),
  };
}

export function useStatusFilterState(): BaseFilter<boolean> {
  // true -> do not show externals
  const statusFilter = useState("status-filter", () => true);

  return {
    model: statusFilter,
    isFiltered: computed(() => statusFilter.value === false),
    clear: () => (statusFilter.value = true),
  };
}

export function useTenantFilterState(): BaseFilter<string[]> {
  const tenantFilter = useState<string[]>("tenant-filter", () => []);

  return {
    model: tenantFilter,
    isFiltered: computed(() => tenantFilter.value.length > 0),
    clear: () => (tenantFilter.value = []),
  };
}

export function useWorkingSetFilterState(): BaseFilter<(string | undefined)[]> {
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
  const tenantFilterState = useTenantFilterState();
  const workingSetFilterState = useWorkingSetFilterState();

  // Computed

  const isFiltered = computed(
    () =>
      lineFilterState.isFiltered.value ||
      geoFilterState.isFiltered.value ||
      timeFilterState.isFiltered.value ||
      statusFilterState.isFiltered.value ||
      tenantFilterState.isFiltered.value ||
      workingSetFilterState.isFiltered.value
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
    tenantFilterState.clear();
    workingSetFilterState.clear();
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
