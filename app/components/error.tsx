/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { useRouter } from "@tanstack/react-router";

export function RootError(): JSX.Element {
  const router = useRouter();
  const err = router.state.error as RouteError | null;

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
        <strong style={{ fontWeight: 400 }}>
          Error {(err as any)?.status || 500}
        </strong>
        : {(err as any)?.statusText ?? err?.message ?? "Unknown error"}
      </h1>
    </div>
  );
}

type RouteError = Error & { status?: number; statusText?: string };
