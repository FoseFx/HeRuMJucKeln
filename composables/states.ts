export type InternalNotification = {
  id: number;
  message: string;
  date: Date;
  read?: boolean;
};

export const useNotifications = () =>
  useState<InternalNotification[]>("notifications", () => []);

export function useFilterSidebar(initialState = true) {
  let isFilterSidebarOpen = ref(initialState);

  const onlyShowLinesFilter = useState<string[]>("show-lines-filter", () => []);

  const geolocationFilter = useState<{
    lngLat: mapboxgl.LngLat;
    radius: number;
  } | null>("geolocation-filter", () => null);

  isFilterSidebarOpen = useLocalStorage("filter-sidebar-open", initialState);

  const isLinesFiltered = computed(() => onlyShowLinesFilter.value.length > 0);

  function clearLinesFilter() {
    onlyShowLinesFilter.value = [];
  }

  const isGeolocationFiltered = computed(
    () => geolocationFilter.value !== null
  );

  function clearGeolocationFilter() {
    geolocationFilter.value = null;
  }

  return {
    isFilterSidebarOpen: readonly(isFilterSidebarOpen),
    onlyShowLinesFilter,
    geolocationFilter,
    isLinesFiltered,
    isGeolocationFiltered,
    isFiltered: computed(() => isLinesFiltered || isGeolocationFiltered),
    openFilterSidebar() {
      isFilterSidebarOpen.value = true;
    },
    openIfFiltered() {
      if (onlyShowLinesFilter.value.length > 0 || geolocationFilter.value) {
        this.openFilterSidebar();
      }
    },
    closeFilterSidebar() {
      isFilterSidebarOpen.value = false;
    },
    clearLinesFilter,
    clearGeolocationFilter,
    clear() {
      clearLinesFilter();
      clearGeolocationFilter();
    },
  };
}
