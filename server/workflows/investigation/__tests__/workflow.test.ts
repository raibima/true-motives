import {beforeEach, describe, expect, it, vi} from 'vitest';

import {
  createJsonResponse,
  createOpenAIResponsesStream,
  createOpenAIResponsesStreamWithoutStructuredOutput,
  createOpenAIToolCallStream,
  createTestInvestigationInput,
  createTestReport,
  createWorkflowWritable,
  getProgressPayloads,
  recordNetworkTrace,
} from './test-utils';

const writes: unknown[] = [];
const workflowFetch = vi.fn();

vi.mock('server-only', () => ({}));

vi.mock('workflow', () => ({
  fetch: workflowFetch,
  getWritable: vi.fn(() => createWorkflowWritable(writes)),
}));

describe('investigationWorkflow provider-boundary smoke test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    workflowFetch.mockReset();
    writes.length = 0;
    process.env.OPENAI_API_KEY = 'test-key';
    process.env.BRAVE_SEARCH_API_KEY = 'test-brave-key';
    process.env.GDELT_API_KEY = 'test-gdelt-key';
  });

  it('calls the OpenAI responses endpoint with the workflow prompt and parses the streamed result', async () => {
    const {investigationWorkflow} = await import('../workflow');
    const input = createTestInvestigationInput({
      description: 'Verify we can intercept the provider fetch.',
    });
    const report = createTestReport({
      slug: 'fetch-smoke-test',
      title: 'Fetch Smoke Test',
      summary: 'Provider boundary smoke test.',
      executiveSummary: 'Provider boundary smoke test.',
      tags: ['poc'],
      featured: false,
    });

    workflowFetch.mockResolvedValue(createOpenAIResponsesStream(report));

    const result = await investigationWorkflow(input);
    const networkTrace = recordNetworkTrace(workflowFetch.mock.calls);

    expect(workflowFetch).toHaveBeenCalled();
    expect(networkTrace).toMatchSnapshot();
    expect(result).toMatchObject(report);
  });

  it('emits phase progress updates when the workflow executes a research tool', async () => {
    const {investigationWorkflow} = await import('../workflow');
    const input = createTestInvestigationInput();
    const report = createTestReport({
      slug: 'phase-tracking-test',
      title: 'Phase Tracking Test',
    });

    workflowFetch
      .mockResolvedValueOnce(
        createOpenAIToolCallStream({
          toolName: 'webSearch01',
          input: {
            q: 'test query',
          },
        }),
      )
      .mockResolvedValueOnce(
        createJsonResponse({
          type: 'search',
          query: {
            original: 'test query',
          },
          web: {
            results: [
              {
                title: 'Example result',
                url: 'https://example.com',
                description: 'Example description',
              },
            ],
          },
        }),
      )
      .mockResolvedValueOnce(createOpenAIResponsesStream(report));

    const result = await investigationWorkflow(input);
    const networkTrace = recordNetworkTrace(workflowFetch.mock.calls);
    const progressPayloads = getProgressPayloads(writes);

    expect(workflowFetch).toHaveBeenCalledTimes(3);
    expect(networkTrace).toMatchSnapshot();
    expect(progressPayloads).toMatchInlineSnapshot(`
      [
        {
          "kind": "phases-init",
          "phases": [
            {
              "description": "Build the investigation plan.",
              "id": "plan",
              "label": "Plan",
              "status": "pending",
            },
            {
              "description": "Collect evidence.",
              "id": "research",
              "label": "Research",
              "status": "pending",
            },
          ],
        },
        {
          "kind": "phase-update",
          "phaseId": "plan",
          "status": "in-progress",
        },
        {
          "kind": "activity",
          "message": "[Brave] Querying web index for "test query" (offset=0, count=10)",
        },
        {
          "kind": "activity",
          "message": "[Brave] Search complete. Found 1 web results.",
        },
      ]
    `);
    expect(result).toMatchObject(report);
  });

  it('advances to the next phase after enough research tool calls', async () => {
    const {investigationWorkflow} = await import('../workflow');
    const input = createTestInvestigationInput({
      phases: Array.from({length: 8}, (_, index) => ({
        id: `phase-${index + 1}`,
        label: `Phase ${index + 1}`,
        description: `Description ${index + 1}`,
      })),
    });
    const report = createTestReport({
      slug: 'multi-phase-advancement-test',
      title: 'Multi Phase Advancement Test',
    });

    workflowFetch
      .mockResolvedValueOnce(
        createOpenAIToolCallStream({
          toolName: 'webSearch01',
          toolCallId: 'call_1',
          itemId: 'fc_1',
          input: {q: 'first query'},
        }),
      )
      .mockResolvedValueOnce(
        createJsonResponse({
          type: 'search',
          query: {original: 'first query'},
          web: {results: [{title: 'First', url: 'https://example.com/1', description: 'First'}]},
        }),
      )
      .mockResolvedValueOnce(
        createOpenAIToolCallStream({
          toolName: 'webSearch01',
          toolCallId: 'call_2',
          itemId: 'fc_2',
          input: {q: 'second query'},
        }),
      )
      .mockResolvedValueOnce(
        createJsonResponse({
          type: 'search',
          query: {original: 'second query'},
          web: {results: [{title: 'Second', url: 'https://example.com/2', description: 'Second'}]},
        }),
      )
      .mockResolvedValueOnce(
        createOpenAIToolCallStream({
          toolName: 'webSearch01',
          toolCallId: 'call_3',
          itemId: 'fc_3',
          input: {q: 'third query'},
        }),
      )
      .mockResolvedValueOnce(
        createJsonResponse({
          type: 'search',
          query: {original: 'third query'},
          web: {results: [{title: 'Third', url: 'https://example.com/3', description: 'Third'}]},
        }),
      )
      .mockResolvedValueOnce(
        createOpenAIToolCallStream({
          toolName: 'webSearch01',
          toolCallId: 'call_4',
          itemId: 'fc_4',
          input: {q: 'fourth query'},
        }),
      )
      .mockResolvedValueOnce(
        createJsonResponse({
          type: 'search',
          query: {original: 'fourth query'},
          web: {
            results: [{title: 'Fourth', url: 'https://example.com/4', description: 'Fourth'}],
          },
        }),
      )
      .mockResolvedValueOnce(createOpenAIResponsesStream(report));

    const result = await investigationWorkflow(input);
    const progressPayloads = getProgressPayloads(writes);

    expect(workflowFetch).toHaveBeenCalledTimes(9);
    expect(
      progressPayloads.filter(
        (payload) => payload.kind === 'phases-init' || payload.kind === 'phase-update',
      ),
    ).toMatchInlineSnapshot(`
      [
        {
          "kind": "phases-init",
          "phases": [
            {
              "description": "Description 1",
              "id": "phase-1",
              "label": "Phase 1",
              "status": "pending",
            },
            {
              "description": "Description 2",
              "id": "phase-2",
              "label": "Phase 2",
              "status": "pending",
            },
            {
              "description": "Description 3",
              "id": "phase-3",
              "label": "Phase 3",
              "status": "pending",
            },
            {
              "description": "Description 4",
              "id": "phase-4",
              "label": "Phase 4",
              "status": "pending",
            },
            {
              "description": "Description 5",
              "id": "phase-5",
              "label": "Phase 5",
              "status": "pending",
            },
            {
              "description": "Description 6",
              "id": "phase-6",
              "label": "Phase 6",
              "status": "pending",
            },
            {
              "description": "Description 7",
              "id": "phase-7",
              "label": "Phase 7",
              "status": "pending",
            },
            {
              "description": "Description 8",
              "id": "phase-8",
              "label": "Phase 8",
              "status": "pending",
            },
          ],
        },
        {
          "kind": "phase-update",
          "phaseId": "phase-1",
          "status": "in-progress",
        },
        {
          "kind": "phase-update",
          "phaseId": "phase-1",
          "status": "completed",
        },
        {
          "kind": "phase-update",
          "phaseId": "phase-2",
          "status": "in-progress",
        },
      ]
    `);
    expect(result).toMatchObject(report);
  });

  it('returns the fallback report when the provider does not emit structured output', async () => {
    const {investigationWorkflow} = await import('../workflow');
    const input = createTestInvestigationInput({
      title: 'Shadow Budget Review!!!',
      description: 'Fallback report description',
      geography: undefined,
    });

    workflowFetch.mockResolvedValue(createOpenAIResponsesStreamWithoutStructuredOutput());

    const result = await investigationWorkflow(input);

    expect(workflowFetch).toHaveBeenCalledTimes(1);
    expect(getProgressPayloads(writes)).toEqual([]);
    expect(result).toMatchObject({
      slug: 'shadow-budget-review',
      title: 'Shadow Budget Review!!!',
      summary: 'Fallback report description',
      executiveSummary: 'Fallback report description',
      category: 'policy',
      geography: 'Global',
      tags: [],
      featured: false,
      stakeholders: [],
      motivations: [],
      evidence: [],
      assumptions: [],
      limitations: [],
      alternativeExplanations: [],
    });
    expect(Date.parse(result.publishedAt)).not.toBeNaN();
  });

  it('merges the provider report over the workflow-derived defaults', async () => {
    const {investigationWorkflow} = await import('../workflow');
    const input = createTestInvestigationInput({
      title: 'Input Investigation Title',
      description: 'Input description that should be overridden by the model output.',
      geography: 'Indonesia',
    });
    const report = createTestReport({
      slug: 'provider-report-slug',
      title: 'Provider Report Title',
      summary: 'Provider summary',
      executiveSummary: 'Provider executive summary',
      geography: 'Singapore',
      tags: ['provider-tag'],
      featured: true,
      publishedAt: '2026-01-02T03:04:05.000Z',
    });

    workflowFetch.mockResolvedValue(createOpenAIResponsesStream(report));

    const result = await investigationWorkflow(input);

    expect(result).toEqual(report);
    expect(result.title).not.toBe(input.title);
    expect(result.summary).not.toBe(input.description);
    expect(result.geography).toBe('Singapore');
  });

  it('clamps gdelt tool params before hitting the downstream provider', async () => {
    const {investigationWorkflow} = await import('../workflow');
    const input = createTestInvestigationInput();
    const report = createTestReport({
      slug: 'gdelt-clamp-test',
      title: 'GDELT Clamp Test',
    });

    workflowFetch
      .mockResolvedValueOnce(
        createOpenAIToolCallStream({
          toolName: 'webSearch03',
          input: {
            days: 999,
            limit: 999,
            quad_class: '4',
            search: 'influence campaign',
          },
        }),
      )
      .mockResolvedValueOnce(
        createJsonResponse({
          success: true,
          clusters: [{cluster_id: 'cluster-1', cluster_label: 'Example cluster'}],
        }),
      )
      .mockResolvedValueOnce(createOpenAIResponsesStream(report));

    const result = await investigationWorkflow(input);
    const networkTrace = recordNetworkTrace(workflowFetch.mock.calls);

    expect(workflowFetch).toHaveBeenCalledTimes(3);
    expect(networkTrace[1]).toMatchSnapshot();
    expect(result).toMatchObject(report);
  });
});
