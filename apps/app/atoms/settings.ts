import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export interface AppSettings {
  notifications: {
    email: boolean;
    push: boolean;
    sound: boolean;
  };
  privacy: {
    shareAnalytics: boolean;
    showOnlineStatus: boolean;
  };
  locale: string;
  timezone: string;
}

const defaultSettings: AppSettings = {
  notifications: {
    email: true,
    push: true,
    sound: false,
  },
  privacy: {
    shareAnalytics: false,
    showOnlineStatus: true,
  },
  locale: "en-US",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
};

export const settingsAtom = atomWithStorage<AppSettings>(
  "appSettings",
  defaultSettings,
);

export const notificationsEnabledAtom = atom((get) => {
  const settings = get(settingsAtom);
  return settings.notifications.email || settings.notifications.push;
});

export const localeAtom = atom(
  (get) => get(settingsAtom).locale,
  (get, set, locale: string) => {
    const settings = get(settingsAtom);
    set(settingsAtom, { ...settings, locale });
  },
);
