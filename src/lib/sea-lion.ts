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

export class SeaLionAPI {
  private apiKey: string;
  private baseURL: string;

  // Available models
  public static readonly MODELS = {
    INSTRUCT: 'aisingapore/Gemma-SEA-LION-v4-27B-IT',
    REASONING: 'aisingapore/Llama-SEA-LION-v3.5-70B-R',
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
   * Send a chat completion request
   */
  public async chatCompletion(request: SeaLionChatRequest): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('SEA-LION API key not configured');
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'accept': 'text/plain',
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait before making another request.');
        }
        throw new Error(`SEA-LION API error: ${response.statusText}`);
      }

      // SEA-LION API returns text/plain for most requests
      return await response.text();
    } catch (error) {
      console.error('SEA-LION API request failed:', error);
      throw error;
    }
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
   * Generate AI assistant response for pet insurance queries
   */
  public async petInsuranceAssistant(query: string): Promise<string> {
    const systemPrompt = `You are a helpful AI assistant for PetInsureX, a pet insurance platform. 
    You specialize in:
    - Pet insurance policies and coverage
    - Claims processing and requirements  
    - Pet health and wellness advice
    - Regional pet care practices in Southeast Asia
    
    Provide accurate, helpful, and friendly responses. Use simple language and be empathetic to pet owners' concerns.
    If you're unsure about specific policy details, recommend contacting customer support.`;

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