import { apiClient } from "./client";
import type { ShopSettings } from "@/types";

export const settingsApi = {
  getSettings: () =>
    apiClient.get<ShopSettings>("/settings/", { cache: "no-store" }),
};
