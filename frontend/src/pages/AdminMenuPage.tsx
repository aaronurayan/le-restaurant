import React, { useState } from 'react';
import { useAdminMenuApi } from '../hooks/useAdminMenuApi';
import MenuItemForm from '../components/admin/MenuItemForm';
import ConfirmDelete from '../components/admin/ConfirmDelete';
import { MenuItem } from '../types/menu';

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
    };

    // Confirm deletion
    const confirmDelete = async () => {
        if (selectedItem) {
            await deleteItem(selectedItem.id);
            setIsDeleteConfirmOpen(false);
            setSelectedItem(null);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Menu Management</h1>
                <button
                    onClick={handleAddNew}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Add New Item
                </button>
            </div>

            {/* List of Menu Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuItems.map((item) => (
                    <div key={item.id} className="border p-4 rounded shadow">
                        <h2 className="font-bold">{item.name}</h2>
                        <p>{item.description}</p>
                        <p className="text-green-700 font-semibold">${item.price}</p>
                        <p className="text-sm text-gray-500">Category: {item.category}</p>
                        <p className="text-sm">{item.available ? 'Available' : 'Unavailable'}</p>
                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={() => handleEdit(item)}
                                className="bg-yellow-500 text-white px-2 py-1 rounded"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(item)}
                                className="bg-red-500 text-white px-2 py-1 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

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