/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Timestamp } from "@google-cloud/firestore";
import { z } from "zod";

export const WorkspaceSchema = z.object({
  name: z.string().max(100),
  ownerId: z.string().max(50),
  created: z.instanceof(Timestamp),
  updated: z.instanceof(Timestamp),
  archived: z.instanceof(Timestamp).nullable(),
});

export type Workspace = z.output<typeof WorkspaceSchema>;
export type WorkspaceInput = z.input<typeof WorkspaceSchema>;
