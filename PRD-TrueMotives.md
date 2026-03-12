## TrueMotives – Product Requirements Document (PRD)

### 1. Product overview

- **Product name**: TrueMotives
- **One-liner**: AI-powered deep research into the hidden motivations behind public policies, government decisions, corporate actions, and other socially impactful topics.
- **Primary value proposition**: Help journalists and the general public move beyond surface-level narratives by uncovering likely incentives, interests, and power dynamics driving major decisions—grounded in transparent reasoning and sourced evidence rather than opaque AI guesses.

### 2. Objectives and success metrics

- **Primary objectives**
  - **O1 – Journalist productivity**: Enable investigative journalists to get a high-quality, well-structured “motivation analysis brief” in minutes instead of days.
  - **O2 – Public understanding**: Give the general public accessible, trustworthy explanations for “why this is really happening” on major issues.
  - **O3 – Trust and transparency**: Build trust by making the AI’s reasoning traceable (citations, explicit assumptions, uncertainty).

- **Key success metrics (first 3–6 months)**
  - **M1**: Number of paid journalist accounts created.
  - **M2**: Monthly active paid users (journalists) and their average number of research runs per month.
  - **M3**: Average rating of report usefulness (e.g. 1–5 stars or Likert scale).
  - **M4**: % of reports with at least N external citations/sources.
  - **M5**: Time to first meaningful output from new user signup (onboarding friction).

### 3. Target users and personas

- **Primary persona – Investigative journalist**
  - **Profile**: Mid-career journalist at a newsroom, independent investigator, or policy analyst who regularly digs into public policies, regulations, corporate decisions, and government actions.
  - **Goals**:
    - Quickly build a hypothesis about “who benefits, who loses, and why”.
    - Surface non-obvious stakeholders and incentives they might have.
    - Collect a starting set of sources, quotes, and documents to read further.
  - **Pain points**:
    - Research is time-consuming and scattered across many sources.
    - Hard to systematically map incentives and interests around complex topics.
    - Many AI tools produce shallow, generic overviews with low transparency.

- **Secondary persona – Curious citizen / informed public**
  - **Profile**: Politically engaged citizen, student, activist, or policy enthusiast who wants to understand the “real reasons” behind decisions.
  - **Goals**:
    - Browse existing analyses by topic or issue.
    - Understand motivations in plain language, with transparency about uncertainty.
  - **Pain points**:
    - News is often fragmented; opinions are polarized.
    - Hard to see the bigger picture of motives and power structures.

- **Tertiary persona – Editor / newsroom lead**
  - **Profile**: Editor who oversees investigative teams.
  - **Goals**:
    - Give their team leverage tools to explore more leads.
    - Maintain quality and ethical standards in AI-assisted reporting.

### 4. Problem statement

Investigative research on motivations behind public decisions is:

- Slow and manual: requires combing through documents, news articles, hearings, financial data, and lobbying records.
- Fragmented: insights are spread across many sources, each with its own framing.
- Under-powered: many smaller outlets and independent journalists lack resources to do deep background research on every story.
- Opaque: existing AI summarizers give “what” and “how” but rarely “why”, and almost never show transparent chains of reasoning and evidence.

TrueMotives aims to provide **structured, explainable motivation analyses** that journalists can use as a starting point or augment their own investigations, and that the general public can read to better understand complex issues.

### 5. Core product concept

- **Input**: A topic representing a decision or issue (e.g. “EU Digital Markets Act enforcement”, “recent tax reform in Country X”, “US decision on LNG export permits”, “City Y’s zoning change for waterfront development”).
- **Processing**:
  - Gather background context and recent information from credible sources.
  - Identify stakeholders (e.g. governments, companies, lobbies, public groups).
  - Model their likely incentives (economic, political, ideological, institutional).
  - Generate structured hypotheses about motivations behind the decision/issue.
  - Explicitly label assumptions, uncertainty, and alternative hypotheses.
- **Output**: A structured “TrueMotives Report” with:
  - Executive summary of likely core motivations.
  - Stakeholder map and incentive breakdown.
  - Evidence/citations and reasoning chains.
  - Alternative explanations and what evidence would support/refute them.

