import { useRouterState } from "@tanstack/react-router";

export function RootError() {
  const routerState = useRouterState();
  const err = routerState.matches.find((match) => match.error)
    ?.error as RouteError | null;

  return (
    <div
      style={{
        marginTop: "43vh",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "0 20px",
      }}
    >
      <h1
        style={{
          fontSize: "2em",
          fontWeight: 300,
          textAlign: "center",
          color: "#333",
        }}
      >
        <strong style={{ fontWeight: 400 }}>Error {err?.status || 500}</strong>:{" "}
        {err?.statusText ?? err?.message ?? "Unknown error"}
      </h1>
    </div>
  );
}

type RouteError = Error & { status?: number; statusText?: string };
