# Feasibility Study: Frontend–Backend Integration

**Project:** TrueMotives  
**Date:** March 17, 2026  
**Scope:** Connecting the existing Next.js 16 frontend to the deep-research agent backend described in `docs/`, using **Workflow DevKit** (useworkflow.dev) as the durable workflow runtime

---

## 1. Current State Assessment

### 1.1 Frontend

The frontend is a **Next.js 16 (App Router) + React 19 + TypeScript** application with a polished UI built on React Aria Components, Tailwind CSS v4, and a comprehensive design-token system. It has two main areas:

| Area | Routes | Status |
|---|---|---|
| **Public site** | `/`, `/reports`, `/reports/[slug]`, `/pricing` | Server-rendered, reads from in-memory mock data |
| **Dashboard** | `/dashboard`, `/dashboard/new`, `/dashboard/investigations/[id]` | Mix of server and client components, entirely mock-driven |

Key observations:

- **No API routes exist.** There is no `app/api/` directory. No Server Actions (`"use server"`) are defined anywhere.
- **All data is mock.** `lib/mock-data.ts` exports hardcoded arrays of `Report[]` and `Investigation[]`. Every page reads from these in-memory objects at import time.
- **The "new investigation" form** (`app/dashboard/new/page.tsx`) simulates a 1.8-second delay and then hard-redirects to a mock investigation (`inv-003`). No form data is actually persisted or sent anywhere.
- **The generation progress view** (`GenerationProgress.tsx`) simulates a live activity log with hardcoded strings on a `setInterval` timer. No real backend events are consumed.
- **Buttons like "Retry generation", "Generate motives analysis", "Publish to library", "Export", and "Edit notes"** are all non-functional `<button>` elements with no handlers.

### 1.2 Backend (As Described in Docs)

The documentation describes a **multi-agent deep-research system** using the Vercel AI SDK (`ai` package), with five specialized agents:

| Agent | Role | AI SDK Construct |
|---|---|---|
| **Orchestrator** | Drives the full investigation lifecycle | `ToolLoopAgent` calling subagent tools |
| **Planner** | Decomposes queries into sub-questions and tasks | `ToolLoopAgent` with structured output |
| **Researcher** | Gathers evidence via external APIs | `ToolLoopAgent` with search/browse tools |
| **Analyst** | Synthesizes notes into structured drafts | `ToolLoopAgent` |
| **Critic** | Evaluates drafts for accuracy and coverage | `ToolLoopAgent` with structured output |

Concrete tool implementations already exist in `lib/`:

| Module | External API | Ready? |
|---|---|---|
| `lib/brave-search.ts` | Brave Search | Yes — fully implemented |
| `lib/firecrawl.ts` | Firecrawl v2 | Yes — fully implemented |
| `lib/gdelt.ts` | GDELT Cloud | Yes — fully implemented |
| `lib/newsapi.ts` | NewsAPI v2 | Yes — fully implemented |
| `lib/ai-research-tools.ts` | AI SDK tool wrappers for all of the above | Yes — fully implemented |

The AI SDK (`ai@^6.0.116`) and Zod (`zod@^4.3.6`) are already in `package.json` and installed.

### 1.3 Workflow DevKit (useworkflow.dev)

Workflow DevKit is a TypeScript framework (currently in beta) that adds **durability, resumability, and observability** to async functions and AI agents. It provides:

- **`"use workflow"` / `"use step"` directives** — convert regular async functions into durable, resumable workflows with persisted state.
- **`DurableAgent`** (`@workflow/ai/agent`) — a drop-in wrapper around AI SDK's `Agent` that makes LLM calls, tool executions, and streaming into retryable, observable workflow steps.
- **Persistent streaming** via `getWritable()` / `run.readable` — streams survive server restarts and support client reconnection from a specific index.
- **Automatic retries** — step functions (`"use step"`) are retried up to 3 times by default on failure.
- **Hooks and webhooks** — first-class support for pausing workflows to wait for external events (human-in-the-loop).
- **Built-in observability** — `npx workflow web` opens a local dashboard showing workflow runs, step traces, and retry history.
- **First-class Next.js integration** — `withWorkflow(nextConfig)` enables the directives with zero additional config.

