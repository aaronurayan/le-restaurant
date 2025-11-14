import React, { useEffect, useState } from 'react';
import { useMenuManagementApi, MenuItem, MenuItemCreateRequest } from '../../hooks/useMenuManagementApi';
import toast from 'react-hot-toast';
import { ConfirmDialog } from '../molecules/ConfirmDialog';
import { useFormValidation, ValidationRules } from '../../hooks/useFormValidation';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { ErrorMessage } from '../molecules/ErrorMessage';
import { LoadingSpinner } from '../atoms/LoadingSpinner';

/**
 * Menu Management Panel Component (F103, F104)
 * Provides full CRUD interface for managing menu items
 * 
 * Features:
 * - View all menu items in a table
 * - Create new menu items (F104)
 * - Edit existing menu items (F104)
 * - Delete menu items with confirmation (F104)
 * - Search by name (F103)
 * - Filter by category (F103)
 * 
 * @author Le Restaurant Development Team
 */
interface MenuManagementPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const MenuManagementPanel: React.FC<MenuManagementPanelProps> = () => {
  const { 
    menuItems, 
    loading, 
    error, 
    fetchMenuItems, 
    createMenuItem, 
    updateMenuItem, 
    deleteMenuItem,
    fetchCategories
  } = useMenuManagementApi();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: number; name: string } | null>(null);
  
  const [formData, setFormData] = useState<MenuItemCreateRequest>({
    name: '',
    description: '',
    price: 0,
    category: '',
    available: true,
    imageUrl: ''
  });

  // Form validation
  const validationSchema = {
    name: [
      ValidationRules.required('Menu item name is required'),
      ValidationRules.minLength(2, 'Name must be at least 2 characters'),
      ValidationRules.maxLength(100, 'Name must be no more than 100 characters'),
    ],
    description: [
      ValidationRules.maxLength(500, 'Description must be no more than 500 characters'),
    ],
    price: [
      ValidationRules.required('Price is required'),
      ValidationRules.min(0.01, 'Price must be greater than 0'),
    ],
    category: [
      ValidationRules.required('Category is required'),
    ],
  };

  const { errors: validationErrors, validate, validateFieldRealTime, clearErrors: clearValidationErrors } = useFormValidation(validationSchema);
  
  // Error handling
  const { error: apiError, handleError, clearError } = useErrorHandler();
  
  // Load menu items and categories on mount
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      clearError();
      await fetchMenuItems();
      const cats = await fetchCategories();
      setCategories(cats);
    } catch (err) {
      handleError(err, 'Failed to load menu data');
    }
  };
  
  /**
   * HANDLE CREATE/UPDATE (F104)
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    clearValidationErrors();
    
    // Validate form using validation hook
    if (!validate(formData)) {
      // Validation errors are already set by validate()
      return;
    }
    
    try {
      if (editingItem) {
        await updateMenuItem(editingItem.id, formData);
        toast.success('Menu item updated successfully!');
      } else {
        await createMenuItem(formData);
        toast.success('Menu item created successfully!');
      }
      
      setIsModalOpen(false);
      setEditingItem(null);
      resetForm();
      clearValidationErrors();
      await fetchMenuItems();
    } catch (err) {
      handleError(err, 'Failed to save menu item');
    }
  };
  
  /**
   * HANDLE DELETE (F104)
   */
  const handleDelete = (id: number, name: string) => {
    setItemToDelete({ id, name });
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      clearError();
      await deleteMenuItem(itemToDelete.id);
      toast.success('Menu item deleted successfully!');
      await fetchMenuItems();
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    } catch (err) {
      handleError(err, 'Failed to delete menu item');
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setItemToDelete(null);
  };
  
  /**
   * HANDLE EDIT (F104)
   */
  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      available: item.available,
      imageUrl: item.imageUrl || ''
    });
    setIsModalOpen(true);
  };
  
  /**
   * RESET FORM
   */
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: '',
      available: true,
      imageUrl: ''
    });
    setEditingItem(null);
  };
  
  /**
   * FILTER MENU ITEMS (F103)
   */
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Menu Management</h1>
              <p className="text-orange-100 text-sm mt-1">F103 Menu Display & F104 Menu Management</p>
            </div>
          </div>
        </div>
        
        {/* CONTROLS */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-wrap gap-4 mb-4">
            {/* Search Input */}
            <input
              type="text"
              placeholder="🔍 Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              aria-label="Filter by category"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            
            {/* Add Button */}
            <button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-2 rounded-lg hover:from-orange-700 hover:to-red-700 transition-all shadow-md font-semibold"
            >
              + Add Menu Item
            </button>
          </div>
          
          {/* Stats */}
          <div className="flex gap-4 text-sm text-gray-600">
            <span>Total: <strong>{menuItems.length}</strong></span>
            <span>Filtered: <strong>{filteredItems.length}</strong></span>
            <span>Available: <strong>{menuItems.filter(i => i.available).length}</strong></span>
          </div>
        </div>
        
        {/* LOADING STATE */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" text="Loading menu items..." variant="primary" />
          </div>
        )}
        
        {/* ERROR STATE */}
        {(error || apiError) && (
          <div className="m-6">
            <ErrorMessage
              message={apiError?.message || error || 'An error occurred'}
              onRetry={apiError?.recoverable ? loadData : undefined}
              size="md"
            />
            {apiError?.suggestions && apiError.suggestions.length > 0 && (
              <div className="mt-2 text-sm text-neutral-600">
                <p className="font-medium mb-1">Suggestions:</p>
                <ul className="list-disc list-inside space-y-1">
                  {apiError.suggestions.map((suggestion, idx) => (
                    <li key={idx}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        {/* MENU ITEMS TABLE */}
        {!loading && !error && (
          <div className="p-6">
            {filteredItems.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <div className="text-6xl mb-4">🍽️</div>
                <p className="text-xl">No menu items found</p>
                <p className="text-sm mt-2">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border-b p-3 text-left font-semibold">Image</th>
                      <th className="border-b p-3 text-left font-semibold">Name</th>
                      <th className="border-b p-3 text-left font-semibold">Category</th>
                      <th className="border-b p-3 text-left font-semibold">Price</th>
                      <th className="border-b p-3 text-left font-semibold">Status</th>
                      <th className="border-b p-3 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map(item => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors border-b">
                        <td className="p-3">
                          {item.imageUrl ? (
                            <img 
                              src={item.imageUrl} 
                              alt={item.name} 
                              className="w-16 h-16 object-cover rounded-lg shadow-sm"
                              onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/64?text=No+Image';
                              }}
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                              🍽️
                            </div>
                          )}
                        </td>
                        <td className="p-3">
                          <div>
                            <div className="font-semibold">{item.name}</div>
                            <div className="text-sm text-gray-500 line-clamp-1">{item.description}</div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {item.category}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-green-600">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="p-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            item.available 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {item.available ? '✓ Available' : '✗ Unavailable'}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item.id, item.name)}
                              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        {/* CREATE/EDIT MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">
                {editingItem ? '✏️ Edit Menu Item' : '➕ Add New Menu Item'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setFormData({ ...formData, name: newValue });
                      validateFieldRealTime('name', newValue, formData);
                    }}
                    onBlur={() => validateFieldRealTime('name', formData.name, formData)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      validationErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Margherita Pizza"
                  />
                  {validationErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                  )}
                </div>
                
                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setFormData({ ...formData, description: newValue });
                      validateFieldRealTime('description', newValue, formData);
                    }}
                    onBlur={() => validateFieldRealTime('description', formData.description, formData)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      validationErrors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    rows={3}
                    placeholder="Describe the menu item..."
                  />
                  {validationErrors.description && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
                  )}
                </div>
                
                {/* Price and Category Row */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Price */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Price ($) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={formData.price}
                      onChange={(e) => {
                        const newValue = parseFloat(e.target.value) || 0;
                        setFormData({ ...formData, price: newValue });
                        validateFieldRealTime('price', newValue, formData);
                      }}
                      onBlur={() => validateFieldRealTime('price', formData.price, formData)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        validationErrors.price ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0.00"
                    />
                    {validationErrors.price && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.price}</p>
                    )}
                  </div>
                  
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      id="category-select"
                      value={formData.category}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setFormData({ ...formData, category: newValue });
                        validateFieldRealTime('category', newValue, formData);
                      }}
                      onBlur={() => validateFieldRealTime('category', formData.category, formData)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        validationErrors.category ? 'border-red-500' : 'border-gray-300'
                      }`}
                      aria-label="Select menu item category"
                    >
                      <option value="">Select Category</option>
                      <option value="STARTER">Starter</option>
                      <option value="MAIN">Main Course</option>
                      <option value="DESSERT">Dessert</option>
                      <option value="BEVERAGE">Beverage</option>
                    </select>
                    {validationErrors.category && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.category}</p>
                    )}
                  </div>
                </div>
                
                {/* Image URL */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.imageUrl && (
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      className="mt-2 w-32 h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                </div>
                
                {/* Available Checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="available-checkbox"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    className="mr-3 w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    aria-label="Menu item availability"
                  />
                  <label className="text-sm font-semibold text-gray-700">
                    Available for customers
                  </label>
                </div>
                
                {/* Buttons */}
                <div className="flex gap-3 mt-8 pt-6 border-t">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-lg hover:from-orange-700 hover:to-red-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : (editingItem ? 'Update Item' : 'Create Item')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Menu Item"
        message={
          itemToDelete
            ? `Are you sure you want to delete "${itemToDelete.name}"? This action cannot be undone.`
            : ''
        }
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="primary"
        loading={loading}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default MenuManagementPanel;
