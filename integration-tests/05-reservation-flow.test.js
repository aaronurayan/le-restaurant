/**
 * Integration Test 5: Table Reservation Flow (F108 + F109)
 * 
 * Tests:
 * - Customer creates reservation
 * - Manager views pending reservations
 * - Manager approves reservation
 * - Verify reservation status update
 */

const axios = require('axios');
const { BACKEND_URL } = require('./setup');

describe('Integration Test 5: Table Reservation Flow', () => {
  
  let customerToken = null;
  let managerToken = null;
  let customerId = null;
  let reservationId = null;
  
  beforeAll(async () => {
    // Create customer user
    const customer = {
      username: `customer_${Date.now()}`,
      email: `customer_${Date.now()}@example.com`,
      password: 'Customer@1234',
      firstName: 'Customer',
      lastName: 'Test',
      role: 'CUSTOMER',
    };
    
    const customerRegister = await axios.post(`${BACKEND_URL}/api/users/register`, customer);
    customerId = customerRegister.data.id;
    
    const customerLogin = await axios.post(`${BACKEND_URL}/api/auth/login`, {
      email: customer.email,
      password: customer.password,
    });
    customerToken = customerLogin.data.token;
    
    // Create manager user
    const manager = {
      username: `manager_${Date.now()}`,
      email: `manager_${Date.now()}@example.com`,
      password: 'Manager@1234',
      firstName: 'Manager',
      lastName: 'Test',
      role: 'MANAGER',
    };
    
    await axios.post(`${BACKEND_URL}/api/users/register`, manager);
    
    const managerLogin = await axios.post(`${BACKEND_URL}/api/auth/login`, {
      email: manager.email,
      password: manager.password,
    });
    managerToken = managerLogin.data.token;
  });
  
  test('Customer should create a reservation', async () => {
    const reservationDate = new Date();
    reservationDate.setDate(reservationDate.getDate() + 3); // 3 days from now
    
    const reservationPayload = {
      customerId: customerId,
      reservationDate: reservationDate.toISOString(),
      numberOfGuests: 4,
      specialRequests: 'Window seat please',
      tableNumber: 5,
    };
    
    const response = await axios.post(`${BACKEND_URL}/api/reservations`, reservationPayload, {
      headers: { 'Authorization': `Bearer ${customerToken}` },
    });
    
    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('id');
    expect(response.data.status).toBe('PENDING');
    expect(response.data.numberOfGuests).toBe(4);
    
    reservationId = response.data.id;
  });
  
  test('Manager should view pending reservations', async () => {
    const response = await axios.get(`${BACKEND_URL}/api/reservations?status=PENDING`, {
      headers: { 'Authorization': `Bearer ${managerToken}` },
    });
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    
    const ourReservation = response.data.find(r => r.id === reservationId);
    expect(ourReservation).toBeDefined();
    expect(ourReservation.status).toBe('PENDING');
  });
  
  test('Manager should approve reservation', async () => {
    const response = await axios.put(
      `${BACKEND_URL}/api/reservations/${reservationId}/approve`,
      {},
      {
        headers: { 'Authorization': `Bearer ${managerToken}` },
      }
    );
    
    expect(response.status).toBe(200);
    expect(response.data.status).toBe('CONFIRMED');
  });
  
  test('Customer should see confirmed reservation', async () => {
    const response = await axios.get(`${BACKEND_URL}/api/reservations/${reservationId}`, {
      headers: { 'Authorization': `Bearer ${customerToken}` },
    });
    
    expect(response.status).toBe(200);
    expect(response.data.status).toBe('CONFIRMED');
    expect(response.data.id).toBe(reservationId);
  });
  
  test('Manager should be able to reject a reservation', async () => {
    // Create another reservation to reject
    const reservationDate = new Date();
    reservationDate.setDate(reservationDate.getDate() + 5);
    
    const newReservation = await axios.post(
      `${BACKEND_URL}/api/reservations`,
      {
        customerId: customerId,
        reservationDate: reservationDate.toISOString(),
        numberOfGuests: 2,
        tableNumber: 3,
      },
      { headers: { 'Authorization': `Bearer ${customerToken}` } }
    );
    
    const rejectResponse = await axios.put(
      `${BACKEND_URL}/api/reservations/${newReservation.data.id}/reject`,
      {},
      { headers: { 'Authorization': `Bearer ${managerToken}` } }
    );
    
    expect(rejectResponse.status).toBe(200);
    expect(rejectResponse.data.status).toBe('REJECTED');
  });
});
