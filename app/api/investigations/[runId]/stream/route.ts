import {createUIMessageStreamResponse, type UIMessageChunk} from 'ai';
import {getRun} from 'workflow/api';

export async function GET(req: Request, {params}: {params: Promise<{runId: string}>}) {
  const {runId} = await params;
  const {searchParams} = new URL(req.url);
  const startIndex = Number.parseInt(searchParams.get('startIndex') ?? '0', 10);

  const run = getRun(runId);
  if (!(await run.exists)) {
    return Response.json({error: 'Workflow run not found.'}, {status: 404});
  }

  return createUIMessageStreamResponse({
    stream: run.getReadable<UIMessageChunk>({
      startIndex: Number.isNaN(startIndex) ? 0 : Math.max(0, startIndex),
    }),
  });
}
