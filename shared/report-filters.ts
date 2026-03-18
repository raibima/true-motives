export const REPORT_FILTER_GEOGRAPHIES = [
  "European Union",
  "United States",
  "India",
  "United Kingdom",
  "Indonesia",
  "Brazil",
  "Japan",
] as const;

export const REPORT_FILTER_CATEGORIES = [
  { value: "policy", label: "Policy" },
  { value: "regulation", label: "Regulation" },
  { value: "corporate-decision", label: "Corporate decision" },
  { value: "government-action", label: "Government action" },
  { value: "legislation", label: "Legislation" },
  {
    value: "culture-and-society",
    label: "Culture, sports & public narratives",
  },
] as const;
