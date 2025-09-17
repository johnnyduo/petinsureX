#!/usr/bin/env node

/**
 * SEA-LION API Test Script for Vercel Deployment
 * Tests the API configuration and connectivity
 */

import { readFileSync } from 'fs';

// Load environment variables from .env file
function loadEnv() {
  try {
    const envContent = readFileSync('.env', 'utf-8');
    const lines = envContent.split('\n');
    lines.forEach(line => {
      if (line.includes('=') && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('=').trim();
        process.env[key.trim()] = value;
      }
    });
  } catch (error) {
    console.log('No .env file found, using system environment variables');
  }
}

loadEnv();

const API_KEY = process.env.VITE_SEA_LION_API_KEY;
const BASE_URL = process.env.VITE_SEA_LION_API_BASE_URL || 'https://api.sea-lion.ai/v1';

console.log('🧪 Testing SEA-LION API Configuration...\n');

// Check environment variables
console.log('📋 Environment Check:');
console.log(`   API Key: ${API_KEY ? '✅ Present' : '❌ Missing'}`);
console.log(`   Base URL: ${BASE_URL}`);
console.log('');

if (!API_KEY) {
  console.error('❌ VITE_SEA_LION_API_KEY is not set in environment variables');
  process.exit(1);
}

async function testAPI() {
  try {
    console.log('🔍 Testing Models Endpoint...');
    const modelsResponse = await fetch(`${BASE_URL}/models`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    if (!modelsResponse.ok) {
      const errorText = await modelsResponse.text();
      throw new Error(`Models endpoint failed (${modelsResponse.status}): ${errorText}`);
    }

    const modelsData = await modelsResponse.json();
    console.log(`✅ Models endpoint working - ${modelsData.data?.length || 0} models available`);
    
    if (modelsData.data?.length > 0) {
      console.log('📋 Available models:');
      modelsData.data.slice(0, 3).forEach(model => {
        console.log(`   - ${model.id}`);
      });
      if (modelsData.data.length > 3) {
        console.log(`   ... and ${modelsData.data.length - 3} more`);
      }
    }
    console.log('');

    console.log('💬 Testing Chat Completion...');
    const chatResponse = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'aisingapore/Gemma-SEA-LION-v4-27B-IT',
        messages: [
          {
            role: 'user',
            content: 'Hello! Please respond with just "API test successful" to confirm connectivity.'
          }
        ],
        cache: {
          no_cache: true
        }
      })
    });

    if (!chatResponse.ok) {
      const errorText = await chatResponse.text();
      throw new Error(`Chat completion failed (${chatResponse.status}): ${errorText}`);
    }

    const contentType = chatResponse.headers.get('content-type');
    let result;

    if (contentType?.includes('application/json')) {
      const chatData = await chatResponse.json();
      result = chatData.choices?.[0]?.message?.content || 'No content in response';
    } else {
      result = await chatResponse.text();
    }

    console.log(`✅ Chat completion working`);
    console.log(`📝 Response: ${result.substring(0, 100)}${result.length > 100 ? '...' : ''}`);
    console.log('');

    console.log('🎉 All tests passed! API is ready for Vercel deployment.');
    return true;

  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
    
    if (error.message.includes('401')) {
      console.error('🔑 Authentication failed - check your API key');
    } else if (error.message.includes('429')) {
      console.error('⏰ Rate limit exceeded - wait a moment and try again');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('network')) {
      console.error('🌐 Network connectivity issue - check your internet connection');
    }
    
    return false;
  }
}

// Run the test
testAPI().then(success => {
  process.exit(success ? 0 : 1);
});