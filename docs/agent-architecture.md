## Deep-Research Agent Architecture (2026)

This document synthesizes recent research and practice (up to 2026) on **deep-research LLM agents**—systems that can run multi-hour / multi-step investigations, browse and cross-check sources, and produce structured, well-cited outputs. It distills ideas from academic work (e.g. ReAct, Reflexion, Graph-of-Thoughts, tool-using agents, multi-agent frameworks like AutoGen), as well as production research systems (e.g. WebGPT-style web agents, retrieval-augmented assistants, and research copilots).

The goal is to describe a **reference architecture** you can adapt to TrueMotives or similar products.

---

## 1. High-Level Design Goals

- **Depth over breadth**: Support multi-step investigations, not single-turn Q&A.
- **Verifiability**: Every important claim traceable to one or more external sources.
- **Controllability**: Clear levers for scope, rigor, allowed tools, and time budget.
- **Modularity**: Swap models, tools, and memory backends without redesigning the whole system.
- **Safety**: Systematic mitigation of hallucinations, stale information, and unsafe tool use.

At a high level, a deep-research agent is an **LLM-orchestrated workflow engine** with:

1. A **planner** that decomposes queries into research tasks.
2. A **tool layer** (web search, browser, code execution, retrieval, etc.).
3. A **memory layer** for working notes and long-term knowledge.
4. One or more **critic / verifier roles** that check evidence and reasoning.
5. A **composer** that turns notes into a final, cited artifact.

---

## 2. Core Components

### 2.1 Orchestrator

**Responsibility**: Drives the research loop, manages tools, and tracks state.

- Implements a **controller loop** akin to ReAct:
  - Observe → Think → Act (tool call) → Observe → …
- Maintains a **research state object**:
  - Original query and constraints (depth, time budget, allowed domains).
  - List of sub-questions / tasks.
  - Current working notes and evidence graph.
  - Tool call history and cost budget.
- Enforces **guardrails**:
  - Max steps per investigation.
  - Rate limiting and backoff for APIs / web.
  - Tool- and domain-specific safety filters.

Orchestration can be implemented as:

- A **finite-state machine** (FSM) / workflow engine (e.g. “PLAN → RESEARCH → SYNTHESIZE → REVIEW”).
- Or a **graph-based controller** (Graph-of-Thoughts / DAG of sub-tasks) for more complex research.

### 2.2 Planner

**Responsibility**: Turn a user query into a **research plan**.

Typical behavior:

- Decompose into **sub-questions** (what must be known to answer?).
- For each sub-question, propose:
  - **Tooling** (search vs. API vs. retrieval vs. code).
  - **Source preferences** (e.g. prefer peer-reviewed, filter by recency).
  - **Verification strategy** (cross-check at least N independent sources, etc.).
- Estimate **time / token / cost budgets** per sub-question.

Research suggests planning works best with:

- **Hierarchical decomposition** (top-level questions → mid-level → leaf tasks).
- **Iterative refinement**:
  - Initial rough plan.
  - Periodic re-planning based on new evidence (e.g. after each N steps).

### 2.3 Tool Layer

**Responsibility**: Interface with the external world.

Recommended tools for deep research:

- **Web search**:
  - General search (e.g. web search APIs).
  - Academic search (e.g. Semantic Scholar / OpenAlex style APIs).
  - News search with date filters.
- **Web browsing**:
  - Fetch and parse HTML, with:
    - Boilerplate removal.
    - Content segmentation (title, abstract, main text, tables, references).
  - Basic interaction (pagination, click, simple form filling) if needed.
- **Academic / domain APIs**:
  - Paper metadata (authors, venue, year, citation count).
  - Full-text retrieval where legally allowed.
- **Retrieval / vector search**:
  - Over **local corpora** (internal knowledge base).
  - Over **cached research artifacts** (previous investigations).
- **Code & data tools** (optional but powerful):
  - Python / notebook runtime to run quick analyses, verify numeric claims, plot data.

Design guidance:

- Use a **narrow, typed tool interface** (function-call schema) instead of arbitrary shell commands.
- For safety and reliability:
  - Whitelist domains / path patterns.
  - Sanitize URLs.
  - Cap page size and number of pages per query.

### 2.4 Memory Layer

**Responsibility**: Track what’s known, what’s been tried, and where evidence came from.

