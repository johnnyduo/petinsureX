
// API Response Types for PetInsureX
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UploadResponse {
  fileRef: string;
  url: string;
  type: string;
  size: number;
}

export interface OCRResult {
  text: string;
  items: Array<{
    description: string;
    amount: number;
    category?: string;
  }>;
  vendor: string;
  confidence: number;
}

export interface InvoiceExtraction {
  invoiceNo: string;
  date: string;
  clinic: string;
  vetName?: string;
  items: Array<{
    description: string;
    amount: number;
    category: string;
  }>;
  total: number;
  tax?: number;
  confidence: number;
}

export interface PetMatchResult {
  match_confidence: number;
  evidence: string[];
  decision: 'auto_approve' | 'human_review' | 'reject';
  explanation: string;
}

export interface BleedDetectionResult {
  forensic_score: number;
  duplicates: Array<{
    id: string;
    claimId: string;
    similarity: number;
    date: string;
  }>;
  segmentation: string[];
  bleedDetected: boolean;
  clinicalAlignmentScore?: number;
}

export interface FraudAnalysisResult {
  fraud_score: number;
  flags: string[];
  explanation: string;
  explanationLocalized: string;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export interface AIBreedDetection {
  primaryBreed: string;
  confidence: number;
  secondaryBreeds?: Array<{
    breed: string;
    confidence: number;
  }>;
  uniqueMarkers: string[];
  analysis: string;
}
