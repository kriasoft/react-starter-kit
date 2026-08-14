import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The web worker forwards a hardcoded list of top-level paths to this app
 * (`apps/web/worker.ts`). Anything missing from that list falls through to the
 * marketing assets and 404s – but only on direct load or refresh, since
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

// The page and endpoint file types Astro turns into routes. Anything else under
// `pages/` is inert, so it must not be mistaken for a marketing URL.
// https://docs.astro.build/en/basics/astro-pages/
const ASTRO_ROUTE = /\.(astro|md|mdx|html|js|ts)$/;

/**
 * The first URL segment of every marketing page, read from `apps/web/pages`.
 * These must NOT be forwarded to the app; a hardcoded list would go stale the
 * moment someone adds a page.
 *
 * Astro drops `_`-prefixed names from routing at every level, and only the last
 * extension is stripped from the URL – `rss.xml.ts` serves /rss.xml.
 */
function marketingOwnedPaths(): Set<string> {
  const pagesDir = join(repoRoot, "apps/web/pages");

  const visible = (dir: string) =>
    readdirSync(dir, { withFileTypes: true }).filter(
      (entry) => !entry.name.startsWith("_"),
    );

  // A directory owns a URL only if a routable file survives underneath it.
  function containsRoute(dir: string): boolean {
    return visible(dir).some((entry) =>
      entry.isDirectory()
        ? containsRoute(join(dir, entry.name))
        : ASTRO_ROUTE.test(entry.name),
    );
  }

  const names = visible(pagesDir).flatMap((entry) => {
    // `pricing/index.astro` serves /pricing.
    if (entry.isDirectory()) {
      return containsRoute(join(pagesDir, entry.name)) ? [entry.name] : [];
    }
    return ASTRO_ROUTE.test(entry.name)
      ? [entry.name.replace(ASTRO_ROUTE, "")]
      : [];
  });

  // `[slug]` and `[...rest]` expand through `getStaticPaths` at build time, so
  // the set of URLs they own is not visible from the filename.
  const dynamic = names.filter((name) => name.includes("["));
  if (dynamic.length > 0) {
    throw new Error(
      `A top-level dynamic marketing page (${dynamic.join(", ")}) cannot be ` +
        "compared against APP_PATHS: its URLs are only known after the build. " +
        "Nest it under a static segment.",
    );
  }

  // `index` is "/", routed by the auth-hint handler rather than APP_PATHS.
  return new Set(names.filter((name) => name !== "index"));
}

const MARKETING_OWNED = marketingOwnedPaths();

function forwardedPaths(): string[] {
  const block = workerSource.match(
    /const APP_PATHS = \[([\s\S]*?)\] as const;/,
  );
  if (!block) throw new Error("APP_PATHS not found in apps/web/worker.ts");
  return [...block[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
}

/**
 * The first URL segment of every app route, read from the generated route tree.
 *
 * `routeTree.gen.ts` is TanStack Router's own resolution of the filename
 * grammar – route groups, pathless layouts, flat dotted routes and excluded
 * `-` modules are already applied. Re-deriving that here would be a second,
 * worse copy of their parser. The router plugin in `vite.config.ts` regenerates
 * the tree when vitest boots, so this always reads the current route files.
 */
function topLevelRoutes(): string[] {
  const tree = readFileSync(
    join(repoRoot, "apps/app/lib/routeTree.gen.ts"),
    "utf8",
  );

  const union = tree.match(/\n {2}fullPaths:([\s\S]*?)\n {2}\w+:/);
  if (!union) {
    throw new Error("fullPaths not found in apps/app/lib/routeTree.gen.ts");
  }

  const segments = [...union[1].matchAll(/'([^']*)'/g)]
    .map((match) => match[1].split("/")[1])
    // "/" yields an empty segment. The auth-hint handler routes it, not
    // APP_PATHS.
    .filter(Boolean);

  // `$slug` required, `{-$slug}` optional – both carry the parameter marker.
  const dynamic = segments.filter((segment) => segment.includes("$"));
  if (dynamic.length > 0) {
    throw new Error(
      `A top-level dynamic route (${dynamic.join(", ")}) cannot be edge-routed: ` +
        "APP_PATHS lists literal paths, and forwarding every unmatched URL " +
        "would swallow the marketing site. Nest it under a static segment.",
    );
  }

  return [...new Set(segments)];
}

describe("edge routing", () => {
  it("forwards every top-level app route to the app worker", () => {
    const forwarded = new Set(forwardedPaths());
    const missing = topLevelRoutes().filter((r) => !forwarded.has(r));

    expect(
      missing,
      `Add these to APP_PATHS in apps/web/worker.ts, or they will 404 on direct load: ${missing.join(", ")}`,
    ).toEqual([]);
  });

  it("defines no app route that shadows a marketing page", () => {
    // Such a route is unwinnable: listed in APP_PATHS it hides the marketing
    // page, left out it 404s on direct load. Rename the route instead.
    const collisions = topLevelRoutes().filter((r) => MARKETING_OWNED.has(r));

    expect(
      collisions,
      `These app routes collide with apps/web/pages: ${collisions.join(", ")}`,
    ).toEqual([]);
  });

  it("matches whole path segments, not bare prefixes", () => {
    // A bare `/${path}*` would answer /members-only with the SPA shell, since
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
