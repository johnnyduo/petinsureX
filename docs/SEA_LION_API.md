# SEA-LION AI Integration Documentation

## Overview

This document explains how to integrate and use the SEA-LION AI API in the PetInsureX application. SEA-LION is a family of large language models developed by AI Singapore, optimized for Southeast Asian languages and contexts.

## API Configuration

### Environment Variables

The following environment variables are configured in `.env`:

```bash
# SEA-LION AI API Configuration
VITE_SEA_LION_API_KEY=sk-DStJmupqYRHEKfM5cDdkMw
VITE_SEA_LION_API_BASE_URL=https://api.sea-lion.ai/v1
```

### Rate Limits

- **10 requests per minute per user** (as of March 2025)
- Contact sealion@aisingapore.org for rate limit increases

## Available Models

### 1. Instruct Models
- **aisingapore/Gemma-SEA-LION-v4-27B-IT** - Main instruction-following model
- Best for: General chat, Q&A, content generation

### 2. Reasoning Models  
- **aisingapore/Llama-SEA-LION-v3.5-70B-R** - Advanced reasoning capabilities
- Features: Dynamic reasoning with thinking mode on/off
- Best for: Complex problem solving, analysis

### 3. Safety Guard Model
- **aisingapore/Llama-SEA-Guard-Prompt-v1** - Content safety evaluation
- Returns: Binary classification (safe/unsafe)
- Best for: Content moderation, safety checks

## Usage Examples

### Basic Chat Completion

```javascript
const response = await fetch('https://api.sea-lion.ai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'accept': 'text/plain',
    'Authorization': `Bearer ${import.meta.env.VITE_SEA_LION_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: "aisingapore/Gemma-SEA-LION-v4-27B-IT",
    messages: [
      {
        role: "user",
        content: "Explain pet insurance benefits in simple terms"
      }
    ]
  })
});

const data = await response.text();
console.log(data);
```

### Using Reasoning Model

```javascript
const response = await fetch('https://api.sea-lion.ai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'accept': 'text/plain',
    'Authorization': `Bearer ${import.meta.env.VITE_SEA_LION_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: "aisingapore/Llama-SEA-LION-v3.5-70B-R",
    messages: [
      {
        role: "user",
        content: "Analyze this pet insurance claim for potential fraud indicators"
      }
    ],
    chat_template_kwargs: {
      thinking_mode: "on"  // Enable reasoning mode
    }
  })
});
```

### Content Safety Check

```javascript
const response = await fetch('https://api.sea-lion.ai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'accept': 'text/plain',
    'Authorization': `Bearer ${import.meta.env.VITE_SEA_LION_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: "aisingapore/Llama-SEA-Guard-Prompt-v1",
    messages: [
      {
        role: "user",
        content: "User input to check for safety"
      }
    ],
    stream: false
  })
});
```

## Integration in PetInsureX

### AI Assistant Enhancement

The SEA-LION API can enhance the existing AI Assistant page (`src/pages/AIAssistant.tsx`) with:

1. **Multilingual Support**: Southeast Asian languages (Singlish, Bahasa, etc.)
2. **Local Context**: Understanding of regional pet care practices
3. **Advanced Reasoning**: Complex claim analysis and recommendations

### Potential Use Cases

1. **Claims Processing**
   - Analyze claim descriptions for completeness
   - Detect potential fraud patterns
   - Generate claim summaries

2. **Customer Support**
   - Answer policy questions in local languages
   - Provide region-specific pet care advice
   - Generate personalized responses

3. **Content Safety**
   - Moderate user-generated content
   - Filter inappropriate claims or messages
   - Ensure platform safety

### Implementation Example

```typescript
// src/lib/sea-lion.ts
export class SeaLionAPI {
  private apiKey: string;
  private baseURL: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_SEA_LION_API_KEY;
    this.baseURL = import.meta.env.VITE_SEA_LION_API_BASE_URL;
  }

  async chat(message: string, model = "aisingapore/Gemma-SEA-LION-v4-27B-IT") {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'accept': 'text/plain',
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: message }]
      })
    });

    if (!response.ok) {
      throw new Error(`SEA-LION API error: ${response.statusText}`);
    }

    return await response.text();
  }

  async moderateContent(content: string) {
    const response = await this.chat(
      content, 
      "aisingapore/Llama-SEA-Guard-Prompt-v1"
    );
    return response.toLowerCase().includes('safe');
  }
}
```

## Error Handling

- **Rate Limit Exceeded**: Implement exponential backoff
- **API Key Invalid**: Check environment variable configuration
- **Network Errors**: Implement retry logic with timeout

## Best Practices

1. **Caching**: Cache responses to reduce API calls
2. **Error Boundaries**: Wrap API calls in try-catch blocks  
3. **Loading States**: Show loading indicators during API calls
4. **Fallbacks**: Provide fallback responses when API is unavailable
5. **Security**: Never expose API keys in client-side code (use environment variables)

## Testing

### Get Available Models
```bash
curl 'https://api.sea-lion.ai/v1/models' \
  -H 'Authorization: Bearer sk-DStJmupqYRHEKfM5cDdkMw'
```

### Test Basic Chat
```bash
curl https://api.sea-lion.ai/v1/chat/completions \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer sk-DStJmupqYRHEKfM5cDdkMw' \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "aisingapore/Gemma-SEA-LION-v4-27B-IT",
    "messages": [
      {
        "role": "user",
        "content": "Hello! Can you help me with pet insurance questions?"
      }
    ]
  }'
```

## Resources

- [SEA-LION API Documentation](https://docs.sea-lion.ai/guides/inferencing/api)
- [SEA-LION Playground](https://playground.sea-lion.ai/)
- [Terms of Use](https://sea-lion.ai/terms-of-use/)
- [Privacy Policy](https://sea-lion.ai/privacy-policy/)
- Contact: sealion@aisingapore.org