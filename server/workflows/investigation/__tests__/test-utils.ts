import type {InvestigationWorkflowInput} from '@/shared/investigations/schema';
import type {Report} from '@/shared/types';
export function createTestInvestigationInput(
  overrides: Partial<InvestigationWorkflowInput> = {},
): InvestigationWorkflowInput {
  return {
    title: 'Testing Infra POC',
    description: 'Verify the investigation workflow test harness.',
    category: 'policy',
    geography: 'Indonesia',
    phases: [
      {
        id: 'plan',
        label: 'Plan',
        description: 'Build the investigation plan.',
      },
      {
        id: 'research',
        label: 'Research',
        description: 'Collect evidence.',
      },
    ],
    ...overrides,
  };
}

export function createTestReport(overrides: Partial<Report> = {}): Report {
  return {
    slug: 'poc-happy-path',
    title: 'POC Report',
    summary: 'Synthetic summary',
    executiveSummary: 'Synthetic executive summary',
    category: 'policy',
    geography: 'Indonesia',
    tags: ['test'],
    publishedAt: '2026-03-19T00:00:00.000Z',
    featured: true,
    stakeholders: [],
    motivations: [],
    evidence: [],
    assumptions: [],
    limitations: [],
    alternativeExplanations: [],
    ...overrides,
  };
}

export function createWorkflowWritable(chunks: unknown[]) {
  const stream = new WritableStream<unknown>({
    write(chunk) {
      chunks.push(chunk);
    },
  }) as WritableStream<unknown> & {
    close: () => Promise<void>;
  };

  stream.close = async () => {};
  return stream;
}

export function createOpenAIResponsesStream(report: Report) {
  return createEventStreamResponse([
    {
      type: 'response.created',
      response: {
        id: 'resp_123',
        created_at: 1773878400,
        model: 'gpt-5.4',
        service_tier: null,
      },
    },
    {
      type: 'response.output_item.added',
      output_index: 0,
      item: {
        type: 'message',
        id: 'msg_123',
        phase: 'final_answer',
      },
    },
    {
      type: 'response.output_text.delta',
      item_id: 'msg_123',
      delta: JSON.stringify(report),
      logprobs: null,
    },
    {
      type: 'response.output_item.done',
      output_index: 0,
      item: {
        type: 'message',
        id: 'msg_123',
        phase: 'final_answer',
      },
    },
    {
      type: 'response.completed',
      response: {
        incomplete_details: null,
        usage: {
          input_tokens: 100,
          input_tokens_details: {
            cached_tokens: 0,
          },
          output_tokens: 50,
          output_tokens_details: {
            reasoning_tokens: 0,
          },
        },
        service_tier: null,
      },
    },
  ]);
}

export function createOpenAIResponsesStreamWithoutStructuredOutput() {
  return createEventStreamResponse([
    {
      type: 'response.created',
      response: {
        id: 'resp_empty_123',
        created_at: 1773878400,
        model: 'gpt-5.4',
        service_tier: null,
      },
    },
    {
      type: 'response.completed',
      response: {
        incomplete_details: null,
        usage: {
          input_tokens: 100,
          input_tokens_details: {
            cached_tokens: 0,
          },
          output_tokens: 0,
          output_tokens_details: {
            reasoning_tokens: 0,
          },
        },
        service_tier: null,
      },
    },
  ]);
}

export function createJsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      ...(init.headers ?? {}),
    },
    ...init,
  });
}

export function createOpenAIToolCallStream({
  toolName,
  toolCallId = 'call_123',
  itemId = 'fc_123',
  outputIndex = 0,
  input,
}: {
  toolName: string;
  toolCallId?: string;
  itemId?: string;
  outputIndex?: number;
  input: Record<string, unknown>;
}) {
  const argumentsJson = JSON.stringify(input);

  return createEventStreamResponse([
    {
      type: 'response.created',
      response: {
        id: 'resp_tool_123',
        created_at: 1773878400,
        model: 'gpt-5.4',
        service_tier: null,
      },
    },
    {
      type: 'response.output_item.added',
      output_index: outputIndex,
      item: {
        type: 'function_call',
        id: itemId,
        call_id: toolCallId,
        name: toolName,
        arguments: argumentsJson,
      },
    },
    {
      type: 'response.output_item.done',
      output_index: outputIndex,
      item: {
        type: 'function_call',
        id: itemId,
        call_id: toolCallId,
        name: toolName,
        arguments: argumentsJson,
        status: 'completed',
      },
    },
    {
      type: 'response.completed',
      response: {
        incomplete_details: {
          reason: 'tool_use',
        },
        usage: {
          input_tokens: 100,
          input_tokens_details: {
            cached_tokens: 0,
          },
          output_tokens: 20,
          output_tokens_details: {
            reasoning_tokens: 0,
          },
        },
        service_tier: null,
      },
    },
  ]);
}