Use multiple tiers:

- **Ephemeral / working memory** (per investigation):
  - Current notes, partial summaries, hypotheses, and open questions.
  - Represented as a **research notebook** object.
- **Short-term vector memory**:
  - Embeddings of passages, notes, and tool outputs to enable retrieval during the same session.
- **Long-term memory** (optional but powerful for products):
  - Index of **past investigations**, with:
    - User query, final answer, and structured outline.
    - Source metadata (URLs, DOIs, timestamps).
    - Domain tags and key entities.

Best practices:

- Record an **evidence graph**:
  - Nodes: claims, sources (papers, web pages), and intermediate conclusions.
  - Edges: “supported-by”, “contradicted-by”, “derived-from”.
- Store **timestamps** for all external evidence, to reason about recency and staleness.

### 2.5 Researcher / Critic Roles (Multi-Agent Pattern)

Research and practice both support **role specialization**:

- **Researcher**:
  - Drives search and evidence collection.
  - Writes working notes and mini-summaries per source.
- **Analyst / Synthesizer**:
  - Organizes notes into arguments, trade-offs, and structured sections.
  - Identifies missing evidence and sends tasks back to the Researcher.
- **Critic / Verifier** (Reflexion-style):
  - Checks reasoning chains, evidence sufficiency, and citation coverage.
  - Flags speculative statements and suggests extra checks.
- **Fact-checker**:
  - For high-stakes claims, explicitly re-queries the web / APIs to confirm.

These roles can be:

- Implemented as **separate LLM agents** (multi-agent framework).
- Or emulated via **single-model role prompts** in a sequenced workflow to save cost.

---

## 3. Canonical Deep-Research Loop

A typical investigation proceeds as:

1. **Intake & scoping**
   - Normalize the user query (clarify domain, time horizon, definitions).
   - Extract constraints (e.g. “focus on RCTs after 2018”, “US-only data”, “enterprise SaaS context”).
   - Decide **depth level** (e.g. quick scan vs. literature review vs. design doc level).

2. **Planning**
   - Decompose into sub-questions.
   - Prioritize:
     - Background / definitions.
     - Landscape mapping (who, what, where).
     - Mechanisms / causal explanations.
     - Evaluation (strength of evidence, limitations).
   - Allocate a step / cost budget.

3. **Evidence gathering (iterative)**
   - For each sub-question:
     - Run search (web, academic, internal).
     - Select promising results via an **LLM re-ranker** + simple heuristics (recency, venue, citations).
     - Visit pages and extract:
       - Key claims and numbers.
       - Methodology (if research / benchmark).
       - Limitations and conflicts.
     - Append to the **research notebook** and evidence graph.
   - Periodically:
     - Summarize what’s known so far.
     - Identify gaps or contradictions.
     - Re-plan if needed.

4. **Analysis & synthesis**
   - Cluster evidence by theme, methodology, or stance.
   - For each cluster:
     - Summarize consensus, disagreements, and open questions.
     - Note the **quality and bias** of sources.
   - Build a **structured outline** for the final answer.

5. **Verification & critique**
   - Run a **Critic** pass:
     - Check major claims for explicit citations.
     - Sample-check citations by re-opening sources.
     - Look for **overconfident language** or extrapolation beyond evidence.
   - Optionally, run a **second-model checker** (different architecture or provider) over critical sections.

6. **Final report generation**
   - Render into the target format:
     - Long-form report with sections and references.
     - Executive summary + bullet recommendations.
     - Comparison tables, timelines, diagrams (if supported).
   - Include:
     - **Citation map** (which parts rely on which sources).
     - **Limitations** and **what we still don’t know**.

7. **Archival**
   - Store:
     - Final artifact.
     - Outline and evidence graph.
     - Tool logs and metadata.
   - Index under:
     - Topic, entities, and domains.
     - User, team, or project.

---

## 4. Design Patterns from Literature & Practice

Below are patterns frequently seen in recent research / systems that are particularly relevant for deep-research agents.

### 4.1 ReAct-style Tool Use

- Interleave **natural language reasoning** and **tool actions**:
  - “Thought: I should verify this claim about X.”
  - “Action: search_web(…)”
  - “Observation: the top results say…”
- Benefits:
  - Transparent chain-of-thought for debugging (can be hidden from end users if needed).
  - Better grounding of each step in observed evidence.

