import { describe, expect, it } from "vitest";
import { isLocalDatabase } from "./local-database";

/**
 * The classifier behind `db:push`'s refusal.
 *
 * Both directions are load-bearing and in opposite ways. A remote database
 * wrongly allowed is an unreviewed migration against real data. A local one
 * wrongly refused is worse than it looks: it teaches the developer to reach for
 * `ALLOW_REMOTE_DB_PUSH`, and an override reached for by habit has stopped
 * being a control.
 */
describe("isLocalDatabase", () => {
  it.each([
    ["postgresql://u:p@localhost:5432/db", "localhost"],
    ["postgresql://u:p@127.0.0.1:5432/db", "127.0.0.1"],
    ["postgresql://u:p@127.0.0.2:5432/db", "the rest of 127.0.0.0/8"],
    ["postgresql://u:p@[::1]:5432/db", "an IPv6 literal, brackets and all"],
    ["postgresql://u:p@localhost.:5432/db", "a fully qualified trailing dot"],
    ["postgresql://u:p@db.localhost:5432/db", "anything under .localhost"],
    ["postgresql:///db", "no host at all, so a socket or loopback"],
    ["postgres://u:p@LOCALHOST:5432/db", "any casing"],
  ])("allows %s – %s", (url) => {
    expect(isLocalDatabase(url)).toBe(true);
  });

  it.each([
    ["postgresql://u:p@ep-x.aws.neon.tech/db", "a hosted branch"],
    ["postgresql://u:p@10.0.0.5:5432/db", "another machine on the network"],
    ["postgresql://u:p@127.0.0.1.evil.com/db", "a loopback-shaped prefix"],
    ["postgresql://u:p@notlocalhost/db", "a name merely ending in the word"],
  ])("refuses %s – %s", (url) => {
    expect(isLocalDatabase(url)).toBe(false);
  });
});
