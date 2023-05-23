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

  isFilterSidebarOpen = useLocalStorage("filter-sidebar-open", initialState);

  return {
    isFilterSidebarOpen: readonly(isFilterSidebarOpen),
    onlyShowLinesFilter,
    openFilterSidebar() {
      isFilterSidebarOpen.value = true;
    },
    closeFilterSidebar() {
      isFilterSidebarOpen.value = false;
    },
    openIfFiltered() {
      if (onlyShowLinesFilter.value.length > 0) {
        this.openFilterSidebar();
      }
    },
  };
}
