import { z } from "zod";

import { type InvestigationWorkflowInput, planInvestigationFromPrompt } from "@/workflows/investigation/workflow";

const planningRequestSchema = z.object({
  prompt: z.string().min(1, "Prompt is required."),
});

export type InvestigationPlanningResponse = {
  plan: InvestigationWorkflowInput;
};

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { prompt } = planningRequestSchema.parse(json);

    const plan = await planInvestigationFromPrompt(prompt);

    const responseBody: InvestigationPlanningResponse = {
      plan,
    };

    return Response.json(responseBody);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        {
          error: "Invalid planning request payload.",
          issues: error.issues,
        },
        { status: 400 },
      );
    }

    console.error("Failed to plan investigation from prompt", error);

    return Response.json(
      {
        error: "Failed to plan investigation from prompt.",
      },
      { status: 500 },
    );
  }
}