### 1.4 Gap Summary

| Concern | Current State | Required State |
|---|---|---|
| Workflow runtime | None | Workflow DevKit (`workflow` + `@workflow/ai`) |
| API layer | None | Route Handlers calling `start()` to launch workflows |
| Agent implementation | Documented only | `DurableAgent` instances wired to research tools inside `"use workflow"` functions |
| In-flight investigation persistence | None (mock data) | Handled automatically by Workflow DevKit's event log |
| Completed report persistence | In-memory mock arrays | Database for long-term storage (Phase 3) |
| Real-time progress | Simulated `setInterval` | `run.readable` stream consumed via `createUIMessageStreamResponse` |
| Form submission | Fake delay + hard redirect | POST to route handler → `start(workflow)` → redirect with run ID |
| LLM provider | Not configured | `@ai-sdk/openai` or `@ai-sdk/anthropic` (or Vercel AI Gateway) |

---

## 2. Feasibility Assessment: Is This Integration Viable?

**Yes — high feasibility.** Workflow DevKit significantly simplifies the integration compared to a raw AI SDK approach, for these reasons:

1. **The frontend data model already matches the agent output model.** The `Report` type in `lib/types.ts` (with `stakeholders`, `motivations`, `evidence`, `assumptions`, `limitations`, `alternativeExplanations`) maps directly to what the Analyst agent produces. No schema redesign is needed.

2. **AI SDK compatibility is built in.** `DurableAgent` from `@workflow/ai/agent` has full AI SDK parity — same `tool()` definitions, same `streamText` options, same `UIMessageChunk` streaming protocol. The existing research tools in `lib/ai-research-tools.ts` can be used directly as `DurableAgent` tools.

3. **Durability solves the hardest problems for free.** Deep research investigations run 60–120+ seconds. With raw AI SDK, you'd need to build your own job queue, state persistence, retry logic, and stream resumption. Workflow DevKit provides all of these out of the box:
   - Workflows survive server restarts (event-sourced state).
   - Failed tool calls (e.g., Brave Search rate limit) are automatically retried.
   - Streams are persistent and resumable — clients can reconnect at any chunk index.

4. **Next.js 16 integration is first-class.** `withWorkflow(nextConfig)` is all that's needed. No separate worker process, no Redis, no external job queue to manage in development.

5. **No conflicting architectural patterns.** The frontend has no existing state management library, no data-fetching layer, and no auth system that would conflict.

6. **Environment variables for external APIs are already configured.** `.env.local` contains valid keys for Brave Search, Firecrawl, GDELT, and NewsAPI.

### 2.1 Risk Assessment

| Risk | Severity | Mitigation |
|---|---|---|
| **Workflow DevKit is in beta** — APIs may change | Medium | Pin `workflow` and `@workflow/ai` versions. The core primitives (`"use workflow"`, `"use step"`, `DurableAgent`, `start()`) are stable and well-documented. Monitor the changelog. |
| **LLM cost and latency** — multi-agent loops with 4+ subagents can be expensive | Medium | Start with a single `DurableAgent` using role-switching instructions (documented in `example-agent-setup.md` §8). Graduate to multi-agent orchestration once the single-agent version is stable. |
| **Completed report persistence** — Workflow DevKit persists in-flight state, but completed investigations need long-term storage | Medium | Workflow DevKit handles in-flight durability. Add a database (SQLite/Postgres) in Phase 3 for completed reports. In Phase 1, store reports in-memory or as workflow return values. |
| **No authentication** — the dashboard has no auth, so any user could trigger expensive LLM calls | Low (dev phase) | Out of scope for initial integration but must be addressed before any public deployment. |
| **Production deployment** — Workflow DevKit works best on Vercel; other platforms require additional configuration | Low | The project appears Vercel-targeted (Next.js 16 canary). If self-hosting is needed, Workflow DevKit supports custom deployments with documented configuration. |
| **`"use workflow"` sandbox limitations** — workflow functions run in a sandboxed environment without full Node.js access | Low | This is by design. All I/O (API calls, database access) goes into `"use step"` functions, which have full Node.js access. This is a clean separation that matches the agent architecture. |

