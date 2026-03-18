export type ConfidenceLevel = "high" | "medium" | "low";

export type InvestigationStatus = "draft" | "generating" | "completed" | "failed";

export type DynamicPhaseStatus =
  | "pending"
  | "in-progress"
  | "completed"
  | "skipped";

export interface DynamicPhase {
  id: string;
  label: string;
  description: string;
  status: DynamicPhaseStatus;
}

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  message: string;
}

export interface InvestigationGenerationProgress {
  phases: DynamicPhase[];
  percentage: number;
  estimatedSecondsRemaining?: number;
  activityLog: ActivityLogEntry[];
}

export interface Investigation {
  id: string;
  title: string;
  description: string;
  status: InvestigationStatus;
  category: ReportCategory;
  geography: string;
  createdAt: string;
  updatedAt: string;
  report?: Report;
  generationProgress?: InvestigationGenerationProgress;
}

export type ReportCategory =
  | "policy"
  | "regulation"
  | "corporate-decision"
  | "government-action"
  | "legislation"
  | "culture-and-society";

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
