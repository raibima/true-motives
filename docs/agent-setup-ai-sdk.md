## Mapping the Agent Setup to AI SDK (TypeScript)

This document maps the roles from `example-agent-setup.md` (Orchestrator, Planner, Researcher, Analyst, Critic) to a concrete implementation using **TypeScript** and the **AI SDK** (`ai` package from `ai-sdk.dev`).

It uses:

- `ToolLoopAgent` for agents and subagents  
- `tool()` for tools (including subagent tools)  
- AI SDK subagent patterns for deep research tasks

The examples are framework-agnostic Node/TypeScript, but they plug directly into Next.js, etc.

---

## 1. Installation and Imports

```ts
// Install:
//   npm install ai zod
// and configure your provider (OpenAI, Anthropic, etc.) per ai-sdk.dev docs.

import { ToolLoopAgent, tool, stepCountIs, Output } from 'ai';
import { openai } from '@ai-sdk/openai'; // or other provider
import { z } from 'zod';
```

You can swap `openai` for any supported provider (`anthropic`, `groq`, etc.) as documented on `ai-sdk.dev`.

---

## 2. Shared Tools and Services

In the conceptual design, multiple agents share:

- `memory_api`
- `notes_api`
- `draft_api`
- `citation_mapper`

In AI SDK, these are **plain TypeScript services** that your tools call.

```ts
// Example in-memory stores (replace with DB / vector store / search, etc.)
const investigations = new Map<string, any>();
const notes = new Map<string, any[]>();
const drafts = new Map<string, any>();

export const memoryApi = {
  createInvestigation(id: string, payload: any) {
    investigations.set(id, { ...payload, id, status: 'active' });
  },
  readInvestigation(id: string) {
    return investigations.get(id) ?? null;
  },
  updateInvestigationStatus(id: string, status: string) {
    const existing = investigations.get(id);
    if (existing) investigations.set(id, { ...existing, status });
  },
};

export const notesApi = {
  append(id: string, note: any) {
    const current = notes.get(id) ?? [];
    current.push(note);
    notes.set(id, current);
  },
  read(id: string, filters?: any) {
    // For now ignore filters
    return notes.get(id) ?? [];
  },
};

export const draftApi = {
  save(id: string, draft: any) {
    drafts.set(id, draft);
  },
  read(id: string) {
    return drafts.get(id) ?? null;
  },
};
```

---

## 3. Subagents with ToolLoopAgent

The roles from `example-agent-setup.md` map naturally to **subagents** in AI SDK:

- `plannerAgent` → planning subagent
- `researcherAgent` → evidence-gathering subagent
- `analystAgent` → synthesis subagent
- `criticAgent` → critique subagent
- `orchestratorAgent` → main agent that calls the subagents via tools

Each subagent is a `ToolLoopAgent` with its own:

- `model`
- `instructions`
- Optional `tools`
- `stopWhen` loop control for multi-step reasoning and tool use

### 3.1 Planner Subagent

```ts
const plannerAgent = new ToolLoopAgent({
  model: openai('gpt-4.5-mini'), // or other capable but cheaper model
  instructions: `
You are the Planner in a deep-research system.
Transform a user question and context into a clear, executable research plan.

Output JSON with:
- subQuestions: array of short questions to answer
- tasks: array of { id, subQuestionIndex, priority, suggestedAgent, suggestedTools }
- notes: any assumptions or constraints

Be concise but explicit enough for other agents to follow.
  `.trim(),
  output: Output.object({
    schema: z.object({
      subQuestions: z.array(z.string()),
      tasks: z.array(
        z.object({
          id: z.string(),
          subQuestionIndex: z.number().int(),
          priority: z.enum(['high', 'medium', 'low']),
          suggestedAgent: z.enum(['researcher', 'analyst', 'critic']).optional(),
          suggestedTools: z.array(z.string()).optional(),
        }),
      ),
      notes: z.string().optional(),
    }),
  }),
  stopWhen: stepCountIs(8),
});
```

Tool to expose `plannerAgent` to the orchestrator:

```ts
export const plannerTool = tool({
  description: 'Create or refine a research plan for an investigation.',
  inputSchema: z.object({
    investigationId: z.string(),
    userQuestion: z.string(),
    constraints: z
      .object({
        depth: z.enum(['quick', 'standard', 'deep']).optional(),
        timeHorizon: z.string().optional(),
      })
      .optional(),
  }),
  execute: async ({ investigationId, userQuestion, constraints }) => {
    const { output } = await plannerAgent.generate({
      prompt: `
User question:
${userQuestion}

Constraints:
${JSON.stringify(constraints ?? {}, null, 2)}

Return a plan as specified.
      `.trim(),
    });

    memoryApi.createInvestigation(investigationId, {
      question: userQuestion,
      constraints,
      plan: output,
    });

    return output;
  },
});
```

---

### 3.2 Researcher Subagent

