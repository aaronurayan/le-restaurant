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
                        <h1 className="text-3xl font-bold text-neutral-gray-800">Menu Management</h1>
                        <p className="text-neutral-gray-600 mt-1">Create, update, and manage menu items</p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menuItems.map((item) => (
                        <div key={item.id} className="bg-white border-2 border-neutral-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                            {item.imageUrl && (
                                <img 
                                    src={item.imageUrl} 
                                    alt={item.name}
                                    className="w-full h-48 object-cover rounded-lg mb-4"
                                />
                            )}
                            <div className="mb-4">
                                <h2 className="text-xl font-bold text-neutral-900 mb-2">{item.name}</h2>
                                <p className="text-neutral-600 text-sm mb-3">{item.description || 'No description'}</p>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-2xl font-bold text-primary-600">${item.price.toFixed(2)}</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        item.available 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {item.available ? 'Available' : 'Unavailable'}
                                    </span>
                                </div>
                                <p className="text-sm text-neutral-500">Category: <span className="font-medium">{item.category}</span></p>
                            </div>
                            <div className="flex gap-2 pt-4 border-t border-neutral-200">
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(item)}
                                    className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
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