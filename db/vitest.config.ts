import { defineProject } from "vitest/config";

export default defineProject({
  test: {
    // Prevent concurrent tests from resetting a database shared within a file.
    maxConcurrency: 1,
  },
});
