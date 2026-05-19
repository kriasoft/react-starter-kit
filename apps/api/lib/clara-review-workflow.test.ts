import { describe, expect, it } from "vitest";
import { CLARA_REVIEW_STATUS } from "./clara-records.js";
import {
  canApproveForActivesoft,
  canLogActivesoftLaunch,
} from "./clara-review-workflow.js";

describe("Clara review workflow guards", () => {
  it("only allows approval from awaiting review", () => {
    expect(canApproveForActivesoft(CLARA_REVIEW_STATUS.awaitingReview)).toBe(
      true,
    );
    expect(
      canApproveForActivesoft(CLARA_REVIEW_STATUS.approvedForActivesoft),
    ).toBe(false);
    expect(
      canApproveForActivesoft(CLARA_REVIEW_STATUS.launchedInActivesoft),
    ).toBe(false);
  });

  it("only allows ActiveSoft launch logging after approval", () => {
    expect(
      canLogActivesoftLaunch(CLARA_REVIEW_STATUS.approvedForActivesoft),
    ).toBe(true);
    expect(canLogActivesoftLaunch(CLARA_REVIEW_STATUS.awaitingReview)).toBe(
      false,
    );
    expect(
      canLogActivesoftLaunch(CLARA_REVIEW_STATUS.launchedInActivesoft),
    ).toBe(false);
  });
});
