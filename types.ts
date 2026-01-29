
export interface FarmerProfile {
  name: string;
  state: string;
  district: string;
  landHolding: number; // in acres
  cropType: string;
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
  isMarginal: boolean;
}

export interface Scheme {
  id: string;
  name: string;
  description: string;
  category: string;
  benefit: string;
  guidelinesUrl?: string;
}

export interface EligibilityResult {
  schemeId: string;
  schemeName: string;
  isEligible: boolean;
  benefit: string;
  proofCitation: string;
  proofSnippet: string;
  nextSteps: string[];
  requiredDocuments: string[];
}

export interface DashboardMetrics {
  schemesAnalyzed: number;
  checksPerformed: number;
  avgResponseTime: string;
  eligibleCount: number;
}