### 2.2 Why Workflow DevKit over Raw AI SDK

The original docs describe the backend in terms of AI SDK's `ToolLoopAgent`. Here's what Workflow DevKit adds on top:

| Concern | Raw AI SDK | With Workflow DevKit |
|---|---|---|
| Durability | None — if the server restarts, the investigation is lost | Automatic — workflow state is event-sourced and persisted |
| Tool retries | Manual — you write try/catch and retry loops | Automatic — `"use step"` retries up to 3 times by default |
| Stream resumption | Manual — you build reconnection logic | Built-in — `run.getReadable({ startIndex })` resumes from any chunk |
| Observability | Manual — you instrument logging yourself | Built-in — `npx workflow web` shows traces, steps, retries |
| Background execution | Manual — you build a job queue or use a separate worker | Built-in — `start()` returns immediately, workflow runs in the background |
| Human-in-the-loop | Not supported | Built-in — hooks and webhooks for approval workflows |
| Cost | Free (AI SDK is open source) | Free in development; production pricing tied to Vercel or self-hosted runtime |

The net effect is that **Phase 3 from the original plan (persistence + production hardening) is largely absorbed into Phase 1** with Workflow DevKit.

---

## 3. Integration Strategy

### 3.1 Phased Approach

#### Phase 1: Durable Agent Vertical Slice

**Goal:** Replace the mock form submission with a real end-to-end flow — form → API → DurableAgent workflow → streamed result → rendered report.

1. **Install dependencies:**
   - `workflow` — core framework
   - `@workflow/ai` — DurableAgent and AI integration
   - An LLM provider (e.g. `@ai-sdk/openai` or `@workflow/ai/openai`)
2. **Configure Next.js** — wrap `next.config.ts` with `withWorkflow()`.
3. **Create the investigation workflow** (`workflows/investigation/workflow.ts`):
   - A `"use workflow"` function that instantiates a `DurableAgent` with the existing `aiResearchTools` and system instructions.
   - Streams output via `getWritable<UIMessageChunk>()`.
4. **Convert research tools to durable steps** — add `"use step"` to the `execute` functions in `lib/ai-research-tools.ts` (or create wrapper step functions). This gives every external API call automatic retries.
5. **Create a route handler** (`app/api/investigations/route.ts`):
   - `POST` — calls `start(investigationWorkflow, [params])`, returns the run ID and a streaming response via `createUIMessageStreamResponse({ stream: run.readable })`.
6. **Create a stream reconnection route** (`app/api/investigations/[runId]/stream/route.ts`):
   - `GET` — calls `getRun(runId).getReadable({ startIndex })` for resumable streaming.
7. **Update the frontend** (4 files — details in §5).

#### Phase 2: Multi-Agent Orchestration

**Goal:** Replace the single `DurableAgent` with the full Orchestrator → Planner → Researcher → Analyst → Critic pipeline.

1. Implement each subagent as a separate `DurableAgent` inside its own `"use workflow"` or as a tool that delegates to a nested `DurableAgent.stream()` call.
2. The orchestrator workflow function sequences these agents: plan → research (loop) → analyze → critique → (optionally loop back).
3. Use **namespaced streams** (`getWritable({ namespace: "progress" })`) to emit structured progress events separately from the main AI response stream.
4. Implement `memoryApi`, `notesApi`, and `draftApi` as `"use step"` functions that write to a persistence layer.
5. Map the agent's structured output (via `Output.object()` / Zod schema) to the existing `Report` type.

#### Phase 3: Persistence + Production Hardening

**Goal:** Add long-term storage for completed investigations and harden for production.

1. Add a database (recommended: SQLite with Drizzle ORM for simplicity, or Postgres for scale) for completed investigations and published reports.
2. Add authentication (e.g. NextAuth / Clerk / Auth.js).
3. Add rate limiting and cost budgets per investigation.
4. Implement human-in-the-loop approval flows using Workflow DevKit hooks (e.g., for high-cost investigations or sensitive topics).
5. Configure production deployment (Vercel recommended for simplest path).

