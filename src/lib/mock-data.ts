
import { User, Pet, Policy, Claim, FraudAnalysis, ImageAnalysis } from '@/types';
import { DEMO_USERS, DEMO_PETS } from '@/lib/constants';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: DEMO_USERS.OWNER.email,
    name: DEMO_USERS.OWNER.name,
    role: DEMO_USERS.OWNER.role,
    locale: 'en',
    createdAt: '2024-01-15T08:00:00Z',
    avatar: '👨‍💼'
  },
  {
    id: 'vet-1',
    email: DEMO_USERS.VET.email,
    name: DEMO_USERS.VET.name,
    role: DEMO_USERS.VET.role,
    locale: 'en',
    createdAt: '2024-01-10T08:00:00Z',
    avatar: '👩‍⚕️'
  },
  {
    id: 'admin-1',
    email: DEMO_USERS.ADMIN.email,
    name: DEMO_USERS.ADMIN.name,
    role: DEMO_USERS.ADMIN.role,
    locale: 'en',
    createdAt: '2024-01-05T08:00:00Z',
    avatar: '👨‍💻'
  }
];

// Mock Pets
export const mockPets: Pet[] = [
  {
    id: 'pet-1',
    ownerId: 'user-1',
    name: DEMO_PETS.MALI.name,
    species: DEMO_PETS.MALI.species,
    breed: DEMO_PETS.MALI.breed,
    ageMonths: DEMO_PETS.MALI.ageMonths,
    vaccinated: DEMO_PETS.MALI.vaccinated,
    embeddingsId: 'emb-mali-001',
    photos: [
      '/api/pets/mali/front.jpg',
      '/api/pets/mali/left.jpg',
      '/api/pets/mali/right.jpg',
      '/api/pets/mali/full.jpg'
    ],
    createdAt: '2024-01-16T08:00:00Z',
    updatedAt: '2024-01-16T08:00:00Z'
  },
  {
    id: 'pet-2',
    ownerId: 'user-1',
    name: DEMO_PETS.TARO.name,
    species: DEMO_PETS.TARO.species,
    breed: DEMO_PETS.TARO.breed,
    ageMonths: DEMO_PETS.TARO.ageMonths,
    vaccinated: DEMO_PETS.TARO.vaccinated,
    embeddingsId: 'emb-taro-001',
    photos: [
      '/api/pets/taro/front.jpg',
      '/api/pets/taro/left.jpg',
      '/api/pets/taro/right.jpg',
      '/api/pets/taro/full.jpg'
    ],
    createdAt: '2024-01-20T08:00:00Z',
    updatedAt: '2024-01-20T08:00:00Z'
  }
];

// Mock Policies
export const mockPolicies: Policy[] = [
  {
    id: 'policy-1',
    petId: 'pet-1',
    provider: 'PetInsureX Premium',
    coverageLimit: 100000,
    remaining: 82000,
    premium: 12000,
    start: '2024-01-01T00:00:00Z',
    end: '2024-12-31T23:59:59Z',
    termsUrl: '/api/policies/policy-1/terms.pdf',
    status: 'active',
    createdAt: '2024-01-01T08:00:00Z'
  },
  {
    id: 'policy-2',
    petId: 'pet-2',
    provider: 'PetInsureX Basic',
    coverageLimit: 50000,
    remaining: 47500,
    premium: 8000,
    start: '2024-01-15T00:00:00Z',
    end: '2024-12-31T23:59:59Z',
    status: 'active',
    createdAt: '2024-01-15T08:00:00Z'
  }
];

// Mock Claims
export const mockClaims: Claim[] = [
  {
    id: 'claim-1',
    petId: 'pet-1',
    policyId: 'policy-1',
    createdAt: '2024-08-10T10:30:00Z',
    updatedAt: '2024-08-10T14:22:00Z',
    status: 'review',
    amount: 15000,
    description: 'Emergency surgery for gastric torsion. Mali showed symptoms of bloating and distress.',
    invoiceUrl: '/api/claims/claim-1/invoice.pdf',
    injuryPhotos: [
      '/api/claims/claim-1/injury-1.jpg',
      '/api/claims/claim-1/injury-2.jpg'
    ],
    proofs: [
      {
        id: 'proof-1',
        type: 'identity_verification',
        status: 'valid',
        payload: { confidence: 0.94, method: 'cv_embedding' },
        createdAt: '2024-08-10T10:35:00Z'
      },
      {
        id: 'proof-2',
        type: 'forensic_analysis',
        status: 'valid',
        payload: { forensic_score: 0.82, duplicates: [] },
        createdAt: '2024-08-10T10:36:00Z'
      }
    ],
    fraudScore: 0.15,
    petMatchConfidence: 0.94,
    vetAttestation: {
      id: 'att-1',
      vetId: 'vet-1',
      invoiceHash: 'hash-abc123',
      signature: 'sig-def456',
      timestamp: '2024-08-10T14:20:00Z',
      clinicName: 'Bangkok Animal Hospital',
      licenseNumber: 'VET-TH-2024-001'
    }
  },
  {
    id: 'claim-2',
    petId: 'pet-2',
    policyId: 'policy-2',
    createdAt: '2024-08-05T09:15:00Z',
    updatedAt: '2024-08-05T16:45:00Z',
    status: 'paid',
    amount: 2500,
    description: 'Routine vaccination and health check. Taro received his annual shots.',
    invoiceUrl: '/api/claims/claim-2/invoice.pdf',
    injuryPhotos: [],
    proofs: [
      {
        id: 'proof-3',
        type: 'identity_verification',
        status: 'valid',
        payload: { confidence: 0.96, method: 'cv_embedding' },
        createdAt: '2024-08-05T09:20:00Z'
      }
    ],
    fraudScore: 0.05,
    petMatchConfidence: 0.96
  }
];

