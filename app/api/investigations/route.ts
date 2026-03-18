import { z } from "zod";
import { start } from "workflow/api";

import {
  investigationWorkflow,
} from "@/workflows/investigation/workflow";
import {
  investigationInputSchema,
  type InvestigationWorkflowInput,
} from "@/lib/investigations/schema";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const input = investigationInputSchema.parse(json) as InvestigationWorkflowInput;
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
