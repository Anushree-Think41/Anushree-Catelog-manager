import React, { useEffect } from 'react';
import { useProductStore } from '../store/productStore';

const Filters: React.FC = () => {
  const { filters, setCategory, setPriceRange, addTag, removeTag, clearFilters, availableCategories, availableTags, fetchFilterOptions } = useProductStore();

  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceRange(Number(e.target.value), filters.priceRange.max);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceRange(filters.priceRange.min, Number(e.target.value));
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      addTag(value);
    } else {
      removeTag(value);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button className="text-blue-600 text-sm" onClick={clearFilters}>Clear All</button>
      </div>

      {/* Category */}
      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          id="category"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.category}
          onChange={handleCategoryChange}
        >
          <option value="All Categories">All Categories</option>
          {availableCategories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="Min"
            className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.priceRange.min}
            onChange={handleMinPriceChange}
          />
          <input
            type="number"
            placeholder="Max"
            className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.priceRange.max}
            onChange={handleMaxPriceChange}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">$0 - $1000</p>
      </div>

      {/* Tags */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
        <div className="space-y-2">
          {availableTags.map((tag) => (
            <label key={tag} className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                value={tag}
                checked={filters.tags.includes(tag)}
                onChange={handleTagChange}
              />
              <span className="ml-2 text-sm text-gray-700">{tag}</span>
            </label>
          ))}
        </div>
      </div>

      
    </div>
  );
};

export default Filters;
