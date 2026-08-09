import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The web worker forwards a hardcoded list of top-level paths to this app
 * (`apps/web/worker.ts`). Anything missing from that list falls through to the
 * marketing assets and 404s — but only on direct load or refresh, since
 * client-side navigation never hits the edge. This guards that gap.
 */

// Walk up from the test runner's cwd until the monorepo root is found, so this
// works whether vitest runs from the repo root or the app project directory.
function findRepoRoot(): string {
  let dir = resolve(process.cwd());
  while (!existsSync(join(dir, "apps", "web", "worker.ts"))) {
    const parent = dirname(dir);
    if (parent === dir) throw new Error("monorepo root not found");
    dir = parent;
  }
  return dir;
}

const repoRoot = findRepoRoot();
const workerSource = readFileSync(join(repoRoot, "apps/web/worker.ts"), "utf8");

// Paths the marketing site owns, so they must NOT be forwarded to the app.
const MARKETING_OWNED = new Set(["about"]);

function forwardedPaths(): string[] {
  const block = workerSource.match(
    /const APP_PATHS = \[([\s\S]*?)\] as const;/,
  );
  if (!block) throw new Error("APP_PATHS not found in apps/web/worker.ts");
  return [...block[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
}

function topLevelRoutes(): string[] {
  const routesDir = join(repoRoot, "apps/app/routes");
  const groups = readdirSync(routesDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

  return groups
    .flatMap((g) =>
      readdirSync(join(routesDir, g))
        .filter((f) => f.endsWith(".tsx"))
        .map((f) => f.replace(/\.tsx$/, "")),
    )
    .filter(
      (name) =>
        // `route` is a layout, `index` is "/" (owned by the auth-hint handler)
        name !== "route" && name !== "index" && !name.startsWith("-"),
    );
}

describe("edge routing", () => {
  it("forwards every top-level app route to the app worker", () => {
    const forwarded = new Set(forwardedPaths());
    const missing = topLevelRoutes().filter(
      (r) => !forwarded.has(r) && !MARKETING_OWNED.has(r),
    );

    expect(
      missing,
      `Add these to APP_PATHS in apps/web/worker.ts, or they will 404 on direct load: ${missing.join(", ")}`,
    ).toEqual([]);
  });

  it("matches whole path segments, not bare prefixes", () => {
    // A bare `/${path}*` would answer /users-guide with the SPA shell, since
    // the app worker serves a single-page-application fallback.
    const prefixRoutes = workerSource.match(/app\.all\(`\/\$\{path\}\*`/g);
    expect(prefixRoutes).toBeNull();
    expect(workerSource).toContain("app.all(`/${path}`");
    expect(workerSource).toContain("app.all(`/${path}/*`");
  });

  it("does not forward paths the marketing site owns", () => {
    const forwarded = forwardedPaths();
    expect(forwarded.filter((p) => MARKETING_OWNED.has(p))).toEqual([]);
  });

  it("declares service bindings in every wrangler environment", () => {
    // Cloudflare does not inherit bindings into named environments. An env
    // block without `services` deploys a web worker whose API_SERVICE and
    // APP_SERVICE are undefined, so every proxied request throws at runtime.
    const jsonc = readFileSync(
      join(repoRoot, "apps/web/wrangler.jsonc"),
      "utf8",
    );
    const config = JSON.parse(jsonc.replace(/^\s*\/\/.*$/gm, "")) as {
      services?: unknown[];
      env?: Record<string, { services?: unknown[] }>;
    };

    expect(config.services, "top-level services missing").toBeDefined();
    const missing = Object.entries(config.env ?? {})
      .filter(([, block]) => !block.services)
      .map(([name]) => name);

    expect(
      missing,
      `Add "services" to these envs in apps/web/wrangler.jsonc: ${missing.join(", ")}`,
    ).toEqual([]);
  });
});
