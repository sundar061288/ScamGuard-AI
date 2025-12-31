
export enum RiskScore {
  HIGH = "High",
  MEDIUM = "Medium",
  LOW = "Low"
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AnalysisResult {
  risk_score: RiskScore;
  scam_type: string;
  red_flags: string[];
  advice: string;
  sources?: GroundingSource[];
}

export type InputMode = 'text' | 'image' | 'link';

export interface AnalysisState {
  loading: boolean;
  result: AnalysisResult | null;
  error: string | null;
}
