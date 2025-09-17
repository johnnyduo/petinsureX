/**
 * Vercel Environment Variables Check
 * This will be included in the build to verify environment setup
 */

// This file can be imported to verify environment variables are properly set
export function checkEnvironment() {
  const config = {
    apiKey: import.meta.env.VITE_SEA_LION_API_KEY,
    baseUrl: import.meta.env.VITE_SEA_LION_API_BASE_URL,
    appName: import.meta.env.VITE_APP_NAME,
    appVersion: import.meta.env.VITE_APP_VERSION,
    enableMockData: import.meta.env.VITE_ENABLE_MOCK_DATA
  };

  const issues = [];
  
  if (!config.apiKey) {
    issues.push('VITE_SEA_LION_API_KEY is missing');
  } else if (!config.apiKey.startsWith('sk-')) {
    issues.push('VITE_SEA_LION_API_KEY appears to be invalid (should start with sk-)');
  }
  
  if (!config.baseUrl) {
    issues.push('VITE_SEA_LION_API_BASE_URL is missing');
  } else if (!config.baseUrl.startsWith('https://')) {
    issues.push('VITE_SEA_LION_API_BASE_URL should use HTTPS');
  }

  const result = {
    isValid: issues.length === 0,
    config,
    issues,
    summary: {
      apiKey: config.apiKey ? `Present (${config.apiKey.substring(0, 8)}...)` : 'Missing',
      baseUrl: config.baseUrl || 'Missing',
      appName: config.appName || 'Missing',
      appVersion: config.appVersion || 'Missing'
    }
  };

  // Log for debugging in development
  if (import.meta.env.DEV) {
    console.log('🔍 Environment Check:', result);
  }

  return result;
}

// Export for use in components
export default checkEnvironment;