// src/components/admin/MenuItemForm.tsx
import React, { useState } from 'react';
import type { MenuItem } from '../../types/menu';

interface Props {
  initial?: MenuItem;
  onClose: () => void;
  onSave: (payload: {
    name: string;
    description?: string;
    price: number;
    category: string;
    available?: boolean;
    imageFile?: File | null;
  }) => Promise<any>;
}

export default function MenuItemForm({ initial, onClose, onSave }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [price, setPrice] = useState<number>(initial?.price ?? 0);
  const [category, setCategory] = useState<string>(initial?.category ?? '');
  const [available, setAvailable] = useState<boolean>(initial?.available ?? true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(null);
    try {
      await onSave({ name, description, price, category, available, imageFile });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">{initial ? 'Edit Item' : 'Create Item'}</h2>

        {error && <div className="text-red-600 mb-2">{error}</div>}

        <label className="block mb-2">
          <div className="text-sm">Name</div>
          <input required value={name} onChange={e => setName(e.target.value)} className="w-full border p-2 rounded" />
        </label>

        <label className="block mb-2">
          <div className="text-sm">Description</div>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border p-2 rounded" />
        </label>

        <label className="block mb-2">
          <div className="text-sm">Price</div>
          <input type="number" step="0.01" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full border p-2 rounded" />
        </label>

        <label className="block mb-2">
          <div className="text-sm">Category</div>
          <input value={category} onChange={e => setCategory(e.target.value)} className="w-full border p-2 rounded" />
        </label>

        <label className="flex items-center gap-2 mb-2">
          <input type="checkbox" checked={available} onChange={e => setAvailable(e.target.checked)} />
          <span className="text-sm">Available</span>
        </label>

        <label className="block mb-4">
          <div className="text-sm">Image</div>
          <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] ?? null)} />
        </label>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 py-1 border rounded">Cancel</button>
          <button type="submit" disabled={saving} className="px-3 py-1 rounded bg-amber-600 text-white">
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
