import { act, fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "jotai";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import indexHtml from "../index.html?raw";
import { ThemeSync, useTheme } from "./theme";

const root = document.documentElement;

const mediaListeners = new Set<(event: MediaQueryListEvent) => void>();
let systemPrefersDark = false;

function setSystemPrefersDark(matches: boolean) {
  systemPrefersDark = matches;
  act(() => {
    mediaListeners.forEach((listener) =>
      listener({ matches } as MediaQueryListEvent),
    );
  });
}

function ThemeProbe() {
  const { theme, preference, setPreference } = useTheme();

  return (
    <>
      <span data-testid="theme">{theme}</span>
      <span data-testid="preference">{preference}</span>
      <button type="button" onClick={() => setPreference("dark")}>
        dark
      </button>
      <button type="button" onClick={() => setPreference("system")}>
        system
      </button>
    </>
  );
}

/** A fresh Jotai store per render, so atoms re-read storage instead of reusing state. */
function renderTheme() {
  return render(
    <Provider>
      <ThemeSync />
      <ThemeProbe />
    </Provider>,
  );
}

function click(name: string) {
  fireEvent.click(screen.getByRole("button", { name }));
}

function syncFromOtherTab(value: string) {
  fireEvent(
    window,
    new StorageEvent("storage", {
      key: "theme",
      newValue: JSON.stringify(value),
      storageArea: localStorage,
    }),
  );
}

describe("theme", () => {
  beforeEach(() => {
    mediaListeners.clear();
    systemPrefersDark = false;
    localStorage.clear();
    root.classList.remove("dark");
    root.style.colorScheme = "";

    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({
        get matches() {
          return systemPrefersDark;
        },
        addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => {
          mediaListeners.add(cb);
        },
        removeEventListener: (
          _: string,
          cb: (e: MediaQueryListEvent) => void,
        ) => {
          mediaListeners.delete(cb);
        },
      })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("follows the OS setting by default", () => {
    systemPrefersDark = true;
    renderTheme();

    expect(screen.getByTestId("preference")).toHaveTextContent("system");
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    // The default is never written back.
    expect(localStorage.getItem("theme")).toBeNull();
  });

  it("does not undo what the bootstrap script already applied", () => {
    // A system-dark user, with the class already on <html> as index.html leaves
    // it. Resolving the OS setting a frame late here would repaint to light.
    systemPrefersDark = true;
    root.classList.add("dark");

    const applied: (boolean | undefined)[] = [];
    const toggle = root.classList.toggle.bind(root.classList);
    vi.spyOn(root.classList, "toggle").mockImplementation((token, force) => {
      applied.push(force);
      return toggle(token, force);
    });

    renderTheme();

    expect(applied).toEqual([true]);
  });

  it("restores a persisted preference over the OS setting", () => {
    localStorage.setItem("theme", JSON.stringify("dark"));
    renderTheme();

    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    expect(root.classList.contains("dark")).toBe(true);
    expect(root.style.colorScheme).toBe("dark");
  });

  it("ignores an unrecognized persisted value", () => {
    localStorage.setItem("theme", JSON.stringify("sepia"));
    renderTheme();

    expect(screen.getByTestId("preference")).toHaveTextContent("system");
  });

  it("persists the preference and updates the document", () => {
    renderTheme();

    click("dark");
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    expect(root.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("theme")).toBe(JSON.stringify("dark"));

    click("system");
    expect(screen.getByTestId("theme")).toHaveTextContent("light");
    expect(root.classList.contains("dark")).toBe(false);
    expect(root.style.colorScheme).toBe("light");
  });

  it("tracks OS changes while following the system", () => {
    renderTheme();
    expect(screen.getByTestId("theme")).toHaveTextContent("light");

    setSystemPrefersDark(true);

    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    expect(root.classList.contains("dark")).toBe(true);
  });

  it("ignores OS changes once a preference is set", () => {
    renderTheme();

    click("dark");
    setSystemPrefersDark(false);

    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
  });

  it("syncs across tabs via storage events", () => {
    renderTheme();

    syncFromOtherTab("dark");

    expect(screen.getByTestId("preference")).toHaveTextContent("dark");
    expect(root.classList.contains("dark")).toBe(true);
  });

  it("ignores an unrecognized value from another tab", () => {
    renderTheme();

    // Sync to dark first, so falling back to "system" can't pass by doing nothing.
    syncFromOtherTab("dark");
    syncFromOtherTab("sepia");

    expect(screen.getByTestId("preference")).toHaveTextContent("system");
    expect(screen.getByTestId("theme")).toHaveTextContent("light");
  });

  it("still applies the theme when persistence fails", () => {
    vi.spyOn(localStorage, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });
    renderTheme();

    click("dark");

    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    expect(root.classList.contains("dark")).toBe(true);
  });

  it("survives a browser that denies storage access", () => {
    vi.spyOn(localStorage, "getItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });

    expect(() => renderTheme()).not.toThrow();
    expect(screen.getByTestId("preference")).toHaveTextContent("system");
  });

  it("shares its storage contract with the pre-paint bootstrap", () => {
    // A mismatch only shows as a white flash for dark-mode users, so nothing
    // else catches it. The tests above pin theme.tsx to the same key and
    // encoding, holding the two files in step.
    expect(indexHtml).toContain('localStorage.getItem("theme")');
    expect(indexHtml).toContain("JSON.parse");
    expect(indexHtml).toContain("(prefers-color-scheme: dark)");
  });
});
