/**
 * AI Context Manager for PetInsureX
 * 
 * Manages user context data for AI assistant interactions
 */

import { mockUsers, mockPets, mockPolicies, mockClaims } from '@/lib/mock-data';
import type { User, Pet, Policy, Claim } from '@/types';

export interface AIUserContext {
  user?: User;
  pets: Pet[];
  policies: Policy[];
  claims: Claim[];
  language?: string;
}

export class AIContextManager {
  private static instance: AIContextManager;
  private currentUserId: string = 'user-1'; // Default to demo user

  private constructor() {}

  public static getInstance(): AIContextManager {
    if (!AIContextManager.instance) {
      AIContextManager.instance = new AIContextManager();
    }
    return AIContextManager.instance;
  }

  /**
   * Set the current user ID (in a real app, this would come from auth)
   */
  public setCurrentUser(userId: string): void {
    this.currentUserId = userId;
  }

  /**
   * Get comprehensive user context for AI interactions
   */
  public getUserContext(language?: string): AIUserContext {
    const user = mockUsers.find(u => u.id === this.currentUserId);
    const pets = mockPets.filter(p => p.ownerId === this.currentUserId);
    const petIds = pets.map(p => p.id);
    const policies = mockPolicies.filter(p => petIds.includes(p.petId));
    const claims = mockClaims.filter(c => petIds.includes(c.petId));

    return {
      user,
      pets,
      policies,
      claims,
      language: language || user?.locale || 'en'
    };
  }

  /**
   * Get context for a specific pet
   */
  public getPetContext(petId: string): {
    pet?: Pet;
    policy?: Policy;
    claims: Claim[];
    user?: User;
  } {
    const pet = mockPets.find(p => p.id === petId);
    const policy = mockPolicies.find(p => p.petId === petId);
    const claims = mockClaims.filter(c => c.petId === petId);
    const user = pet ? mockUsers.find(u => u.id === pet.ownerId) : undefined;

    return { pet, policy, claims, user };
  }

  /**
   * Get context for a specific claim
   */
  public getClaimContext(claimId: string): {
    claim?: Claim;
    pet?: Pet;
    policy?: Policy;
    user?: User;
    previousClaims: Claim[];
  } {
    const claim = mockClaims.find(c => c.id === claimId);
    
    if (!claim) {
      return { previousClaims: [] };
    }

    const pet = mockPets.find(p => p.id === claim.petId);
    const policy = mockPolicies.find(p => p.id === claim.policyId);
    const user = pet ? mockUsers.find(u => u.id === pet.ownerId) : undefined;
    const previousClaims = mockClaims.filter(c => 
      c.petId === claim.petId && c.id !== claimId
    );

    return { claim, pet, policy, user, previousClaims };
  }

  /**
   * Get policy analysis context
   */
  public getPolicyAnalysisContext(): {
    pets: Pet[];
    policies: Policy[];
    claims: Claim[];
    totalClaims: number;
    totalCoverage: number;
    utilizationRate: number;
  } {
    const context = this.getUserContext();
    const totalClaims = context.claims.reduce((sum, claim) => sum + claim.amount, 0);
    const totalCoverage = context.policies.reduce((sum, policy) => sum + policy.coverageLimit, 0);
    const utilizationRate = totalCoverage > 0 ? (totalClaims / totalCoverage) * 100 : 0;

    return {
      ...context,
      totalClaims,
      totalCoverage,
      utilizationRate
    };
  }

  /**
   * Get emergency context with location and immediate needs
   */
  public getEmergencyContext(petId: string, location?: string): {
    pet?: Pet;
    policy?: Policy;
    emergencyContacts: Array<{
      name: string;
      phone: string;
      address: string;
      distance: string;
      specialty: string[];
    }>;
    coverageInfo: {
      emergencyCovered: boolean;
      maxAmount: number;
      deductible: number;
      directBilling: boolean;
    };
  } {
    const { pet, policy } = this.getPetContext(petId);
    
    // Mock emergency contacts based on location
    const emergencyContacts = this.getEmergencyVets(location || 'Bangkok');
    
    const coverageInfo = {
      emergencyCovered: true,
      maxAmount: policy?.remaining || 0,
      deductible: 25, // Mock deductible
      directBilling: true
    };

    return {
      pet,
      policy,
      emergencyContacts,
      coverageInfo
    };
  }

  /**
   * Get regional emergency veterinarians
   */
  private getEmergencyVets(location: string): Array<{
    name: string;
    phone: string;
    address: string;
    distance: string;
    specialty: string[];
  }> {
    const vetDatabase = {
      'Bangkok': [
        {
          name: 'Bangkok Animal Emergency Hospital',
          phone: '(02) 555-0123',
          address: '123 Sukhumvit Rd, Klongtoei',
          distance: '2.1km',
          specialty: ['Emergency Surgery', 'Critical Care', 'Trauma']
        },
        {
          name: 'Thonglor Veterinary Emergency Center',
          phone: '(02) 555-0199',
          address: '456 Thonglor Rd, Watthana',
          distance: '3.8km',
          specialty: ['Emergency Medicine', 'Advanced Surgery', 'ICU']
        }
      ],
      'Singapore': [
        {
          name: 'Mount Pleasant Veterinary Emergency',
          phone: '+65 6555-0123',
          address: '123 Thomson Rd, Novena',
          distance: '1.5km',
          specialty: ['Emergency Care', 'Surgery', 'Specialist Referrals']
        }
      ],
      'Kuala Lumpur': [
        {
          name: 'Gasing Veterinary Hospital',
          phone: '+60 3-5555-0123',
          address: '123 Jalan Gasing, Petaling Jaya',
          distance: '2.3km',
          specialty: ['Emergency Medicine', 'Surgery', 'Diagnostics']
        }
      ]
    };

    return vetDatabase[location as keyof typeof vetDatabase] || vetDatabase['Bangkok'];
  }

  /**
   * Get breed-specific health insights
   */
  public getBreedHealthInsights(breed: string): {
    commonConditions: string[];
    preventiveCare: string[];
    warningSigns: string[];
    lifeExpectancy: string;
    specialConsiderations: string[];
  } {
    const breedData = {
      'Golden Retriever': {
        commonConditions: ['Hip Dysplasia', 'Gastric Torsion', 'Cancer', 'Heart Disease'],
        preventiveCare: ['Joint supplements', 'Weight management', 'Regular cardiac screening'],
        warningSigns: ['Bloating', 'Limping', 'Difficulty breathing', 'Unusual fatigue'],
        lifeExpectancy: '10-12 years',
        specialConsiderations: ['Large breed, prone to bloat', 'High cancer risk', 'Needs regular exercise']
      },
      'British Shorthair': {
        commonConditions: ['Hypertrophic Cardiomyopathy', 'Kidney Disease', 'Obesity'],
        preventiveCare: ['Annual cardiac screening', 'Weight monitoring', 'Dental care'],
        warningSigns: ['Difficulty breathing', 'Lethargy', 'Changes in appetite'],
        lifeExpectancy: '12-17 years',
        specialConsiderations: ['Prone to weight gain', 'Heart disease screening important']
      }
    };

    return breedData[breed as keyof typeof breedData] || {
      commonConditions: ['General health monitoring needed'],
      preventiveCare: ['Regular checkups', 'Vaccinations', 'Dental care'],
      warningSigns: ['Changes in behavior', 'Appetite loss', 'Lethargy'],
      lifeExpectancy: 'Varies by breed',
      specialConsiderations: ['Consult veterinarian for breed-specific advice']
    };
  }
}

// Export singleton instance
export const aiContextManager = AIContextManager.getInstance();