### 6. Scope and constraints for MVP

- **In scope (MVP)**
  - Core web app with:
    - Public, read-only access to a curated library of previously generated reports.
    - Authentication, paid subscription, and access control for journalist users.
    - A simple “New investigation” flow for paid users.
    - Automatic report generation using AI with transparent structure.
    - Basic source citation and reasoning transparency.
  - Initial content domain: public policy and government decisions, plus some corporate actions with strong public impact.
  - Basic admin capabilities to:
    - Approve/publish or unlist reports.
    - Flag/remove low-quality or problematic outputs.

- **Out of scope (for MVP, future versions)**
  - Browser extensions or in-article overlays.
  - Real-time collaboration on reports.
  - Native mobile apps.
  - Deep integrations with newsroom CMS.
  - Automated scraping of non-public or paywalled data (will rely on open/web-accessible content and user-provided documents).

### 7. User flows (MVP)

- **7.1 Public user – browse existing reports**
  1. Visits `truemotives` landing page.
  2. Reads explanation of what TrueMotives does and why it exists.
  3. Browses a list/grid of recent or featured reports.
  4. Filters/searches by:
     - Topic/keywords.
     - Geography.
     - Category: policy, regulation, corporate decision, etc. (MVP: simple tags).
  5. Opens a report detail page.
  6. Reads:
     - Executive summary.
     - Stakeholder & incentives map.
     - Evidence & references.
     - Limitations and uncertainty.
  7. (Optional) Signs up for newsletter or updates.
  8. (Optional) Clicks “Investigate your own topic” → hits paywall / upsell to journalist plan.

- **7.2 Journalist – sign up and start investigation**
  1. Lands on marketing page, sees “For journalists” section.
  2. Clicks “Start investigating” → Sign up.
  3. Creates an account and subscribes to a paid plan.
  4. After onboarding, user sees:
     - A dashboard: recent own investigations, drafts, and published reports.
     - A prominent “New investigation” CTA.
  5. Clicks “New investigation” and fills:
     - Topic title (required).
     - Short description or question (“What are the true motivations behind …?”).
     - Type of issue (policy, government decision, corporate action, etc.).
     - Geography/region (optional).
     - Upload or paste key documents/links (optional, MVP: text/doc links).
  6. Clicks “Generate motives analysis”.
  7. System processes the prompt and generates:
     - Executive motivations summary.
     - Stakeholder list with roles and incentives.
     - Supporting arguments & evidence with citations.
     - Explicit list of assumptions and uncertainty levels.
     - Alternative plausible motivations.
  8. Journalist can:
     - Edit text sections.
     - Add their own notes.
     - Save as draft.
     - Mark as “publish to public library” (optional, maybe opt-in).

- **7.3 Admin / editorial review (lightweight)**
  1. Admin logs into an internal dashboard.
  2. Views queue of newly generated reports flagged for public listing.
  3. Approves, edits title/summary, or rejects/keeps private.

### 8. Functional requirements (MVP)

- **8.1 Authentication & authorization**
  - Email/password based login (or OAuth provider in future).
  - Role-based access:
    - Public (unauthenticated): view only public reports.
    - Journalist (paid): can create/read/edit their own reports; read the public library.
    - Admin: manage reports and possibly user accounts.
  - Session management compatible with modern web stack (likely Next.js app).

- **8.2 Subscription & access control**
  - Paid subscription required to:
    - Run new investigations/topics.
    - Access and edit private drafts.
  - Public users can:
    - Read only public reports at no cost.
  - Basic plan characteristics (can be refined later):
    - Monthly / annual subscription.
    - Limits on number of investigations per month (e.g. 20/month).

