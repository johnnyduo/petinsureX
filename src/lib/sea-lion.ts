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
  public static readonly MODELS = {
    INSTRUCT: 'aisingapore/Gemma-SEA-LION-v3-9B-IT', // Primary model - often more stable
    INSTRUCT_ALT: 'aisingapore/Llama-SEA-LION-v3-70B-IT', // Backup model
    INSTRUCT_V4: 'aisingapore/Gemma-SEA-LION-v4-27B-IT', // Latest model (may have issues)
    REASONING: 'aisingapore/Llama-SEA-LION-v3.5-8B-R', // Smaller reasoning model first
    REASONING_ALT: 'aisingapore/Llama-SEA-LION-v3.5-70B-R', // Larger backup
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
   * Generate AI assistant response for pet insurance queries
   */
  public async petInsuranceAssistant(query: string): Promise<string> {
    const systemPrompt = `You are a helpful AI assistant for PetInsureX, a pet insurance platform. 
    You specialize in:
    - Pet insurance policies and coverage
    - Claims processing and requirements  
    - Pet health and wellness advice
    - Regional pet care practices in Southeast Asia
    
    LANGUAGE SUPPORT:
    - Respond in English by default
    - Support Singlish (Singaporean English) 
    - Support Thai (ภาษาไทย) when requested
    - Support Bahasa Malaysia and Bahasa Indonesia
    - Detect language from user input and respond accordingly
    - Use culturally appropriate examples and references
    
    REGIONAL EXPERTISE:
    - Thailand: Understand Thai pet care practices, local vet clinics, Thai animal welfare laws
    - Singapore: Singlish expressions, HDB pet policies, local vet networks
    - Malaysia: Pet import/export regulations, local insurance requirements
    - Indonesia: Traditional pet care practices, local veterinary standards
    
    Provide accurate, helpful, and friendly responses. Use simple language and be empathetic to pet owners' concerns.
    If you're unsure about specific policy details, recommend contacting customer support.
    
    For Thai queries, respond in Thai and include relevant cultural context about pet care in Thailand.`;

    return await this.chat(query, systemPrompt);
  }

  /**
   * Analyze a claim for potential issues or completeness
   */
  public async analyzeClaim(claimDescription: string, amount: number, petType: string): Promise<string> {
    const systemPrompt = `You are an AI claim analyst for PetInsureX. Analyze pet insurance claims for:
    - Completeness of information
    - Potential red flags or inconsistencies
    - Required documentation suggestions
    - Processing recommendations
    
    Be thorough but fair in your analysis. Focus on helping ensure claims are processed efficiently.`;

    const query = `Please analyze this pet insurance claim:
    
    Pet Type: ${petType}
    Claim Amount: $${amount}
    Description: ${claimDescription}
    
    Provide your analysis and recommendations.`;

    return await this.reasoning(query, systemPrompt);
  }

  /**
   * Generate multilingual support response
   */
  public async generateMultilingualResponse(message: string, language: string = 'English'): Promise<string> {
    const systemPrompt = `You are a multilingual customer support AI for PetInsureX. 
    Respond in ${language} when appropriate, especially for Southeast Asian languages like Singlish, Bahasa Malaysia, or Bahasa Indonesia.
    Be culturally aware and use appropriate local context.`;

    return await this.chat(message, systemPrompt);
  }
}

// Export a singleton instance
export const seaLionAPI = new SeaLionAPI();