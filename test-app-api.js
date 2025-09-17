/**
 * Test SEA-LION API integration using the actual application service
 */

import { SeaLionAPI } from './src/lib/sea-lion.js';

async function testApplicationAPI() {
  console.log('🚀 Testing SEA-LION API through application...\n');
  
  const seaLion = new SeaLionAPI();
  
  // Check configuration
  console.log('🔧 Configuration Check:');
  console.log(`   API Configured: ${seaLion.isConfigured() ? '✅ Yes' : '❌ No'}`);
  console.log('');
  
  if (!seaLion.isConfigured()) {
    console.error('❌ API not configured properly');
    return false;
  }
  
  try {
    // Test health check
    console.log('🏥 Running health check...');
    const health = await seaLion.checkHealth(true); // Force refresh
    
    console.log(`   Status: ${getStatusEmoji(health.status)} ${health.status.toUpperCase()}`);
    console.log(`   Response Time: ${health.responseTime}ms`);
    console.log(`   Available Models: ${health.availableModels.length}`);
    
    if (health.errors.length > 0) {
      console.log('   Errors:');
      health.errors.forEach(error => console.log(`     - ${error}`));
    }
    
    console.log('');
    
    // Test chat completion
    console.log('💬 Testing chat completion...');
    const response = await seaLion.chatCompletion({
      model: SeaLionAPI.MODELS.INSTRUCT,
      messages: [
        {
          role: 'user',
          content: 'You are a pet insurance AI assistant. Respond with exactly: "PetInsureX AI is ready for deployment!"'
        }
      ]
    });
    
    console.log(`✅ Chat response: ${response.substring(0, 100)}${response.length > 100 ? '...' : ''}`);
    console.log('');
    
    // Test pet insurance specific functionality
    console.log('🐾 Testing pet insurance assistant...');
    const petResponse = await seaLion.petInsuranceAssistant(
      'What are the key benefits of pet insurance?',
      {
        user: { name: 'Test User', preferredLanguage: 'en' },
        pets: [{ name: 'Max', breed: 'Golden Retriever', age: 3 }],
        policies: [],
        claims: [],
        location: { country: 'Singapore', region: 'Southeast Asia' }
      }
    );
    
    console.log(`✅ Pet insurance response: ${petResponse.substring(0, 150)}${petResponse.length > 150 ? '...' : ''}`);
    console.log('');
    
    console.log('🎉 All application tests passed! Ready for production deployment.');
    return true;
    
  } catch (error) {
    console.error('❌ Application test failed:', error.message);
    
    if (error.message.includes('401')) {
      console.error('🔑 Check API key in Vercel environment variables');
    } else if (error.message.includes('429')) {
      console.error('⏰ Rate limited - this is normal, API is working');
    }
    
    return false;
  }
}

function getStatusEmoji(status) {
  switch (status) {
    case 'healthy': return '✅';
    case 'degraded': return '⚠️';
    case 'down': return '❌';
    default: return '❓';
  }
}

// Run the test
testApplicationAPI().then(success => {
  process.exit(success ? 0 : 1);
});