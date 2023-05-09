export type InternalNotification = {
  id: number;
  message: string;
  date: Date;
  read?: boolean;
};

export const useNotifications = () =>
  useState<InternalNotification[]>("notifications", () => []);

export function useFilterSidebar(storageKey?: string, initialState = true) {
  let isFilterSidebarOpen = ref(initialState);

  if (storageKey) {
    isFilterSidebarOpen = useLocalStorage(
      "filter-sidebar-open-" + storageKey,
      initialState
    );
  }

  return {
    isFilterSidebarOpen: readonly(isFilterSidebarOpen),
    openFilterSidebar() {
      isFilterSidebarOpen.value = true;
    },
    closeFilterSidebar() {
      isFilterSidebarOpen.value = false;
    },
  };
}
