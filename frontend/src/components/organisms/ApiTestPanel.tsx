import React, { useState } from 'react';
import { Button } from '../atoms/Button';
import { useMenuApi, useApiHealth } from '../../hooks/useApi';
import { MenuItem } from '../../types';

const ApiTestPanel: React.FC = () => {
  const { 
    data: menuItems, 
    loading, 
    error, 
    categories,
    fetchAllItems, 
    fetchItemsByCategory,
    searchItems 
  } = useMenuApi();
  
  const { isBackendHealthy, checkBackendStatus } = useApiHealth();
  
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const handleSearch = () => {
    if (searchKeyword.trim()) {
      searchItems(searchKeyword);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category) {
      fetchItemsByCategory(category);
    } else {
      fetchAllItems();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">API Test Panel</h2>
        <p className="text-neutral-600">백엔드 API 연결을 테스트하고 메뉴 데이터를 확인할 수 있습니다.</p>
      </div>

      {/* Backend Status */}
      <div className="mb-6 p-4 bg-neutral-50 rounded-lg">
        <h3 className="text-lg font-semibold text-neutral-900 mb-3">Backend Status</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-neutral-600">Status:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              isBackendHealthy 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {isBackendHealthy ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={checkBackendStatus}
            disabled={loading}
          >
            Refresh Status
          </Button>
        </div>
      </div>

      {/* API Controls */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Search Menu Items
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Enter keyword..."
              className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Button 
              variant="primary" 
              size="sm" 
              onClick={handleSearch}
              disabled={!searchKeyword.trim() || loading}
            >
              Search
            </Button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Filter by Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <Button 
            variant="secondary" 
            onClick={fetchAllItems}
            disabled={loading}
            className="w-full"
          >
            Load All Items
          </Button>
        </div>
      </div>

      {/* Results */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">Results</h3>
          {loading && (
            <div className="flex items-center space-x-2 text-blue-600">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Loading...</span>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
            <p className="text-red-800 text-sm">Error: {error}</p>
          </div>
        )}

        {menuItems && menuItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menuItems.map((item: MenuItem) => (
              <div key={item.id} className="border border-neutral-200 rounded-lg p-4">
                <h4 className="font-semibold text-neutral-900 mb-2">{item.name}</h4>
                <p className="text-sm text-neutral-600 mb-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary-600">
                    ${item.price.toFixed(2)}
                  </span>
                  <span className="text-xs px-2 py-1 bg-neutral-100 text-neutral-600 rounded">
                    {item.categoryId}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-neutral-500">
            {loading ? 'Loading menu items...' : 'No menu items found. Try loading data or searching.'}
          </div>
        )}
      </div>

      {/* API Info */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">API Information</h3>
        <div className="text-sm text-blue-800 space-y-1">
          <p><strong>Base URL:</strong> http://localhost:8080/api</p>
          <p><strong>Endpoints:</strong> /menu/items, /menu/categories, /menu/search</p>
          <p><strong>Status:</strong> {isBackendHealthy ? 'Backend is running and accessible' : 'Backend is not accessible'}</p>
        </div>
      </div>
    </div>
  );
};

export default ApiTestPanel;
