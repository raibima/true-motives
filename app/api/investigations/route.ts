import { z } from "zod";
import { start } from "workflow/api";

import type { ReportCategory } from "@/lib/types";
import {
  investigationWorkflow,
  type InvestigationWorkflowInput,
} from "@/workflows/investigation/workflow";

const requestSchema = z.object({
  title: z.string().min(1),
  description: z.string().default(""),
  category: z.enum([
    "policy",
    "regulation",
    "corporate-decision",
    "government-action",
    "legislation",
  ]) as z.ZodType<ReportCategory>,
  geography: z.string().default("Global"),
  context: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const input = requestSchema.parse(json) as InvestigationWorkflowInput;
    const run = await start(investigationWorkflow, [input]);
    return Response.json({ runId: run.runId });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: "Invalid investigation payload.", issues: error.issues },
        { status: 400 },
      );
    }

    return Response.json(
      { error: "Failed to start investigation workflow." },
      { status: 500 },
    );
  }
}
