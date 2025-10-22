/**
 * Integration Test 3: Menu Display & Filtering (F103)
 * 
 * Tests:
 * - Fetch all menu items
 * - Filter by category
 * - Search by name
 * - Menu item structure validation
 */

const axios = require('axios');
const { BACKEND_URL } = require('./setup');

describe('Integration Test 3: Menu Display & Filtering', () => {
  
  test('Should fetch all menu items', async () => {
    const response = await axios.get(`${BACKEND_URL}/api/menu`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBeGreaterThan(0);
  });
  
  test('Menu items should have required fields', async () => {
    const response = await axios.get(`${BACKEND_URL}/api/menu`);
    const firstItem = response.data[0];
    
    expect(firstItem).toHaveProperty('id');
    expect(firstItem).toHaveProperty('name');
    expect(firstItem).toHaveProperty('price');
    expect(firstItem).toHaveProperty('category');
    expect(firstItem).toHaveProperty('description');
  });
  
  test('Should filter menu items by category', async () => {
    const response = await axios.get(`${BACKEND_URL}/api/menu?category=MAIN`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    
    if (response.data.length > 0) {
      response.data.forEach(item => {
        expect(item.category).toBe('MAIN');
      });
    }
  });
  
  test('Should search menu items by name', async () => {
    // First get all items to find a searchable name
    const allItems = await axios.get(`${BACKEND_URL}/api/menu`);
    
    if (allItems.data.length > 0) {
      const searchTerm = allItems.data[0].name.substring(0, 3);
      const response = await axios.get(`${BACKEND_URL}/api/menu?search=${searchTerm}`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    }
  });
  
  test('Should return empty array for non-existent search', async () => {
    const response = await axios.get(`${BACKEND_URL}/api/menu?search=NonExistentDish12345`);
    
    expect(response.status).toBe(200);
    expect(response.data).toEqual([]);
  });
});
