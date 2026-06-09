import { atom } from "jotai";
import { atomEffect } from "jotai-effect";
import { atomWithStorage } from "jotai/utils";

export type Theme = "light" | "dark" | "system";
export type ColorScheme = "blue" | "green" | "purple" | "orange";

export const themeAtom = atomWithStorage<Theme>("theme", "system");
export const colorSchemeAtom = atomWithStorage<ColorScheme>(
  "colorScheme",
  "blue",
);
export const sidebarCollapsedAtom = atomWithStorage<boolean>(
  "sidebarCollapsed",
  false,
);

export const systemPrefersDarkAtom = atom(false);

export const themeSystemEffect = atomEffect((_, set) => {
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  set(systemPrefersDarkAtom, mql.matches);

  const handler = (e: MediaQueryListEvent) => {
    set(systemPrefersDarkAtom, e.matches);
  };
  mql.addEventListener("change", handler);
  return () => mql.removeEventListener("change", handler);
});

export const resolvedThemeAtom = atom((get) => {
  const theme = get(themeAtom);
  if (theme !== "system") return theme;
  return get(systemPrefersDarkAtom) ? "dark" : "light";
});

export const themeClassAtom = atom((get) => {
  const theme = get(resolvedThemeAtom);
  const color = get(colorSchemeAtom);
  return `theme-${theme} color-${color}`;
});
