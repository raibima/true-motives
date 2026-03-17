## Candidate 3rd-Party Research Tools & APIs (2026)

This document lists **concrete APIs and services** that fit the deep-research agent architecture you’re building, grouped by function. For each, it summarizes what it’s good for, key capabilities, and trade-offs / notes.

---

## 1. Academic Literature & Scholarly Data

### 1.1 OpenAlex

- **What it is**: Open, large-scale index of scholarly works, authors, institutions, topics, etc. Intended as a modern, open alternative to Scopus / Web of Science.  
- **Use cases**:
  - Literature reviews (works, authors, venues).
  - Mapping fields/topics, citation networks, and institutions.
  - Building domain/topic filters for deep-research agents.
- **Key capabilities** (2026):
  - REST API with entities like **works, authors, sources, institutions, topics, publishers, funders**, and more.  
  - Powerful **filter/search** over metadata (year ranges, topics, institutions, OA status, etc.).  
  - **Semantic search and PDF download** (paid per 1k calls / 1k PDFs).  
  - Data snapshots for offline or self-hosted use.  
- **Pricing / access**:
  - Freemium: free tier (~$1/day usage credit); then per-1k-call pricing (e.g. search/semantic search \$1/1k calls, filters cheaper).  
  - API key required.  
- **Fit for TrueMotives**:
  - Strong default for **domain-agnostic, global academic search**.  
  - Works well for **journalism / analysis that needs to cite peer-reviewed work** or trace evidence quality.

### 1.2 Semantic Scholar API

- **What it is**: Scholarly paper API from Allen Institute for AI (AI2), covering millions of papers and citation relationships.  
- **Use cases**:
  - Finding related papers and citation graphs.  
  - Quick academic “grounding” for technical / scientific claims.  
- **Key capabilities**:
  - REST API for **papers, authors, venues**, citations, and **SPECTER2 embeddings**.  
  - Semantic similarity / recommendation endpoints (e.g. “papers similar to X”).  
  - Good coverage in CS + AI, growing coverage in other domains.  
- **Pricing / access**:
  - Free with API key; rate-limited.  
- **Fit for TrueMotives**:
  - Great for **technical / AI / CS-focused investigations** or when you want good embedding-quality references for RAG.  
  - Complements OpenAlex; you can use one or both.

### 1.3 arXiv API

- **What it is**: API for preprints across physics, math, CS, etc.  
- **Use cases**:
  - Latest research in fast-moving technical domains (AI, crypto, physics, etc.).  
  - Cross-checking claims against cutting-edge preprints.  
- **Key capabilities**:
  - Query by keywords, author, category, date.  
  - Returns metadata and PDF links for public preprints.  
- **Pricing / access**:
  - Free, rate-limited; requires courteous usage.  
- **Fit for TrueMotives**:
  - Use when investigations explicitly need “latest preprints” or frontier research, especially in AI/ML.

---

## 2. General Web Search for Agents

### 2.1 Brave Search API

- **What it is**: Privacy-preserving search engine with an API designed with RAG / AI use cases in mind.  
- **Use cases**:
  - General-purpose web search for fact-finding.  
  - Feeding **structured snippets** into your Researcher agent.  
- **Key capabilities**:
  - Web search results with **schema-enriched JSON**, snippets, and multiple result types.  
  - “Answer” endpoint optimized for LLM usage (short enriched answers, token-priced).  
  - Large index (tens of billions of pages) with frequent updates.  
- **Pricing / access**:
  - Web search: ≈\$5 / 1,000 requests; “answers” priced per tokens + requests.  
  - Free monthly credits (~\$5) for experimentation.  
- **Fit for TrueMotives**:
  - Strong candidate for **default web search**: good structure, LLM-friendly, independent index (not just Google HTML).  

### 2.2 Tavily Search

- **What it is**: Search API designed specifically for LLM agents.  
- **Use cases**:
  - Agentic research workflows needing configurable **search depth and speed**.  
  - Quickly retrieving small sets of high-signal documents for summarization.  
- **Key capabilities**:
  - Multiple search “modes” (basic / fast / advanced) with different latency/relevance tradeoffs.  
  - Control over **number of chunks per source** (e.g. up to ~3 per URL) and top-k results.  
  - Topic/domain filters (e.g. “news”, “academic”).  
- **Pricing / access**:
  - Credit-based; each call costs 1–2 credits depending on mode.  
  - Free tier + paid tiers.  
- **Fit for TrueMotives**:
  - Very attractive as a **plug-in web search layer** for Researcher tools, especially if you want fewer, cleaner snippets instead of raw SERP HTML.

### 2.3 Perplexity Search & Agent APIs

- **What it is**: APIs from Perplexity focused on **web-grounded Q&A, search, and agentic research**.  
- **Use cases**:
  - Offloading parts of the research workflow to Perplexity’s infrastructure (e.g. for “quick” investigations).  
  - Getting **ranked web results** and/or **web-grounded answers with citations**.  
- **Key capabilities**:
  - **Search API**: ranked results with domain / language / region filters.  
  - **Sonar API**: web-grounded LLM responses with citation links.  
  - **Agent API**: multi-model agentic workflows with integrated web browsing.  
