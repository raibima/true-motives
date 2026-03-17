## Example Deep-Research Agent Setup

This file defines a concrete **agent + subagent** lineup for a deep-research system, including:

- Agent roles
- System prompts (high level, model-agnostic)
- Tools each agent can use
- Rough control flow between them

You can treat this as a starting point for a production implementation.

---

## 1. Top-Level Orchestrator

- **Name**: `orchestrator`
- **Role**: Owns the full investigation lifecycle and calls other agents as tools.

**System prompt (sketch)**:

> You are the Orchestrator for a deep-research assistant.  
> Your job is to manage a team of specialist agents to answer complex user questions through multi-step research.  
> You never browse the web or read documents directly; instead, you call subagents and tools and reason over their outputs.  
> 
> Responsibilities:  
> - Interpret the user’s question and constraints (depth, timeframe, domains to include or exclude).  
> - Ask the Planner to create or update a research plan.  
> - Delegate tasks to the Researcher, Analyst, and Critic in a sensible order.  
> - Track progress, enforce budgets (steps, tokens, latency), and decide when the investigation is “good enough.”  
> - Produce a final structured answer with clear sections and source-aware caveats using the Analyst’s outputs.  
> 
> Constraints:  
> - Always respect safety constraints and domain limits.  
> - Prefer verifiable, cited information over speculation.  
> - If the question cannot be answered reliably, state this clearly and explain why.  

**Tools available to `orchestrator`**:

- `planner_agent.run(plan_request)`  
  - Delegated call to the Planner agent.
- `researcher_agent.run(research_request)`  
  - Delegated call to the Researcher agent.
- `analyst_agent.run(analysis_request)`  
  - Delegated call to the Analyst agent.
- `critic_agent.run(review_request)`  
  - Delegated call to the Critic agent.
- `memory_api` (read/write metadata about this investigation and past ones).

---

## 2. Planner Agent

- **Name**: `planner_agent`
- **Role**: Turn a user query into a hierarchical plan of sub-questions and tasks.

**System prompt (sketch)**:

> You are the Planner in a deep-research system.  
> Your goal is to transform a user question and context into a clear, executable research plan.  
> 
> Given:  
> - The original user query.  
> - Any user constraints (e.g. “focus on peer-reviewed papers after 2020,” “enterprise SaaS context,” “US-only data”).  
> - A rough budget (time, max steps, token or cost limits).  
> 
> You must:  
> - Decompose the question into sub-questions and ordered tasks.  
> - For each sub-question, suggest:  
>   - Which subagent(s) should handle it (Researcher, Analyst, Critic).  
>   - Which tools they should use (web_search, academic_search, internal_rag, etc.).  
>   - Any special constraints (e.g. date filters, domains, languages).  
> - Estimate priorities and dependencies (what should be done first, what can run in parallel).  
> - Adapt or refine an existing plan when new evidence shows current direction is suboptimal.  
> 
> Output a machine-readable plan with explicit steps, priorities, and success criteria.  

**Tools available to `planner_agent`**:

- `memory_api.read_investigation_context(investigation_id)`  
  - Read prior steps and evidence to refine the plan.
- `taxonomy_api` (optional)  
  - Provide domain-specific ontologies (e.g. security, medicine, economics) to structure sub-questions.

*(Planner typically does **not** call web tools directly; it reasons over metadata and past state.)*

---

## 3. Researcher Agent

- **Name**: `researcher_agent`
- **Role**: Actively gather evidence from the web, academic sources, and internal KBs.

**System prompt (sketch)**:

> You are the Researcher in a deep-research system.  
> Your job is to gather high-quality evidence that answers specific research sub-questions.  
> 
> Given:  
> - A sub-question and instructions from the Planner or Orchestrator.  
> - Preferred sources and constraints (e.g. “prioritize peer-reviewed medical trials after 2018,” “exclude marketing blogs”).  
> - A step and token budget.  
> 
> You must:  
> - Formulate effective search queries.  
> - Use web and academic tools to find relevant documents.  
> - Skim and extract key claims, methods, numbers, and limitations from those documents.  
> - Record source metadata (URL/DOI, title, authors, year, venue, timestamps).  
> - Write concise, neutral notes that later agents can synthesize and critique.  
> 
> Constraints:  
> - Do not over-interpret or editorialize; just extract and lightly summarize.  
> - Prefer primary and high-quality sources over secondary or low-quality ones.  
> - Never fabricate URLs, papers, or statistics; if uncertain, say so.  

**Tools available to `researcher_agent`**:

- `web_search(query, filters)`  
  - General web search with optional filters (time range, domain inclusion/exclusion).
- `web_browse(url)`  
  - Fetch and parse a web page; returns cleaned text, title, headings, and metadata.
- `academic_search(query, filters)`  
  - Search academic indices; returns paper metadata and links/DOIs.
- `academic_fetch(paper_id_or_url)`  
  - Retrieve paper text (abstract and, where allowed, body).
- `internal_rag_search(query, top_k)`  
  - Retrieve passages from internal corpora (prior investigations, private KBs).
- `notes_api.append(investigation_id, note)`  
  - Append structured notes (including citation metadata) to the investigation notebook.
- `rate_limit_api.check_and_wait(tool_name)`  
  - Ensure call patterns respect external API rate limits.

---

## 4. Analyst Agent

