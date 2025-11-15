import { useState, useEffect, useCallback } from 'react';
import type { MenuItem } from '../types/menu';

// Mock data for when backend is not available
const mockMenuItems: MenuItem[] = [
  {
    id: 1,
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with parmesan cheese, croutons, and classic Caesar dressing',
    price: 12.99,
    category: 'Appetizers',
    imageUrl: 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Bruschetta Trio',
    description: 'Three pieces of toasted bread topped with fresh tomatoes, mozzarella, and basil',
    price: 9.99,
    category: 'Appetizers',
    imageUrl: 'https://images.pexels.com/photos/1394947/pexels-photo-1394947.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Buffalo Wings',
    description: 'Crispy chicken wings tossed in spicy buffalo sauce with celery and blue cheese',
    price: 14.99,
    category: 'Appetizers',
    imageUrl: 'https://images.pexels.com/photos/1683545/pexels-photo-1683545.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 4,
    name: 'Margherita Pizza',
    description: 'Traditional Italian pizza with fresh mozzarella, basil, and tomato sauce',
    price: 18.99,
    category: 'Main Courses',
    imageUrl: 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 5,
    name: 'Grilled Salmon',
    description: 'Fresh Atlantic salmon grilled to perfection with lemon herb butter',
    price: 24.99,
    category: 'Main Courses',
    imageUrl: 'https://images.pexels.com/photos/3296875/pexels-photo-3296875.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 6,
    name: 'Beef Burger',
    description: 'Juicy beef patty with lettuce, tomato, onion, and special sauce on brioche bun',
    price: 16.99,
    category: 'Main Courses',
    imageUrl: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 7,
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream',
    price: 8.99,
    category: 'Desserts',
    imageUrl: 'https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 8,
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with molten center, served with vanilla ice cream',
    price: 9.99,
    category: 'Desserts',
    imageUrl: 'https://images.pexels.com/photos/887853/pexels-photo-887853.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 9,
    name: 'Fresh Orange Juice',
    description: 'Freshly squeezed orange juice, no added sugar',
    price: 4.99,
    category: 'Beverages',
    imageUrl: 'https://images.pexels.com/photos/1292294/pexels-photo-1292294.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 10,
    name: 'Craft Beer',
    description: 'Local craft beer selection, rotating seasonal flavors',
    price: 6.99,
    category: 'Beverages',
    imageUrl: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function fetchJson(input: RequestInfo, init?: RequestInit) {
  return fetch(input, init).then(async res => {
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || res.statusText);
    }
    return res.json();
  });
}

/**
 * Check if error is a network error (backend not available)
 */
function isNetworkError(err: any): boolean {
  const errorMessage = err?.message || '';
  return (
    errorMessage.includes('Network Error') ||
    errorMessage.includes('ERR_CONNECTION_REFUSED') ||
    errorMessage.includes('fetch') ||
    errorMessage.includes('Failed to fetch') ||
    (err?.name === 'TypeError' && errorMessage.includes('fetch'))
  );
}

