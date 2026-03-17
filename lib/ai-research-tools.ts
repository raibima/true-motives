import { tool } from "ai";
import { z } from "zod";

import {
  braveWebSearch,
  type BraveSearchParams,
} from "./brave-search";
import {
  firecrawlScrape,
  firecrawlSearch,
  type FirecrawlScrapeRequest,
  type FirecrawlSearchRequest,
} from "./firecrawl";
import {
  getTopMediaEventClusters,
  type GdeltMediaEventsParams,
} from "./gdelt";
import {
  fetchEverything,
  fetchSources,
  fetchTopHeadlines,
  type EverythingParams,
  type SourcesParams,
  type TopHeadlinesParams,
} from "./newsapi";

// Utility schemas
const booleanNumberString = z.union([z.string(), z.number(), z.boolean()]);

const recordOfStringNumberBoolean = z.record(z.string(), booleanNumberString);

/**
 * Tools for AI SDK that wrap the project’s research integrations:
 * - Brave Search
 * - Firecrawl
 * - GDELT
 * - NewsAPI
 */
export const aiResearchTools = {
  /**
   * General-purpose web search via Brave Search.
   */
  braveWebSearch: tool({
    description:
      "Perform a general-purpose web search using Brave Search and return structured web results.",
    inputSchema: z.object({
      q: z
        .string()
        .min(1)
        .describe("The search query string."),
      country: z
        .string()
        .optional()
        .describe(
          'Optional locale / market code such as "en-US" to influence results.',
        ),
      offset: z
        .number()
        .int()
        .min(0)
        .optional()
        .describe("Pagination offset into the result set."),
      count: z
        .number()
        .int()
        .min(1)
        .max(50)
        .optional()
        .describe("Number of results to return."),
      /**
       * Additional raw Brave query parameters (advanced usage).
       * These will be passed through as-is.
       */
      extraParams: recordOfStringNumberBoolean
        .optional()
        .describe(
          "Advanced: additional Brave API query parameters to pass through as-is.",
        ),
    }),
    execute: async (input) => {
      const { extraParams, ...base } = input;
      const params: BraveSearchParams = {
        ...base,
        ...(extraParams ?? {}),
      };
      return braveWebSearch(params);
    },
  }),

  /**
   * Scrape and extract content from a single URL using Firecrawl.
   */
  firecrawlScrape: tool({
    description:
      "Scrape a single web page using Firecrawl and return cleaned, LLM-ready content (markdown/HTML/summary).",
    inputSchema: z.object({
      url: z
        .string()
        .url()
        .describe("Absolute HTTP(S) URL to scrape."),
      formats: z
        .array(
          z.union([
            z.enum([
              "markdown",
              "summary",
              "html",
              "rawHtml",
              "links",
              "images",
              "screenshot",
              "json",
              "changeTracking",
              "branding",
            ]),
            z.object({
              type: z.enum([
                "markdown",
                "summary",
                "html",
                "rawHtml",
                "links",
                "images",
                "screenshot",
                "json",
                "changeTracking",
                "branding",
              ]),
            }).catchall(z.unknown()),
          ]),
        )
        .optional()
        .describe(
          "Desired Firecrawl output formats. If omitted, server defaults are used.",
        ),
      onlyMainContent: z
        .boolean()
        .optional()
        .describe("If true, focus on main article/body content."),
      includeTags: z
        .array(z.string())
        .optional()
        .describe("HTML tags or CSS selectors to force-include."),
      excludeTags: z
        .array(z.string())
        .optional()
        .describe("HTML tags or CSS selectors to exclude."),
      maxAge: z
        .number()
        .int()
        .optional()
        .describe("Maximum cache age in seconds."),
      minAge: z
        .number()
        .int()
        .optional()
        .describe("Minimum cache age in seconds."),
      waitFor: z
        .number()
        .int()
        .optional()
        .describe(
          "Milliseconds to wait for the page to load or for dynamic content.",
        ),
      mobile: z
        .boolean()
        .optional()
        .describe("If true, use a mobile browser profile."),
      skipTlsVerification: z
        .boolean()
        .optional()
        .describe("Skip TLS verification (not recommended unless necessary)."),
      timeout: z
        .number()
        .int()
        .optional()
        .describe("Request timeout in milliseconds."),
      zeroDataRetention: z
        .boolean()
        .optional()
        .describe(
          "If true, instruct Firecrawl not to retain data beyond this request.",
        ),
      // Advanced options: allow partial passthrough while keeping schema manageable.
      scrapeOptions: z
        .record(z.string(), z.unknown())
        .optional()
        .describe(
          "Advanced Firecrawl scrape options object for power users. Merged into the request.",
        ),
    }),
    execute: async (input) => {
      const {
        scrapeOptions,
        zeroDataRetention,
        url,
        ...directOptions
      } = input;

      const request: FirecrawlScrapeRequest = {
        url,
        zeroDataRetention,
        ...(scrapeOptions ?? {}),
        ...directOptions,
      };

      return firecrawlScrape(request);
    },
  }),

  /**
   * Search the web using Firecrawl's search API and optionally include scrape options.
   */
  firecrawlSearch: tool({
    description:
      "Search the web using Firecrawl search (e.g. for PDFs, research, or GitHub) and return structured search results.",
    inputSchema: z.object({
      query: z
        .string()
        .min(1)
        .describe("The search query to send to Firecrawl."),
      limit: z
        .number()
        .int()
        .min(1)
        .max(50)
        .optional()
        .describe(
          "Maximum number of search results to return. Defaults are applied by the API.",
        ),
      country: z
        .string()
        .optional()
        .describe("Optional country code or region hint for the search."),
      location: z
        .string()
        .optional()
        .describe("Optional free-form location hint text."),
      categories: z
        .array(z.enum(["pdf", "research", "github"]))
        .optional()
        .describe(
          "Optional list of Firecrawl search categories to focus results (e.g. pdf, research, github).",
        ),
      tbs: z
        .string()
        .optional()
        .describe(
          "Optional time-based search restriction string (tbs parameter).",
        ),
      scrapeOptions: z
        .record(z.string(), z.unknown())
        .optional()
        .describe(
          "Optional Firecrawl scrapeOptions object for how individual results should be scraped.",
        ),
      extraParams: z
        .record(z.string(), z.unknown())
        .optional()
        .describe(
          "Advanced: additional Firecrawl search request parameters to pass through.",
        ),
    }),
    execute: async (input) => {
      const { extraParams, ...base } = input;

      const request: FirecrawlSearchRequest = {
        ...base,
        ...(extraParams ?? {}),
      };

      return firecrawlSearch(request);
    },
  }),

  /**
   * Query GDELT Cloud for top media event clusters.
   */
  gdeltTopMediaEvents: tool({
    description:
      "Query GDELT Cloud for top media event clusters over a recent time window (geopolitics, protests, disasters, etc.).",
    inputSchema: z.object({
      days: z
        .number()
        .int()
        .min(1)
        .max(30)
        .optional()
        .describe(
          "Window size in days ending on the anchor date. 1–30, defaults to 1.",
        ),
      date: z
        .string()
        .optional()
        .describe(
          "Anchor/end date in YYYY-MM-DD format. Defaults to today (UTC) if omitted.",
        ),
      limit: z
        .number()
        .int()
        .min(1)
        .max(50)
        .optional()
        .describe("Number of clusters to return (1–50)."),
      offset: z
        .number()
        .int()
        .min(0)
        .optional()
        .describe("Pagination offset (0 or greater)."),
      detail: z
        .enum(["summary", "standard", "full"])
        .optional()
        .describe(
          'Response detail level: "summary", "standard", or "full".',
        ),
      category: z
        .string()
        .optional()
        .describe(
          "Optional topic category filter (e.g. conflict, politics). Comma-separated list is allowed.",
        ),
      scope: z
        .enum(["local", "national", "global"])
        .optional()
        .describe("Optional geographic scope filter."),
      actor_country: z
        .string()
        .optional()
        .describe(
          "CAMEO ISO-3 country code for actor1 or actor2 (e.g. USA, GBR, CHN).",
        ),
      event_type: z
        .string()
        .optional()
        .describe(
          'CAMEO event root code prefix (e.g. "14" for protest-related events).',
        ),
      country: z
        .string()
        .optional()
        .describe(
          "Friendly country filter (name, ISO-3, or FIPS 2-letter).",
        ),
      location: z
        .string()
        .optional()
        .describe("Raw FIPS 10-4 two-letter country prefix."),
      language: z
        .string()
        .optional()
        .describe("Full language name or ISO-639-1 code."),
      domain: z
        .string()
        .optional()
        .describe(
          "Filter to clusters containing at least one article from this domain.",
        ),
      goldstein_min: z
        .number()
        .optional()
        .describe("Minimum Goldstein score (between -10 and 10)."),
      goldstein_max: z
        .number()
        .optional()
        .describe("Maximum Goldstein score (between -10 and 10)."),
      tone_min: z
        .number()
        .optional()
        .describe("Minimum average tone score."),
      tone_max: z
        .number()
        .optional()
        .describe("Maximum average tone score."),
      quad_class: z
        .enum(["1", "2", "3", "4"])
        .optional()
        .describe(
          "Quad class (1–4) as a string, representing conflict/coop dimensions.",
        ),
      search: z
        .string()
        .optional()
        .describe("Natural-language semantic search query to filter clusters."),
      extraParams: recordOfStringNumberBoolean
        .optional()
        .describe(
          "Advanced: additional raw query parameters to pass through to the GDELT API.",
        ),
    }),
    execute: async (input) => {
      const { extraParams, quad_class, ...rest } = input;

      const params: GdeltMediaEventsParams = {
        ...rest,
        ...(quad_class
          ? {
              quad_class: Number(quad_class) as 1 | 2 | 3 | 4,
            }
          : {}),
        ...(extraParams ?? {}),
      };

      return getTopMediaEventClusters(params);
    },
  }),

  /**
   * Fetch top news headlines using NewsAPI.
   */
  newsTopHeadlines: tool({
    description:
      "Fetch top news headlines using NewsAPI, with optional filters for country, category, sources, and query.",
    inputSchema: z.object({
      q: z
        .string()
        .optional()
        .describe("Optional free-text search query string."),
      country: z
        .custom<TopHeadlinesParams["country"]>()
        .optional()
        .describe(
          "Two-letter country code for top headlines (e.g. us, gb, de).",
        ),
      category: z
        .custom<TopHeadlinesParams["category"]>()
        .optional()
        .describe(
          "News category such as business, technology, health, sports, etc.",
        ),
      sources: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of source identifiers. Cannot be combined with country or category.",
        ),
      pageSize: z
        .number()
        .int()
        .min(1)
        .max(100)
        .optional()
        .describe("Number of results per page (1–100)."),
      page: z
        .number()
        .int()
        .min(1)
        .optional()
        .describe("Page number for pagination (1+)."),
      language: z
        .custom<TopHeadlinesParams["language"]>()
        .optional()
        .describe(
          "Optional language code for headlines (e.g. en, fr, de). If provided, must be supported by NewsAPI.",
        ),
      extraParams: recordOfStringNumberBoolean
        .optional()
        .describe(
          "Advanced: additional NewsAPI top-headlines parameters to pass through.",
        ),
    }),
    execute: async (input) => {
      const { extraParams, ...base } = input;
      const params: TopHeadlinesParams = {
        ...base,
        ...(extraParams ?? {}),
      };
      return fetchTopHeadlines(params);
    },
  }),

  /**
   * Search for news articles using NewsAPI's `everything` endpoint.
   */
  newsEverything: tool({
    description:
      "Search for news articles using NewsAPI's `everything` endpoint, with filters for keywords, dates, domains, and language.",
    inputSchema: z.object({
      q: z
        .string()
        .optional()
        .describe("Free-text search query."),
      searchIn: z
        .enum(["title", "description", "content"])
        .optional()
        .describe(
          "Restrict the search to specific fields: title, description, or content.",
        ),
      sources: z
        .string()
        .optional()
        .describe("Comma-separated list of source identifiers."),
      domains: z
        .string()
        .optional()
        .describe("Comma-separated list of domains to include."),
      excludeDomains: z
        .string()
        .optional()
        .describe("Comma-separated list of domains to exclude."),
      from: z
        .string()
        .optional()
        .describe(
          "Oldest article date allowed (ISO 8601 string, e.g. 2024-01-01).",
        ),
      to: z
        .string()
        .optional()
        .describe(
          "Newest article date allowed (ISO 8601 string, e.g. 2024-12-31).",
        ),
      language: z
        .custom<EverythingParams["language"]>()
        .optional()
        .describe("Language code for articles (e.g. en, fr, de)."),
      sortBy: z
        .enum(["relevancy", "popularity", "publishedAt"])
        .optional()
        .describe(
          "How to sort the results: relevancy, popularity, or publishedAt.",
        ),
      pageSize: z
        .number()
        .int()
        .min(1)
        .max(100)
        .optional()
        .describe("Number of results per page (1–100)."),
      page: z
        .number()
        .int()
        .min(1)
        .optional()
        .describe("Page number for pagination (1+)."),
      extraParams: recordOfStringNumberBoolean
        .optional()
        .describe(
          "Advanced: additional NewsAPI `everything` parameters to pass through.",
        ),
    }),
    execute: async (input) => {
      const { extraParams, ...base } = input;
      const params: EverythingParams = {
        ...base,
        ...(extraParams ?? {}),
      };
      return fetchEverything(params);
    },
  }),

  /**
   * Fetch supported news sources from NewsAPI.
   */
  newsSources: tool({
    description:
      "Fetch the list of news sources available from NewsAPI, optionally filtered by category, language, or country.",
    inputSchema: z.object({
      category: z
        .custom<SourcesParams["category"]>()
        .optional()
        .describe(
          "Optional news category to filter sources (e.g. business, technology).",
        ),
      language: z
        .custom<SourcesParams["language"]>()
        .optional()
        .describe("Optional language code to filter sources (e.g. en, fr)."),
      country: z
        .custom<SourcesParams["country"]>()
        .optional()
        .describe(
          "Optional two-letter country code to filter sources (e.g. us, gb).",
        ),
      extraParams: recordOfStringNumberBoolean
        .optional()
        .describe(
          "Advanced: additional NewsAPI `sources` parameters to pass through.",
        ),
    }),
    execute: async (input) => {
      const { extraParams, ...base } = input;
      const params: SourcesParams = {
        ...base,
        ...(extraParams ?? {}),
      };
      return fetchSources(params);
    },
  }),
} as const;

