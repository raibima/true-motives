import "server-only";

import type { UIMessageChunk } from "ai";
import { z } from "zod";
import { DurableAgent, Output as WorkflowOutput } from "@workflow/ai/agent";
import { openai } from "@workflow/ai/openai";
import { getWritable, fetch } from "workflow";

import { reportSchema } from "@/shared/report-schema";
import type { Report, ReportCategory } from "@/shared/types";
import {
  investigationInputSchema,
  type InvestigationWorkflowInput,
} from "@/shared/investigations/schema";
import { emitProgress } from "@/server/workflows/investigation/steps/research";
import {
  getCallsPerPhase,
  getTargetPhaseIndex,
} from "@/server/workflows/investigation/phase-tracking";
import {
  createInvestigationTools,
  type InvestigationToolCallCounts,
} from "@/server/workflows/investigation/tools";
import {
  createInvestigationSystemPrompt,
  createInvestigationUserPrompt,
} from "@/server/workflows/investigation/prompts";

// Maximum number of steps the agent can take.
const AGENT_MAX_STEPS = 60;

const AGENT_MODEL = openai("gpt-5.4");

export async function investigationWorkflow(
  rawInput: InvestigationWorkflowInput,
) {
  "use workflow";

  // See: https://useworkflow.dev/docs/errors/fetch-in-workflow
  globalThis.fetch = fetch;

  const input = investigationInputSchema.parse(rawInput);
  const toolCallCounts: InvestigationToolCallCounts = {};
  const writable = getWritable<UIMessageChunk>();
  const reportOutput = WorkflowOutput.object({ schema: reportSchema });
  const reportOutputSpecification = {
    type: "object" as const,
    responseFormat: await reportOutput.responseFormat,
    parseOutput: reportOutput.parseCompleteOutput.bind(reportOutput),
    parsePartial: reportOutput.parsePartialOutput.bind(reportOutput),
  };

  // Phase tracking is heuristic rather than semantic:
  // every research tool call advances a shared counter, and phases advance
  // when that counter crosses evenly sized call buckets (`callsPerPhase`).
  // This means phases reflect "research effort spent so far", not whether the
  // model explicitly declared a phase complete.
  //
  // Important edge case: the backend only marks a phase as completed when it
  // advances into a later phase. Because the last phase has no successor, it
  // typically remains `in-progress` until the stream ends, and the frontend
  // marks any remaining non-completed phases as completed for final display.
  const phases = input.phases ?? [];
  let phasesInitialized = false;
  let currentPhaseIndex = -1;
  let researchCallCount = 0;
  const callsPerPhase = getCallsPerPhase(phases.length);

  function incrementToolCall(tool: keyof InvestigationToolCallCounts) {
    toolCallCounts[tool] = (toolCallCounts[tool] ?? 0) + 1;
  }

  async function autoAdvancePhase() {
    if (phases.length === 0) return;

    if (!phasesInitialized) {
      await emitProgress({
        kind: "phases-init",
        phases: phases.map((p) => ({ ...p, status: "pending" })),
      });
      phasesInitialized = true;
    }

    researchCallCount++;

    const targetIndex = getTargetPhaseIndex(
      researchCallCount,
      phases.length,
      callsPerPhase,
    );

    if (targetIndex > currentPhaseIndex) {
      if (currentPhaseIndex >= 0) {
        await emitProgress({
          kind: "phase-update",
          phaseId: phases[currentPhaseIndex].id,
          status: "completed",
        });
      }
      currentPhaseIndex = targetIndex;
      await emitProgress({
        kind: "phase-update",
        phaseId: phases[currentPhaseIndex].id,
        status: "in-progress",
      });
    } else if (currentPhaseIndex === -1) {
      currentPhaseIndex = 0;
      await emitProgress({
        kind: "phase-update",
        phaseId: phases[0].id,
        status: "in-progress",
      });
    }
  }

  const tools = createInvestigationTools({
    onToolStart: async (tool) => {
      await autoAdvancePhase();
      incrementToolCall(tool);
    },
  });

  const agent = new DurableAgent({
    model: AGENT_MODEL,
    system: createInvestigationSystemPrompt(),
    tools,
  });

  const result = await agent.stream({
    messages: [
      {
        role: "user",
        content: createInvestigationUserPrompt(input),
      },
    ],
    writable,
    maxSteps: AGENT_MAX_STEPS,
    experimental_output: reportOutputSpecification,
  });

  if (Object.keys(toolCallCounts).length > 0) {
    console.log(
      "Investigation tool usage for title=%s, geography=%s:",
      input.title,
      input.geography,
      toolCallCounts,
    );
  }

  const report = finalizeReport(result.experimental_output, input);
  return report;
}

function finalizeReport(
  report: z.infer<typeof reportSchema> | undefined,
  input: InvestigationWorkflowInput,
): Report {
  const fallbackSlug = slugify(input.title) || "investigation-report";

  const base: Report = {
    slug: fallbackSlug,
    title: input.title,
    summary: input.description || input.title,
    executiveSummary: input.description || input.title,
    category: input.category as ReportCategory,
    geography: input.geography || "Global",
    tags: [],
    publishedAt: new Date().toISOString(),
    featured: false,
    stakeholders: [],
    motivations: [],
    evidence: [],
    assumptions: [],
    limitations: [],
    alternativeExplanations: [],
  };

  if (!report) {
    return base;
  }

  return {
    ...base,
    ...report,
    slug: report.slug || base.slug,
    category: (report.category || base.category) as ReportCategory,
    geography: report.geography || base.geography,
    publishedAt: report.publishedAt || base.publishedAt,
    featured: report.featured ?? base.featured,
  };
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
