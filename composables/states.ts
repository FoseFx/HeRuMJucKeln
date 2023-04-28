export type InternalNotification = {
  id: number;
  message: string;
  date: Date;
  read?: boolean;
};

export const useNotifications = () =>
  useState<InternalNotification[]>("notifications", () => []);
