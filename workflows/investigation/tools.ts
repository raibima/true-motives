import { z } from "zod";

import type { BraveSearchParams } from "@/lib/brave-search";
import type { FirecrawlScrapeRequest, FirecrawlSearchRequest } from "@/lib/firecrawl";
import type { GdeltMediaEventsParams } from "@/lib/gdelt";
import type {
  EverythingParams,
  NewsApiCategory,
  NewsApiCountry,
  NewsApiLanguage,
  SourcesParams,
  TopHeadlinesParams,
} from "@/lib/newsapi";
import {
  braveWebSearchStep,
  firecrawlScrapeStep,
  firecrawlSearchStep,
  gdeltTopMediaEventsStep,
  newsEverythingStep,
  newsSourcesStep,
  newsTopHeadlinesStep,
} from "@/workflows/investigation/steps/research";

const NEWS_API_COUNTRIES = [
  "ae",
  "ar",
  "at",
  "au",
  "be",
  "bg",
  "br",
  "ca",
  "ch",
  "cn",
  "co",
  "cu",
  "cz",
  "de",
  "eg",
  "fr",
  "gb",
  "gr",
  "hk",
  "hu",
  "id",
  "ie",
  "il",
  "in",
  "it",
  "jp",
  "kr",
  "lt",
  "lv",
  "ma",
  "mx",
  "my",
  "ng",
  "nl",
  "no",
  "nz",
  "ph",
  "pl",
  "pt",
  "ro",
  "rs",
  "ru",
  "sa",
  "se",
  "sg",
  "si",
  "sk",
  "th",
  "tr",
  "tw",
  "ua",
  "us",
  "ve",
  "za",
] as const satisfies readonly NewsApiCountry[];

const NEWS_API_CATEGORIES = [
  "business",
  "entertainment",
  "general",
  "health",
  "science",
  "sports",
  "technology",
] as const satisfies readonly NewsApiCategory[];

const NEWS_API_LANGUAGES = [
  "ar",
  "de",
  "en",
  "es",
  "fr",
  "he",
  "it",
  "nl",
  "no",
  "pt",
  "ru",
  "se",
  "ud",
  "zh",
] as const satisfies readonly NewsApiLanguage[];

type ToolCallName =
  | "braveWebSearch"
  | "firecrawlScrape"
  | "firecrawlSearch"
  | "gdeltTopMediaEvents"
  | "newsTopHeadlines"
  | "newsEverything"
  | "newsSources";

export type InvestigationToolCallCounts = Partial<Record<ToolCallName, number>>;

interface CreateInvestigationToolsOptions {
  onToolStart?: (tool: ToolCallName) => Promise<void> | void;
}

