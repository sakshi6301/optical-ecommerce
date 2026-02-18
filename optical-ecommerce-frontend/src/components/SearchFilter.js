import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ChevronDown } from 'lucide-react';

const SearchFilter = ({ filters, onFilterChange, categories = [] }) => {
  const [showFilters, setShowFilters] = useState(false);
  
  const defaultCategories = [
    { value: '', label: 'All Categories' },
    { value: 'frames', label: 'Frames' },
    { value: 'sunglasses', label: 'Sunglasses' },
    { value: 'lenses', label: 'Lenses' },
    { value: 'contact-lenses', label: 'Contact Lenses' }
  ];

  const priceRanges = [
    { value: '', label: 'Any Price' },
    { value: '0-50', label: 'Under ₹50' },
    { value: '50-100', label: '₹50 - ₹100' },
    { value: '100-200', label: '₹100 - ₹200' },
    { value: '200-500', label: '₹200 - ₹500' },
    { value: '500+', label: 'Above ₹500' }
  ];

  const brands = [
    { value: '', label: 'All Brands' },
    { value: 'ray-ban', label: 'Ray-Ban' },
    { value: 'oakley', label: 'Oakley' },
    { value: 'warby-parker', label: 'Warby Parker' },
    { value: 'tom-ford', label: 'Tom Ford' },
    { value: 'persol', label: 'Persol' },
    { value: 'maui-jim', label: 'Maui Jim' }
  ];

  const categoriesToUse = categories.length > 0 ? categories : defaultCategories;
  
  const clearFilters = () => {
    onFilterChange('search', '');
    onFilterChange('category', '');
    onFilterChange('priceRange', '');
    onFilterChange('brand', '');
  };

  const hasActiveFilters = filters.search || filters.category || filters.priceRange || filters.brand;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {/* Search Bar */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search for eyewear, brands, styles..."
          value={filters.search || ''}
          onChange={(e) => onFilterChange('search', e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <Filter size={18} />
          <span>Filters</span>
          <ChevronDown 
            size={16} 
            className={`transform transition-transform ${
              showFilters ? 'rotate-180' : ''
            }`} 
          />
        </button>
        
        {hasActiveFilters && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={clearFilters}
            className="flex items-center gap-2 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X size={14} />
            Clear All
          </motion.button>
        )}
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category || ''}
                  onChange={(e) => onFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {categoriesToUse.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <select
                  value={filters.priceRange || ''}
                  onChange={(e) => onFilterChange('priceRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {priceRanges.map(range => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <select
                  value={filters.brand || ''}
                  onChange={(e) => onFilterChange('brand', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {brands.map(brand => (
                    <option key={brand.value} value={brand.value}>
                      {brand.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200"
        >
          {filters.search && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
              Search: "{filters.search}"
              <button 
                onClick={() => onFilterChange('search', '')}
                className="ml-1 hover:bg-orange-200 rounded-full p-0.5"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {filters.category && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              {categoriesToUse.find(c => c.value === filters.category)?.label}
              <button 
                onClick={() => onFilterChange('category', '')}
                className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {filters.priceRange && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
              {priceRanges.find(p => p.value === filters.priceRange)?.label}
              <button 
                onClick={() => onFilterChange('priceRange', '')}
                className="ml-1 hover:bg-green-200 rounded-full p-0.5"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {filters.brand && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
              {brands.find(b => b.value === filters.brand)?.label}
              <button 
                onClick={() => onFilterChange('brand', '')}
                className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
              >
                <X size={12} />
              </button>
            </span>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default SearchFilter;