export type InternalNotification = {
  id: number;
  message: string;
  date: Date;
  read?: boolean;
};

export const useNotifications = () =>
  useState<InternalNotification[]>("notifications", () => []);

export type FilterSidebarState = {
  isFilterSidebarOpen: Ref<boolean>;
  onlyShowLinesFilter: Ref<string[] | null>;
  openFilterSidebar: () => void;
  closeFilterSidebar: () => void;
};

export function useFilterSidebar(
  storageKey?: string,
  initialState = true
): FilterSidebarState {
  let isFilterSidebarOpen = ref(initialState);

  if (storageKey) {
    isFilterSidebarOpen = useLocalStorage(
      "filter-sidebar-open-" + storageKey,
      initialState
    );
  }

  const onlyShowLinesFilter = ref(null);

  return {
    isFilterSidebarOpen: readonly(isFilterSidebarOpen),
    onlyShowLinesFilter,
    openFilterSidebar() {
      isFilterSidebarOpen.value = true;
    },
    closeFilterSidebar() {
      isFilterSidebarOpen.value = false;
    },
  };
}
