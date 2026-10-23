import type { ShopSettings } from "@/types";
import { DEFAULT_SETTINGS } from "./defaults";

/**
 * Public Teyva API has no /settings endpoint.
 * Override via NEXT_PUBLIC_* env where needed; otherwise use defaults.
 */
export const settingsApi = {
  getSettings: async (): Promise<ShopSettings> => {
    return {
      ...DEFAULT_SETTINGS,
      shop_name: process.env.NEXT_PUBLIC_SHOP_NAME ?? DEFAULT_SETTINGS.shop_name,
      whatsapp_number:
        process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? DEFAULT_SETTINGS.whatsapp_number,
    };
  },
};
