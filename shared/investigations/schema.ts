import {z} from 'zod';

export const reportCategorySchema = z.enum([
  'policy',
  'regulation',
  'corporate-decision',
  'government-action',
  'legislation',
  'culture-and-society',
]);

export const plannedPhaseSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string(),
});

export type PlannedPhase = z.infer<typeof plannedPhaseSchema>;

export const investigationInputSchema = z.object({
  title: z.string().min(1),
  description: z.string().default(''),
  category: reportCategorySchema,
  geography: z.string().default('Global'),
  phases: z.array(plannedPhaseSchema).min(2).max(8).optional(),
});

export type InvestigationWorkflowInput = z.infer<typeof investigationInputSchema>;
