/** @file Which connection strings can only reach this machine. */

/**
 * Whether a connection string can only reach this machine.
 *
 * Classified rather than matched against a list of four spellings, because the
 * cost of getting it wrong is asymmetric: a refused local database teaches the
 * developer to reach for the override, and an override reached for by habit is
 * no longer a control. So every form that is genuinely local has to pass.
 *
 * It does not try to outwit anyone. A `localhost` port forwarded to production
 * looks local and is allowed; the check is aimed at the obvious mistake, which
 * is the one that actually happens.
 */
export function isLocalDatabase(databaseUrl: string): boolean {
  const host = new URL(databaseUrl).hostname
    // Bun keeps the brackets on an IPv6 literal, so `[::1]` never equals `::1`.
    .replace(/^\[|\]$/g, "")
    // A trailing dot is the same name, fully qualified.
    .replace(/\.$/, "")
    .toLowerCase();

  // No host at all: the driver falls back to a unix socket or loopback, and a
  // URL with nowhere to go cannot reach another machine.
  if (host === "") return true;

  // `localhost` and everything under it are reserved for loopback (RFC 6761).
  if (host === "localhost" || host.endsWith(".localhost")) return true;

  if (host === "::1" || host === "0.0.0.0") return true;

  // The whole 127.0.0.0/8 block, not just 127.0.0.1.
  return /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host);
}