export function getProgressPayloads(chunks: unknown[]) {
  return chunks
    .filter(
      (chunk): chunk is {type: 'data-progress'; data: Record<string, unknown>} =>
        typeof chunk === 'object' &&
        chunk !== null &&
        'type' in chunk &&
        chunk.type === 'data-progress' &&
        'data' in chunk,
    )
    .map((chunk) => chunk.data);
}

export interface NetworkTraceEntry {
  method: string;
  hostname: string;
  path: string;
  bodyPreview?: Record<string, unknown>;
}

export function recordNetworkTrace(calls: unknown[][]): NetworkTraceEntry[] {
  return calls.map(([input, init]) => {
    const requestUrl = getUrlString(input);
    const url = new URL(requestUrl);
    const requestInit = (init ?? {}) as RequestInit;
    const bodyText = typeof requestInit.body === 'string' ? requestInit.body : '';

    return {
      method: requestInit.method ?? 'GET',
      hostname: url.hostname,
      path: url.pathname,
      bodyPreview: bodyText ? sanitizeRequestBody(bodyText) : undefined,
    };
  });
}

function createEventStreamResponse(events: unknown[]) {
  const encoder = new TextEncoder();
  const body = events
    .map((event) => `data: ${JSON.stringify(event)}\n\n`)
    .concat('data: [DONE]\n\n')
    .join('');

  return new Response(encoder.encode(body), {
    status: 200,
    headers: {
      'content-type': 'text/event-stream',
    },
  });
}

function getUrlString(input: unknown) {
  if (typeof input === 'string') return input;
  if (input instanceof URL) return input.href;
  if (input instanceof Request) return input.url;

  throw new Error(`Unsupported request input: ${String(input)}`);
}

function sanitizeRequestBody(bodyText: string) {
  const body = JSON.parse(bodyText) as Record<string, unknown>;
  const preview: Record<string, unknown> = {};

  if (typeof body.model === 'string') preview.model = body.model;
  if (typeof body.stream === 'boolean') preview.stream = body.stream;
  if (typeof body.text === 'object' && body.text !== null) {
    const text = body.text as Record<string, unknown>;
    const format =
      typeof text.format === 'object' && text.format !== null
        ? (text.format as Record<string, unknown>)
        : undefined;

    preview.responseFormat = {
      type: format?.type,
      name: format?.name,
    };
  }

  const instructions = extractInstructions(body);
  if (instructions) {
    preview.instructions = instructions;
  }

  const promptPreview = extractPromptPreview(body.input);
  if (promptPreview) {
    preview.promptPreview = promptPreview;
  }

  const tools = extractTools(body.tools);
  if (tools.length > 0) {
    preview.tools = tools;
  }

  return preview;
}

function extractInstructions(body: Record<string, unknown>) {
  if (typeof body.instructions === 'string') {
    return body.instructions.slice(0, 200);
  }

  const input = body.input;
  if (!Array.isArray(input)) return undefined;

  const instructions = input.find(
    (item) =>
      typeof item === 'object' &&
      item !== null &&
      'role' in item &&
      item.role === 'system' &&
      'content' in item &&
      typeof item.content === 'string',
  ) as {content: string} | undefined;

  return instructions?.content.slice(0, 200);
}

function extractPromptPreview(input: unknown) {
  if (!Array.isArray(input)) return undefined;

  const userItem = input.find(
    (item) => typeof item === 'object' && item !== null && 'role' in item && item.role === 'user',
  ) as {content?: unknown} | undefined;

  if (typeof userItem?.content === 'string') {
    return userItem.content.slice(0, 300);
  }

  if (Array.isArray(userItem?.content)) {
    const textParts = userItem.content
      .filter(
        (part): part is {type?: unknown; text?: unknown} =>
          typeof part === 'object' && part !== null,
      )
      .filter((part) => part.type === 'input_text' && typeof part.text === 'string')
      .map((part) => part.text);

    return textParts.join('\n').slice(0, 300);
  }

  return undefined;
}

function extractTools(tools: unknown) {
  if (!Array.isArray(tools)) return [];

  return tools
    .filter(
      (tool): tool is {name?: unknown; description?: unknown; type?: unknown} =>
        typeof tool === 'object' && tool !== null,
    )
    .map((tool) => ({
      type: typeof tool.type === 'string' ? tool.type : undefined,
      name: typeof tool.name === 'string' ? tool.name : undefined,
    }));
}