**Note:** Unlike the original plan, in-flight investigation durability, tool retries, and stream resumption are already handled by Phase 1. Phase 3 focuses only on completed-data persistence and access control.

### 3.2 Streaming Architecture

```
┌──────────────┐     POST /api/investigations          ┌───────────────────────┐
│   Frontend    │ ────────────────────────────────────► │  Route Handler        │
│  (New form)   │     { title, description, ... }       │                       │
└──────────────┘                                        │  run = await start(   │
       │                                                │    investigationWf,   │
       │  returns { runId }                             │    [params]           │
       │  + streams run.readable                        │  )                    │
       │  via createUIMessageStreamResponse             │                       │
       ▼                                                └───────────────────────┘
┌──────────────┐                                                  │
│  redirect to │                                                  │
│  /dashboard/ │                                                  ▼
│  investigations                                       ┌───────────────────────┐
│  /{runId}    │                                        │  "use workflow"       │
└──────────────┘                                        │                       │
       │                                                │  DurableAgent with    │
       ▼                                                │  research tools       │
┌──────────────┐   GET /api/investigations/{runId}/     │  (each tool is a      │
│  Frontend    │   stream?startIndex=N                  │  "use step" function  │
│  (Progress)  │ ─────────────────────────────────────► │  with auto-retries)   │
│              │                                        │                       │
│              │ ◄──── run.getReadable({ startIndex })  │  Streams UIMessage    │
│              │       (resumable persistent stream)     │  chunks via           │
└──────────────┘                                        │  getWritable()        │
                                                        └───────────────────────┘
```

Key architectural advantages over the original plan:

- **No separate streaming endpoint is strictly necessary for the initial flow.** The `POST` handler can return the stream directly via `createUIMessageStreamResponse({ stream: run.readable })`. The separate `GET` endpoint is only needed for reconnection (page refresh, navigation away and back).
- **Streams are persistent.** If the user navigates away and returns, the `GET` endpoint with `startIndex` resumes from where they left off — no data loss.
- **The workflow runs in the background.** `start()` enqueues the workflow; it doesn't block the API route. The route returns immediately with the stream handle.

### 3.3 How DurableAgent Replaces ToolLoopAgent

The docs describe agents using AI SDK's `ToolLoopAgent`. With Workflow DevKit, the mapping is:

| Docs Concept | Workflow DevKit Equivalent |
|---|---|
| `new ToolLoopAgent({ model, instructions, tools, stopWhen })` | `new DurableAgent({ model, instructions, tools, maxSteps })` |
| `agent.generate({ prompt })` | `agent.stream({ messages, writable })` |
| `tool({ execute: async (input) => { ... } })` | Same `tool()` from AI SDK, but the `execute` function uses `"use step"` for durability |
| `stepCountIs(N)` stop condition | `maxSteps: N` option on `stream()` |
| `Output.object({ schema })` for structured output | `experimental_output: Output.object({ schema })` on `stream()` |
| In-memory `memoryApi` / `notesApi` / `draftApi` | Same pattern, but `"use step"` functions writing to a DB |
| Subagent tools wrapping inner agents | Nested `DurableAgent.stream()` calls within tool execute functions |

---

## 4. Code Structure Recommendation

### 4.1 New Files to Create

```
workflows/
  investigation/
    workflow.ts                   # Main investigation workflow ("use workflow")
    steps/
      research.ts                 # Durable step wrappers for research tools
      analyze.ts                  # Analyst step (Phase 2)
      critique.ts                 # Critic step (Phase 2)
      persist.ts                  # Save results to DB (Phase 3)

app/
  api/
    investigations/
      route.ts                    # POST: start investigation workflow, stream response
      [runId]/
        stream/
          route.ts                # GET: reconnect to an in-progress workflow stream

lib/
  report-mapper.ts                # Maps agent structured output → Report type
```

### 4.2 Files to Modify

