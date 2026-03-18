import type { InvestigationWorkflowInput } from "@/workflows/investigation/workflow";

export async function generatePlan(
  prompt: string,
): Promise<InvestigationWorkflowInput> {
  const response = await fetch("/api/investigations/plan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;
    throw new Error(
      body?.error || "Failed to analyze your investigation idea.",
    );
  }

  const body = (await response.json()) as {
    plan: InvestigationWorkflowInput;
  };

  return body.plan;
}
