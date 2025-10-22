/**
 * Integration Test 4: Order & Payment Flow (F105 + F106)
 * 
 * Tests:
 * - Create order with menu items
 * - Calculate total price
 * - Process payment
 * - Verify order status update
 */

const axios = require('axios');
const { BACKEND_URL } = require('./setup');

describe('Integration Test 4: Order & Payment Flow', () => {
  
  let authToken = null;
  let customerId = null;
  let orderId = null;
  let menuItems = [];
  
  beforeAll(async () => {
    // Create test user and login
    const testUser = {
      username: `ordertest_${Date.now()}`,
      email: `order_${Date.now()}@example.com`,
      password: 'Order@1234',
      firstName: 'Order',
      lastName: 'Test',
      role: 'CUSTOMER',
    };
    
    const registerResponse = await axios.post(`${BACKEND_URL}/api/users/register`, testUser);
    customerId = registerResponse.data.id;
    
    const loginResponse = await axios.post(`${BACKEND_URL}/api/auth/login`, {
      email: testUser.email,
      password: testUser.password,
    });
    authToken = loginResponse.data.token;
    
    // Get menu items
    const menuResponse = await axios.get(`${BACKEND_URL}/api/menu`);
    menuItems = menuResponse.data.slice(0, 2); // Take first 2 items
  });
  
  test('Should create an order with menu items', async () => {
    const orderPayload = {
      customerId: customerId,
      items: menuItems.map(item => ({
        menuItemId: item.id,
        quantity: 2,
        price: item.price,
      })),
      deliveryAddress: '123 Test Street, Test City',
      specialInstructions: 'Integration test order',
    };
    
    const response = await axios.post(`${BACKEND_URL}/api/orders`, orderPayload, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    
    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('id');
    expect(response.data.status).toBe('PENDING');
    
    orderId = response.data.id;
  });
  
  test('Should calculate correct total price', async () => {
    const response = await axios.get(`${BACKEND_URL}/api/orders/${orderId}`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    
    const expectedTotal = menuItems.reduce((sum, item) => sum + (item.price * 2), 0);
    
    expect(response.data.totalAmount).toBeCloseTo(expectedTotal, 2);
  });
  
  test('Should process payment for order', async () => {
    const paymentPayload = {
      orderId: orderId,
      amount: menuItems.reduce((sum, item) => sum + (item.price * 2), 0),
      paymentMethod: 'CREDIT_CARD',
      cardNumber: '4111111111111111',
      cardHolderName: 'Order Test',
    };
    
    const response = await axios.post(`${BACKEND_URL}/api/payments`, paymentPayload, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    
    expect(response.status).toBe(201);
    expect(response.data.status).toBe('COMPLETED');
  });
  
  test('Should update order status after payment', async () => {
    const response = await axios.get(`${BACKEND_URL}/api/orders/${orderId}`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    
    expect(response.data.status).toBe('CONFIRMED');
    expect(response.data.paymentStatus).toBe('PAID');
  });
});
