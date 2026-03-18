import type { UIMessageChunk } from "ai";
import { getWritable } from "workflow";

import { braveWebSearch, type BraveSearchParams } from "@/lib/brave-search";
import {
  firecrawlScrape,
  firecrawlSearch,
  type FirecrawlScrapeRequest,
  type FirecrawlSearchRequest,
} from "@/lib/firecrawl";
import {
  getTopMediaEventClusters,
  type GdeltMediaEventsParams,
} from "@/lib/gdelt";
import {
  fetchEverything,
  fetchSources,
  fetchTopHeadlines,
  type EverythingParams,
  type SourcesParams,
  type TopHeadlinesParams,
} from "@/lib/newsapi";

type ProgressPayload = Record<string, unknown>;

function summarizeResult(result: unknown): string {
  if (!result || typeof result !== "object") return "No structured data returned.";

  const candidate = result as Record<string, unknown>;

  if (Array.isArray(candidate.results)) {
    return `Returned ${candidate.results.length} results.`;
  }

  if (candidate.web && typeof candidate.web === "object") {
    const web = candidate.web as Record<string, unknown>;
    if (Array.isArray(web.results)) {
      return `Found ${web.results.length} web results.`;
    }
  }

  if (candidate.data && typeof candidate.data === "object") {
    const data = candidate.data as Record<string, unknown>;
    if (Array.isArray(data.web)) {
      return `Found ${data.web.length} indexed documents.`;
    }
    if (Array.isArray(data.sources)) {
      return `Loaded ${data.sources.length} sources.`;
    }
    if (Array.isArray(data.articles)) {
      return `Fetched ${data.articles.length} articles.`;
    }
    if (typeof data.markdown === "string") {
      return `Extracted ${data.markdown.length.toLocaleString()} markdown characters.`;
    }
  }

  if (Array.isArray(candidate.clusters)) {
    return `Resolved ${candidate.clusters.length} event clusters.`;
  }

  if (Array.isArray(candidate.articles)) {
    return `Fetched ${candidate.articles.length} articles.`;
  }

  if (Array.isArray(candidate.sources)) {
    return `Fetched ${candidate.sources.length} sources.`;
  }

  return "Completed with structured output.";
}

export async function emitProgress(payload: ProgressPayload) {
  "use step";

  const writable = getWritable<UIMessageChunk>();
  const writer = writable.getWriter();
  try {
    await writer.write({
      type: "data-progress",
      data: payload,
      transient: true,
    });
  } finally {
    writer.releaseLock();
  }
}

export async function braveWebSearchStep(input: BraveSearchParams) {
  "use step";
  await emitProgress({
    kind: "activity",
    message: `[Brave] Querying web index for "${input.q}" (offset=${input.offset ?? 0}, count=${input.count ?? 10})`,
  });
  const result = await braveWebSearch(input);
  await emitProgress({
    kind: "activity",
    message: `[Brave] Search complete. ${summarizeResult(result)}`,
  });
  return result;
}

export async function firecrawlScrapeStep(input: FirecrawlScrapeRequest) {
  "use step";
  await emitProgress({
    kind: "activity",
    message: `[Firecrawl/Scrape] Fetching and extracting content from ${input.url}`,
  });
  const result = await firecrawlScrape(input);
  await emitProgress({
    kind: "activity",
    message: `[Firecrawl/Scrape] Extraction complete. ${summarizeResult(result)}`,
  });
  return result;
}

export async function firecrawlSearchStep(input: FirecrawlSearchRequest) {
  "use step";
  await emitProgress({
    kind: "activity",
    message: `[Firecrawl/Search] Running indexed search for "${input.query}"`,
  });
  const result = await firecrawlSearch(input);
  await emitProgress({
    kind: "activity",
    message: `[Firecrawl/Search] Search complete. ${summarizeResult(result)}`,
  });
  return result;
}

export async function gdeltTopMediaEventsStep(input: GdeltMediaEventsParams = {}) {
  "use step";
  await emitProgress({
    kind: "activity",
    message: `[GDELT] Pulling top media event clusters (days=${input.days ?? 1}, limit=${input.limit ?? 10})`,
  });
  const result = await getTopMediaEventClusters(input);
  await emitProgress({
    kind: "activity",
    message: `[GDELT] Cluster analysis complete. ${summarizeResult(result)}`,
  });
  return result;
}

export async function newsTopHeadlinesStep(input: TopHeadlinesParams = {}) {
  "use step";
  await emitProgress({
    kind: "activity",
    message: `[NewsAPI/TopHeadlines] Pulling top headlines for stakeholder signal detection`,
  });
  const result = await fetchTopHeadlines(input);
  await emitProgress({
    kind: "activity",
    message: `[NewsAPI/TopHeadlines] Retrieval complete. ${summarizeResult(result)}`,
  });
  return result;
}

export async function newsEverythingStep(input: EverythingParams = {}) {
  "use step";
  await emitProgress({
    kind: "activity",
    message: `[NewsAPI/Everything] Querying broad corpus for incentive patterns`,
  });
  const result = await fetchEverything(input);
  await emitProgress({
    kind: "activity",
    message: `[NewsAPI/Everything] Pattern scan complete. ${summarizeResult(result)}`,
  });
  return result;
}

export async function newsSourcesStep(input: SourcesParams = {}) {
  "use step";
  await emitProgress({
    kind: "activity",
    message: "[NewsAPI/Sources] Collecting source metadata and provenance attributes",
  });
  const result = await fetchSources(input);
  await emitProgress({
    kind: "activity",
    message: `[NewsAPI/Sources] Source metadata loaded. ${summarizeResult(result)}`,
  });
  return result;
}
