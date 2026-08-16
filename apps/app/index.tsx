import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NotFound } from "./components/not-found";
import { queryClient } from "./lib/query";
import { routeTree } from "./lib/routeTree.gen";
import { StoreProvider } from "./lib/store";
import { ThemeSync } from "./lib/theme";
import "./styles/globals.css";

const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: "intent",
  defaultNotFoundComponent: NotFound,
});

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <StrictMode>
    <StoreProvider>
      <ThemeSync />
      <QueryClientProvider client={queryClient}>
        {/* Router and Query devtools share one shell in the root route. */}
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StoreProvider>
  </StrictMode>,
);

if (import.meta.hot) {
  import.meta.hot.dispose(() => root.unmount());
}

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
