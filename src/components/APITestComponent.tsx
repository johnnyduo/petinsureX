import React, { useState, useEffect } from 'react';
import { SeaLionAPI } from '@/lib/sea-lion';
import checkEnvironment from '@/lib/env-check';

/**
 * API Test Component for Vercel Deployment Verification
 * This component tests the SEA-LION API integration
 */
export const APITestComponent: React.FC = () => {
  const [envCheck, setEnvCheck] = useState(checkEnvironment());
  const [apiStatus, setApiStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testResults, setTestResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testAPI = async () => {
    setApiStatus('testing');
    setError(null);
    
    try {
      const seaLion = new SeaLionAPI();
      
      // Check configuration
      if (!seaLion.isConfigured()) {
        throw new Error('API not configured - check environment variables');
      }
      
      // Run health check
      console.log('🏥 Running health check...');
      const health = await seaLion.checkHealth(true);
      
      // Test basic chat
      console.log('💬 Testing chat completion...');
      const response = await seaLion.chatCompletion({
        model: SeaLionAPI.MODELS.INSTRUCT,
        messages: [
          {
            role: 'user',
            content: 'Respond with: "API working on Vercel!"'
          }
        ]
      });
      
      setTestResults({
        health,
        chatResponse: response.substring(0, 200),
        timestamp: new Date().toISOString()
      });
      
      setApiStatus('success');
      
    } catch (err) {
      console.error('API test failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setApiStatus('error');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'degraded': return 'text-yellow-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'healthy': return '✅';
      case 'degraded': return '⚠️';
      case 'down': return '❌';
      default: return '❓';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        🧪 SEA-LION API Test - Vercel Deployment
      </h2>
      
      {/* Environment Check */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">📋 Environment Variables</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between">
            <span>API Key:</span>
            <span className={envCheck.config.apiKey ? 'text-green-600' : 'text-red-600'}>
              {envCheck.summary.apiKey}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Base URL:</span>
            <span className={envCheck.config.baseUrl ? 'text-green-600' : 'text-red-600'}>
              {envCheck.summary.baseUrl}
            </span>
          </div>
          <div className="flex justify-between">
            <span>App Name:</span>
            <span>{envCheck.summary.appName}</span>
          </div>
          <div className="flex justify-between">
            <span>App Version:</span>
            <span>{envCheck.summary.appVersion}</span>
          </div>
        </div>
        
        {envCheck.issues.length > 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
            <h4 className="font-semibold text-red-800">Issues Found:</h4>
            <ul className="list-disc list-inside text-red-700">
              {envCheck.issues.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Test Button */}
      <div className="mb-6">
        <button
          onClick={testAPI}
          disabled={apiStatus === 'testing' || !envCheck.isValid}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            apiStatus === 'testing'
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : envCheck.isValid
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {apiStatus === 'testing' ? '🔄 Testing API...' : '🚀 Test SEA-LION API'}
        </button>
      </div>

      {/* Test Results */}
      {apiStatus === 'success' && testResults && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-3">✅ API Test Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">🏥 Service Health</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={getStatusColor(testResults.health.status)}>
                    {getStatusEmoji(testResults.health.status)} {testResults.health.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Response Time:</span>
                  <span>{testResults.health.responseTime}ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Available Models:</span>
                  <span>{testResults.health.availableModels.length}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">💬 Chat Response</h4>
              <div className="p-2 bg-white border rounded text-sm">
                {testResults.chatResponse}
                {testResults.chatResponse.length >= 200 && '...'}
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-xs text-gray-600">
            Test completed at: {new Date(testResults.timestamp).toLocaleString()}
          </div>
        </div>
      )}

      {/* Error Display */}
      {apiStatus === 'error' && error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800 mb-3">❌ API Test Failed</h3>
          <div className="text-red-700 font-mono text-sm bg-white p-3 rounded border">
            {error}
          </div>
          
          <div className="mt-4 text-sm text-red-700">
            <h4 className="font-semibold">Troubleshooting:</h4>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Verify environment variables are set in Vercel dashboard</li>
              <li>Check API key is valid and has proper permissions</li>
              <li>Ensure the API endpoint is accessible</li>
              <li>Check for rate limiting (429 errors)</li>
            </ul>
          </div>
        </div>
      )}

      {/* Development Notes */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">📝 Deployment Notes</h3>
        <ul className="text-sm text-blue-700 space-y-2">
          <li>• This component tests the SEA-LION API integration in production</li>
          <li>• Environment variables are automatically loaded from Vercel</li>
          <li>• The API key should be set in Vercel's environment variables</li>
          <li>• Remove this component before final production deployment</li>
        </ul>
      </div>
    </div>
  );
};

export default APITestComponent;