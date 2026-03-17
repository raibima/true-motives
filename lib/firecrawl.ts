const FIRECRAWL_API_BASE_URL = "https://api.firecrawl.dev/v2";

export class FirecrawlError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "FirecrawlError";
    this.status = status;
    this.code = code;
  }
}

function getApiKey(): string {
  const key = process.env.FIRECRAWL_API_KEY;
  if (!key) {
    throw new Error(
      "Missing Firecrawl API key. Set FIRECRAWL_API_KEY in your environment.",
    );
  }
  return key;
}

function sanitizeHeaders(headers?: HeadersInit): HeadersInit | undefined {
  if (!headers) return undefined;

  const result: Record<string, string> = {};

  const append = (k: string, v: string) => {
    const lower = k.toLowerCase();
    if (lower === "authorization") {
      // Never allow callers to override our auth header
      return;
    }
    result[k] = v;
  };

  if (headers instanceof Headers) {
    headers.forEach((value, key) => append(key, value));
  } else if (Array.isArray(headers)) {
    for (const [key, value] of headers) {
      append(key, value);
    }
  } else {
    for (const [key, value] of Object.entries(headers)) {
      if (value !== undefined) {
        append(key, String(value));
      }
    }
  }

  return result;
}

export type FirecrawlFormatType =
  | "markdown"
  | "summary"
  | "html"
  | "rawHtml"
  | "links"
  | "images"
  | "screenshot"
  | "json"
  | "changeTracking"
  | "branding";

export type FirecrawlFormat =
  | FirecrawlFormatType
  | {
      type: FirecrawlFormatType;
      // Additional options vary by format; allow forward-compatible options.
      [key: string]: unknown;
    };

export interface FirecrawlLocation {
  country?: string;
  languages?: string[];
}

export interface FirecrawlParserPdf {
  type: "pdf";
  mode?: "fast" | "auto" | "ocr";
  maxPages?: number;
}

export type FirecrawlParser = FirecrawlParserPdf;

export interface FirecrawlActionWaitByDuration {
  type: "wait";
  milliseconds: number;
}

export interface FirecrawlActionWaitForElement {
  type: "wait";
  selector: string;
}

export interface FirecrawlActionScreenshot {
  type: "screenshot";
  fullPage?: boolean;
  quality?: number;
  viewport?: {
    width: number;
    height: number;
  };
}

export interface FirecrawlActionClick {
  type: "click";
  selector: string;
  all?: boolean;
}

export interface FirecrawlActionWrite {
  type: "write";
  text: string;
}

export interface FirecrawlActionPress {
  type: "press";
  key: string;
}

export interface FirecrawlActionScroll {
  type: "scroll";
  direction?: "up" | "down";
  selector?: string;
}

export interface FirecrawlActionScrape {
  type: "scrape";
}

export interface FirecrawlActionExecuteJavascript {
  type: "executeJavascript";
  script: string;
}

export interface FirecrawlActionPdf {
  type: "pdf";
  format?:
    | "A0"
    | "A1"
    | "A2"
    | "A3"
    | "A4"
    | "A5"
    | "A6"
    | "Letter"
    | "Legal"
    | "Tabloid"
    | "Ledger";
  landscape?: boolean;
  scale?: number;
}

export type FirecrawlAction =
  | FirecrawlActionWaitByDuration
  | FirecrawlActionWaitForElement
  | FirecrawlActionScreenshot
  | FirecrawlActionClick
  | FirecrawlActionWrite
  | FirecrawlActionPress
  | FirecrawlActionScroll
  | FirecrawlActionScrape
  | FirecrawlActionExecuteJavascript
  | FirecrawlActionPdf;

export interface FirecrawlScrapeOptions {
  formats?: FirecrawlFormat[];
  onlyMainContent?: boolean;
  includeTags?: string[];
  excludeTags?: string[];
  maxAge?: number;
  minAge?: number;
  headers?: Record<string, string>;
  waitFor?: number;
  mobile?: boolean;
  skipTlsVerification?: boolean;
  timeout?: number;
  parsers?: FirecrawlParser[];
  actions?: FirecrawlAction[];
  location?: FirecrawlLocation;
  removeBase64Images?: boolean;
  blockAds?: boolean;
  proxy?: "basic" | "enhanced" | "auto";
  storeInCache?: boolean;
  [key: string]: unknown;
}

export interface FirecrawlScrapeRequest extends FirecrawlScrapeOptions {
  url: string;
  zeroDataRetention?: boolean;
}

export interface FirecrawlScrapeActionsResult {
  screenshots?: string[];
  scrapes?: { url: string; html: string }[];
  javascriptReturns?: { type: string; value: unknown }[];
  pdfs?: string[];
}

export interface FirecrawlScrapeMetadata {
  title?: string | string[];
  description?: string | string[];
  language?: string | string[] | null;
  sourceURL?: string;
  url?: string;
  keywords?: string | string[];
  ogLocaleAlternate?: string[];
  statusCode?: number;
  error?: string | null;
  [key: string]: unknown;
}

