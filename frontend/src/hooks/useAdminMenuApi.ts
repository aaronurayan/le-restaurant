import { useState, useEffect, useCallback } from 'react';
import type { MenuItem } from '../types/menu';

function fetchJson(input: RequestInfo, init?: RequestInit) {
  return fetch(input, init).then(async res => {
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || res.statusText);
    }
    return res.json();
  });
}

export function useAdminMenuApi(initial: MenuItem[] = []) {
  const [items, setItems] = useState<MenuItem[]>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await fetchJson('/api/admin/menu');
      // ensure types: convert price to number if server sends string
      const normalized: MenuItem[] = (data || []).map((d: any) => ({
        id: Number(d.id),
        name: d.name,
        description: d.description,
        price: Number(d.price),
        category: d.category,
        imageUrl: d.imageUrl,
        available: Boolean(d.available),
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
      }));
      setItems(normalized);
    } catch (err: any) {
      setError(err.message || 'Failed to load menu');
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
      setItems(prev => prev.filter(it => it.id !== tempId));
      setError(err.message || 'Create failed');
      throw err;
    }
  }, []);

  // Update
  const updateItem = useCallback(async (id: number, changes: Partial<MenuItem> & { imageFile?: File | null }) => {
    setError(null);
    let prev: MenuItem | undefined;
    setItems(old => old.map(it => it.id === id ? (prev = it, { ...it, ...changes }) : it));
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
      if (prev) setItems(old => old.map(it => (it.id === id ? prev! : it)));
      setError(err.message || 'Update failed');
      throw err;
    }
  }, []);

  // Delete
  const deleteItem = useCallback(async (id: number) => {
    setError(null);
    const backup = items;
    setItems(old => old.filter(it => it.id !== id));
    try {
      await fetchJson(`/api/admin/menu/${id}`, { method: 'DELETE' });
    } catch (err: any) {
      setItems(backup);
      setError(err.message || 'Delete failed');
      throw err;
    }
  }, [items]);

  return { items, loading, error, loadAll, createItem, updateItem, deleteItem };
}
