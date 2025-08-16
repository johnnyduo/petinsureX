
// PetInsureX Constants

export const APP_NAME = 'PetInsureX';
export const APP_DESCRIPTION = 'Advanced pet insurance with AI-powered claims processing';

// UI Copy (exact strings from spec)
export const UI_COPY = {
  CTA: 'Get My Pet Covered',
  ONBOARDING_HELPER: 'Take 4 photos: front, left, right, full-body — good lighting and no motion.',
  MATCH_CONFIDENCE: 'This photo matches your registered pet with 94% confidence.',
  FRAUD_FLAG: '⚠️ This claim shows 3 high-risk indicators. Please provide a vet note or request a manual review.',
  SCAM_ADVICE: 'Do not click the link. Contact your clinic and report to us.',
} as const;

// Pet species and breeds
export const PET_SPECIES = ['dog', 'cat'] as const;

export const DOG_BREEDS = [
  'Golden Retriever', 'Labrador Retriever', 'German Shepherd', 'Bulldog',
  'Poodle', 'Beagle', 'Rottweiler', 'Yorkshire Terrier', 'Boxer', 'Husky',
  'Chihuahua', 'Dachshund', 'Shih Tzu', 'Boston Terrier', 'Mixed Breed'
] as const;

export const CAT_BREEDS = [
  'Persian', 'Maine Coon', 'British Shorthair', 'Ragdoll', 'Bengal',
  'Abyssinian', 'Birman', 'Oriental Shorthair', 'Devon Rex', 'Scottish Fold',
  'Siamese', 'Russian Blue', 'Norwegian Forest Cat', 'Sphynx', 'Mixed Breed'
] as const;

// Status configurations
export const CLAIM_STATUSES = {
  submitted: { label: 'Submitted', color: 'blue', icon: '📋' },
  review: { label: 'Under Review', color: 'yellow', icon: '🔍' },
  approved: { label: 'Approved', color: 'green', icon: '✅' },
  paid: { label: 'Paid', color: 'green', icon: '💰' },
  rejected: { label: 'Rejected', color: 'red', icon: '❌' },
} as const;

export const POLICY_STATUSES = {
  active: { label: 'Active', color: 'green', icon: '🛡️' },
  expired: { label: 'Expired', color: 'gray', icon: '⏰' },
  cancelled: { label: 'Cancelled', color: 'red', icon: '🚫' },
} as const;

// Risk levels
export const RISK_LEVELS = {
  low: { label: 'Low Risk', color: 'green', range: [0, 0.3] },
  medium: { label: 'Medium Risk', color: 'yellow', range: [0.3, 0.7] },
  high: { label: 'High Risk', color: 'red', range: [0.7, 1] },
} as const;

// Photo capture guidelines
export const PHOTO_GUIDELINES = {
  front: {
    title: 'Front View',
    description: 'Face clearly visible, good lighting',
    icon: '📸'
  },
  left: {
    title: 'Left Profile',
    description: 'Side view showing body markings',
    icon: '📸'
  },
  right: {
    title: 'Right Profile',
    description: 'Side view from the other side',
    icon: '📸'
  },
  full: {
    title: 'Full Body',
    description: 'Entire pet visible, standing position',
    icon: '📸'
  }
} as const;

// Fraud detection flags
export const FRAUD_FLAGS = {
  HIGH_AMOUNT: 'Amount exceeds typical treatment costs',
  DUPLICATE_IMAGE: 'Image found in previous claims',
  VENDOR_MISMATCH: 'Clinic not in our network',
  FREQUENCY: 'Multiple claims in short period',
  INCONSISTENT_STORY: 'Description doesn\'t match photos',
  MODIFIED_IMAGE: 'Image shows signs of manipulation',
  IDENTITY_MISMATCH: 'Pet doesn\'t match registered photos'
} as const;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  PETS: '/api/pets',
  POLICIES: '/api/policies',
  CLAIMS: '/api/claims',
  UPLOAD: '/api/storage/upload',
  OCR: '/api/ocr/extract',
  FRAUD: '/api/fraud/evaluate',
  VET: '/api/vet',
  ZKP: '/api/zkp',
  ADMIN: '/api/admin',
  SCAM: '/api/scam/analyze',
  RIGHTS: '/api/rights/ask',
  SUMMARIZE: '/api/summarize'
} as const;

// File upload constraints
export const UPLOAD_CONSTRAINTS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'image/jpeg', 'image/png'],
  MAX_PHOTOS_PER_CLAIM: 5,
  REQUIRED_PET_PHOTOS: 4
} as const;

// Confidence thresholds
export const CONFIDENCE_THRESHOLDS = {
  PET_MATCH: {
    AUTO_APPROVE: 0.9,
    HUMAN_REVIEW: 0.7,
    REJECT: 0.5
  },
  OCR: {
    HIGH: 0.95,
    MEDIUM: 0.8,
    LOW: 0.6
  },
  FRAUD: {
    HIGH_RISK: 0.7,
    MEDIUM_RISK: 0.3,
    LOW_RISK: 0.1
  }
} as const;

// Supported locales
export const LOCALES = {
  en: { name: 'English', flag: '🇺🇸' },
  th: { name: 'ไทย', flag: '🇹🇭' }
} as const;

// Sample data for demo
export const DEMO_USERS = {
  OWNER: { email: 'jun@test', name: 'Jun Nakamura', role: 'owner' as const },
  VET: { email: 'vet1@test', name: 'Dr. Sarah Chen', role: 'vet' as const },
  ADMIN: { email: 'admin@test', name: 'Admin User', role: 'admin' as const }
} as const;

export const DEMO_PETS = {
  MALI: {
    name: 'Mali',
    species: 'dog' as const,
    breed: 'Golden Retriever',
    ageMonths: 36,
    vaccinated: true
  },
  TARO: {
    name: 'Taro',
    species: 'cat' as const,
    breed: 'British Shorthair',
    ageMonths: 24,
    vaccinated: false
  }
} as const;

// Mock data for development
export const MOCK_RESPONSES = {
  POLICY_SUMMARY: [
    "Coverage includes accidents, illnesses, and emergency care up to ฿100,000 annually",
    "30-day waiting period for illness claims, no waiting for accidents",
    "Pre-existing conditions are excluded from coverage",
    "Annual premium: ฿12,000 with ฿500 deductible per claim",
    "Claims processed within 5-7 business days with complete documentation",
    "Vet network includes 500+ certified clinics across Thailand"
  ],
  FRAUD_EXPLANATION: "This claim has been flagged due to: high treatment amount compared to typical costs for this condition, image metadata suggests potential editing, and this is the third claim in 60 days which exceeds normal frequency patterns.",
  SCAM_ANALYSIS: {
    score: 85,
    flags: ['Suspicious URL', 'Urgency language', 'Request for personal info'],
    explanation: 'This message contains several red flags typical of phishing attempts targeting pet owners.'
  }
} as const;
