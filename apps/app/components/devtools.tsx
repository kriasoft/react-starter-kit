import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { ErrorBoundary } from "react-error-boundary";

/**
 * Router and Query devtools behind one shell, so development gets a single
 * trigger instead of two floating logos. Mounted by the root route, which puts
 * it under both `RouterProvider` and `QueryClientProvider` – each panel finds
 * its own context from there.
 *
 * Render failures stay contained in both directions: the root route keeps this
 * outside `AppErrorBoundary` so a devtools crash can't raise the app's error UI,
 * and the boundary below renders nothing so it can't take the app down with it –
 * React unmounts the whole tree for a render error no boundary catches.
 *
 * Only the shell is wired up, not `@tanstack/devtools-vite`. Its source
 * inspection and console piping change how every component is compiled and
 * logged, and the guard below already keeps devtools out of production builds.
 */
export function Devtools() {
  if (!import.meta.env.DEV) return null;

  return (
    <ErrorBoundary fallback={null}>
      <TanStackDevtools
        config={{
          hideUntilHover: true,
          // The shell's default `Ctrl+~` cannot be typed: it matches the exact
          // set of keys held, and a US layout needs Shift to reach `~`. `X` is
          // the replacement because Chrome, Firefox, and Edge all leave
          // Ctrl+Shift+X unbound – Ctrl+Shift+D is "bookmark all tabs" in every
          // one of them. Developers can rebind it from the settings tab.
          openHotkey: ["Control", "Shift", "X"],
        }}
        plugins={[
          {
            // Explicit IDs: generated ones embed the plugin's array index, so
            // adding or reordering a panel would orphan the persisted layout.
            id: "router",
            name: "Router",
            // Opens whenever no panel is active – on a first run, and again if
            // the developer closes every panel and reloads.
            defaultOpen: true,
            render: <TanStackRouterDevtoolsPanel />,
          },
          { id: "query", name: "Query", render: <ReactQueryDevtoolsPanel /> },
        ]}
      />
    </ErrorBoundary>
  );
}
