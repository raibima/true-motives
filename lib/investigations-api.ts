import type { InvestigationWorkflowInput } from "@/lib/investigations/schema";

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

export type StartInvestigationInput = {
  title: string;
  description: string;
  category: InvestigationWorkflowInput["category"];
  geography: string;
  phases?: Array<{ id: string; label: string; description: string }>;
};

export async function startInvestigation(
  input: StartInvestigationInput,
): Promise<string> {
  const response = await fetch("/api/investigations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;
    throw new Error(body?.error || "Failed to start investigation.");
  }

  const body = (await response.json()) as { runId: string };
  return body.runId;
}