export function createInvestigationTools({
  onToolStart,
}: CreateInvestigationToolsOptions) {
  const notifyToolStart = async (tool: ToolCallName) => {
    await onToolStart?.(tool);
  };

  return {
    webSearch01: {
      description: "General-purpose web search for relevant sources.",
      inputSchema: z.object({
        q: z.string(),
        country: z.string().optional(),
        offset: z.number().int().min(0).optional(),
        count: z.number().int().min(1).optional(),
        extraParams: z
          .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
          .optional(),
      }),
      execute: async ({
        extraParams,
        ...base
      }: {
        q: string;
        country?: string;
        offset?: number;
        count?: number;
        extraParams?: Record<string, string | number | boolean>;
      }) => {
        await notifyToolStart("braveWebSearch");
        if (base.count != null) base.count = Math.min(50, base.count);
        return braveWebSearchStep({ ...base, ...(extraParams ?? {}) } satisfies BraveSearchParams);
      },
    },
    webFetch: {
      description: "Scrape and extract content from a URL.",
      inputSchema: z.object({
        url: z.string().url(),
        formats: z.array(z.union([z.literal("markdown"), z.literal("html")])).optional(),
        onlyMainContent: z.boolean().optional(),
        includeTags: z.array(z.string()).optional(),
        excludeTags: z.array(z.string()).optional(),
        maxAge: z.number().int().optional(),
        minAge: z.number().int().optional(),
        waitFor: z.number().int().optional(),
        mobile: z.boolean().optional(),
        skipTlsVerification: z.boolean().optional(),
        timeout: z.number().int().optional(),
        zeroDataRetention: z.boolean().optional(),
        scrapeOptions: z.record(z.string(), z.unknown()).optional(),
      }),
      execute: async ({
        scrapeOptions,
        ...base
      }: {
        url: string;
        formats?: Array<"markdown" | "html">;
        onlyMainContent?: boolean;
        includeTags?: string[];
        excludeTags?: string[];
        maxAge?: number;
        minAge?: number;
        waitFor?: number;
        mobile?: boolean;
        skipTlsVerification?: boolean;
        timeout?: number;
        zeroDataRetention?: boolean;
        scrapeOptions?: Record<string, unknown>;
      }): Promise<unknown> => {
        await notifyToolStart("firecrawlScrape");
        return firecrawlScrapeStep({
          ...base,
          ...(scrapeOptions ?? {}),
        } satisfies FirecrawlScrapeRequest);
      },
    },
    webSearch02: {
      description: "Search web/indexes via Firecrawl for research content.",
      inputSchema: z.object({
        query: z.string(),
        limit: z.number().int().min(1).optional(),
        country: z.string().optional(),
        location: z.string().optional(),
        categories: z.array(z.enum(["pdf", "research", "github"])).optional(),
        tbs: z.string().optional(),
        scrapeOptions: z.record(z.string(), z.unknown()).optional(),
        extraParams: z.record(z.string(), z.unknown()).optional(),
      }),
      execute: async ({
        extraParams,
        ...base
      }: {
        query: string;
        limit?: number;
        country?: string;
        location?: string;
        categories?: Array<"pdf" | "research" | "github">;
        tbs?: string;
        scrapeOptions?: Record<string, unknown>;
        extraParams?: Record<string, unknown>;
      }) => {
        await notifyToolStart("firecrawlSearch");
        if (base.limit != null) base.limit = Math.min(50, base.limit);
        return firecrawlSearchStep({
          ...base,
          ...(extraParams ?? {}),
        } satisfies FirecrawlSearchRequest);
      },
    },
    webSearch03: {
      description: "Fetch top media event clusters for geopolitical context.",
      inputSchema: z.object({
        days: z.number().int().min(1).optional(),
        date: z.string().optional(),
        limit: z.number().int().min(1).optional(),
        offset: z.number().int().min(0).optional(),
        detail: z.enum(["summary", "standard", "full"]).optional(),
        category: z.string().optional(),
        scope: z.enum(["local", "national", "global"]).optional(),
        actor_country: z.string().optional(),
        event_type: z.string().optional(),
        country: z.string().optional(),
        location: z.string().optional(),
        language: z.string().optional(),
        domain: z.string().optional(),
        goldstein_min: z.number().optional(),
        goldstein_max: z.number().optional(),
        tone_min: z.number().optional(),
        tone_max: z.number().optional(),
        quad_class: z.enum(["1", "2", "3", "4"]).optional(),
        search: z.string().optional(),
        extraParams: z
          .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
          .optional(),
      }),
      execute: async ({
        quad_class,
        extraParams,
        ...base
      }: {
        days?: number;
        date?: string;
        limit?: number;
        offset?: number;
        detail?: "summary" | "standard" | "full";
        category?: string;
        scope?: "local" | "national" | "global";
        actor_country?: string;
        event_type?: string;
        country?: string;
        location?: string;
        language?: string;
        domain?: string;
        goldstein_min?: number;
        goldstein_max?: number;
        tone_min?: number;
        tone_max?: number;
        quad_class?: "1" | "2" | "3" | "4";
        search?: string;
        extraParams?: Record<string, string | number | boolean>;
      }) => {
        await notifyToolStart("gdeltTopMediaEvents");
        if (base.days != null) base.days = Math.min(30, base.days);
        if (base.limit != null) base.limit = Math.min(50, base.limit);
        return gdeltTopMediaEventsStep({
          ...base,
          ...(quad_class
            ? { quad_class: Number(quad_class) as 1 | 2 | 3 | 4 }
            : {}),
          ...(extraParams ?? {}),
        } satisfies GdeltMediaEventsParams);
      },
    },
    webSearch04: {
      description: "Fetch top headlines from NewsAPI.",
      inputSchema: z.object({
        q: z.string().optional(),
        country: z.enum(NEWS_API_COUNTRIES).optional(),
        category: z.enum(NEWS_API_CATEGORIES).optional(),
        sources: z.string().optional(),
        pageSize: z.number().int().min(1).optional(),
        page: z.number().int().min(1).optional(),
        language: z.string().optional(),
        extraParams: z
          .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
          .optional(),
      }),
      execute: async ({
        extraParams,
        ...base
      }: {
        q?: string;
        country?: NewsApiCountry;
        category?: NewsApiCategory;
        sources?: string;
        pageSize?: number;
        page?: number;
        language?: NewsApiLanguage;
        extraParams?: Record<string, string | number | boolean>;
      }) => {
        await notifyToolStart("newsTopHeadlines");
        if (base.pageSize != null) base.pageSize = Math.min(100, base.pageSize);
        return newsTopHeadlinesStep({
          ...base,
          ...(extraParams ?? {}),
        } satisfies TopHeadlinesParams);
      },
    },
    webSearch05: {
      description: "Search the complete NewsAPI corpus.",
      inputSchema: z.object({
        q: z.string().optional(),
        searchIn: z.enum(["title", "description", "content"]).optional(),
        sources: z.string().optional(),
        domains: z.string().optional(),
        excludeDomains: z.string().optional(),
        from: z.string().optional(),
        to: z.string().optional(),
        language: z.enum(NEWS_API_LANGUAGES).optional(),
        sortBy: z.enum(["relevancy", "popularity", "publishedAt"]).optional(),
        pageSize: z.number().int().min(1).optional(),
        page: z.number().int().min(1).optional(),
        extraParams: z
          .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
          .optional(),
      }),
      execute: async ({
        extraParams,
        ...base
      }: {
        q?: string;
        searchIn?: "title" | "description" | "content";
        sources?: string;
        domains?: string;
        excludeDomains?: string;
        from?: string;
        to?: string;
        language?: NewsApiLanguage;
        sortBy?: "relevancy" | "popularity" | "publishedAt";
        pageSize?: number;
        page?: number;
        extraParams?: Record<string, string | number | boolean>;
      }) => {
        await notifyToolStart("newsEverything");
        if (base.pageSize != null) base.pageSize = Math.min(100, base.pageSize);
        return newsEverythingStep({
          ...base,
          ...(extraParams ?? {}),
        } satisfies EverythingParams);
      },
    },
    webSearch06: {
      description: "Fetch source metadata from NewsAPI.",
      inputSchema: z.object({
        category: z.enum(NEWS_API_CATEGORIES).optional(),
        language: z.enum(NEWS_API_LANGUAGES).optional(),
        country: z.enum(NEWS_API_COUNTRIES).optional(),
        extraParams: z
          .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
          .optional(),
      }),
      execute: async ({
        extraParams,
        ...base
      }: {
        category?: NewsApiCategory;
        language?: NewsApiLanguage;
        country?: NewsApiCountry;
        extraParams?: Record<string, string | number | boolean>;
      }) => {
        await notifyToolStart("newsSources");
        return newsSourcesStep({
          ...base,
          ...(extraParams ?? {}),
        } satisfies SourcesParams);
      },
    },
  } as const;
}
