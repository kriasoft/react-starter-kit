/**
 * Type definitions for Cloudflare Workers environment bindings
 */

/**
 * Cloudflare Workers environment bindings
 * These are injected at runtime by the Cloudflare Workers platform
 */
export interface Env {
  /**
   * Built-in static assets fetcher
   * Serves files from the 'assets.directory' specified in wrangler.jsonc
   * Automatically available when using Workers with assets
   */
  ASSETS: Fetcher;

  /**
   * Service binding to the main application worker (apps/app)
   * Used to proxy authenticated users to the dashboard
   * Configured in wrangler.jsonc services section
   */
  APP_SERVICE: Fetcher;

  /**
   * Service binding to the API worker (apps/api)
   * Used to validate authentication sessions and proxy API requests
   * Configured in wrangler.jsonc services section
   */
  API_SERVICE: Fetcher;

  /**
   * Current deployment environment
   * Values: "development" | "staging" | "preview" | "production"
   */
  ENVIRONMENT: string;
}

/**
 * Better Auth API response structure
 * Response shape can vary based on plugins and client wrappers
 * See: https://www.better-auth.com/docs/integrations
 */
export interface BetterAuthApiResponse {
  /**
   * Direct session field (most common format)
   */
  session?: BetterAuthSession;

  /**
   * Nested data field (used by some client wrappers)
   */
  data?:
    | {
        session?: BetterAuthSession;
      }
    | BetterAuthSession;

  /**
   * User information if session is valid
   */
  user?: {
    id: string;
    email: string;
    name?: string;
    [key: string]: unknown;
  };
}

/**
 * Better Auth session structure
 */
export interface BetterAuthSession {
  id: string;
  userId: string;
  expiresAt: Date | string;
  [key: string]: unknown;
}
