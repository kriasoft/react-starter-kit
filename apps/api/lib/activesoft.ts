import { z } from "zod";

const activeSoftConfigInput = z.object({
  ACTIVESOFT_API_URL: z.url(),
  ACTIVESOFT_API_KEY: z.string().min(1),
  ACTIVESOFT_USE_BEARER: z.enum(["true", "false"]).default("true"),
});

export type ActiveSoftConfig = {
  baseUrl: URL;
  apiKey: string;
  useBearer: boolean;
};

type ActiveSoftFetch = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

export type ActiveSoftProbeSummary = {
  configured: boolean;
  host: string | null;
  pathname: string | null;
  authScheme: "bearer" | "x-api-key" | null;
  keyConfigured: boolean;
};

export class ActiveSoftHTTPError extends Error {
  readonly status: number;
  readonly statusText: string;
  readonly redactedBody: string;

  constructor(status: number, statusText: string, redactedBody: string) {
    super(`ActiveSoft request failed with ${status} ${statusText}`);
    this.name = "ActiveSoftHTTPError";
    this.status = status;
    this.statusText = statusText;
    this.redactedBody = redactedBody;
  }
}

export function parseActiveSoftConfig(
  source: Record<string, string | undefined>,
): ActiveSoftConfig {
  const parsed = activeSoftConfigInput.parse(source);

  return {
    baseUrl: new URL(parsed.ACTIVESOFT_API_URL),
    apiKey: parsed.ACTIVESOFT_API_KEY,
    useBearer: parsed.ACTIVESOFT_USE_BEARER === "true",
  };
}

export function tryParseActiveSoftConfig(
  source: Record<string, string | undefined>,
): ActiveSoftConfig | null {
  if (!source.ACTIVESOFT_API_URL || !source.ACTIVESOFT_API_KEY) {
    return null;
  }

  return parseActiveSoftConfig(source);
}

export function getActiveSoftProbeSummary(
  config: ActiveSoftConfig | null,
): ActiveSoftProbeSummary {
  if (!config) {
    return {
      configured: false,
      host: null,
      pathname: null,
      authScheme: null,
      keyConfigured: false,
    };
  }

  return {
    configured: true,
    host: config.baseUrl.host,
    pathname: config.baseUrl.pathname,
    authScheme: config.useBearer ? "bearer" : "x-api-key",
    keyConfigured: config.apiKey.length > 0,
  };
}

export function createActiveSoftClient(
  config: ActiveSoftConfig,
  fetchImpl: ActiveSoftFetch = fetch,
) {
  return {
    async getJson<T = unknown>(endpoint: string): Promise<T> {
      const url = new URL(endpoint.replace(/^\/+/, ""), config.baseUrl);
      const headers = new Headers({
        accept: "application/json",
        "user-agent": "Clara/0.1 ActiveSoft read-only probe",
      });

      if (config.useBearer) {
        headers.set("authorization", `Bearer ${config.apiKey}`);
      } else {
        headers.set("x-api-key", config.apiKey);
      }

      const response = await fetchImpl(url, { headers, method: "GET" });
      const body = await response.text();

      if (!response.ok) {
        throw new ActiveSoftHTTPError(
          response.status,
          response.statusText,
          redactSecrets(body, [config.apiKey]),
        );
      }

      if (!body) {
        return null as T;
      }

      return JSON.parse(body) as T;
    },
  };
}

function redactSecrets(body: string, secrets: string[]): string {
  let redacted = body;

  for (const secret of secrets) {
    if (!secret) continue;
    redacted = redacted.split(secret).join("[REDACTED]");
  }

  return redacted;
}
