
// PetInsureX Core Types

export type User = {
  id: string;
  role: 'owner' | 'vet' | 'insurer' | 'admin';
  name: string;
  email: string;
  locale: string;
  createdAt: string;
  avatar?: string;
};

export type Pet = {
  id: string;
  ownerId: string;
  name: string;
  species: 'dog' | 'cat';
  breed?: string;
  ageMonths: number;
  vaccinated: boolean;
  embeddingsId?: string;
  photos: string[];
  createdAt: string;
  updatedAt: string;
};

export type Policy = {
  id: string;
  petId: string;
  provider: string;
  coverageLimit: number;
  remaining: number;
  premium: number;
  start: string;
  end: string;
  termsUrl?: string;
  status: 'active' | 'expired' | 'cancelled';
  createdAt: string;
};

export type Claim = {
  id: string;
  petId: string;
  policyId: string;
  createdAt: string;
  updatedAt: string;
  status: 'submitted' | 'review' | 'approved' | 'paid' | 'rejected';
  amount: number;
  description: string;
  invoiceUrl?: string;
  injuryPhotos: string[];
  proofs: ProofRef[];
  fraudScore?: number;
  petMatchConfidence?: number;
  aiAnalysis?: AIAnalysisResult;
  adminNotes?: string;
};

export type ProofRef = {
  id: string;
  type: 'ai_analysis' | 'identity_verification' | 'forensic_analysis' | 'policy_verification';
  status: 'pending' | 'valid' | 'invalid';
  payload?: any;
  createdAt: string;
};

export type AIAnalysisResult = {
  analysisId: string;
  vetId: string;
  clinicName: string;
  fraudScore: number;
  validationScore: number;
  timestamp: string;
  licenseNumber?: string;
};

export type FraudAnalysis = {
  id: string;
  claimId: string;
  fraudScore: number;
  flags: string[];
  explanation: string;
  explanationLocalized: string;
  riskLevel: 'low' | 'medium' | 'high';
  createdAt: string;
};

export type ImageAnalysis = {
  id: string;
  imageUrl: string;
  forensicScore: number;
  duplicates: Array<{
    id: string;
    claimId: string;
    similarity: number;
    date: string;
  }>;
  segmentation?: string[];
  bleedDetected: boolean;
  clinicalAlignmentScore?: number;
  createdAt: string;
};

export type PolicySummary = {
  id: string;
  policyId: string;
  summary: string[];
  clauses: Record<string, string>;
  citations: string[];
  locale: string;
  createdAt: string;
};

export type ScamAnalysis = {
  id: string;
  content: string;
  contentType: 'text' | 'image';
  riskScore: number;
  redFlags: string[];
  explanation: string;
  advice: string;
  locale: string;
  createdAt: string;
};

export type AIValidation = {
  id: string;
  type: 'fraud_detection' | 'policy_verification' | 'amount_validation' | 'completeness_check';
  score: number;
  confidence: number;
  reasoning: string[];
  status: 'pending' | 'verified' | 'failed';
  createdAt: string;
  completedAt?: string;
};

// API Response Types
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type UploadResponse = {
  fileRef: string;
  url: string;
  type: string;
  size: number;
};

export type OCRResult = {
  text: string;
  items: Array<{
    description: string;
    amount: number;
    category?: string;
  }>;
  vendor: string;
  confidence: number;
};

export type InvoiceExtraction = {
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
};

// UI State Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export type ToastMessage = {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
};

export type FileUpload = {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  url?: string;
  error?: string;
};

// Form Types
export type OnboardingData = {
  petName: string;
  species: 'dog' | 'cat';
  breed?: string;
  ageMonths: number;
  vaccinated: boolean;
  photos: string[];
  consentGiven: boolean;
};

export type ClaimFormData = {
  petId: string;
  description: string;
  amount: number;
  invoiceFile?: File;
  injuryPhotos: File[];
  vetVisitDate: string;
  symptoms: string[];
  treatmentType: string;
};

// Component Props Types
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type CardVariant = 'default' | 'glass' | 'solid' | 'outline';
export type StatusVariant = 'pending' | 'approved' | 'rejected' | 'review' | 'paid';
