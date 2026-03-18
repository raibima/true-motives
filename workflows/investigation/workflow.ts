import type { UIMessageChunk } from "ai";
import { generateText, Output } from "ai";
import { z } from "zod";
import { DurableAgent, Output as WorkflowOutput } from "@workflow/ai/agent";
import { openai as workflowOpenai } from "@workflow/ai/openai";
import { getWritable } from "workflow";
import { openai } from "@ai-sdk/openai";

import { reportSchema } from "@/lib/report-schema";
import type { Report, ReportCategory } from "@/lib/types";
import {
  braveWebSearchStep,
  firecrawlScrapeStep,
  firecrawlSearchStep,
  gdeltTopMediaEventsStep,
  newsEverythingStep,
  newsSourcesStep,
  newsTopHeadlinesStep,
} from "@/workflows/investigation/steps/research";

export const reportCategorySchema = z.enum([
  "policy",
  "regulation",
  "corporate-decision",
  "government-action",
  "legislation",
  "culture-and-society",
]);

export const investigationInputSchema = z.object({
  title: z.string().min(1),
  description: z.string().default(""),
  category: reportCategorySchema,
  geography: z.string().default("Global"),
  context: z.string().optional(),
});

export type InvestigationWorkflowInput = z.infer<
  typeof investigationInputSchema
>;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function finalizeReport(
  report: z.infer<typeof reportSchema> | undefined,
  input: InvestigationWorkflowInput,
): Report {
  const fallbackSlug = slugify(input.title) || "investigation-report";

  const base: Report = {
    slug: fallbackSlug,
    title: input.title,
    summary: input.description || input.title,
    executiveSummary: input.description || input.title,
    category: input.category as ReportCategory,
    geography: input.geography || "Global",
    tags: [],
    publishedAt: new Date().toISOString(),
    featured: false,
    stakeholders: [],
    motivations: [],
    evidence: [],
    assumptions: [],
    limitations: [],
    alternativeExplanations: [],
  };

  if (!report) {
    return base;
  }

  return {
    ...base,
    ...report,
    slug: report.slug || base.slug,
    category: (report.category || base.category) as ReportCategory,
    geography: report.geography || base.geography,
    publishedAt: report.publishedAt || base.publishedAt,
    featured: report.featured ?? base.featured,
  };
}

export async function planInvestigationFromPrompt(
  prompt: string,
): Promise<InvestigationWorkflowInput> {
  const planningSchema = z.object({
    title: z.string().min(1),
    description: z.string(),
    category: reportCategorySchema,
    geography: z.string(),
    context: z.string(),
  });

  const planningOutput = Output.object({
    schema: planningSchema,
  });

  const { output } = await generateText({
    model: openai("gpt-5-mini-2025-08-07"),
    output: planningOutput,
    prompt: `
You are an assistant that turns a freeform investigation idea into a structured investigation input for the TrueMotives investigation workflow. TrueMotives investigates with a skeptical, critical lens—questioning official narratives and uncovering hidden motives.

Transform the user's idea into an object that matches this schema:
- title: concise, descriptive investigation title
- description: 1–3 sentence summary of the investigation focus
- category: one of "policy" | "regulation" | "corporate-decision" | "government-action" | "legislation" | "culture-and-society"
- geography: string (use "Global" if unclear)
- context: optional string with additional context, constraints, or guiding questions

Guidelines:
- Choose the category by mapping the user's description to the closest enum value.
- Use "Global" as geography when the scope is unclear.
- Keep the title short but specific.
- Summarize the core investigative question in the description; frame it to invite skeptical inquiry (e.g., "what might be hidden?", "who benefits?", "what is the official narrative obscuring?").
- Never invent fields outside this schema.

User investigation idea:
${prompt}
`.trim(),
  });

  const planned = planningSchema.parse(output);

  const normalized: InvestigationWorkflowInput = {
    title: planned.title.trim(),
    description: planned.description.trim(),
    category: planned.category,
    geography: planned.geography.trim() || "Global",
    context: planned.context.trim() || undefined,
  };

  return investigationInputSchema.parse(normalized);
}

