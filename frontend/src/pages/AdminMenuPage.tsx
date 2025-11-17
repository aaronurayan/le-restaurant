import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';
import { useAdminMenuApi } from '../hooks/useAdminMenuApi';
import MenuItemForm from '../components/organisms/MenuItemForm';
import ConfirmDelete from '../components/organisms/ConfirmDelete';
import { MenuItem } from '../types/menu';
import { LoadingSpinner } from '../components/atoms/LoadingSpinner';
import { ErrorMessage } from '../components/molecules/ErrorMessage';

const AdminMenuPage = () => {
    const {
        items: menuItems,
        createItem: addItem,
        updateItem,
        deleteItem,
        loading: isLoading,
        error
    } = useAdminMenuApi();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

    // Open form for adding new item
    const handleAddNew = () => {
        setSelectedItem(null);
        setIsFormOpen(true);
    };

    // Open form for editing item
    const handleEdit = (item: MenuItem) => {
        setSelectedItem(item);
        setIsFormOpen(true);
    };

    // Open confirmation for deleting item
    const handleDelete = (item: MenuItem) => {
        setSelectedItem(item);
        setIsDeleteConfirmOpen(true);
    };

    // Save (add or update) item
    const handleFormSave = async (payload: {
        name: string;
        description?: string;
        price: number;
        category: string;
        available?: boolean;
        imageFile?: File | null;
    }) => {
        try {
            if (selectedItem && selectedItem.id) {
                await updateItem(selectedItem.id, {
                    ...selectedItem,
                    ...payload,
                    available: payload.available ?? true,
                });
            } else {
                await addItem({
                    ...payload,
                    available: payload.available ?? true,
                });
            }
            setIsFormOpen(false);
            setSelectedItem(null);
        } catch (err) {
            console.error('Failed to save menu item:', err);
            // Error is handled by useAdminMenuApi hook - state will be updated automatically
            // Keep form open so user can retry
        }
    };

    // Confirm deletion
    const confirmDelete = async () => {
        if (selectedItem) {
            try {
                await deleteItem(selectedItem.id);
                setIsDeleteConfirmOpen(false);
                setSelectedItem(null);
            } catch (err) {
                console.error('Failed to delete menu item:', err);
                // Error is handled by useAdminMenuApi hook
            }
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <LoadingSpinner size="lg" text="Loading menu items..." variant="primary" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <ErrorMessage 
                        message={error} 
                        onRetry={() => window.location.reload()} 
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-6">
                <Link 
                    to="/admin/dashboard" 
                    className="flex items-center text-primary-600 hover:text-primary-700 mb-3"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    <span>Back to Dashboard</span>
                </Link>
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-xs uppercase tracking-[0.4em] text-primary-600 mb-2">Immersive Gallery</p>
                        <h1 className="text-3xl font-serif font-bold text-neutral-gray-900">Menu Management</h1>
                        <p className="text-neutral-gray-600 mt-1 max-w-2xl">
                            Curate dishes like works of art. High-resolution assets, chef notes, and availability tags keep the dining room aligned with your vision.
                        </p>
                    </div>
                    <button
                        onClick={handleAddNew}
                        className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium inline-flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add New Item
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6 mb-8">
                <h2 className="text-xl font-bold text-neutral-900 mb-2">Media Library</h2>
                <p className="text-sm text-neutral-600">
                    Upload 4K stills or plating clips when editing an item. Our concierge surfaces these assets on the public gallery instantly.
                </p>
            </div>

            {/* List of Menu Items */}
            {menuItems.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-neutral-500 text-lg mb-4">No menu items found</p>
                    <button
                        onClick={handleAddNew}
                        className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium inline-flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Your First Item
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {menuItems.map((item) => {
                        const isAvailable = (item as any).available ?? (item as any).isAvailable ?? true;
                        return (
                        <div key={item.id} className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow">
                            <div className="relative h-64">
                                <img 
                                    src={item.imageUrl || 'https://images.pexels.com/photos/704569/pexels-photo-704569.jpeg?auto=compress&cs=tinysrgb&w=1200'} 
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                />
                                <span className={`absolute top-4 left-4 px-4 py-1 rounded-full text-xs font-semibold ${
                                    isAvailable ? 'bg-white/90 text-green-700' : 'bg-accent-red text-white'
                                }`}>
                                    {isAvailable ? 'Live on menu' : 'Hidden'}
                                </span>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-2xl font-serif text-neutral-900">{item.name}</h2>
                                        <p className="text-sm text-neutral-600 mt-1">
                                            {item.description || 'Describe plating, sourcing, or tasting notes to assist concierge and marketing teams.'}
                                        </p>
                                    </div>
                                    <span className="text-xl font-semibold text-primary-600 whitespace-nowrap">
                                        ${Number(item.price).toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2 text-xs font-medium text-neutral-600">
                                    <span className="px-3 py-1 rounded-full bg-neutral-100">Category: {item.category || '—'}</span>
                                    <span className="px-3 py-1 rounded-full bg-neutral-100">Asset: {item.imageUrl ? '4K Photo' : 'Placeholder'}</span>
                                </div>
                                <div className="flex gap-3 pt-4 border-t border-neutral-100">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-white border border-neutral-300 text-neutral-800 px-4 py-2 rounded-full hover:border-neutral-500 transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit Story
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )})}
                </div>
            )}

            {/* Add/Edit Modal */}
            {isFormOpen && (
                <MenuItemForm
                    initial={selectedItem ?? undefined}
                    onSave={handleFormSave}
                    onClose={() => setIsFormOpen(false)}
                />
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteConfirmOpen && selectedItem && (
                <ConfirmDelete
                    itemName={selectedItem.name}
                    onConfirm={confirmDelete}
                    onCancel={() => setIsDeleteConfirmOpen(false)}
                />
            )}
        </div>
    );
};

export default AdminMenuPage;