
export enum ConstitutionStatus {
  PROTECTED = '✅',
  VIOLATION = '❌',
  DEPENDS = '⚠️'
}

export interface Citation {
  article: string;
  text: string;
}

export interface AnalysisResult {
  articles: string;
  status: ConstitutionStatus | string;
  explanation: string;
  raw: string;
  citations: Citation[];
}

export interface HistoryItem extends AnalysisResult {
  id: string;
  query: string;
  timestamp: number;
}
