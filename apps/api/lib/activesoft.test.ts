import { describe, expect, it } from "vitest";
import {
  ActiveSoftHTTPError,
  createActiveSoftClient,
  getActiveSoftProbeSummary,
  parseActiveSoftConfig,
} from "./activesoft.js";

describe("ActiveSoft integration client", () => {
  it("parses config without exposing the API key in probe output", () => {
    const config = parseActiveSoftConfig({
      ACTIVESOFT_API_URL: "https://siga01.activesoft.com.br/",
      ACTIVESOFT_API_KEY: "secret-active-soft-key",
      ACTIVESOFT_USE_BEARER: "true",
    });

    expect(config.baseUrl.href).toBe("https://siga01.activesoft.com.br/");
    expect(config.useBearer).toBe(true);

    const summary = getActiveSoftProbeSummary(config);

    expect(summary).toEqual({
      configured: true,
      host: "siga01.activesoft.com.br",
      pathname: "/",
      authScheme: "bearer",
      keyConfigured: true,
    });
    expect(JSON.stringify(summary)).not.toContain("secret-active-soft-key");
  });

  it("sends read-only requests with the configured bearer token", async () => {
    const requests: Request[] = [];
    const client = createActiveSoftClient(
      parseActiveSoftConfig({
        ACTIVESOFT_API_URL: "https://siga01.activesoft.com.br/",
        ACTIVESOFT_API_KEY: "secret-active-soft-key",
        ACTIVESOFT_USE_BEARER: "true",
      }),
      async (input, init) => {
        const request = new Request(input, init);
        requests.push(request);

        return new Response(JSON.stringify({ result: "ok" }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      },
    );

    await expect(
      client.getJson("api/v1/listar_frequencia_aluno/?aluno_id=123"),
    ).resolves.toEqual({ result: "ok" });

    expect(requests).toHaveLength(1);
    expect(requests[0].method).toBe("GET");
    expect(requests[0].url).toBe(
      "https://siga01.activesoft.com.br/api/v1/listar_frequencia_aluno/?aluno_id=123",
    );
    expect(requests[0].headers.get("authorization")).toBe(
      "Bearer secret-active-soft-key",
    );
  });

  it("returns structured HTTP errors with redacted response bodies", async () => {
    const client = createActiveSoftClient(
      parseActiveSoftConfig({
        ACTIVESOFT_API_URL: "https://siga01.activesoft.com.br/",
        ACTIVESOFT_API_KEY: "secret-active-soft-key",
        ACTIVESOFT_USE_BEARER: "true",
      }),
      async () =>
        new Response(
          JSON.stringify({
            error: "Token secret-active-soft-key is invalid",
          }),
          {
            status: 401,
            statusText: "Unauthorized",
            headers: { "content-type": "application/json" },
          },
        ),
    );

    await expect(
      client.getJson("api/v1/listar_frequencia_aluno/"),
    ).rejects.toMatchObject({
      status: 401,
      statusText: "Unauthorized",
      redactedBody: '{"error":"Token [REDACTED] is invalid"}',
    } satisfies Partial<ActiveSoftHTTPError>);
  });
});
