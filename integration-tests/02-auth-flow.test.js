/**
 * Integration Test 2: User Registration & Authentication Flow
 * 
 * Tests:
 * - User registration (F100)
 * - User login (F101)
 * - JWT token issuance
 * - Protected endpoint access
 */

const axios = require('axios');
const { BACKEND_URL } = require('./setup');

describe('Integration Test 2: User Registration & Authentication', () => {
  
  const testUser = {
    username: `testuser_${Date.now()}`,
    email: `test_${Date.now()}@example.com`,
    password: 'Test@1234',
    firstName: 'Test',
    lastName: 'User',
    role: 'CUSTOMER',
  };
  
  let authToken = null;
  
  test('Should register a new user successfully', async () => {
    const response = await axios.post(`${BACKEND_URL}/api/users/register`, testUser);
    
    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('id');
    expect(response.data.email).toBe(testUser.email);
    expect(response.data.role).toBe('CUSTOMER');
  });
  
  test('Should login with registered credentials', async () => {
    const loginPayload = {
      email: testUser.email,
      password: testUser.password,
    };
    
    const response = await axios.post(`${BACKEND_URL}/api/auth/login`, loginPayload);
    
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('token');
    expect(response.data).toHaveProperty('user');
    
    authToken = response.data.token;
  });
  
  test('Should access protected endpoint with valid token', async () => {
    const response = await axios.get(`${BACKEND_URL}/api/users/me`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });
    
    expect(response.status).toBe(200);
    expect(response.data.email).toBe(testUser.email);
  });
  
  test('Should reject access without token', async () => {
    try {
      await axios.get(`${BACKEND_URL}/api/users/me`);
      fail('Should have thrown 401 error');
    } catch (error) {
      expect(error.response.status).toBe(401);
    }
  });
});