export function useAdminMenuApi(initial: MenuItem[] = []) {
  const [items, setItems] = useState<MenuItem[]>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true); 
    setError(null);
    try {
      // The URL should match the backend controller's @RequestMapping
      const data = await fetchJson('/api/admin/menu/items'); 
      setItems(data);
    } catch (err: any) {
      // If it's a network error (backend not available), use mock data
      if (isNetworkError(err)) {
        console.log('Backend not available, using mock data for menu items');
        setItems(mockMenuItems);
        setError(null); // Clear error for network issues
      } else {
        // For other errors, show the error message
        setError(err.message || 'Failed to load menu');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  // Create
  const createItem = useCallback(async (payload: Partial<MenuItem> & { imageFile?: File | null }) => {
    setError(null);
    const tempId = Date.now() * -1; // temporary negative id
    const temp: MenuItem = {
      id: tempId,
      name: payload.name || 'New item',
      description: payload.description || '',
      price: payload.price ?? 0,
      category: payload.category ?? '',
      imageUrl: '',
      available: payload.available ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setItems(prev => [temp, ...prev]);

    try {
      const form = new FormData();
      if (payload.name) form.append('name', payload.name);
      if (payload.description !== undefined) form.append('description', payload.description);
      if (payload.price !== undefined) form.append('price', String(payload.price));
      if (payload.category !== undefined) form.append('category', payload.category);
      if (payload.available !== undefined) form.append('available', String(payload.available));
      if (payload.imageFile) form.append('image', payload.imageFile);

      const created = await fetchJson('/api/admin/menu', { method: 'POST', body: form });
      const createdNormalized: MenuItem = {
        id: Number(created.id),
        name: created.name,
        description: created.description,
        price: Number(created.price),
        category: created.category,
        imageUrl: created.imageUrl,
        available: Boolean(created.available),
        createdAt: created.createdAt,
        updatedAt: created.updatedAt,
      };
      setItems(prev => prev.map(it => (it.id === tempId ? createdNormalized : it)));
      return createdNormalized;
    } catch (err: any) {
      // If it's a network error, keep the temporary item (optimistic update)
      if (isNetworkError(err)) {
        console.log('Backend not available, keeping item in local state only');
        // Keep the temp item, but mark it somehow? Or just keep it as is
        return temp;
      }
      // For other errors, remove the temp item and show error
      setItems(prev => prev.filter(it => it.id !== tempId));
      setError(err.message || 'Create failed');
      throw err;
    }
  }, []);

  // Update
  const updateItem = useCallback(async (id: number, changes: Partial<MenuItem> & { imageFile?: File | null }) => {
    setError(null);
    let prev: MenuItem | undefined;
    const updatedItem: MenuItem = {
      ...(items.find(it => it.id === id) || {} as MenuItem),
      ...changes,
      id,
      updatedAt: new Date().toISOString(),
    };
    setItems(old => old.map(it => it.id === id ? (prev = it, updatedItem) : it));
    try {
      const form = new FormData();
      if (changes.name !== undefined) form.append('name', String(changes.name));
      if (changes.description !== undefined) form.append('description', String(changes.description));
      if (changes.price !== undefined) form.append('price', String(changes.price));
      if (changes.category !== undefined) form.append('category', String(changes.category));
      if (changes.available !== undefined) form.append('available', String(changes.available));
      if (changes.imageFile) form.append('image', changes.imageFile);

      const updated = await fetchJson(`/api/admin/menu/${id}`, { method: 'PUT', body: form });
      const normalized: MenuItem = {
        id: Number(updated.id),
        name: updated.name,
        description: updated.description,
        price: Number(updated.price),
        category: updated.category,
        imageUrl: updated.imageUrl,
        available: Boolean(updated.available),
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      };
      setItems(old => old.map(it => it.id === id ? normalized : it));
      return normalized;
    } catch (err: any) {
      // If it's a network error, keep the updated item (optimistic update)
      if (isNetworkError(err)) {
        console.log('Backend not available, keeping update in local state only');
        return updatedItem;
      }
      // For other errors, revert the change
      if (prev) setItems(old => old.map(it => (it.id === id ? prev! : it)));
      setError(err.message || 'Update failed');
      throw err;
    }
  }, [items]);

  // Delete
  const deleteItem = useCallback(async (id: number) => {
    setError(null);
    const backup = items;
    setItems(old => old.filter(it => it.id !== id));
    try {
      await fetchJson(`/api/admin/menu/${id}`, { method: 'DELETE' });
    } catch (err: any) {
      // If it's a network error, keep the deletion (optimistic update)
      if (isNetworkError(err)) {
        console.log('Backend not available, keeping deletion in local state only');
        return; // Item already removed from state
      }
      // For other errors, revert the deletion
      setItems(backup);
      setError(err.message || 'Delete failed');
      throw err;
    }
  }, [items]);

  return { items, loading, error, loadAll, createItem, updateItem, deleteItem };
}