// Mock API Responses
export const mockApiResponses = {
  summarize: {
    summary: [
      "Coverage includes accidents, illnesses, and emergency care up to ฿100,000 annually",
      "30-day waiting period for illness claims, no waiting for accidents",
      "Pre-existing conditions are excluded from coverage",
      "Annual premium: ฿12,000 with ฿500 deductible per claim",
      "Claims processed within 5-7 business days with complete documentation",
      "Vet network includes 500+ certified clinics across Thailand"
    ],
    clauses: {
      "coverage": "Section 3.1 - Covered Expenses",
      "exclusions": "Section 4.2 - Pre-existing Conditions",
      "waiting_period": "Section 2.3 - Waiting Periods",
      "deductible": "Section 5.1 - Deductibles and Co-pays"
    },
    citations: [
      "Policy Document v2.3, Page 12",
      "Terms and Conditions, Section 4",
      "Coverage Schedule, Appendix A"
    ]
  },
  
  ocrExtract: {
    text: `Bangkok Animal Hospital
    Invoice #: BAH-2024-08-001
    Date: August 10, 2024
    Patient: Mali (Golden Retriever)
    Owner: Jun Nakamura
    
    Services:
    - Emergency consultation: ฿1,500
    - Gastric torsion surgery: ฿12,000
    - Anesthesia: ฿1,000
    - Post-op medications: ฿500
    
    Total: ฿15,000`,
    items: [
      { description: 'Emergency consultation', amount: 1500, category: 'consultation' },
      { description: 'Gastric torsion surgery', amount: 12000, category: 'surgery' },
      { description: 'Anesthesia', amount: 1000, category: 'medication' },
      { description: 'Post-op medications', amount: 500, category: 'medication' }
    ],
    vendor: 'Bangkok Animal Hospital',
    confidence: 0.97
  },
  
  fraudEvaluate: {
    fraud_score: 0.15,
    flags: ['high_amount'],
    explanation_localized: 'This claim shows a high treatment amount (฿15,000) which is above average for this condition, but other indicators suggest legitimate medical necessity. The timing and veterinary attestation support the claim validity.',
    risk_level: 'low' as const
  },
  
  imageCheck: {
    forensic_score: 0.82,
    duplicates: [],
    segmentation: ['/api/analysis/claim-1/segmentation.jpg'],
    bleed_detected: true,
    clinical_alignment_score: 0.89
  },
  
  scamAnalyze: {
    score: 85,
    redFlags: [
      'Suspicious URL pattern',
      'Urgency language detected',
      'Request for personal information',
      'Unofficial sender domain'
    ],
    explanation: 'This message contains several red flags typical of phishing attempts targeting pet owners. The sender is requesting immediate action and personal information through an unofficial channel.',
    advice: 'Do not click the link. Contact your clinic directly and report this message to us.'
  },
  
  rightsAsk: {
    answer: 'In Thailand, you have the right to dispute claim decisions through our internal appeals process. You can: 1) Submit a written appeal within 30 days, 2) Request an independent medical review, 3) Contact the Office of Insurance Commission (OIC) if needed. We must respond to appeals within 15 business days.',
    sources: [
      'Insurance Act B.E. 2535, Section 23',
      'Pet Insurance Regulations 2023, Article 15',
      'Consumer Protection Guidelines for Insurance'
    ]
  }
};

// Simulation helpers
export const simulateApiDelay = (min = 500, max = 2000) => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

export const simulateStreamingResponse = async function* (text: string, delayMs = 50) {
  const words = text.split(' ');
  let accumulated = '';
  
  for (const word of words) {
    accumulated += (accumulated ? ' ' : '') + word;
    yield accumulated;
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }
};