The Researcher uses external tools (web/academic search, internal RAG) and writes notes.

Assume you have concrete implementations:

- `webSearchApi(query, filters?)`
- `webFetchPage(url)`
- `academicSearchApi(query, filters?)`

Wrap them as AI SDK tools for the **Researcher**:

```ts
const webSearchTool = tool({
  description: 'General web search with optional filters.',
  inputSchema: z.object({
    query: z.string(),
    timeRange: z
      .object({
        from: z.string().optional(),
        to: z.string().optional(),
      })
      .optional(),
  }),
  execute: async ({ query, timeRange }) => {
    // Replace with your own implementation.
    const results = await webSearchApi(query, timeRange);
    return results; // e.g. [{ url, title, snippet, publishedAt }, ...]
  },
});

const webBrowseTool = tool({
  description: 'Fetch and extract main content from a web page.',
  inputSchema: z.object({
    url: z.string().url(),
  }),
  execute: async ({ url }) => {
    const page = await webFetchPage(url);
    return page; // { url, title, text, headings, ... }
  },
});
```

Define the Researcher agent:

```ts
const researcherAgent = new ToolLoopAgent({
  model: openai('gpt-4.5-mini'),
  instructions: `
You are the Researcher in a deep-research system.
You receive a specific sub-question and must gather evidence.

Use webSearch and webBrowse to:
- Find high-quality, relevant sources
- Extract key claims, numbers, and limitations
- Record citations (url, title, author if available, date)

Write notes as structured JSON objects with:
- subQuestion
- findings: array of { claim, support, sourceUrl, sourceTitle, sourceMeta }
- limitations: array of strings

Never fabricate sources or URLs. If uncertain, say so explicitly.
  `.trim(),
  tools: {
    webSearch: webSearchTool,
    webBrowse: webBrowseTool,
  },
  stopWhen: stepCountIs(16),
});
```

Tool that the orchestrator will use to call the Researcher and save notes:

```ts
export const researcherTool = tool({
  description: 'Investigate a sub-question and append notes to the investigation notebook.',
  inputSchema: z.object({
    investigationId: z.string(),
    subQuestion: z.string(),
    context: z.string().optional(), // additional context or constraints
  }),
  execute: async ({ investigationId, subQuestion, context }) => {
    const { text } = await researcherAgent.generate({
      prompt: `
Investigation ID: ${investigationId}
Sub-question: ${subQuestion}

Additional context:
${context ?? '(none)'}

Follow your instructions, gather evidence, and output JSON-formatted notes.
      `.trim(),
    });

    // In a real system, parse and validate JSON here; for brevity we store raw text.
    notesApi.append(investigationId, {
      subQuestion,
      raw: text,
      createdAt: new Date().toISOString(),
    });

    return { subQuestion, notes: text };
  },
});
```

---

### 3.3 Analyst Subagent

Reads notes, synthesizes a structured draft, and saves it to `draftApi`.

```ts
const analystAgent = new ToolLoopAgent({
  model: openai('gpt-4.5-mini'),
  instructions: `
You are the Analyst in a deep-research system.
You read notes and produce structured, well-organized drafts.

Given:
- The original user question.
- A set of notes with citations.

Produce a Markdown draft with:
- A short executive summary.
- Thematic sections.
- Explicit mentions of evidence strength, limitations, and open questions.
- Inline citation markers like [S1], [S2] that refer to a reference list.

At the end, include a "References" section listing sources (URL, title, date if known).
  `.trim(),
  stopWhen: stepCountIs(10),
});

export const analystTool = tool({
  description: 'Synthesize notes for an investigation into a structured draft.',
  inputSchema: z.object({
    investigationId: z.string(),
  }),
  execute: async ({ investigationId }) => {
    const inv = memoryApi.readInvestigation(investigationId);
    const allNotes = notesApi.read(investigationId);

    const { text } = await analystAgent.generate({
      prompt: `
User question:
${inv?.question ?? '(unknown)'}

Constraints:
${JSON.stringify(inv?.constraints ?? {}, null, 2)}

Notes:
${JSON.stringify(allNotes, null, 2)}

Write the draft as specified in your instructions.
      `.trim(),
    });

    draftApi.save(investigationId, { markdown: text });

    return { draft: text };
  },
});
```

---

### 3.4 Critic Subagent

Critiques the draft and can suggest follow-ups.

```ts
const criticAgent = new ToolLoopAgent({
  model: openai('gpt-4.5-mini'),
  instructions: `
You are the Critic in a deep-research system.
You evaluate a draft for factual support, coverage, and overconfidence.

Given:
- The user question.
- The current draft (Markdown).
- Any raw notes or citation info.

Output JSON with:
- issues: array of { type, severity, description, locationHint }
- suggestions: array of { description, suggestedFollowUp }
- overallAssessment: string

