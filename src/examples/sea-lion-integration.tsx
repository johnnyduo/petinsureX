/**
 * Example integration of SEA-LION API in AIAssistant component
 * 
 * This file shows how to enhance the existing AI Assistant page
 * with SEA-LION API capabilities for multilingual support and
 * advanced reasoning.
 */

import React, { useState } from 'react';
import { seaLionAPI } from '@/lib/sea-lion';

// Example hook for SEA-LION integration
export const useSeaLion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chat = async (message: string): Promise<string> => {
    if (!seaLionAPI.isConfigured()) {
      throw new Error('SEA-LION API not configured. Please check your .env file.');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await seaLionAPI.petInsuranceAssistant(message);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const moderateContent = async (content: string): Promise<boolean> => {
    try {
      return await seaLionAPI.moderateContent(content);
    } catch (err) {
      console.error('Content moderation failed:', err);
      return false; // Fail safe
    }
  };

  const analyzeClaim = async (
    description: string, 
    amount: number, 
    petType: string
  ): Promise<string> => {
    setLoading(true);
    setError(null);

    try {
      const analysis = await seaLionAPI.analyzeClaim(description, amount, petType);
      return analysis;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    chat,
    moderateContent,
    analyzeClaim,
    loading,
    error,
    isConfigured: seaLionAPI.isConfigured()
  };
};

// Example component showing SEA-LION integration
export const SeaLionDemo: React.FC = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const { chat, loading, error, isConfigured } = useSeaLion();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const result = await chat(message);
      setResponse(result);
    } catch (err) {
      console.error('Chat failed:', err);
    }
  };

  if (!isConfigured) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">SEA-LION API Not Configured</h3>
        <p className="text-yellow-700 text-sm">
          Please add your SEA-LION API key to the .env file to enable AI features.
        </p>
        <p className="text-yellow-600 text-xs mt-2">
          Get your API key from: <a href="https://playground.sea-lion.ai/" className="underline">SEA-LION Playground</a>
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">SEA-LION AI Assistant</h2>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask me anything about pet insurance..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Thinking...' : 'Ask SEA-LION'}
        </button>
      </form>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {response && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-semibold mb-2">SEA-LION Response:</h3>
          <div className="whitespace-pre-wrap text-sm">{response}</div>
        </div>
      )}
    </div>
  );
};

// Example integration in existing AIAssistant component
export const enhanceAIAssistantWithSeaLion = () => {
  // This is how you would modify the existing AIAssistant.tsx file:
  
  /*
  // Add to the imports
  import { useSeaLion } from '@/lib/sea-lion-integration';
  
  // Add to the component
  const AIAssistant = () => {
    const { chat, loading, error, isConfigured } = useSeaLion();
    
    // Modify the handleSendMessage function to use SEA-LION
    const handleSendMessage = async (message: string) => {
      if (!isConfigured) {
        // Fallback to existing mock responses
        return handleMockResponse(message);
      }
      
      try {
        const response = await chat(message);
        // Add the response to your chat messages
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          content: response,
          isUser: false,
          timestamp: new Date()
        }]);
      } catch (err) {
        // Handle error - maybe show fallback response
        console.error('SEA-LION chat failed:', err);
        handleMockResponse(message); // Fallback
      }
    };
    
    // Rest of your component...
  };
  */
};

export default SeaLionDemo;