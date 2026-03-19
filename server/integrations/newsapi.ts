import 'server-only';

const NEWS_API_ENDPOINT = 'https://newsapi.org/v2';

export type NewsApiLanguage =
  | 'ar'
  | 'de'
  | 'en'
  | 'es'
  | 'fr'
  | 'he'
  | 'it'
  | 'nl'
  | 'no'
  | 'pt'
  | 'ru'
  | 'se'
  | 'ud'
  | 'zh';

export type NewsApiCountry =
  | 'ae'
  | 'ar'
  | 'at'
  | 'au'
  | 'be'
  | 'bg'
  | 'br'
  | 'ca'
  | 'ch'
  | 'cn'
  | 'co'
  | 'cu'
  | 'cz'
  | 'de'
  | 'eg'
  | 'fr'
  | 'gb'
  | 'gr'
  | 'hk'
  | 'hu'
  | 'id'
  | 'ie'
  | 'il'
  | 'in'
  | 'it'
  | 'jp'
  | 'kr'
  | 'lt'
  | 'lv'
  | 'ma'
  | 'mx'
  | 'my'
  | 'ng'
  | 'nl'
  | 'no'
  | 'nz'
  | 'ph'
  | 'pl'
  | 'pt'
  | 'ro'
  | 'rs'
  | 'ru'
  | 'sa'
  | 'se'
  | 'sg'
  | 'si'
  | 'sk'
  | 'th'
  | 'tr'
  | 'tw'
  | 'ua'
  | 'us'
  | 've'
  | 'za';

export type NewsApiCategory =
  | 'business'
  | 'entertainment'
  | 'general'
  | 'health'
  | 'science'
  | 'sports'
  | 'technology';

export type NewsApiSortBy = 'relevancy' | 'popularity' | 'publishedAt';

export interface NewsApiSourceRef {
  id: string | null;
  name: string;
}

export interface NewsApiArticle {
  source: NewsApiSourceRef;
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
  [key: string]: unknown;
}

export interface NewsApiSource {
  id: string;
  name: string;
  description: string;
  url: string;
  category: NewsApiCategory;
  language: NewsApiLanguage;
  country: NewsApiCountry;
  [key: string]: unknown;
}

export interface NewsApiOkBase {
  status: 'ok';
}

export interface NewsApiErrorBase {
  status: 'error';
  code: string;
  message: string;
}

export type NewsApiResponse<T> = (NewsApiOkBase & T) | NewsApiErrorBase;

export interface TopHeadlinesParams {
  q?: string;
  country?: NewsApiCountry;
  category?: NewsApiCategory;
  sources?: string;
  pageSize?: number;
  page?: number;
  language?: NewsApiLanguage;
  [key: string]: string | number | boolean | undefined;
}

export interface EverythingParams {
  q?: string;
  searchIn?: 'title' | 'description' | 'content';
  sources?: string;
  domains?: string;
  excludeDomains?: string;
  from?: string;
  to?: string;
  language?: NewsApiLanguage;
  sortBy?: NewsApiSortBy;
  pageSize?: number;
  page?: number;
  [key: string]: string | number | boolean | undefined;
}

export interface SourcesParams {
  category?: NewsApiCategory;
  language?: NewsApiLanguage;
  country?: NewsApiCountry;
  [key: string]: string | number | boolean | undefined;
}

export interface TopHeadlinesResponseBody {
  totalResults: number;
  articles: NewsApiArticle[];
}

export interface EverythingResponseBody {
  totalResults: number;
  articles: NewsApiArticle[];
}

export interface SourcesResponseBody {
  sources: NewsApiSource[];
}

export class NewsApiError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'NewsApiError';
    this.status = status;
    this.code = code;
  }
}

function getApiKey(): string {
  const key = process.env.NEWS_API_KEY;
  if (!key) {
    throw new Error('Missing NewsAPI API key. Set NEWS_API_KEY in your environment.');
  }
  return key;
}

function buildUrl(
  path: string,
  params: Record<string, string | number | boolean | undefined>,
): string {
  const url = new URL(path, NEWS_API_ENDPOINT + '/');

  const entries = Object.entries(params).filter(([, value]) => value !== undefined) as [
    string,
    string | number | boolean,
  ][];

  for (const [key, value] of entries) {
    url.searchParams.set(key, String(value));
  }

  return url.toString();
}

async function request<TBody>(
  path: string,
  params: Record<string, string | number | boolean | undefined>,
  init?: RequestInit,
): Promise<NewsApiOkBase & TBody> {
  const apiKey = getApiKey();
  const url = buildUrl(path, params);

  const response = await fetch(url, {
    ...init,
    method: 'GET',
    headers: {
      ...(init?.headers ?? {}),
      Accept: 'application/json',
      'X-Api-Key': apiKey,
    },
  });

  const data = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    const maybeError = data as Partial<NewsApiErrorBase> | null;
    const message = maybeError?.message || `NewsAPI request failed with status ${response.status}`;
    const code = maybeError?.code;
    throw new NewsApiError(message, response.status, code);
  }

  if (!data || typeof data !== 'object') {
    throw new NewsApiError('Unexpected NewsAPI response shape.', response.status);
  }

  const typed = data as NewsApiResponse<TBody>;

  if (typed.status === 'error') {
    throw new NewsApiError(typed.message, response.status, typed.code);
  }

  if (typed.status !== 'ok') {
    throw new NewsApiError('Unexpected NewsAPI status value.', response.status);
  }

  return typed;
}

export async function fetchTopHeadlines(
  params: TopHeadlinesParams,
  init?: RequestInit,
): Promise<NewsApiOkBase & TopHeadlinesResponseBody> {
  if (params.sources && (params.country || params.category)) {
    throw new TypeError(
      "NewsAPI top-headlines: 'sources' cannot be combined with 'country' or 'category'.",
    );
  }

  return request<TopHeadlinesResponseBody>('top-headlines', params, init);
}

export async function fetchEverything(
  params: EverythingParams,
  init?: RequestInit,
): Promise<NewsApiOkBase & EverythingResponseBody> {
  return request<EverythingResponseBody>('everything', params, init);
}

export async function fetchSources(
  params: SourcesParams = {},
  init?: RequestInit,
): Promise<NewsApiOkBase & SourcesResponseBody> {
  return request<SourcesResponseBody>('top-headlines/sources', params, init);
}