### 4.2 Reflection / Self-Critique (Reflexion)

- After some steps or a draft answer:
  - Ask the model (or a separate agent) to **critique its own work**:
    - Missing perspectives.
    - Weak evidence.
    - Logical gaps.
  - Use that critique to:
    - Trigger more research.
    - Revise the answer.

### 4.3 Graph-of-Thoughts / DAG Controllers

- Represent the research as a **graph of sub-problems**:
  - Nodes: questions, computations, or retrieval calls.
  - Edges: dependency relationships.
- Enables:
  - Parallelism (explore independent sub-questions concurrently).
  - Caching and reuse of intermediate results.
  - More explicit control over how results flow into each other.

### 4.4 Retrieval-Augmented Generation (RAG) with Structured Provenance

- Use retrieval as **default grounding** for claims:
  - For each question / paragraph, retrieve top-K relevant passages from:
    - Web / academic cache.
    - Internal knowledge base.
  - Ask the model to **only answer conditioned on retrieved evidence**.
- Maintain a **provenance record**:
  - Identify exactly which documents / passages supported each claim.

### 4.5 Multi-Agent Collaboration

- Split responsibilities across specialized roles (Researcher, Analyst, Critic, Fact-checker).
- Coordination strategies:
  - **Mediator** agent that reads all messages and decides who speaks next.
  - **Shared memory buffer** where agents post notes and tasks.
- Benefits:
  - Cleaner prompts per role.
  - Easier to reason about responsibilities and upgrade parts independently.

---

## 5. Practical Implementation Notes

### 5.1 Models and Prompting

- Use a **high-capability model** for:
  - Planning.
  - Cross-document synthesis.
  - Critique and final drafting.
- Optionally use **cheaper / faster models** for:
  - Initial search query generation.
  - Simple classification or filtering.
- System prompts should:
  - Enforce **citation discipline**.
  - Emphasize **uncertainty expression** (“likely”, “unclear”, “evidence suggests…”).
  - Describe **forbidden behaviors** (e.g. fabricating URLs, inventing studies).

### 5.2 Tooling & Infrastructure

- Implement tools as:
  - **JSON-schema-described functions** for LLM function calling / tools API.
  - With strong validation, logging, and rate limiting.
- Introduce a **tool router**:
  - Simple rules (e.g. “If domain is medicine, use academic search first”).
  - Learned or LLM-based router for complex tasks.

### 5.3 Caching and Cost Control

- Cache:
  - Search results per query (with time-based invalidation).
  - Parsed page content and embeddings.
  - Intermediate summaries for popular topics.
- At runtime:
  - Keep a **global token budget** per investigation.
  - If near limit, **downgrade**:
    - Fewer steps.
    - Smaller context windows.
    - Less exhaustive verification (but keep safety checks).

### 5.4 Evaluation

Evaluate a deep-research agent on:

- **Factuality**:
  - Human or model-graded correctness vs. ground truth where available.
  - Degree of hallucination in citations (broken / fabricated references).
- **Coverage & depth**:
  - Are major perspectives / lines of evidence included?
  - Does it surface limitations and open questions?
- **Usefulness**:
  - For target personas (e.g. journalists, PMs, researchers), does it answer the real question?
- **Efficiency**:
  - Tokens and latency vs. baseline systems.
  - Robustness to noisy or ambiguous queries.

---

## 6. Mapping to a Concrete System

To instantiate this architecture in a product (e.g. TrueMotives-style investigative assistant), you would:

- **Define target user workflows**:
  - Investigative journalism, competitive analysis, technical due diligence, etc.
- **Specialize the planner and tools**:
  - Journalist mode: emphasize news, primary documents, and timelines.
  - Technical mode: emphasize academic literature, benchmarks, and repositories.
- **Implement the research loop**:
  - Orchestrator service written in a general-purpose language (e.g. TypeScript/Node, Python, Go).
  - Integrations with:
    - Web / news / academic APIs.
    - Internal KBs.
    - Optional notebook runtime.
- **Wrap in a UI**:
  - Expose:
    - Live “research log” (sources visited, key notes).
    - Final report with citations.
    - Controls for depth, domains, and time budget.

This gives you a **robust, extensible template** for building deep-research agents that combine strong LLM reasoning with careful evidence gathering, verification, and user-centric reporting.

