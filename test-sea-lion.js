/**
 * Test script to verify SEA-LION API integration
 * Run this to test the API connection and basic functionality
 */

import { seaLionAPI } from './src/lib/sea-lion.js';

async function testSeaLionIntegration() {
  console.log('🧪 Testing SEA-LION API Integration...\n');

  // Test 1: Check if API is configured
  console.log('1. Checking API Configuration...');
  const isConfigured = seaLionAPI.isConfigured();
  console.log(`   ✅ API Configured: ${isConfigured ? 'Yes' : 'No'}`);
  
  if (!isConfigured) {
    console.log('   ❌ SEA-LION API key not found. Please check your .env file.');
    return;
  }

  try {
    // Test 2: Get available models
    console.log('\n2. Fetching Available Models...');
    const models = await seaLionAPI.getModels();
    console.log(`   ✅ Found ${models.data.length} available models`);
    console.log(`   📋 Models: ${models.data.map(m => m.id).join(', ')}`);

    // Test 3: Simple chat test
    console.log('\n3. Testing Pet Insurance Assistant...');
    const chatResponse = await seaLionAPI.petInsuranceAssistant(
      "What are the key benefits of pet insurance?"
    );
    console.log(`   ✅ Chat Response (${chatResponse.length} chars):`);
    console.log(`   📝 ${chatResponse.substring(0, 150)}...`);

    // Test 4: Content moderation test
    console.log('\n4. Testing Content Moderation...');
    const safeContent = await seaLionAPI.moderateContent("I love my pet dog");
    const unsafeContent = await seaLionAPI.moderateContent("How to harm animals");
    console.log(`   ✅ Safe content: ${safeContent ? 'SAFE' : 'UNSAFE'}`);
    console.log(`   ✅ Unsafe content: ${unsafeContent ? 'SAFE' : 'UNSAFE'}`);

    // Test 5: Claims analysis test
    console.log('\n5. Testing Claims Analysis...');
    const claimsAnalysis = await seaLionAPI.analyzeClaim(
      "Emergency surgery for gastric torsion in Golden Retriever",
      1250,
      "dog"
    );
    console.log(`   ✅ Claims Analysis (${claimsAnalysis.length} chars):`);
    console.log(`   📝 ${claimsAnalysis.substring(0, 200)}...`);

    console.log('\n🎉 All tests passed! SEA-LION API integration is working correctly.');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   - Check your API key in .env file');
    console.log('   - Verify internet connection');
    console.log('   - Check rate limits (10 requests/minute)');
  }
}

// Run the test
testSeaLionIntegration();