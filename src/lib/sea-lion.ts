/**
 * SEA-LION AI API Service
 * 
 * This service provides a clean interface to interact with the SEA-LION API
 * for AI-powered features in the PetInsureX application.
 */

export interface SeaLionMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface SeaLionChatRequest {
  model: string;
  messages: SeaLionMessage[];
  chat_template_kwargs?: {
    thinking_mode?: 'on' | 'off';
  };
  cache?: {
    no_cache?: boolean;
  };
  stream?: boolean;
}

export interface SeaLionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ServiceHealth {
  status: 'healthy' | 'degraded' | 'down';
  lastChecked: Date;
  responseTime?: number;
  availableModels: string[];
  errors: string[];
  modelsHealth: Record<string, 'working' | 'failing' | 'unknown'>;
}

export class SeaLionAPI {
  private apiKey: string;
  private baseURL: string;
  private healthCache: ServiceHealth | null = null;
  private healthCacheExpiry: number = 5 * 60 * 1000; // 5 minutes

  // Available models (prioritized by stability and availability)
  // Updated based on current API availability as of Sept 2025
  public static readonly MODELS = {
    INSTRUCT: 'aisingapore/Gemma-SEA-LION-v4-27B-IT', // Latest model - now primary
    INSTRUCT_ALT: 'aisingapore/Llama-SEA-LION-v3-70B-IT', // Backup model
    INSTRUCT_V4: 'aisingapore/Gemma-SEA-LION-v4-27B-IT', // Same as primary
    REASONING: 'aisingapore/Llama-SEA-LION-v3.5-70B-R', // Available reasoning model
    REASONING_ALT: 'aisingapore/Llama-SEA-LION-v3-70B-IT', // Fallback to instruct
    GUARD: 'aisingapore/Llama-SEA-Guard-Prompt-v1'
  } as const;

  constructor() {
    this.apiKey = import.meta.env.VITE_SEA_LION_API_KEY;
    this.baseURL = import.meta.env.VITE_SEA_LION_API_BASE_URL || 'https://api.sea-lion.ai/v1';
    
    if (!this.apiKey) {
      console.warn('SEA-LION API key not found. Please set VITE_SEA_LION_API_KEY in your .env file.');
    }
  }

  /**
   * Check if the API is properly configured
   */
  public isConfigured(): boolean {
    return !!this.apiKey;
  }

