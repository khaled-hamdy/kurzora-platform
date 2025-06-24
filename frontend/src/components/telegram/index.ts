// src/components/telegram/index.ts
// Export all Telegram-related components
export { default as TelegramConnection } from "./TelegramConnection";
export { default as TelegramAlertBanner } from "./TelegramAlertBanner";

// Export hook
export { useUserAlertSettings } from "../../hooks/useUserAlertSettings";

// Export types
export type {
  UserAlertSettings,
  UserProfile,
} from "../../hooks/useUserAlertSettings";
