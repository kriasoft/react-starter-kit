/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { TRPCError } from "@trpc/server";
import { testWorkspaces } from "db";
import { describe, expect, it } from "vitest";
import { createClient } from "../test/context";
import * as router from "./workspace";

describe("workspace.update()", () => {
  it("requires authentication", async () => {
    const [client] = createClient(router.workspace);
    const action = client.update({
      id: "xxxxxxxxxx",
      name: "My Workspace",
    });

    await expect(action).rejects.toThrowError(
      new TRPCError({ code: "UNAUTHORIZED" }),
    );
  });

  it("workspace must exist", async () => {
    const [client] = createClient(router.workspace, { user: "erika" });
    const action = client.update({
      id: "xxxxxxxxxx", // Non-existent workspace ID
      name: "My Workspace",
    });

    await expect(action).rejects.toThrowError(
      new TRPCError({ code: "NOT_FOUND" }),
    );
  });

  it("workspace must belong to the user", async () => {
    const [client, ctx] = createClient(router.workspace, { user: "erika" });
    const id = testWorkspaces.find((x) => x.ownerId !== ctx.token?.uid)?.id;
    expect(id).toEqual(expect.any(String));

    const action = client.update({
      id: id!, // Workspace ID that belongs to another user
      name: "My Workspace",
    });

    await expect(action).rejects.toThrowError(
      new TRPCError({ code: "NOT_FOUND" }),
    );
  });

  it("updates the workspace", async () => {
    const [client, ctx] = createClient(router.workspace, { user: "erika" });
    const id = testWorkspaces.find((x) => x.ownerId === ctx.token?.uid)?.id;
    expect(id).toEqual(expect.any(String));

    await client.update({ id: id!, name: "My Workspace" });
    const doc1 = await ctx.db.doc(`workspace/${id}`).get();
    expect(doc1.data()?.name).toBe("My Workspace");

    await client.update({ id: id!, name: "Personal workspace" });
    const doc2 = await ctx.db.doc(`workspace/${id}`).get();
    expect(doc2.data()?.name).toBe("Personal workspace");
  });
});
