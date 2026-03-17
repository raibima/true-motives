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
import type { GenerationPhase } from "@/lib/types";

type ProgressPayload = {
  phase: GenerationPhase;
  message: string;
  percentage?: number;
};

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

async function emitProgress(payload: ProgressPayload) {
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
    phase: "gathering-sources",
    message: `[Brave] Querying web index for "${input.q}" (offset=${input.offset ?? 0}, count=${input.count ?? 10})`,
    percentage: 18,
  });
  const result = await braveWebSearch(input);
  await emitProgress({
    phase: "gathering-sources",
    message: `[Brave] Search complete. ${summarizeResult(result)}`,
    percentage: 20,
  });
  return result;
}

export async function firecrawlScrapeStep(input: FirecrawlScrapeRequest) {
  "use step";
  await emitProgress({
    phase: "gathering-sources",
    message: `[Firecrawl/Scrape] Fetching and extracting content from ${input.url}`,
    percentage: 24,
  });
  const result = await firecrawlScrape(input);
  await emitProgress({
    phase: "gathering-sources",
    message: `[Firecrawl/Scrape] Extraction complete. ${summarizeResult(result)}`,
    percentage: 26,
  });
  return result;
}

export async function firecrawlSearchStep(input: FirecrawlSearchRequest) {
  "use step";
  await emitProgress({
    phase: "gathering-sources",
    message: `[Firecrawl/Search] Running indexed search for "${input.query}"`,
    percentage: 28,
  });
  const result = await firecrawlSearch(input);
  await emitProgress({
    phase: "gathering-sources",
    message: `[Firecrawl/Search] Search complete. ${summarizeResult(result)}`,
    percentage: 32,
  });
  return result;
}

export async function gdeltTopMediaEventsStep(input: GdeltMediaEventsParams = {}) {
  "use step";
  await emitProgress({
    phase: "identifying-stakeholders",
    message: `[GDELT] Pulling top media event clusters (days=${input.days ?? 1}, limit=${input.limit ?? 10})`,
    percentage: 40,
  });
  const result = await getTopMediaEventClusters(input);
  await emitProgress({
    phase: "identifying-stakeholders",
    message: `[GDELT] Cluster analysis complete. ${summarizeResult(result)}`,
    percentage: 44,
  });
  return result;
}

export async function newsTopHeadlinesStep(input: TopHeadlinesParams = {}) {
  "use step";
  await emitProgress({
    phase: "identifying-stakeholders",
    message: `[NewsAPI/TopHeadlines] Pulling top headlines for stakeholder signal detection`,
    percentage: 48,
  });
  const result = await fetchTopHeadlines(input);
  await emitProgress({
    phase: "identifying-stakeholders",
    message: `[NewsAPI/TopHeadlines] Retrieval complete. ${summarizeResult(result)}`,
    percentage: 52,
  });
  return result;
}

export async function newsEverythingStep(input: EverythingParams = {}) {
  "use step";
  await emitProgress({
    phase: "analyzing-incentives",
    message: `[NewsAPI/Everything] Querying broad corpus for incentive patterns`,
    percentage: 62,
  });
  const result = await fetchEverything(input);
  await emitProgress({
    phase: "analyzing-incentives",
    message: `[NewsAPI/Everything] Pattern scan complete. ${summarizeResult(result)}`,
    percentage: 68,
  });
  return result;
}

export async function newsSourcesStep(input: SourcesParams = {}) {
  "use step";
  await emitProgress({
    phase: "drafting-report",
    message: "[NewsAPI/Sources] Collecting source metadata and provenance attributes",
    percentage: 82,
  });
  const result = await fetchSources(input);
  await emitProgress({
    phase: "drafting-report",
    message: `[NewsAPI/Sources] Source metadata loaded. ${summarizeResult(result)}`,
    percentage: 88,
  });
  return result;
}
