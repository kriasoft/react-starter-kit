import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { ErrorBoundary } from "react-error-boundary";

/**
 * Router and Query devtools behind one shell – one trigger instead of two
 * floating logos. The root route mounts it under `RouterProvider` and
 * `QueryClientProvider`, where each panel finds its context, and outside
 * `AppErrorBoundary` so a devtools crash can't raise the app's error UI. Its own
 * boundary renders nothing, because React unmounts the whole tree for a render
 * error no boundary catches.
 *
 * `@tanstack/devtools-vite` is deliberately absent: its source inspection and
 * console piping change how every component is compiled and logged, and the dev
 * guard below is enough to keep devtools out of production.
 */
export function Devtools() {
  if (!import.meta.env.DEV) return null;

  return (
    <ErrorBoundary fallback={null}>
      <TanStackDevtools
        config={{
          hideUntilHover: true,
          // The default `Ctrl+~` can't be typed – the shell matches the exact
          // set of keys held, and a US layout needs Shift to reach `~`. The
          // mnemonic `Ctrl+Shift+D` is taken: "bookmark all tabs" in Chrome,
          // Firefox, and Edge. `X` is unclaimed in all three.
          openHotkey: ["Control", "Shift", "X"],
        }}
        plugins={[
          {
            // Generated IDs embed the array index, so reordering panels would
            // orphan the persisted layout.
            id: "router",
            name: "Router",
            // Applies whenever no panel is active, not just the first run.
            defaultOpen: true,
            render: <TanStackRouterDevtoolsPanel />,
          },
          { id: "query", name: "Query", render: <ReactQueryDevtoolsPanel /> },
        ]}
      />
    </ErrorBoundary>
  );
}
