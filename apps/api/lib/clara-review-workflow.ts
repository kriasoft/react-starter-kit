import type { ClaraReviewStatus } from "./clara-records.js";
import { CLARA_REVIEW_STATUS } from "./clara-records.js";

export function canApproveForActivesoft(status: ClaraReviewStatus | string) {
  return status === CLARA_REVIEW_STATUS.awaitingReview;
}

export function canLogActivesoftLaunch(status: ClaraReviewStatus | string) {
  return status === CLARA_REVIEW_STATUS.approvedForActivesoft;
}