| File | Change |
|---|---|
| `next.config.ts` | Wrap with `withWorkflow()` from `workflow/next`. |
| `tsconfig.json` | (Optional) Add `"workflow"` to `compilerOptions.plugins` for IDE hints. |
| `app/dashboard/new/page.tsx` | Replace simulated `handleSubmit` with a real `fetch` POST to `/api/investigations`. Redirect using the returned run ID. |
| `app/dashboard/investigations/[id]/page.tsx` | Fetch investigation data from the workflow run (via `getRun()`) instead of `getInvestigationById()`. For generating investigations, connect to the stream. |
| `components/dashboard/GenerationProgress.tsx` | Replace `setInterval` simulation with `useChat` or a custom stream consumer reading from `/api/investigations/{runId}/stream`. Map `UIMessageChunk` events to phase updates and activity log entries. |
| `app/dashboard/page.tsx` | Fetch investigations from the persistence layer instead of `getInvestigations()`. |
| `lib/ai-research-tools.ts` | Add `"use step"` directive to each tool's `execute` function (or create durable wrapper functions in `workflows/investigation/steps/research.ts`). |
| `.env.local` | Add the LLM provider API key (e.g., `OPENAI_API_KEY`). |

### 4.3 Files to Keep As-Is

| File | Reason |
|---|---|
| `lib/brave-search.ts` | Already a complete, working API client. Called from within `"use step"` functions. |
| `lib/firecrawl.ts` | Already a complete, working API client. |
| `lib/gdelt.ts` | Already a complete, working API client. |
| `lib/newsapi.ts` | Already a complete, working API client. |
| `lib/mock-data.ts` | Keep for development/seeding; the public `/reports` pages can continue using it. |
| All `components/ui/*` | UI component library is unaffected. |
| Public pages (`app/(public)/*`) | No changes needed for initial integration. |

---

## 5. Frontend Adjustments

### 5.1 New Investigation Form (`app/dashboard/new/page.tsx`)

**Current behavior:** Client-side `setTimeout` → redirect to hardcoded `inv-003`.

**Required change:** Replace with a real API call. The route handler starts the workflow and returns a stream. The form handler can either (a) consume the stream inline, or (b) just POST, grab the run ID, and redirect.

Recommended approach (redirect-first, simplest):

```typescript
async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setIsSubmitting(true);

  const formData = new FormData(e.currentTarget);

  const res = await fetch("/api/investigations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      geography: formData.get("geography"),
      context: formData.get("context"),
    }),
  });

  const { runId } = await res.json();
  router.push(`/dashboard/investigations/${runId}`);
}
```

**Impact:** Minimal — the form fields and UI remain unchanged. Only the submit handler changes.

### 5.2 Generation Progress (`components/dashboard/GenerationProgress.tsx`)

**Current behavior:** Simulated log entries via `setInterval`, fake percentage increment.

**Required change:** This is the most significant frontend change. The component must consume the real workflow stream and map it to the existing phase/log/progress UI.

Recommended approach:

1. On mount, open a streaming connection to `/api/investigations/{runId}/stream`. Use AI SDK's `useChat` hook or a custom reader using the `fetch` API with `ReadableStream`.
2. Parse incoming `UIMessageChunk` events. Tool call events map to activity log entries; tool results and text chunks map to phase transitions.
3. Workflow DevKit tools can emit **custom progress data chunks** (via `getWritable()` inside step functions) that carry structured phase/progress metadata alongside the main AI response.
4. On stream completion, transition the investigation to `completed` and display the report. On error, show `failed` state.
5. If the user navigates away and returns, the `GET` stream endpoint with `startIndex` resumes without data loss — no special frontend logic needed beyond re-fetching.

Key mapping from workflow events to UI:

