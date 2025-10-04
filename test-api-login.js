// Test script để kiểm tra API login
const axios = require('axios');

const API_BASE = 'https://api.emoeease.vn';

async function testLogin() {
  try {
    console.log('🔍 Testing API login...');
    
    const response = await axios.post(`${API_BASE}/Auth/v2/login`, {
      email: 'test@example.com',
      password: 'password123',
      deviceType: 'Web',
      clientDeviceId: 'test-device-' + Date.now()
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    });
    
    console.log('✅ Login successful!');
    console.log('Response data:', response.data);
    
    if (response.data.token) {
      console.log('✅ Token received:', response.data.token.substring(0, 50) + '...');
    }
    
    if (response.data.refreshToken) {
      console.log('✅ Refresh token received:', response.data.refreshToken);
    }
    
  } catch (error) {
    console.error('❌ Login failed:');
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Response Data:', error.response?.data);
    console.error('Error Message:', error.message);
  }
}

async function testHealthCheck() {
  try {
    console.log('🔍 Testing API health...');
    
    const response = await axios.get(`${API_BASE}/health`, {
      timeout: 5000
    });
    
    console.log('✅ API is healthy!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.log('⚠️ Health check failed, but API might still be available');
    console.log('Error:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting API tests...\n');
  
  await testHealthCheck();
  console.log('\n' + '='.repeat(50) + '\n');
  await testLogin();
  
  console.log('\n✨ Tests completed!');
}

runTests();