  /**
   * Get list of available models
   */
  public async getModels(): Promise<any> {
    if (!this.isConfigured()) {
      throw new Error('SEA-LION API key not configured');
    }

    const response = await fetch(`${this.baseURL}/models`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Send a chat completion request with automatic model fallback
   */
  public async chatCompletion(request: SeaLionChatRequest): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('SEA-LION API key not configured');
    }

    const modelsToTry = [
      request.model,
      ...(request.model === SeaLionAPI.MODELS.INSTRUCT ? [SeaLionAPI.MODELS.INSTRUCT_ALT] : []),
      ...(request.model === SeaLionAPI.MODELS.REASONING ? [SeaLionAPI.MODELS.REASONING_ALT] : [])
    ].filter(Boolean);

    let lastError: any;

    for (const model of modelsToTry) {
      try {
        console.log(`🤖 Trying SEA-LION model: ${model}`);
        
        // Prepare request with proper cache settings for consistent responses
        const requestBody = {
          ...request,
          model,
          cache: {
            no_cache: true // Ensure fresh responses
          }
        };

        const response = await fetch(`${this.baseURL}/chat/completions`, {
          method: 'POST',
          headers: {
            'accept': 'text/plain', // Use text/plain as per API documentation
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          const errorText = await response.text();
          
          if (response.status === 429) {
            throw new Error('Rate limit exceeded. Please wait before making another request.');
          }
          
          if (response.status >= 500) {
            console.warn(`Server error with model ${model}, trying next...`);
            lastError = new Error(`Server error: ${errorText}`);
            continue;
          }
          
          throw new Error(`SEA-LION API error (${response.status}): ${errorText}`);
        }

        // Handle text/plain response as per API documentation
        const contentType = response.headers.get('content-type');
        let result: string;

        if (contentType?.includes('text/plain')) {
          result = await response.text();
          console.log(`✅ SEA-LION text/plain response from ${model}: ${result.length} chars`);
        } else if (contentType?.includes('application/json')) {
          const jsonResponse: SeaLionResponse = await response.json();
          result = jsonResponse.choices[0]?.message?.content || '';
          console.log(`✅ SEA-LION JSON response from ${model}: ${result.length} chars`);
        } else {
          // Fallback to text
          result = await response.text();
          console.log(`✅ SEA-LION fallback text response from ${model}: ${result.length} chars`);
        }

        if (!result.trim()) {
          throw new Error('Empty response from API');
        }

        return result;

      } catch (error) {
        lastError = error;
        console.warn(`❌ Model ${model} failed:`, error.message);
        
        // If it's a rate limit or auth error, don't try other models
        if (error.message.includes('Rate limit') || error.message.includes('401')) {
          throw error;
        }
        
        continue;
      }
    }

    // All models failed
    console.error('🚨 All SEA-LION models failed:', lastError);
    throw lastError || new Error('All SEA-LION models unavailable');
  }

  /**
   * Simple chat with the instruct model
   */
  public async chat(message: string, systemPrompt?: string): Promise<string> {
    const messages: SeaLionMessage[] = [];
    
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    
    messages.push({ role: 'user', content: message });

    return await this.chatCompletion({
      model: SeaLionAPI.MODELS.INSTRUCT,
      messages
    });
  }

  /**
   * Use the reasoning model for complex analysis
   */
  public async reasoning(message: string, systemPrompt?: string, thinkingMode: 'on' | 'off' = 'on'): Promise<string> {
    const messages: SeaLionMessage[] = [];
    
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    
    messages.push({ role: 'user', content: message });

    return await this.chatCompletion({
      model: SeaLionAPI.MODELS.REASONING,
      messages,
      chat_template_kwargs: {
        thinking_mode: thinkingMode
      }
    });
  }

  /**
   * Check if content is safe using the guard model
   */
  public async moderateContent(content: string): Promise<boolean> {
    try {
      const response = await this.chatCompletion({
        model: SeaLionAPI.MODELS.GUARD,
        messages: [{ role: 'user', content }],
        stream: false
      });

      // The guard model returns 'safe' or 'unsafe'
      return response.toLowerCase().trim().includes('safe');
    } catch (error) {
      console.error('Content moderation failed:', error);
      // Fail safe - assume unsafe if moderation fails
      return false;
    }
  }

  /**
   * Check the health of the SEA-LION API service
   */
  public async checkHealth(forceRefresh = false): Promise<ServiceHealth> {
    // Return cached health if available and not expired
    if (!forceRefresh && this.healthCache && 
        (Date.now() - this.healthCache.lastChecked.getTime()) < this.healthCacheExpiry) {
      return this.healthCache;
    }

    const startTime = Date.now();
    const health: ServiceHealth = {
      status: 'down',
      lastChecked: new Date(),
      responseTime: 0,
      availableModels: [],
      errors: [],
      modelsHealth: {}
    };

    try {
      // Test models endpoint first
      const modelsResponse = await this.getModels();
      health.responseTime = Date.now() - startTime;
      
      if (modelsResponse?.data) {
        health.availableModels = modelsResponse.data.map((model: any) => model.id);
        health.status = 'degraded'; // At least models endpoint works
      }

      // Test a simple chat completion with the most reliable model
      try {
        const testStartTime = Date.now();
        await this.chatCompletion({
          model: SeaLionAPI.MODELS.INSTRUCT,
          messages: [{ role: 'user', content: 'test' }],
          cache: { no_cache: true }
        });
        
        health.modelsHealth[SeaLionAPI.MODELS.INSTRUCT] = 'working';
        health.status = 'healthy'; // Chat completions work
        health.responseTime = Math.max(health.responseTime, Date.now() - testStartTime);
        
      } catch (chatError) {
        health.modelsHealth[SeaLionAPI.MODELS.INSTRUCT] = 'failing';
        health.errors.push(`Chat completion failed: ${chatError instanceof Error ? chatError.message : 'Unknown error'}`);
      }

    } catch (error) {
      health.errors.push(`Models endpoint failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Cache the results
    this.healthCache = health;
    
    console.log(`🏥 SEA-LION Health Check: ${health.status} (${health.responseTime}ms)`);
    
    return health;
  }

  /**
   * Get cached health status without making new requests
   */
  public getCachedHealth(): ServiceHealth | null {
    return this.healthCache;
  }

  /**
   * Check if the service is currently healthy
   */
  public async isHealthy(): Promise<boolean> {
    const health = await this.checkHealth();
    return health.status === 'healthy';
  }

  /**
   * Get the best available model based on current health status
   */
  public async getBestAvailableModel(): Promise<string> {
    const health = await this.checkHealth();
    
    // Check which models are working
    const workingModels = Object.entries(health.modelsHealth)
      .filter(([_, status]) => status === 'working')
      .map(([model, _]) => model);
    
    if (workingModels.length > 0) {
      return workingModels[0]; // Return first working model
    }
    
    // Fallback to default model order if no health data
    return SeaLionAPI.MODELS.INSTRUCT;
  }

  /**
   * Generate AI assistant response for pet insurance queries with user context
   */
  public async petInsuranceAssistant(
    query: string, 
    userContext?: {
      user?: any;
      pets?: any[];
      policies?: any[];
      claims?: any[];
      language?: string;
    }
  ): Promise<string> {
    let contextInfo = '';
    
    if (userContext) {
      // Build context from user data
      if (userContext.pets && userContext.pets.length > 0) {
        contextInfo += '\n\nUSER\'S PETS:\n';
        userContext.pets.forEach(pet => {
          contextInfo += `- ${pet.name}: ${pet.breed} ${pet.species}, ${Math.floor(pet.ageMonths / 12)} years old, ${pet.vaccinated ? 'vaccinated' : 'not vaccinated'}\n`;
        });
      }
      
      if (userContext.policies && userContext.policies.length > 0) {
        contextInfo += '\nACTIVE POLICIES:\n';
        userContext.policies.forEach(policy => {
          const pet = userContext.pets?.find(p => p.id === policy.petId);
          contextInfo += `- ${pet?.name || 'Pet'}: ${policy.provider}, Coverage: $${policy.remaining.toLocaleString()}/$${policy.coverageLimit.toLocaleString()}, Premium: $${policy.premium}/year\n`;
        });
      }
      
      if (userContext.claims && userContext.claims.length > 0) {
        contextInfo += '\nRECENT CLAIMS:\n';
        userContext.claims.forEach(claim => {
          const pet = userContext.pets?.find(p => p.id === claim.petId);
          contextInfo += `- ${pet?.name || 'Pet'}: $${claim.amount} for ${claim.description} (Status: ${claim.status})\n`;
        });
      }
    }

    const systemPrompt = `You are a professional AI assistant for PetInsureX, a Southeast Asian pet insurance platform.

EXPERTISE AREAS:
- Pet insurance policies and coverage analysis
- Claims processing and fraud detection
- Pet health and wellness advice
- Regional veterinary practices in Southeast Asia
- Emergency response and vet network navigation

LANGUAGE SUPPORT:
- Respond in ${userContext?.language || 'English'} by default
- Support Singlish (Singaporean English): Use "lah", "can", casual tone
- Support Thai (ภาษาไทย): Use polite forms, cultural references
- Support Bahasa Malaysia/Indonesia: Use appropriate formality
- Detect language from user input and respond accordingly

REGIONAL EXPERTISE:
- Thailand: Local vet clinics, pet care practices, insurance regulations
- Singapore: HDB pet policies, local vet networks, cultural context
- Malaysia: Pet import/export, local insurance requirements
- Indonesia: Traditional practices, veterinary standards

USER CONTEXT:${contextInfo}

RESPONSE GUIDELINES:
- Write naturally and conversationally, like a knowledgeable friend
- Be professional yet warm and empathetic
- Use specific data from user context when relevant
- Provide actionable advice with specific numbers and details
- Avoid excessive bullet points, asterisks, or formal formatting
- Write in flowing paragraphs with natural transitions
- Use emojis sparingly and naturally
- Include relevant policy information seamlessly in conversation
- Suggest next steps naturally within the response

For emergencies, prioritize immediate action steps with clear, direct language.`;

    return await this.chat(query, systemPrompt);
  }

  /**
   * Analyze a claim comprehensively with user context
   */
  public async analyzeClaim(
    claim: any,
    userContext?: {
      pet?: any;
      policy?: any;
      user?: any;
      previousClaims?: any[];
    }
  ): Promise<string> {
    let contextInfo = '';
    
    if (userContext) {
      if (userContext.pet) {
        contextInfo += `\nPET INFORMATION:
- Name: ${userContext.pet.name}
- Species: ${userContext.pet.species}
- Breed: ${userContext.pet.breed}
- Age: ${Math.floor(userContext.pet.ageMonths / 12)} years
- Vaccination Status: ${userContext.pet.vaccinated ? 'Up to date' : 'Incomplete'}`;
      }
      
      if (userContext.policy) {
        contextInfo += `\nPOLICY INFORMATION:
- Provider: ${userContext.policy.provider}
- Coverage Limit: $${userContext.policy.coverageLimit.toLocaleString()}
- Remaining: $${userContext.policy.remaining.toLocaleString()}
- Annual Premium: $${userContext.policy.premium.toLocaleString()}
- Status: ${userContext.policy.status}`;
      }
      
      if (userContext.previousClaims && userContext.previousClaims.length > 0) {
        contextInfo += `\nCLAIM HISTORY:`;
        userContext.previousClaims.forEach(prevClaim => {
          contextInfo += `\n- $${prevClaim.amount} - ${prevClaim.description} (${prevClaim.status})`;
        });
      }
    }

    const systemPrompt = `You are a senior AI claim analyst for PetInsureX specializing in Southeast Asian pet insurance.

ANALYSIS FRAMEWORK:
1. Fraud Risk Assessment (Score 0-100%)
2. Medical Necessity Evaluation
3. Policy Coverage Verification  
4. Documentation Completeness
5. Processing Recommendations

CONTEXT:${contextInfo}

CLAIM DETAILS:
- ID: ${claim.id}
- Amount: $${claim.amount}
- Description: ${claim.description}
- Status: ${claim.status}
- Pet Match Confidence: ${claim.petMatchConfidence ? (claim.petMatchConfidence * 100).toFixed(1) + '%' : 'N/A'}
- Current Fraud Score: ${claim.fraudScore ? (claim.fraudScore * 100).toFixed(1) + '%' : 'N/A'}

Provide a comprehensive analysis in natural, conversational language. Include risk assessment with specific scores, coverage verification against policy, documentation requirements, processing timeline, and recommended actions. Avoid excessive bullet points or formal formatting - write naturally while being thorough and professional.`;

    return await this.reasoning(
      `Analyze this pet insurance claim thoroughly and provide detailed recommendations.`,
      systemPrompt
    );
  }

  /**
   * Generate policy recommendations based on pet and user profile
   */
  public async generatePolicyRecommendations(
    pets: any[],
    currentPolicies: any[],
    userPreferences?: {
      budget?: number;
      coverage_priority?: string;
      location?: string;
    }
  ): Promise<string> {
    const petsInfo = pets.map(pet => 
      `${pet.name} (${pet.breed} ${pet.species}, ${Math.floor(pet.ageMonths / 12)}y)`
    ).join(', ');
    
    const currentCoverage = currentPolicies.map(policy =>
      `${policy.provider}: $${policy.coverageLimit.toLocaleString()}`
    ).join(', ');

    const systemPrompt = `You are a professional pet insurance advisor for PetInsureX in Southeast Asia.

CURRENT SITUATION:
- Pets: ${petsInfo}
- Current Policies: ${currentCoverage || 'None'}
- Budget Range: ${userPreferences?.budget ? `$${userPreferences.budget}/year` : 'Not specified'}
- Priority: ${userPreferences?.coverage_priority || 'Comprehensive coverage'}
- Location: ${userPreferences?.location || 'Southeast Asia'}

AVAILABLE PLANS:
- Basic Plan: $50-80/month, $25K coverage, emergencies only
- Standard Plan: $80-120/month, $50K coverage, accidents + illness
- Premium Plan: $120-180/month, $100K coverage, comprehensive + wellness
- Premium Plus: $180-250/month, $150K coverage, unlimited + specialty care

Analyze the user's situation and recommend the most suitable insurance plans in a natural, conversational way. Consider pet age, breed-specific risks, health status, coverage gaps, cost-effectiveness, and regional factors. Write as if you're having a friendly conversation with the pet owner, avoiding formal bullet points while being thorough and helpful.`;

    return await this.reasoning(
      `Recommend the best pet insurance options for this user's situation.`,
      systemPrompt
    );
  }

  /**
   * Provide emergency veterinary guidance
   */
  public async emergencyVetGuidance(
    symptoms: string,
    petInfo: any,
    location?: string
  ): Promise<string> {
    const systemPrompt = `You are an emergency veterinary AI consultant for PetInsureX.

PET INFORMATION:
- Name: ${petInfo.name}
- Species: ${petInfo.species}
- Breed: ${petInfo.breed}
- Age: ${Math.floor(petInfo.ageMonths / 12)} years
- Vaccination Status: ${petInfo.vaccinated ? 'Current' : 'Incomplete'}

SYMPTOMS REPORTED: ${symptoms}
LOCATION: ${location || 'Southeast Asia'}

CRITICAL RESPONSIBILITIES:
1. Assess urgency level (EMERGENCY/URGENT/ROUTINE)
2. Provide immediate first aid steps if applicable
3. Recommend specific emergency clinics in the area
4. Include insurance coverage information
5. Timeline for seeking care

IMPORTANT: Always err on the side of caution. For any life-threatening symptoms, immediately direct to emergency care.

Regional Emergency Networks:
- Thailand: Bangkok Animal Hospital, Thonglor Emergency Vet
- Singapore: Mount Pleasant Vet, Animal Recovery Vet
- Malaysia: Gasing Veterinary Hospital, PetZone Emergency
- Indonesia: Jakarta Animal Hospital, Surabaya Pet Emergency

Write in a calm, reassuring tone while being direct about urgent actions needed. Avoid excessive formatting and write naturally, as if speaking directly to a concerned pet owner.`;

    return await this.reasoning(
      `Assess these symptoms and provide emergency veterinary guidance.`,
      systemPrompt
    );
  }

  /**
   * Generate health and wellness insights for pets
   */
  public async generateWellnessInsights(
    pets: any[],
    claims: any[],
    policies: any[]
  ): Promise<string> {
    const petsAnalysis = pets.map(pet => {
      const petClaims = claims.filter(claim => claim.petId === pet.id);
      const claimTotal = petClaims.reduce((sum, claim) => sum + claim.amount, 0);
      return {
        ...pet,
        claimsTotal: claimTotal,
        claimsCount: petClaims.length,
        commonIssues: petClaims.map(c => c.description)
      };
    });

    const systemPrompt = `You are a veterinary wellness consultant AI for PetInsureX.

ANALYZE THE FOLLOWING PETS AND THEIR HEALTH DATA:
${petsAnalysis.map(pet => `
${pet.name} (${pet.breed} ${pet.species}, ${Math.floor(pet.ageMonths / 12)}y):
- Total Claims: $${pet.claimsTotal} (${pet.claimsCount} claims)
- Issues: ${pet.commonIssues.join('; ') || 'None'}
- Vaccination: ${pet.vaccinated ? 'Current' : 'Needs Update'}
`).join('\n')}

Provide comprehensive wellness insights in a natural, conversational style. Cover health trends, preventive care, breed-specific risks, vaccination schedules, cost-effective prevention, warning signs, and seasonal considerations for Southeast Asia. Write as if you're a caring veterinary advisor speaking directly to the pet owner, avoiding formal lists while being thorough and actionable.`;

    return await this.reasoning(
      `Analyze pet health data and provide comprehensive wellness insights and recommendations.`,
      systemPrompt
    );
  }

  /**
   * Generate multilingual support response with context
   */
  public async generateMultilingualResponse(
    message: string, 
    language: string = 'English',
    userContext?: any
  ): Promise<string> {
    const contextInfo = userContext ? `
USER CONTEXT:
- Name: ${userContext.user?.name || 'Valued customer'}
- Pets: ${userContext.pets?.map(p => p.name).join(', ') || 'None'}
- Active Policies: ${userContext.policies?.length || 0}
- Recent Claims: ${userContext.claims?.length || 0}
` : '';

    const systemPrompt = `You are a multilingual customer support AI for PetInsureX in Southeast Asia.

LANGUAGE: Respond in ${language}
${contextInfo}

LANGUAGE-SPECIFIC GUIDELINES:
- English: Professional but friendly tone
- Singlish: Use "lah", "can", "already" appropriately. Casual but helpful.
- Thai: Use respectful "ครับ/ค่ะ", "น้อง" for pets, cultural sensitivity
- Bahasa Malaysia: Use "boleh", appropriate formality level
- Bahasa Indonesia: Use "bisa", "pak/bu" respectfully

Be culturally aware, use local context and references. Provide specific, actionable help while maintaining the warm, caring tone appropriate for pet owners.`;

    return await this.chat(message, systemPrompt);
  }

  /**
   * Analyze and summarize policy documents using SEA-LION AI
   */
  public async analyzePolicyDocument(
    documentText: string,
    language: string = 'English'
  ): Promise<{
    summary: string;
    keyTerms: string;
    coverageHighlights: string;
    exclusions: string;
    recommendations: string;
  }> {
    const systemPrompt = `You are a professional insurance document analyst for PetInsureX specializing in Southeast Asian pet insurance policies.

DOCUMENT LANGUAGE: ${language}
RESPONSE LANGUAGE: ${language}

ANALYSIS FRAMEWORK:
Your task is to analyze this pet insurance policy document and provide:

1. EXECUTIVE SUMMARY: 2-3 paragraph overview of the policy
2. KEY TERMS: Important definitions, conditions, and clauses
3. COVERAGE HIGHLIGHTS: What's covered, limits, deductibles
4. EXCLUSIONS: What's NOT covered, limitations, waiting periods
5. RECOMMENDATIONS: Actionable insights for the policyholder

Write naturally and conversationally, as if explaining to a friend. Use clear, simple language and avoid insurance jargon. For Southeast Asian context, reference local practices and regulations where relevant.

DOCUMENT TEXT:
${documentText.substring(0, 8000)} ${documentText.length > 8000 ? '...(document truncated)' : ''}`;

    const analysisPrompt = `Please analyze this pet insurance policy document and provide a comprehensive breakdown covering all five areas: executive summary, key terms, coverage highlights, exclusions, and recommendations.`;

    const fullAnalysis = await this.reasoning(analysisPrompt, systemPrompt);

    // Parse the response into sections (basic implementation)
    const sections = {
      summary: fullAnalysis,
      keyTerms: fullAnalysis,
      coverageHighlights: fullAnalysis,
      exclusions: fullAnalysis,
      recommendations: fullAnalysis
    };

    // Try to extract specific sections if the AI formatted them clearly
    try {
      const summaryMatch = fullAnalysis.match(/(?:EXECUTIVE SUMMARY|SUMMARY)[:\n](.*?)(?=(?:KEY TERMS|COVERAGE|EXCLUSIONS|\n\n[A-Z]))/is);
      if (summaryMatch) sections.summary = summaryMatch[1].trim();

      const keyTermsMatch = fullAnalysis.match(/KEY TERMS[:\n](.*?)(?=(?:COVERAGE|EXCLUSIONS|RECOMMENDATIONS|\n\n[A-Z]))/is);
      if (keyTermsMatch) sections.keyTerms = keyTermsMatch[1].trim();

      const coverageMatch = fullAnalysis.match(/(?:COVERAGE HIGHLIGHTS|COVERAGE)[:\n](.*?)(?=(?:EXCLUSIONS|RECOMMENDATIONS|\n\n[A-Z]))/is);
      if (coverageMatch) sections.coverageHighlights = coverageMatch[1].trim();

      const exclusionsMatch = fullAnalysis.match(/EXCLUSIONS[:\n](.*?)(?=(?:RECOMMENDATIONS|\n\n[A-Z]))/is);
      if (exclusionsMatch) sections.exclusions = exclusionsMatch[1].trim();

      const recommendationsMatch = fullAnalysis.match(/RECOMMENDATIONS[:\n](.*?)$/is);
      if (recommendationsMatch) sections.recommendations = recommendationsMatch[1].trim();
    } catch (parseError) {
      console.warn('Could not parse analysis sections, using full response');
    }

    return sections;
  }

  /**
   * Translate policy summary to specified language
   */
  public async translatePolicyContent(
    content: string,
    targetLanguage: string,
    contentType: 'summary' | 'terms' | 'coverage' | 'exclusions' | 'recommendations' = 'summary'
  ): Promise<string> {
    const languageInstructions = {
      'English': 'Professional, clear English suitable for insurance documents',
      'Thai': 'Thai language with appropriate formality (ครับ/ค่ะ), insurance terminology in Thai',
      'Singlish': 'Singaporean English with natural Singlish expressions (lah, can, etc.)',
      'Bahasa Malaysia': 'Malaysian Bahasa with proper formality and insurance terms',
      'Bahasa Indonesia': 'Indonesian Bahasa with respectful tone and local context'
    };

    const systemPrompt = `You are a professional translator specializing in insurance documents for Southeast Asian markets.

SOURCE CONTENT TYPE: ${contentType}
TARGET LANGUAGE: ${targetLanguage}
LANGUAGE STYLE: ${languageInstructions[targetLanguage] || 'Clear, professional tone'}

TRANSLATION GUIDELINES:
- Maintain the original meaning and technical accuracy
- Use appropriate insurance terminology in the target language
- Keep the natural, conversational tone of the original
- Adapt cultural references for the target market
- Preserve important numbers, dates, and specific terms
- Make it easy to understand for pet owners

CONTENT TO TRANSLATE:
${content}`;

    return await this.chat(
      `Please translate the above ${contentType} content to ${targetLanguage}, maintaining accuracy and natural flow.`,
      systemPrompt
    );
  }

  /**
   * Generate policy comparison analysis
   */
  public async comparePolicies(
    policies: any[],
    userContext?: { pets?: any[]; budget?: number; preferences?: any }
  ): Promise<string> {
    const policiesInfo = policies.map(policy => `
Policy: ${policy.provider || 'Policy'}
- Coverage: $${policy.coverageLimit?.toLocaleString() || 'N/A'}
- Premium: $${policy.premium?.toLocaleString() || 'N/A'}/year
- Deductible: $${policy.deductible || 'N/A'}
- Features: ${policy.features?.join(', ') || 'Standard coverage'}
- Exclusions: ${policy.exclusions?.join(', ') || 'Standard exclusions'}
`).join('\n');

    const contextInfo = userContext ? `
USER CONTEXT:
- Pets: ${userContext.pets?.map(p => `${p.name} (${p.breed} ${p.species}, ${Math.floor(p.ageMonths / 12)}y)`).join(', ') || 'None'}
- Budget: $${userContext.budget?.toLocaleString() || 'Not specified'}/year
- Priorities: ${userContext.preferences?.coverage_priority || 'Comprehensive coverage'}
` : '';

    const systemPrompt = `You are a pet insurance advisor helping customers compare policy options.

POLICIES TO COMPARE:
${policiesInfo}
${contextInfo}

Provide a comprehensive comparison analysis in natural, conversational language. Cover:
- Value proposition of each policy
- Best fit for user's specific pets and situation  
- Cost-benefit analysis
- Coverage gaps and overlaps
- Specific recommendations with reasoning

Write as if you're sitting with the customer, explaining the pros and cons of each option in a friendly, helpful way. Avoid formal bullet points and technical jargon - focus on what matters most to pet owners.`;

    return await this.reasoning(
      `Compare these pet insurance policies and recommend the best option for this user's situation.`,
      systemPrompt
    );
  }

  /**
   * Extract text from uploaded policy documents (mock implementation)
   * In production, this would integrate with OCR services
   */
  public async extractTextFromDocument(file: File): Promise<string> {
    // Mock implementation - in production, you'd use OCR services like:
    // - Google Cloud Vision API
    // - AWS Textract
    // - Azure Computer Vision
    // - Tesseract.js for client-side OCR
    
    console.log(`📄 Extracting text from ${file.name} (${file.size} bytes)`);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return mock policy text for demonstration
    return `
PETINSUREX PREMIUM PLUS POLICY TERMS & CONDITIONS

Policy Number: PX-2024-001234
Effective Date: January 1, 2024
Renewal Date: January 1, 2025

COVERAGE SUMMARY:
Annual Coverage Limit: $4,500
Deductible: $250 per incident
Reimbursement Rate: 80% after deductible

COVERED CONDITIONS:
- Accidents and injuries
- Illness and disease treatment
- Emergency surgery and hospitalization
- Diagnostic tests (X-rays, blood work, etc.)
- Prescription medications
- Hereditary and genetic conditions (after 12-month waiting period)
- Alternative therapies (acupuncture, physiotherapy)
- Behavioral therapy and training
- Dental care (accidents and disease)
- Cancer treatment and chemotherapy

WAITING PERIODS:
- Accidents: No waiting period
- Illness: 14 days from policy start
- Hereditary conditions: 12 months
- Dental issues: 6 months

EXCLUSIONS:
- Pre-existing conditions
- Cosmetic procedures
- Breeding and pregnancy costs
- Routine wellness care
- Experimental treatments
- War, nuclear hazards
- Intentional harm

DEDUCTIBLE: $250 per incident
ANNUAL LIMIT: $4,500 maximum payout per policy year
LIFETIME LIMIT: No lifetime limit

CLAIM PROCESS:
1. Pay veterinary bill in full
2. Submit claim form within 90 days
3. Include itemized receipt and medical records
4. Claim processing time: 5-10 business days
5. Payment via direct deposit or check

PREMIUM: $456 annually, paid monthly at $38
RENEWAL: Automatic renewal unless cancelled 30 days prior

This policy is governed by Singapore insurance regulations and Southeast Asian veterinary standards.
    `.trim();
  }
}

// Export a singleton instance
export const seaLionAPI = new SeaLionAPI();