| Workflow Event | UI Update |
|---|---|
| Agent calls a research tool (Brave/Firecrawl/etc.) | Activity log entry (tool name + query visible in the stream) |
| Custom progress chunk (`type: "data-progress"`) | Phase transition + percentage update |
| Agent text streaming | Activity log entry (the LLM's reasoning visible in real-time) |
| Workflow completes | Parse structured output into `Report`, transition to completed view |
| Workflow errors / step retries | Activity log entry showing retry; final failure transitions to error state |

### 5.3 Investigation Detail Page (`app/dashboard/investigations/[id]/page.tsx`)

**Current behavior:** Server component reading from `getInvestigationById()` (mock data).

**Required changes:**

1. Fetch investigation data from the workflow run state (via `getRun(runId)` on the server side) or from a database.
2. For investigations with status `generating`, render the `GenerationProgress` client component and connect it to the stream endpoint.
3. For `draft` status, wire the "Generate motives analysis" button to trigger the workflow via the API.
4. For `failed` status, wire the "Retry generation" button to re-start the workflow.

### 5.4 Dashboard Page (`app/dashboard/page.tsx`)

**Current behavior:** Reads `getInvestigations()` from mock data.

**Required change:** Fetch from the persistence layer. In Phase 1, this could query workflow run states. In Phase 3, this reads from the database.

### 5.5 No Changes Needed

- **Public pages** (`/`, `/reports`, `/reports/[slug]`, `/pricing`) — continue using mock data.
- **UI component library** (`components/ui/*`) — completely unaffected.
- **Layout, theming, and styling** — no structural changes needed.
- **`provider.tsx`** — no additional providers required.

---

## 6. Dependency Changes

### Required Additions (Phase 1)

| Package | Purpose |
|---|---|
| `workflow` | Core Workflow DevKit runtime — durable workflows and steps |
| `@workflow/ai` | `DurableAgent`, AI SDK integration, `Output` helpers |
| `@ai-sdk/openai` **or** `@ai-sdk/anthropic` | LLM provider. Alternatively, use `@workflow/ai/openai` for Vercel AI Gateway integration. |

### Optional Additions (Phase 3)

| Package | Purpose |
|---|---|
| `drizzle-orm` + `better-sqlite3` **or** `@neondatabase/serverless` | Persistent storage for completed investigations and published reports |

### Already Installed (No Changes)

- `ai@^6.0.116` — AI SDK core (Workflow DevKit's `@workflow/ai` builds on top of this)
- `zod@^4.3.6` — schema validation for tool inputs and structured output
- `next@^16.2.0-canary.93` — Workflow DevKit has explicit Next.js 16 support (`workflow@4.0.1-beta.26+`)

---

## 7. Type Alignment Analysis

The existing `Report` type aligns well with the expected agent output. Here is a field-by-field assessment:

| `Report` Field | Agent Source | Alignment |
|---|---|---|
| `slug` | Generated from title (utility function) | Trivial |
| `title` | User input (passed through) | Direct |
| `summary` | Analyst agent output | Direct |
| `executiveSummary` | Analyst agent output | Direct |
| `category` | User input (passed through) | Direct |
| `geography` | User input (passed through) | Direct |
| `tags` | Analyst agent output (inferred from content) | Direct |
| `publishedAt` | Set on publication | Trivial |
| `featured` | Editorial decision (default `false`) | Trivial |
| `stakeholders` | Analyst agent output — structured | Direct match to `Stakeholder[]` |
| `motivations` | Analyst agent output — structured | Direct match to `MotivationHypothesis[]` |
| `evidence` | Researcher notes → Analyst compilation | Direct match to `EvidenceItem[]` |
| `assumptions` | Analyst/Critic agent output | Direct |
| `limitations` | Critic agent output | Direct |
| `alternativeExplanations` | Analyst/Critic agent output | Direct |

**Conclusion:** The existing TypeScript types can be used as the structured output schema for the `DurableAgent` (via Zod + `Output.object()`). No type redesign is needed.

---

## 8. Example: Investigation Workflow (Phase 1 Sketch)

To make the integration concrete, here's a sketch of the core workflow and route handler.

### 8.1 Workflow Definition

```typescript
// workflows/investigation/workflow.ts
import { DurableAgent } from "@workflow/ai/agent";
import { getWritable } from "workflow";
import { openai } from "@ai-sdk/openai";
import { aiResearchTools } from "@/lib/ai-research-tools";
import type { UIMessageChunk } from "ai";

interface InvestigationParams {
  title: string;
  description: string;
  category: string;
  geography: string;
  context?: string;
}

export async function investigationWorkflow(params: InvestigationParams) {
  "use workflow";

  const agent = new DurableAgent({
    model: openai("gpt-4.1"),
    instructions: `You are a deep-research investigative analyst...`,
    tools: aiResearchTools,
    maxSteps: 30,
  });

  const writable = getWritable<UIMessageChunk>();

  const result = await agent.stream({
    messages: [
      {
        role: "user",
        content: `Investigate: ${params.title}\n\n${params.description}`,
      },
    ],
    writable,
  });

  return result;
}
```

### 8.2 Route Handler

```typescript
// app/api/investigations/route.ts
import { createUIMessageStreamResponse } from "ai";
import { start } from "workflow/api";
import { investigationWorkflow } from "@/workflows/investigation/workflow";

export async function POST(req: Request) {
  const params = await req.json();
  const run = await start(investigationWorkflow, [params]);

  return createUIMessageStreamResponse({
    stream: run.readable,
  });
}
```

### 8.3 Stream Reconnection Route

```typescript
// app/api/investigations/[runId]/stream/route.ts
import { getRun } from "workflow/api";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ runId: string }> }
) {
  const { runId } = await params;
  const { searchParams } = new URL(req.url);
  const startIndex = parseInt(searchParams.get("startIndex") ?? "0", 10);

  const run = getRun(runId);
  const stream = run.getReadable({ startIndex });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream" },
  });
}
```

This is approximately **50 lines of backend code** for a working, durable, streamable investigation agent — compared to hundreds of lines of custom infrastructure in the raw AI SDK approach.

---

## 9. Estimated Effort

| Phase | Scope | Estimated Effort |
|---|---|---|
| **Phase 1** — Durable agent vertical slice (DurableAgent workflow, route handlers, frontend stream consumption) | 4–6 new files, 5–6 modified files | 1.5–3 days |
| **Phase 2** — Multi-agent orchestration (Planner, Researcher, Analyst, Critic as separate agents/steps) | 5–8 new files | 3–5 days |
| **Phase 3** — Database for completed reports, auth, production deploy | Schema design, migration, auth integration | 2–4 days |

Total estimated effort: **6.5–12 days** for a single developer familiar with Next.js and the AI SDK.

Phase 1 is notably faster than the original estimate (1.5–3 days vs. 2–3 days) because Workflow DevKit eliminates the need to build custom persistence, retry logic, and stream resumption infrastructure.

---

## 10. Conclusion

Using Workflow DevKit as the backend runtime for TrueMotives is **highly feasible** and provides significant architectural advantages over a raw AI SDK implementation:

1. **Durability for free.** Investigations that take 60–120+ seconds survive server restarts, deployments, and transient failures — without building a custom job queue.
2. **Automatic tool retries.** Every external API call (Brave Search, Firecrawl, GDELT, NewsAPI) wrapped in `"use step"` gets 3 automatic retries. This is critical for a multi-tool research agent hitting rate-limited APIs.
3. **Resumable streaming.** Users can navigate away and return to an in-progress investigation without losing the activity log or progress state.
4. **Built-in observability.** `npx workflow web` provides a trace viewer during development — invaluable for debugging multi-step agent loops.
5. **Minimal frontend impact.** Only 4–5 frontend files need modification. The existing UI (phases, progress bar, activity log) maps directly to `DurableAgent` stream events.
6. **Strong type alignment.** The existing `Report` type works as-is for the agent's structured output schema.
7. **AI SDK compatibility.** `DurableAgent` is a superset of AI SDK's `Agent` — existing tool definitions from `lib/ai-research-tools.ts` work without modification.

The primary trade-off is a **beta dependency** — Workflow DevKit is not yet at v1.0. However, its core primitives are well-documented, it has explicit Next.js 16 support, and it's backed by Vercel. For a project that needs durable, long-running AI agent workflows with streaming, it is the most appropriate framework available in the TypeScript ecosystem today.