Be conservative: flag potential problems even if you are not certain.
  `.trim(),
  output: Output.object({
    schema: z.object({
      issues: z.array(
        z.object({
          type: z.string(),
          severity: z.enum(['low', 'medium', 'high']),
          description: z.string(),
          locationHint: z.string().optional(),
        }),
      ),
      suggestions: z.array(
        z.object({
          description: z.string(),
          suggestedFollowUp: z.string(),
        }),
      ),
      overallAssessment: z.string(),
    }),
  }),
  stopWhen: stepCountIs(8),
});

export const criticTool = tool({
  description: 'Critique the current draft of an investigation.',
  inputSchema: z.object({
    investigationId: z.string(),
  }),
  execute: async ({ investigationId }) => {
    const inv = memoryApi.readInvestigation(investigationId);
    const draft = draftApi.read(investigationId);
    const allNotes = notesApi.read(investigationId);

    const { output } = await criticAgent.generate({
      prompt: `
User question:
${inv?.question ?? '(unknown)'}

Draft:
${draft?.markdown ?? '(no draft yet)'}

Notes:
${JSON.stringify(allNotes, null, 2)}

Evaluate and respond with JSON as specified.
      `.trim(),
    });

    return output;
  },
});
```

---

## 4. Orchestrator Agent in AI SDK

The Orchestrator is a `ToolLoopAgent` that:

- Receives the user question and investigation ID.
- Delegates to `plannerTool`, `researcherTool`, `analystTool`, `criticTool` as needed.
- Optionally runs a few loops to refine the answer.

```ts
export const orchestratorAgent = new ToolLoopAgent({
  model: openai('gpt-4.5-mini'),
  instructions: `
You are the Orchestrator for a deep-research assistant.

You do not browse the web directly. Instead, you:
- Call the planner tool to create or refine a research plan.
- Call the researcher tool to gather evidence for sub-questions.
- Call the analyst tool to synthesize notes into a draft.
- Call the critic tool to evaluate the draft and decide if more work is needed.

At the end, you return a final answer for the user that:
- Summarizes the key findings.
- Clearly labels speculation vs. well-supported claims.
- Mentions important limitations and open questions.

When interacting with tools:
- Use planner first when there is no plan.
- Use researcher in batches to avoid exceeding budgets.
- Use analyst when there is enough evidence to draft.
- Use critic after analyst, and loop back to planner/researcher if needed.
  `.trim(),
  tools: {
    planner: plannerTool,
    researcher: researcherTool,
    analyst: analystTool,
    critic: criticTool,
  },
  stopWhen: stepCountIs(20),
});
```

You can expose the Orchestrator as an API route or function:

```ts
export async function runInvestigation(params: {
  investigationId: string;
  userQuestion: string;
}) {
  const { investigationId, userQuestion } = params;

  const { text } = await orchestratorAgent.generate({
    prompt: `
You are starting a new investigation.

Investigation ID: ${investigationId}
User question: ${userQuestion}

If there is no plan yet, call the planner tool.
Then progressively call researcher, analyst, and critic as needed.
When satisfied, answer the user directly.
    `.trim(),
  });

  return text;
}
```

---

## 5. Optional: Use Subagents with Streaming

If you want the **Orchestrator** to call, for example, the Researcher as a streaming subagent (showing progress in the UI) while controlling what the model “sees”, you can wrap `researcherAgent` per the **subagents** docs.

Sketch:

```ts
import { readUIMessageStream } from 'ai';

export const researcherSubagentTool = tool({
  description: 'Streaming research subagent for deep investigations.',
  inputSchema: z.object({
    task: z.string(),
  }),
  execute: async function* ({ task }, { abortSignal }) {
    const stream = await researcherAgent.stream({
      prompt: task,
      abortSignal,
    });

    for await (const message of readUIMessageStream({
      stream: stream.toUIMessageStream(),
    })) {
      // each yield is a full UIMessage with accumulated content
      yield message;
    }
  },
  toModelOutput: ({ output: message }) => {
    // Compress to a short summary for the orchestrator model
    const lastTextPart = message?.parts.findLast(p => p.type === 'text');
    return {
      type: 'text',
      value: lastTextPart?.text ?? 'Research task completed.',
    };
  },
});
```

You’d then swap `researcher: researcherTool` with `researcher: researcherSubagentTool` in the Orchestrator tools, allowing the UI to stream Researcher progress while the Orchestrator sees only a compact summary.

---

## 6. Summary

- Each conceptual role (Planner, Researcher, Analyst, Critic, Orchestrator) is a `**ToolLoopAgent**` in AI SDK with its own system instructions and tool set.
- Subagents are implemented by wrapping agents in **tools**; they can run synchronously or as streaming subagents with `readUIMessageStream` and `toModelOutput`.
- Shared services (`memoryApi`, `notesApi`, `draftApi`) are plain TypeScript modules called inside tool `execute` functions.
- The Orchestrator agent coordinates everything by calling these tools within a multi-step agent loop controlled by `stepCountIs` and other stop conditions.