- **8.3 Report generation engine**
  - Input:
    - User-specified topic and optional context.
  - Behavior:
    - Use LLM + retrieval (from web and/or structured data) to:
      - Gather relevant facts and background.
      - Identify stakeholders and incentives.
      - Propose and rank likely motivations.
    - Produce a multi-section structured report (consistent schema).
    - Include references/citations and reasoning steps (not just final conclusions).
  - Requirements:
    - Configurable prompt templates and system instructions.
    - Ability to constrain sources (e.g. to reputable outlets, official documents).
    - Guardrails against hallucinated, defamatory, or unsourced claims.

- **8.4 Report library and viewing**
  - Public library view:
    - List of public reports (paginated, sortable by date, popularity).
    - Search and basic filtering (keywords, tags, geography).
  - Report detail view:
    - Clean, readable layout for the TrueMotives report structure.
    - Clear disclosure that this is AI-assisted analysis, not definitive fact.
    - Show citations and external links.

- **8.5 Journalist dashboard**
  - View list of:
    - Own drafts.
    - Finalized reports (private or public).
  - Create new investigation.
  - Edit existing report content (for text fields).

- **8.6 Admin features (minimal)**
  - Manage which reports appear in public library.
  - Optionally add editorial notes or disclaimers.

### 9. Non-functional requirements

- **Performance**
  - Initial report generation under approximately 60–120 seconds for typical topics.
  - Page loads for browsing reports < 2 seconds on modern connections.

- **Reliability & availability**
  - Handle temporary AI provider/network failures with retries and graceful errors.
  - Save intermediate state of generation so user does not lose everything on failure.

- **Security & privacy**
  - Protect journalist accounts and private investigation drafts.
  - Basic logging and monitoring of suspicious login behavior.
  - Clear data retention policy for uploaded documents and prompts.

- **Compliance / ethics**
  - Safety layer to reduce:
    - Defamatory claims about individuals without strong evidence.
    - Unsupported conspiracy-like explanations.
  - Expose uncertainty and clearly mark hypotheses vs. verified facts.

### 10. Content and AI considerations

- **Source quality and bias**
  - Prefer official documents, credible outlets, and reputable think tanks.
  - Make it clear when sources are partisan or opinionated.

- **Explainability**
  - Each major motive claim should:
    - Have linked evidence (where possible).
    - Include a short explanation of why that motive is plausible.
    - Include a confidence level (low/medium/high or similar).

- **Limitations disclosure**
  - Every report includes a disclaimer about:
    - Being an AI-assisted analysis.
    - Potential gaps in data and sources.
    - The need for human verification.

### 11. Pricing and packaging (initial hypothesis)

- **Public users**
  - Free read-only access to:
    - A curated subset of high-quality public reports.
  - Upsell CTA:
    - “Investigate your own topic” → upgrade path to journalist plan.

- **Journalists / professionals**
  - Single “Pro Investigator” tier for MVP:
    - Monthly subscription with investigation quota.
    - Priority generation queue vs. any future free tier.
  - Later:
    - Team/Newsroom plans with shared seats and collaboration features.

### 12. Risks and open questions

- **Key risks**
  - Over-reliance on AI: users might treat outputs as definitive truth.
  - Hallucinations and speculative claims that appear confident.
  - Legal risks related to defamation, especially about individuals.
  - Resistance from newsrooms skeptical of AI tools.

- **Open questions**
  - How strict should moderation/editing be before a report is made public?
  - Should journalists be able to keep all their investigations fully private (never visible to public library)?
  - Should there be a separate “expert review” label for manually vetted reports?
  - How far should the system go in mapping financial flows, lobbying, and donations (and what data sources will be used)?

### 13. MVP vs. near-term roadmap

- **MVP (this PRD)**
  - Public read-only library of selected reports.
  - Paid journalist accounts with:
    - New investigation flow.
    - AI-generated structured TrueMotives reports.
    - Draft editing & saving.
  - Minimal admin review tools.

- **Near-term enhancements (post-MVP)**
  - More advanced retrieval (e.g. public lobbying/finance databases where legal).
  - Collaboration features for teams.
  - Fine-grained feedback tools (users can rate specific motivations or evidence).
  - Export options (PDF, markdown, newsroom CMS formats).
  - Topic watchlists and alerts when new developments affect previous motives.