- **Pricing / access**:
  - Paid, token-based; full details in Perplexity docs.  
- **Fit for TrueMotives**:
  - Good option if you want to **hybridize**: your orchestrator can sometimes call Perplexity (via an internal tool) instead of running full in-house research, especially under tight latency / cost constraints.

### 2.4 SerpAPI

- **What it is**: Meta-SERP API wrapping Google/Bing/others with unified JSON.  
- **Use cases**:
  - When you specifically need **Google SERP parity** (for SEO / consumer search contexts).  
- **Key capabilities**:
  - Web, image, video, news, shopping, and more; high uptime and low latency.  
- **Pricing / access**:
  - Starts around \$10/month; volume discounts.  
- **Fit for TrueMotives**:
  - Useful if certain investigations must match “what a user sees on Google”. Otherwise, Brave/Tavily/Perplexity may be more agent-friendly.

---

## 3. News & Event Data

### 3.1 GDELT Cloud

- **What it is**: Global news/event analytics platform with **AI-coded events**, entities, and conflict monitoring; now with a cloud API.  
- **Use cases**:
  - Investigations involving **geopolitics, conflict, protests, disasters, and media narratives**.  
  - Time-series analysis of coverage intensity by region, actor, or topic.  
- **Key capabilities**:
  - REST API covering:
    - Structured **event data** (CAMEO-coded, ACLED-influenced).  
    - Entity extraction and Wikipedia-linked actors.  
    - Multi-language coverage (100+ languages, hourly updates).  
  - “Summary” endpoints for dashboards, visual search for imagery.  
- **Pricing / access**:
  - Free for research / limited use; details vary by endpoint.  
- **Fit for TrueMotives**:
  - Extremely valuable for **investigative/journalistic scenarios** where you need to see how events unfolded across time and media ecosystems, not just read articles.

### 3.2 NewsAPI

- **What it is**: Well-known news aggregation API indexing hundreds of millions of articles.  
- **Use cases**:
  - General **article-level news search** with filtering by date, source, language, and keywords.  
- **Key capabilities**:
  - `/v2/everything` endpoint: keyword + Boolean queries, date ranges, source/domain filters, language filters.  
  - Large publisher index across many countries and languages.  
- **Pricing / access**:
  - Free tier + paid plans; commercial usage restrictions on some tiers.  
- **Fit for TrueMotives**:
  - Straightforward way to plug a **“news search” tool** into the Researcher agent; combine with your browser/text-extraction stack for full articles.

### 3.3 Mediastack

- **What it is**: Real-time and historical news API with JSON responses.  
- **Use cases**:
  - Lightweight, cost-effective alternative or complement to NewsAPI.  
- **Key capabilities**:
  - Filters by **date, country, language, sources, keywords**.  
  - HTTPS encryption, clear error codes.  
- **Fit for TrueMotives**:
  - Good backup or regional-coverage supplement; you may use multiple news APIs and fuse results.

---

## 4. Fact-Checking & Claim Review

### 4.1 Google Fact Check Tools API

- **What it is**: Google’s Fact Check Tools platform, exposing ClaimReview data from fact-checking organizations.  
- **Use cases**:
  - Given a user claim or quote, **search for existing fact checks** on that claim.  
  - Enrich research with **fact-checking verdicts and sources**.  
- **Key capabilities**:
  - **Claim Search API**: search fact-check results used in Fact Check Explorer (supports queries, language, region filters).  
  - **ClaimReview Read/Write API**: for publishers to programmatically manage their ClaimReview markup (less relevant for consumption).  
  - Data adheres to **schema.org ClaimReview**, integrated with Data Commons and major platforms.  
- **Pricing / access**:
  - API key-based; free within reasonable limits.  
- **Fit for TrueMotives**:
  - Ideal for a **Fact-Checker sub-tool**: your Critic or Fact-Checker agent can automatically query this API when validating controversial or widely-discussed claims.

---

## 5. Web & Document Extraction for LLMs

These tools convert arbitrary web pages and documents (PDF, DOCX, etc.) into **clean text / markdown**, critical for Researcher tools.

### 5.1 Firecrawl

- **What it is**: Web Data API built for AI agents; scrapes sites, crawls, and returns LLM-ready content.  
- **Use cases**:
  - Converting websites, blog posts, and documentation sites into **normalized markdown/JSON**.  
  - Crawling small/medium sites (sitemaps, multi-page reports) for an investigation.  
- **Key capabilities**:
  - Handles **JS-heavy pages** via browser automation.  
  - Supports web-hosted **PDFs and DOCX**, with extraction to markdown/JSON.  
  - Features: site map generation, crawling, search, screenshotting.  
  - “Browser” feature with sandboxed browser instances for more complex workflows.  
- **Pricing / access**:
  - Open-source core (AGPL) + hosted SaaS; pricing in page credits (e.g. thousands of pages/month).  
- **Fit for TrueMotives**:
  - Excellent candidate for a **`web_extract` or `crawl_site` tool** that feeds your Researcher’s note-taking. Substantial time-saver vs. hand-rolled scraping.

