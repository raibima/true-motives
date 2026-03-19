import 'server-only';

import {generateText, Output} from 'ai';
import {openai} from '@ai-sdk/openai';
import {z} from 'zod';

import {
  investigationInputSchema,
  plannedPhaseSchema,
  reportCategorySchema,
  type InvestigationWorkflowInput,
} from '@/shared/investigations/schema';
import {createPlanningPrompt} from '@/server/investigations/planning-prompt';

const planningSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  category: reportCategorySchema,
  geography: z.string(),
  phases: z.array(plannedPhaseSchema).min(2).max(8),
});

const PLANNING_MODEL = openai('gpt-5.4-nano');

export async function planInvestigationFromPrompt(
  prompt: string,
): Promise<InvestigationWorkflowInput> {
  const planningOutput = Output.object({
    schema: planningSchema,
  });

  const {output} = await generateText({
    model: PLANNING_MODEL,
    output: planningOutput,
    prompt: createPlanningPrompt(prompt),
  });

  const planned = planningSchema.parse(output);

  const normalized: InvestigationWorkflowInput = {
    title: planned.title.trim(),
    description: planned.description.trim(),
    category: planned.category,
    geography: planned.geography.trim() || 'Global',
    phases: planned.phases,
  };

  return investigationInputSchema.parse(normalized);
}
