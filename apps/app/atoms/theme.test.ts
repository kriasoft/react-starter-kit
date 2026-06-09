import { createStore } from "jotai";
import { describe, expect, it } from "vitest";
import {
  colorSchemeAtom,
  resolvedThemeAtom,
  sidebarCollapsedAtom,
  systemPrefersDarkAtom,
  themeClassAtom,
  themeAtom,
} from "./theme";

describe("resolvedThemeAtom", () => {
  it("returns explicit light theme", () => {
    const store = createStore();
    store.set(themeAtom, "light");
    expect(store.get(resolvedThemeAtom)).toBe("light");
  });

  it("returns explicit dark theme", () => {
    const store = createStore();
    store.set(themeAtom, "dark");
    expect(store.get(resolvedThemeAtom)).toBe("dark");
  });

  it("returns dark when system prefers dark", () => {
    const store = createStore();
    store.set(themeAtom, "system");
    store.set(systemPrefersDarkAtom, true);
    expect(store.get(resolvedThemeAtom)).toBe("dark");
  });

  it("returns light when system prefers light", () => {
    const store = createStore();
    store.set(themeAtom, "system");
    store.set(systemPrefersDarkAtom, false);
    expect(store.get(resolvedThemeAtom)).toBe("light");
  });
});

describe("themeClassAtom", () => {
  it("returns correct class string", () => {
    const store = createStore();
    store.set(themeAtom, "dark");
    store.set(colorSchemeAtom, "blue");
    expect(store.get(themeClassAtom)).toBe("theme-dark color-blue");
  });
});

describe("sidebarCollapsedAtom", () => {
  it("defaults to false", () => {
    const store = createStore();
    expect(store.get(sidebarCollapsedAtom)).toBe(false);
  });
});
