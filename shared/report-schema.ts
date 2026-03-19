import {z} from 'zod';

const confidenceSchema = z.enum(['high', 'medium', 'low']);
const categorySchema = z.enum([
  'policy',
  'regulation',
  'corporate-decision',
  'government-action',
  'legislation',
  'culture-and-society',
]);

export const reportSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  executiveSummary: z.string().min(1),
  category: categorySchema,
  geography: z.string().min(1),
  tags: z.array(z.string()),
  publishedAt: z.string(),
  featured: z.boolean(),
  stakeholders: z.array(
    z.object({
      name: z.string().min(1),
      role: z.string().min(1),
      incentives: z.array(z.string()),
      confidence: confidenceSchema,
    }),
  ),
  motivations: z.array(
    z.object({
      title: z.string().min(1),
      summary: z.string().min(1),
      confidence: confidenceSchema,
      supportingEvidence: z.array(z.string()),
    }),
  ),
  evidence: z.array(
    z.object({
      claim: z.string().min(1),
      source: z.string().min(1),
      sourceUrl: z.string().min(1),
      confidence: confidenceSchema,
    }),
  ),
  assumptions: z.array(z.string()),
  limitations: z.array(z.string()),
  alternativeExplanations: z.array(z.string()),
});