### 5.2 Jina AI Reader

- **What it is**: Reader API that converts a URL or HTML into **clean markdown or JSON**, part of Jina’s broader “Search Foundation” stack.  
- **Use cases**:
  - Quick, per-page extraction where you already know the URL.  
  - Turning news articles, blog posts, PDFs into agent-ready text without full crawling.  
- **Key capabilities**:
  - Uses **ReaderLM** to intelligently extract the main content, stripping boilerplate.  
  - Works on dynamic content (headless Chrome under the hood).  
  - Token-based pricing; high throughput.  
- **Fit for TrueMotives**:
  - Good as a **per-URL cleaner**: pair it with Brave/Tavily/NewsAPI and pass result URLs to Jina for extraction.

### 5.3 Browserless / Playwright-based Headless Browsers

- **What it is**: Headless browser APIs (e.g. Browserless, Playwright-based SaaS) for scripted page interactions.  
- **Use cases**:
  - Investigations requiring **form fills, logins, pagination, or click-through flows**.  
- **Key capabilities**:
  - Full browser automation via HTTP APIs (launch, navigate, screenshot, evaluate JS).  
- **Fit for TrueMotives**:
  - Use sparingly for **complex flows**; for standard article reading, Firecrawl/Jina are simpler and cheaper.

---

## 6. Enterprise & Internal Knowledge Search

For private corpora (internal docs, prior investigations, data rooms).

### 6.1 Meilisearch

- **What it is**: Open-source, developer-friendly search & AI retrieval platform.  
- **Use cases**:
  - Full-text search over your **internal documents, investigations, and notes**.  
  - Hybrid search (keyword + vector) for RAG.  
- **Key capabilities**:
  - Fast full-text search, **semantic/vector search**, hybrid retrieval.  
  - Multi-modal search and federated search across indices.  
  - Cloud offering with simple pricing and SDKs in many languages.  
- **Fit for TrueMotives**:
  - Strong candidate for your **internal investigation index**: store past reports, notes, and sources; expose as an `internal_rag_search` tool to all agents.

### 6.2 Elasticsearch / Elastic Cloud

- **What it is**: Mature search & analytics platform; Elastic Cloud adds managed hosting.  
- **Use cases**:
  - Large-scale search, logging, analytics, and **hybrid / semantic search** across big corpora.  
- **Key capabilities**:
  - Rich text search, **vector search**, and **semantic retrievers**.  
  - Flexible ingest pipelines, analytics dashboards, security controls.  
- **Fit for TrueMotives**:
  - Better suited if you anticipate **very large-scale indexing** (millions of documents, heavy analytics), or want to unify search with logging/observability.

### 6.3 Vector DBs (Pinecone, Weaviate, Qdrant, etc.)

- **What they are**: Managed or open-source vector databases for embeddings.  
- **Use cases**:
  - High-quality **semantic retrieval** for RAG on internal notes and documents.  
- **Fit for TrueMotives**:
  - If you prefer a **“RAG-first”** architecture, a vector DB + cheap object store (for raw docs) can be your primary internal search substrate.

---

## 7. Financial & Market Data (for Business / Market Research)

### 7.1 Alpha Vantage

- **What it is**: NASDAQ-licensed financial data API with wide asset and signal coverage.  
- **Use cases**:
  - Market- and company-focused investigations (e.g. competition, valuations, sector trends).  
- **Key capabilities**:
  - Real-time and historical data for **stocks, ETFs, mutual funds, forex, crypto, commodities**.  
  - **Fundamentals** (income statements, balance sheets, cash flows).  
  - **News & sentiment, earnings transcripts, IPO calendars**, and 50+ technical indicators.  
- **Pricing / access**:
  - Free keys with limits; paid tiers for higher throughput and premium data.  
- **Fit for TrueMotives**:
  - Natural fit for a **`market_data` tool** (especially if you target investigative business journalism or competitive analysis).

### 7.2 Finnhub (and similar)

- **What it is**: Real-time stock/forex/crypto data + company fundamentals and economic data.  
- **Fit for TrueMotives**:
  - Alternative or complement to Alpha Vantage if you need specific datasets or better real-time coverage.

---

## 8. How to Integrate into Your Agent Stack

- **Researcher tools**:
  - `web_search`: Brave Search / Tavily / Perplexity Search API.  
  - `news_search`: GDELT + NewsAPI / Mediastack.  
  - `academic_search`: OpenAlex + Semantic Scholar + (optionally) arXiv.  
  - `web_extract`: Firecrawl or Jina Reader (per URL).  
  - `internal_rag_search`: Meilisearch / Elastic / vector DB.  
- **Fact-checker / Critic tools**:
  - `claim_factcheck_search`: Google Fact Check Tools API.  
  - `event_timeline`: GDELT event/time-series queries.  
- **Domain-specific tools**:
  - `market_data`: Alpha Vantage / Finnhub for financial/market investigations.  

This mix gives your deep-research agent **broad, deep, and verifiable coverage** across web, news, academic literature, internal knowledge, and domain-specific data, while staying modular so you can swap vendors as needs or pricing change.