export async function investigationWorkflow(
  rawInput: InvestigationWorkflowInput,
) {
  "use workflow";

  const input = investigationInputSchema.parse(rawInput);
  const toolCallCounts: Record<string, number> = {};
  const writable = getWritable<UIMessageChunk>();
  const reportOutput = WorkflowOutput.object({ schema: reportSchema });
  const reportOutputSpecification = {
    type: "object" as const,
    responseFormat: await reportOutput.responseFormat,
    parseOutput: reportOutput.parseCompleteOutput.bind(reportOutput),
    parsePartial: reportOutput.parsePartialOutput.bind(reportOutput),
  };

  const tools = {
    webSearch01: {
      description: "General-purpose web search for relevant sources.",
      inputSchema: z.object({
        q: z.string(),
        country: z.string().optional(),
        offset: z.number().int().min(0).optional(),
        count: z.number().int().min(1).max(50).optional(),
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
        toolCallCounts.braveWebSearch =
          (toolCallCounts.braveWebSearch ?? 0) + 1;
        return braveWebSearchStep({ ...base, ...(extraParams ?? {}) });
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
        toolCallCounts.firecrawlScrape =
          (toolCallCounts.firecrawlScrape ?? 0) + 1;
        return firecrawlScrapeStep({ ...base, ...(scrapeOptions ?? {}) });
      },
    },
    webSearch02: {
      description: "Search web/indexes via Firecrawl for research content.",
      inputSchema: z.object({
        query: z.string(),
        limit: z.number().int().min(1).max(50).optional(),
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
        toolCallCounts.firecrawlSearch =
          (toolCallCounts.firecrawlSearch ?? 0) + 1;
        return firecrawlSearchStep({ ...base, ...(extraParams ?? {}) });
      },
    },
    webSearch03: {
      description: "Fetch top media event clusters for geopolitical context.",
      inputSchema: z.object({
        days: z.number().int().min(1).max(30).optional(),
        date: z.string().optional(),
        limit: z.number().int().min(1).max(50).optional(),
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
        toolCallCounts.gdeltTopMediaEvents =
          (toolCallCounts.gdeltTopMediaEvents ?? 0) + 1;
        return gdeltTopMediaEventsStep({
          ...base,
          ...(quad_class ? { quad_class: Number(quad_class) as 1 | 2 | 3 | 4 } : {}),
          ...(extraParams ?? {}),
        });
      },
    },
    webSearch04: {
      description: "Fetch top headlines from NewsAPI.",
      inputSchema: z.object({
        q: z.string().optional(),
        country: z
          .enum([
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
          ])
          .optional(),
        category: z
          .enum([
            "business",
            "entertainment",
            "general",
            "health",
            "science",
            "sports",
            "technology",
          ])
          .optional(),
        sources: z.string().optional(),
        pageSize: z.number().int().min(1).max(100).optional(),
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
        country?: import("@/lib/newsapi").NewsApiCountry;
        category?: import("@/lib/newsapi").NewsApiCategory;
        sources?: string;
        pageSize?: number;
        page?: number;
        language?: import("@/lib/newsapi").NewsApiLanguage;
        extraParams?: Record<string, string | number | boolean>;
      }) => {
        toolCallCounts.newsTopHeadlines =
          (toolCallCounts.newsTopHeadlines ?? 0) + 1;
        return newsTopHeadlinesStep({ ...base, ...(extraParams ?? {}) });
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
        language: z
          .enum([
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
          ])
          .optional(),
        sortBy: z.enum(["relevancy", "popularity", "publishedAt"]).optional(),
        pageSize: z.number().int().min(1).max(100).optional(),
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
        language?: import("@/lib/newsapi").NewsApiLanguage;
        sortBy?: "relevancy" | "popularity" | "publishedAt";
        pageSize?: number;
        page?: number;
        extraParams?: Record<string, string | number | boolean>;
      }) => {
        toolCallCounts.newsEverything =
          (toolCallCounts.newsEverything ?? 0) + 1;
        return newsEverythingStep({ ...base, ...(extraParams ?? {}) });
      },
    },
    webSearch06: {
      description: "Fetch source metadata from NewsAPI.",
      inputSchema: z.object({
        category: z
          .enum([
            "business",
            "entertainment",
            "general",
            "health",
            "science",
            "sports",
            "technology",
          ])
          .optional(),
        language: z
          .enum([
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
          ])
          .optional(),
        country: z
          .enum([
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
          ])
          .optional(),
        extraParams: z
          .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
          .optional(),
      }),
      execute: async ({
        extraParams,
        ...base
      }: {
        category?: import("@/lib/newsapi").NewsApiCategory;
        language?: import("@/lib/newsapi").NewsApiLanguage;
        country?: import("@/lib/newsapi").NewsApiCountry;
        extraParams?: Record<string, string | number | boolean>;
      }) => {
        toolCallCounts.newsSources = (toolCallCounts.newsSources ?? 0) + 1;
        return newsSourcesStep({ ...base, ...(extraParams ?? {}) });
      },
    },
  } as const;

  const agent = new DurableAgent({
    model: workflowOpenai("gpt-5.4"),
    system: `You are a **skeptical investigative analyst** for TrueMotives. Your job is to dig beneath the surface and question everything—especially official narratives.

**Core mindset: BE CRITICAL AND SKEPTICAL**
- Do NOT take official statements, press releases, or mainstream narratives at face value. Assume there is always more to the story.
- Ask: Who benefits? Who loses? What are they NOT saying? What narrative are they trying to control?
- Actively look for hidden agendas, ulterior motives, conflicts of interest, and incentives that are downplayed or concealed.
- Consider "conspiracy-adjacent" angles: coordination between actors, strategic timing, manufactured consent, controlled opposition, information suppression. These are valid investigative hypotheses—explore them.
- The goal is to uncover **true motives** that official sources would never admit. Surface-level, PR-friendly explanations are your starting point to question, not your conclusion.

**Operational requirements:**
- Start by asking: "What is the official story, and why might it be wrong or incomplete?" Formulate multiple contrarian hypotheses.
- Search for dissenting voices, whistleblowers, alternative media, leaked documents, and critics—not just mainstream coverage.
- Use research tools iteratively and thoroughly: probe each skeptical hypothesis for contradictions, timing coincidences, financial ties, revolving doors, regulatory capture.
- Aim to use **multiple different tools** (web search, scraping, news APIs, geopolitical/event data) to cross-check and find angles mainstream sources miss.
- Distinguish between: (a) well-supported alternative explanations, (b) plausible but speculative theories, and (c) rejected hypotheses—but err on the side of including provocative possibilities.
- Assign confidence levels honestly; "low confidence" does not mean "don't include it"—include speculative angles and flag them as such.
- Explicitly call out evidence gaps, what official sources omit, and alternative explanations that deserve further investigation.

**Output requirements:**
- Return a complete structured report matching the required schema.
- Make motivations rich with skeptical hypotheses, contrarian angles, and "what if" scenarios—not just sanitized summaries.
- Include alternative explanations even when speculative; the report should read like an investigator who questions power, not one who parrots it.
- Executive summary length target: 90–140 words, max 2 short paragraphs. Keep it scannable and avoid long, multi-clause sentences.
- Keep source citations specific; include sourceUrl when available. Prefer diverse sources over echo chambers.`,
    tools,
  });

  const result = await agent.stream({
    messages: [
      {
        role: "user",
        content: `Investigate the following topic with a skeptical, critical lens. Question official narratives and dig for hidden motives.

Title: ${input.title}
Description: ${input.description || "N/A"}
Category: ${input.category}
Geography: ${input.geography || "Global"}
Additional context: ${input.context || "None provided"}
`,
      },
    ],
    writable,
    maxSteps: 60,
    experimental_output: reportOutputSpecification,
  });

  if (Object.keys(toolCallCounts).length > 0) {
    console.log(
      "Investigation tool usage for title=%s, geography=%s:",
      input.title,
      input.geography,
      toolCallCounts,
    );
  }

  const report = finalizeReport(result.experimental_output, input);
  return report;
}
