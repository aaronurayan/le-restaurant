/**
 * Integration Test 1: Health Check & System Status
 * 
 * Tests:
 * - Backend health endpoint
 * - Frontend accessibility
 * - CORS configuration
 */

const axios = require('axios');
const { BACKEND_URL, FRONTEND_URL } = require('./setup');

describe('Integration Test 1: Health Check & System Status', () => {
  
  test('Backend health endpoint should return OK', async () => {
    const response = await axios.get(`${BACKEND_URL}/actuator/health`);
    
    expect(response.status).toBe(200);
    expect(response.data.status).toBe('UP');
  });
  
  test('Frontend should be accessible', async () => {
    const response = await axios.get(FRONTEND_URL);
    
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('text/html');
  });
  
  test('Backend should accept CORS requests from frontend', async () => {
    const response = await axios.get(`${BACKEND_URL}/api/menu`, {
      headers: {
        'Origin': FRONTEND_URL,
      },
    });
    
    expect(response.status).toBe(200);
    // CORS header should be present
    expect(response.headers['access-control-allow-origin']).toBeDefined();
  });
  
  test('Backend API base path should return valid response', async () => {
    const response = await axios.get(`${BACKEND_URL}/api/menu`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });
});
