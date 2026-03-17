const GDELT_API_BASE_URL = "https://gdeltcloud.com";

export class GdeltError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "GdeltError";
    this.status = status;
    this.code = code;
  }
}

function getApiKey(): string {
  const key = process.env.GDELT_API_KEY;
  if (!key) {
    throw new Error(
      "Missing GDELT API key. Set GDELT_API_KEY in your environment.",
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

export interface GdeltErrorResponse {
  error: string;
  code?: string;
  [key: string]: unknown;
}

export interface GdeltMediaEventsParams {
  /**
   * Window size in days ending on `date`. 1–30, defaults to 1.
   */
  days?: number;
  /**
   * Anchor/end date (YYYY-MM-DD). Defaults to today UTC.
   */
  date?: string;
  /**
   * Number of clusters to return (1–50, default 10).
   */
  limit?: number;
  /**
   * Pagination offset (0+).
   */
  offset?: number;
  /**
   * Response detail level.
   */
  detail?: "summary" | "standard" | "full";
  /**
   * Topic category filter. Comma-separated list is allowed.
   */
  category?: string;
  /**
   * Geographic scope filter.
   */
  scope?: "local" | "national" | "global";
  /**
   * CAMEO ISO-3 country code for actor1 or actor2 (e.g. USA, GBR, CHN).
   */
  actor_country?: string;
  /**
   * CAMEO event root code prefix (e.g. "14"=Protest).
   */
  event_type?: string;
  /**
   * Friendly country filter (name, ISO-3, or FIPS 2-letter).
   */
  country?: string;
  /**
   * Raw FIPS 10-4 two-letter country prefix.
   */
  location?: string;
  /**
   * Full language name or ISO-639-1 code.
   */
  language?: string;
  /**
   * Filter to clusters containing at least one article from this domain.
   */
  domain?: string;
  goldstein_min?: number;
  goldstein_max?: number;
  tone_min?: number;
  tone_max?: number;
  quad_class?: 1 | 2 | 3 | 4;
  /**
   * Natural-language semantic search query.
   */
  search?: string;
  /**
   * Forward-compatible extra query params.
   */
  [key: string]: string | number | boolean | undefined;
}

export interface GdeltResolvedActor {
  code?: string;
  name?: string;
  country_code?: string;
  country_name?: string;
}

export interface GdeltResolvedEvent {
  code?: string;
  root_code?: string;
  description?: string;
}

export interface GdeltResolvedLocation {
  country_code?: string;
  country_name?: string;
  adm1_code?: string;
  adm1_name?: string;
  lat?: number;
  long?: number;
}

export interface GdeltResolvedMetrics {
  primary_actor1?: GdeltResolvedActor | null;
  primary_actor2?: GdeltResolvedActor | null;
  primary_event?: GdeltResolvedEvent | null;
  primary_location?: GdeltResolvedLocation | null;
  avg_goldstein?: number | null;
  avg_tone?: number | null;
  primary_quad_class?: number | null;
  top_entities?: { name: string; frequency: number }[];
  languages?: string[];
  resolution_article_count?: number;
  [key: string]: unknown;
}

export interface GdeltArticleItem {
  cluster_id?: string;
  cluster_label?: string;
  article_weight?: number;
  category?: string;
  scope?: "local" | "national" | "global";
  avg_goldstein?: number;
  avg_tone?: number;
  quad_classes?: number[];
  event_code?: string;
  event_description?: string;
  actor1_name?: string;
  actor2_name?: string;
  actor1_country_code?: string;
  actor2_country_code?: string;
  geo_country_name?: string;
  geo_adm1_name?: string;
  source_url?: string;
  page_title?: string;
  domain?: string;
  article_date?: string;
  sharing_image?: string;
  linked_entities?: {
    name: string;
    canonical_name: string;
    type: "person" | "organization";
  }[];
  [key: string]: unknown;
}

export interface GdeltLinkedEntity {
  name: string;
  canonical_name: string;
  type: "person" | "organization";
  [key: string]: unknown;
}

export interface GdeltResolvedCluster {
  cluster_id: string;
  cluster_label: string;
  category: string;
  scope: "local" | "national" | "global";
  time_bucket: string;
  article_count: number;
  total_events: number;
  resolved_metrics?: GdeltResolvedMetrics;
  representative_articles?: GdeltArticleItem[];
  linked_entities?: GdeltLinkedEntity[];
  [key: string]: unknown;
}

export interface GdeltMediaEventsResponse {
  success: boolean;
  clusters?: GdeltResolvedCluster[];
  filters?: Record<string, unknown>;
  metadata?: {
    cluster_count?: number;
    execution_time_ms?: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

function buildUrl(path: string, params?: Record<string, unknown>): string {
  const url = new URL(path, GDELT_API_BASE_URL);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) continue;
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

async function gdeltRequest<TResponse>(
  path: string,
  params?: Record<string, unknown>,
  init?: RequestInit,
): Promise<TResponse> {
  const apiKey = getApiKey();
  const url = buildUrl(path, params);

  const response = await fetch(url, {
    ...init,
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
      ...sanitizeHeaders(init?.headers),
    },
  });

  const text = await response.text().catch(() => "");
  let json: unknown;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      // Non-JSON response; treat as error below.
    }
  }

  if (!response.ok) {
    const payload = (json || {}) as Partial<GdeltErrorResponse>;
    const message =
      (payload && typeof payload.error === "string" && payload.error) ||
      `GDELT API request to ${path} failed with status ${response.status}${
        text ? `: ${text}` : ""
      }`;
    const code =
      payload && typeof payload.code === "string" ? payload.code : undefined;
    throw new GdeltError(message, response.status, code);
  }

  if (!json || typeof json !== "object") {
    throw new GdeltError(
      "Unexpected GDELT API response shape.",
      response.status,
    );
  }

  return json as TResponse;
}

export async function getTopMediaEventClusters(
  params: GdeltMediaEventsParams = {},
  init?: RequestInit,
): Promise<GdeltMediaEventsResponse> {
  if (!params || typeof params !== "object") {
    throw new TypeError("getTopMediaEventClusters params must be an object.");
  }

  if (
    params.days !== undefined &&
    (!Number.isInteger(params.days) ||
      params.days < 1 ||
      params.days > 30)
  ) {
    throw new TypeError(
      "getTopMediaEventClusters params.days must be an integer between 1 and 30.",
    );
  }

  if (
    params.limit !== undefined &&
    (!Number.isInteger(params.limit) ||
      params.limit < 1 ||
      params.limit > 50)
  ) {
    throw new TypeError(
      "getTopMediaEventClusters params.limit must be an integer between 1 and 50.",
    );
  }

  if (
    params.offset !== undefined &&
    (!Number.isInteger(params.offset) || params.offset < 0)
  ) {
    throw new TypeError(
      "getTopMediaEventClusters params.offset must be a non-negative integer.",
    );
  }

  if (
    params.goldstein_min !== undefined &&
    (typeof params.goldstein_min !== "number" ||
      params.goldstein_min < -10 ||
      params.goldstein_min > 10)
  ) {
    throw new TypeError(
      "getTopMediaEventClusters params.goldstein_min must be a number between -10 and 10.",
    );
  }

  if (
    params.goldstein_max !== undefined &&
    (typeof params.goldstein_max !== "number" ||
      params.goldstein_max < -10 ||
      params.goldstein_max > 10)
  ) {
    throw new TypeError(
      "getTopMediaEventClusters params.goldstein_max must be a number between -10 and 10.",
    );
  }

  return gdeltRequest<GdeltMediaEventsResponse>(
    "/api/v1/media-events",
    params,
    init,
  );
}

