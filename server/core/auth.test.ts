/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import express from "express";
import supertest from "supertest";
import { describe, expect, it } from "vitest";
import { fetchCertificates, sessionMiddleware } from "./auth";
import { env } from "./env";

describe("fetchCertificates()", () => {
  it("should fetch certificates from Google", async () => {
    const certs = await fetchCertificates();
    expect(certs).toEqual(expect.any(Object));
    expect(Object.values(certs)).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/^-----BEGIN CERTIFICATE-----/),
      ]),
    );
  });
});

describe("sessionMiddleware()", () => {
  it.skip("should verify a valid ID token", async () => {
    const app = express();
    app.get("/", sessionMiddleware, (req, res) => {
      res.type("json");
      res.send(JSON.stringify(req.token));
    });

    const idToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImQxNjg5NDE1ZWMyM2EzMzdlMmJiYWE1ZTNlNjhiNjZkYzk5MzY4ODQiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiS3JpYXNvZnQiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jS0hBRVhvRXpJMnpoMWNpN3lna0FVZXFiRWppQ1ZxUE96VkZQYnZmUGtXcGc9czk2LWMiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20va3JpYXNvZnQiLCJhdWQiOiJrcmlhc29mdCIsImF1dGhfdGltZSI6MTcwNDU0MjYyOCwidXNlcl9pZCI6IkpRdWxWbjhaMUhZelRIR0J5YnhlcndGRUhsNzIiLCJzdWIiOiJKUXVsVm44WjFIWXpUSEdCeWJ4ZXJ3RkVIbDcyIiwiaWF0IjoxNzA0NTQyNjI4LCJleHAiOjE3MDQ1NDYyMjgsImVtYWlsIjoia3JpYXNvZnRAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMDI2NTQwODA3NzUxNTYyOTI2ODYiXSwiZW1haWwiOlsia3JpYXNvZnRAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.E1sOoIeLH0269m4K4DXfXOJk97cxc8h3D62u3q9Kqyk0AsmwQfKURRl34IiOtNEzizjesLex6EHSetFr8kS1GSgVrW6yxHowmJZCY8tsgSWfunZ7Vj8l1kG4y0iM7hdFw3t0dhilK8-vDlKpLeRfLVHG8qgt46qI7Rxmdb928llJoa7H6NuuS5heavNJadLfiYItJyUq7i5kjys6-WfndQQcRb7kTt07arHb_1w2jtZnyjZE_S3ErZcIgwnE9M_gqXZ4y1MucpGPR2_nHzicRBBYOMwZDVG7Y0tI9IWRaTyTF3Psd7XKisE6GorZ_X1cDwkaT5ffoXZ1tkBOjeMjfw"; // prettier-ignore
    const res = await supertest(app).get("/").auth(idToken, { type: "bearer" });

    expect({ status: res.status, body: res.body }).toEqual({
      status: 200,
      body: expect.objectContaining({
        name: expect.any(String),
        picture: expect.any(String),
        iss: `https://securetoken.google.com/${env.GOOGLE_CLOUD_PROJECT}`,
        aud: env.GOOGLE_CLOUD_PROJECT,
        auth_time: expect.any(Number),
        sub: expect.any(String),
        iat: expect.any(Number),
        exp: expect.any(Number),
        email: expect.any(String),
        email_verified: true,
        firebase: expect.objectContaining({
          sign_in_provider: "google.com",
        }),
      }),
    });
  });
});
