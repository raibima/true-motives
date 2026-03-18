import "server-only";

const BRAVE_SEARCH_ENDPOINT = "https://api.search.brave.com/res/v1/web/search";

export interface BraveWebResultItem {
  title: string;
  url: string;
  description: string;
  age?: string;
  [key: string]: unknown;
}

export interface BraveWebResultsSection {
  results: BraveWebResultItem[];
  [key: string]: unknown;
}

export interface BraveSearchResponse {
  type: string;
  query: {
    original: string;
    [key: string]: unknown;
  };
  web?: BraveWebResultsSection;
  [key: string]: unknown;
}

export interface BraveSearchParams {
  /**
   * The search query. Required.
   */
  q: string;
  /**
   * Optional locale / market, e.g. "en-US".
   */
  country?: string;
  /**
   * Pagination offset.
   */
  offset?: number;
  /**
   * Number of results to return.
   */
  count?: number;
  /**
   * Additional raw query parameters passed through to Brave.
   */
  [key: string]: string | number | boolean | undefined;
}

export class BraveSearchError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "BraveSearchError";
    this.status = status;
  }
}

function getApiKey(): string {
  const key = process.env.BRAVE_SEARCH_API_KEY;
  if (!key) {
    throw new Error(
      "Missing Brave Search API key. Set BRAVE_SEARCH_API_KEY in your environment.",
    );
  }
  return key;
}

function buildUrl(params: BraveSearchParams): string {
  if (!params.q || typeof params.q !== "string") {
    throw new TypeError(
      "BraveSearchParams.q (query) must be a non-empty string",
    );
  }

  const url = new URL(BRAVE_SEARCH_ENDPOINT);
  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined,
  ) as [string, string | number | boolean][];

  for (const [key, value] of entries) {
    url.searchParams.set(key, String(value));
  }

  return url.toString();
}

export async function braveWebSearch(
  params: BraveSearchParams,
  init?: RequestInit,
): Promise<BraveSearchResponse> {
  const apiKey = getApiKey();
  const url = buildUrl(params);

  const response = await fetch(url, {
    ...init,
    method: "GET",
    headers: {
      Accept: "application/json",
      "Accept-Encoding": "gzip",
      "X-Subscription-Token": apiKey,
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new BraveSearchError(
      `Brave Search API request failed with status ${response.status}${
        text ? `: ${text}` : ""
      }`,
      response.status,
    );
  }

  const data = (await response.json()) as unknown;

  // Basic runtime validation to ensure the shape roughly matches BraveSearchResponse
  if (!data || typeof data !== "object") {
    throw new BraveSearchError(
      "Unexpected Brave Search API response shape.",
      response.status,
    );
  }

  const candidate = data as { type?: unknown; query?: unknown };

  if (typeof candidate.type !== "string" || typeof candidate.query !== "object") {
    throw new BraveSearchError(
      "Unexpected Brave Search API response shape.",
      response.status,
    );
  }

  return data as BraveSearchResponse;
}
