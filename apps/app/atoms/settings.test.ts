import { createStore } from "jotai";
import { describe, expect, it } from "vitest";
import { localeAtom, notificationsEnabledAtom, settingsAtom } from "./settings";
import type { AppSettings } from "./settings";

describe("notificationsEnabledAtom", () => {
  it("returns true when email is enabled", () => {
    const store = createStore();
    store.set(settingsAtom, {
      notifications: { email: true, push: false, sound: false },
      privacy: { shareAnalytics: false, showOnlineStatus: true },
      locale: "en-US",
      timezone: "UTC",
    });
    expect(store.get(notificationsEnabledAtom)).toBe(true);
  });

  it("returns true when push is enabled", () => {
    const store = createStore();
    store.set(settingsAtom, {
      notifications: { email: false, push: true, sound: false },
      privacy: { shareAnalytics: false, showOnlineStatus: true },
      locale: "en-US",
      timezone: "UTC",
    });
    expect(store.get(notificationsEnabledAtom)).toBe(true);
  });

  it("returns false when both are disabled", () => {
    const store = createStore();
    store.set(settingsAtom, {
      notifications: { email: false, push: false, sound: false },
      privacy: { shareAnalytics: false, showOnlineStatus: true },
      locale: "en-US",
      timezone: "UTC",
    });
    expect(store.get(notificationsEnabledAtom)).toBe(false);
  });
});

describe("localeAtom", () => {
  it("returns default locale", () => {
    const store = createStore();
    expect(store.get(localeAtom)).toBe("en-US");
  });

  it("updates locale via write", () => {
    const store = createStore();
    store.set(localeAtom, "fr-FR");
    expect(store.get(localeAtom)).toBe("fr-FR");
  });

  it("preserves other settings when updating locale", () => {
    const store = createStore();
    const initialSettings = store.get(settingsAtom) as AppSettings;
    store.set(localeAtom, "de-DE");
    const updated = store.get(settingsAtom) as AppSettings;
    expect(updated.locale).toBe("de-DE");
    expect(updated.notifications).toEqual(initialSettings.notifications);
    expect(updated.privacy).toEqual(initialSettings.privacy);
    expect(updated.timezone).toEqual(initialSettings.timezone);
  });
});
