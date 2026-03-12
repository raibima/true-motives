export type ConfidenceLevel = "high" | "medium" | "low";

export type ReportCategory =
  | "policy"
  | "regulation"
  | "corporate-decision"
  | "government-action"
  | "legislation";

export interface Stakeholder {
  name: string;
  role: string;
  incentives: string[];
  confidence: ConfidenceLevel;
}

export interface EvidenceItem {
  claim: string;
  source: string;
  sourceUrl: string;
  confidence: ConfidenceLevel;
}

export interface MotivationHypothesis {
  title: string;
  summary: string;
  confidence: ConfidenceLevel;
  supportingEvidence: string[];
}

export interface Report {
  slug: string;
  title: string;
  summary: string;
  executiveSummary: string;
  category: ReportCategory;
  geography: string;
  tags: string[];
  publishedAt: string;
  featured: boolean;
  stakeholders: Stakeholder[];
  motivations: MotivationHypothesis[];
  evidence: EvidenceItem[];
  assumptions: string[];
  limitations: string[];
  alternativeExplanations: string[];
}
