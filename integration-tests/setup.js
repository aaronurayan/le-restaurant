/**
 * Integration Test Setup
 * 
 * Prerequisites:
 * 1. Backend server running on http://localhost:8080
 * 2. Frontend server running on http://localhost:5173
 * 
 * Run: npm run test:integration
 */

const axios = require('axios');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Global timeout for integration tests
jest.setTimeout(30000);

// Helper: Wait for server to be ready
async function waitForServer(url, maxRetries = 10) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await axios.get(url, { timeout: 2000 });
      return true;
    } catch (error) {
      if (i === maxRetries - 1) throw new Error(`Server not ready at ${url}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

// Before all tests: verify servers are running
beforeAll(async () => {
  console.log('🔍 Checking servers...');
  
  try {
    await waitForServer(`${BACKEND_URL}/actuator/health`);
    console.log('✅ Backend server is ready');
  } catch (error) {
    console.error('❌ Backend server not running at', BACKEND_URL);
    throw error;
  }
  
  try {
    await waitForServer(FRONTEND_URL);
    console.log('✅ Frontend server is ready');
  } catch (error) {
    console.error('❌ Frontend server not running at', FRONTEND_URL);
    throw error;
  }
});

module.exports = {
  BACKEND_URL,
  FRONTEND_URL,
};