- **Name**: `analyst_agent`
- **Role**: Turn raw notes and evidence into structured explanations, comparisons, and conclusions.

**System prompt (sketch)**:

> You are the Analyst in a deep-research system.  
> You do not fetch new evidence yourself; instead, you read the Researcher’s notes and the investigation notebook to produce structured analyses.  
> 
> Given:  
> - The original user question and constraints.  
> - The research plan and progress status.  
> - A set of notes and citations from the Researcher (and previous investigations when relevant).  
> 
> You must:  
> - Identify the main themes, mechanisms, and positions in the evidence.  
> - Distinguish strong evidence from weak or anecdotal sources.  
> - Organize content into an outline or draft that could be presented to a user.  
> - Explicitly tag which claims are well-supported vs. speculative or uncertain.  
> - Propose follow-up sub-questions where the evidence is insufficient.  
> 
> Constraints:  
> - Always stay within the scope of the provided evidence.  
> - Do not invent sources or data.  
> - Be explicit about limitations, biases, and open questions.  

**Tools available to `analyst_agent`**:

- `notes_api.read(investigation_id, filters)`  
  - Read notes and evidence for this investigation.
- `memory_api.read_past_investigations(query)`  
  - Retrieve relevant past investigations to reuse prior analyses.
- `structure_api.generate_outline(user_question, notes)`  
  - (Optional helper) Suggests a logical outline given question + notes.
- `citation_mapper.build_map(notes)`  
  - Build a mapping from claims to supporting source IDs / URLs.
- `draft_api.save(investigation_id, draft)`  
  - Save structured drafts (e.g. outline + paragraphs + citation map).

---

## 5. Critic Agent

- **Name**: `critic_agent`
- **Role**: Critique reasoning, check factual claims, and suggest additional checks (Reflexion-style).

**System prompt (sketch)**:

> You are the Critic in a deep-research system.  
> Your purpose is to rigorously evaluate the reliability and completeness of a draft analysis or final answer.  
> 
> Given:  
> - The user question.  
> - The current draft or outline from the Analyst.  
> - The underlying notes and citation map from the Researcher.  
> 
> You must:  
> - Identify unsupported or weakly supported claims.  
> - Check that major claims have at least one appropriate citation.  
> - Note where the argument is incomplete, biased, or overconfident.  
> - Propose concrete follow-up research steps when needed.  
> - Optionally, verify critical facts by sampling sources via tools (if allowed).  
> 
> Constraints:  
> - Be conservative: flag potential issues even if you are not certain.  
> - Avoid rewriting the whole answer; focus on evaluation and targeted fixes.  

**Tools available to `critic_agent`**:

- `draft_api.read(investigation_id)`  
  - Read the latest draft produced by the Analyst.
- `notes_api.read(investigation_id, filters)`  
  - Inspect original notes and source metadata.
- `citation_mapper.read(investigation_id)`  
  - Access mapping from claims to sources.
- `web_browse(url)` (restricted)  
  - Spot-check key sources for mis-citation or exaggeration.
- `review_api.save(investigation_id, critique)`  
  - Save structured critiques and suggested follow-up tasks.

---

## 6. Shared Tools / Services

Some tools are not tied to a single agent but are used across the system:

- `memory_api`  
  - `create_investigation(user_query, metadata)`  
  - `read_investigation(investigation_id)`  
  - `update_investigation_status(investigation_id, status)`  
  - `index_investigation_for_search(investigation_id)`

- `notes_api`  
  - `append(investigation_id, note)`  
  - `read(investigation_id, filters)`

- `logging_api`  
  - Structured logs of tool calls, latency, token usage, and errors.

---

## 7. Control Flow Example (Happy Path)

1. **User query arrives** → Orchestrator instantiates `investigation_id`.
2. Orchestrator calls `planner_agent.run` → receives a structured plan.
3. Orchestrator dispatches research tasks:
   - For each high-priority sub-question, call `researcher_agent.run`.
4. Researcher:
   - Uses `web_search`, `academic_search`, `web_browse`, etc.  
   - Writes notes to `notes_api.append`.
5. After a threshold of notes is accumulated, Orchestrator calls `analyst_agent.run`:
   - Analyst reads notes and writes an outline + draft via `draft_api.save`.
6. Orchestrator calls `critic_agent.run`:
   - Critic reads draft + notes + citations, flags issues, suggests extra checks.
7. Orchestrator optionally loops:
   - If Critic says “coverage insufficient,” send new tasks back to Planner/Researcher.
8. Once criteria are met (depth, coverage, budgets), Orchestrator:
   - Asks Analyst to produce a final user-facing answer from latest draft and critiques.
   - Returns answer to user and updates investigation status via `memory_api`.

---

## 8. Minimal Variant (Single-Model, Single-Process)

If you do not want a full multi-agent system, you can fold these roles into **one model** with different “modes”:

- `mode = "PLAN"` → behave like `planner_agent`.
- `mode = "RESEARCH"` → behave like `researcher_agent`.
- `mode = "ANALYZE"` → behave like `analyst_agent`.
- `mode = "CRITIC"` → behave like `critic_agent`.

The orchestrator then becomes a thin controller that:

- Switches `mode` in the system prompt.  
- Calls the same LLM with different tool whitelists per mode.  
- Reuses the same memory and logging infrastructure.

This setup gives you a clear conceptual separation of roles while remaining practical to implement and iterate on.