export interface FirecrawlScrapeChangeTracking {
  previousScrapeAt?: string | null;
  changeStatus?: "new" | "same" | "changed" | "removed";
  visibility?: "visible" | "hidden";
  diff?: string | null;
  json?: Record<string, unknown> | null;
}

export interface FirecrawlBranding {
  colorScheme?: "light" | "dark";
  logo?: string | null;
  colors?: Record<string, unknown> | null;
  fonts?: { family: string }[] | null;
  typography?: Record<string, unknown> | null;
  spacing?: Record<string, unknown> | null;
  components?: Record<string, unknown> | null;
  icons?: Record<string, unknown> | null;
  images?: Record<string, unknown> | null;
  animations?: Record<string, unknown> | null;
  layout?: Record<string, unknown> | null;
  personality?: Record<string, unknown> | null;
}

export interface FirecrawlScrapeData {
  markdown?: string;
  summary?: string | null;
  html?: string | null;
  rawHtml?: string | null;
  screenshot?: string | null;
  links?: string[];
  actions?: FirecrawlScrapeActionsResult | null;
  metadata?: FirecrawlScrapeMetadata;
  warning?: string | null;
  changeTracking?: FirecrawlScrapeChangeTracking | null;
  branding?: FirecrawlBranding | null;
  [key: string]: unknown;
}

export interface FirecrawlScrapeResponse {
  success: boolean;
  data?: FirecrawlScrapeData;
  error?: string;
  code?: string;
  [key: string]: unknown;
}

export type FirecrawlSearchCategory = "pdf" | "research" | "github";

export interface FirecrawlSearchRequest {
  query: string;
  limit?: number;
  country?: string;
  location?: string;
  categories?: FirecrawlSearchCategory[];
  tbs?: string;
  scrapeOptions?: FirecrawlScrapeOptions;
  [key: string]: unknown;
}

export interface FirecrawlSearchResultItem {
  url: string;
  title: string;
  description: string;
  category?: FirecrawlSearchCategory | string;
  [key: string]: unknown;
}

export interface FirecrawlSearchData {
  web?: FirecrawlSearchResultItem[];
  [key: string]: unknown;
}

export interface FirecrawlSearchResponse {
  success: boolean;
  data?: FirecrawlSearchData;
  error?: string;
  code?: string;
  [key: string]: unknown;
}

async function firecrawlRequest<TRequest, TResponse>(
  path: "/scrape" | "/search",
  body: TRequest,
  init?: RequestInit,
): Promise<TResponse> {
  const apiKey = getApiKey();

  const url = new URL(path, FIRECRAWL_API_BASE_URL).toString();

  const response = await fetch(url, {
    ...init,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
      ...sanitizeHeaders(init?.headers),
    },
    body: JSON.stringify(body),
  });

  const text = await response.text().catch(() => "");
  let json: unknown;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      // Non-JSON response (should be rare); treat as error.
    }
  }

  if (!response.ok) {
    const errorJson =
      json && typeof json === "object"
        ? (json as { error?: unknown; code?: unknown })
        : null;

    const message =
      (errorJson &&
        typeof errorJson.error === "string" &&
        errorJson.error) ||
      `Firecrawl API request to ${path} failed with status ${response.status}${
        text ? `: ${text}` : ""
      }`;

    const code =
      errorJson && typeof errorJson.code === "string"
        ? errorJson.code
        : undefined;

    throw new FirecrawlError(message, response.status, code);
  }

  if (!json || typeof json !== "object") {
    throw new FirecrawlError(
      "Unexpected Firecrawl API response shape.",
      response.status,
    );
  }

  return json as TResponse;
}

export async function firecrawlScrape(
  request: FirecrawlScrapeRequest,
  init?: RequestInit,
): Promise<FirecrawlScrapeResponse> {
  if (!request || typeof request !== "object") {
    throw new TypeError("firecrawlScrape request must be an object.");
  }

  if (!request.url || typeof request.url !== "string") {
    throw new TypeError(
      "firecrawlScrape request.url must be a non-empty string.",
    );
  }

  if (!/^https?:\/\//i.test(request.url)) {
    throw new TypeError(
      "firecrawlScrape request.url must be an absolute HTTP(S) URL.",
    );
  }

  return firecrawlRequest<FirecrawlScrapeRequest, FirecrawlScrapeResponse>(
    "/scrape",
    request,
    init,
  );
}

export async function firecrawlSearch(
  request: FirecrawlSearchRequest,
  init?: RequestInit,
): Promise<FirecrawlSearchResponse> {
  if (!request || typeof request !== "object") {
    throw new TypeError("firecrawlSearch request must be an object.");
  }

  if (!request.query || typeof request.query !== "string") {
    throw new TypeError(
      "firecrawlSearch request.query must be a non-empty string.",
    );
  }

  if (
    request.limit !== undefined &&
    (!Number.isInteger(request.limit) || request.limit <= 0)
  ) {
    throw new TypeError(
      "firecrawlSearch request.limit must be a positive integer when provided.",
    );
  }

  return firecrawlRequest<FirecrawlSearchRequest, FirecrawlSearchResponse>(
    "/search",
    request,
    init,
  );
}
