'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Check } from 'lucide-react';
import { Product } from '@/types/product';

interface ProductFiltersProps {
  filter: string;
  onFilterChange: (filter: string) => void;
  totalProducts: number;
  currentRange: {
    start: number;
    end: number;
  };
  products: Product[];
}

export default function ProductFilters({
  filter,
  onFilterChange,
  totalProducts,
  currentRange,
  products
}: ProductFiltersProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Dynamically derive categories from products
  const availableCategories = useMemo(() => {
    const categories = Array.from(new Set(products.map(product => product.category)));
    return categories.sort();
  }, [products]);

  // Build filter options dynamically
  const filterOptions = useMemo(() => {
    const options = [
      {
        key: 'all',
        label: 'All Products',
        count: products.length
      }
    ];

    // Add category-specific filters
    availableCategories.forEach(category => {
      const categoryProducts = products.filter(p => p.category === category);
      if (categoryProducts.length > 0) {
        options.push({
          key: category,
          label: category.charAt(0).toUpperCase() + category.slice(1),
          count: categoryProducts.length
        });
      }
    });

    return options;
  }, [products, availableCategories]);

  const activeFilter = filterOptions.find(option => option.key === filter);

  const handleDropdownSelect = (selectedFilter: string) => {
    onFilterChange(selectedFilter);
    setIsDropdownOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-16 z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 pb-6 mb-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pt-6">
        {/* Mobile Dropdown */}
        <div className="block sm:hidden w-full relative">
          <motion.button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between bg-white border border-gray-200 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200"
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              <span className="font-medium text-gray-900">{activeFilter?.label}</span>
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 font-semibold">
                {activeFilter?.count}
              </span>
            </div>
            <motion.div
              animate={{ rotate: isDropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 z-50 overflow-hidden"
              >
                {filterOptions.map((option, index) => (
                  <motion.button
                    key={option.key}
                    onClick={() => handleDropdownSelect(option.key)}
                    className={`
                      w-full flex items-center justify-between px-4 py-3 text-left transition-colors duration-150
                      ${filter === option.key 
                        ? 'bg-black text-white' 
                        : 'bg-white text-gray-900 hover:bg-gray-50'
                      }
                    `}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-medium">{option.label}</span>
                      <span className={`
                        text-xs px-2 py-1 font-semibold
                        ${filter === option.key 
                          ? 'bg-white/20 text-white' 
                          : 'bg-gray-100 text-gray-600'
                        }
                      `}>
                        {option.count}
                      </span>
                    </div>
                    {filter === option.key && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Check className="h-4 w-4" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop Filter Buttons */}
        <div className="hidden sm:flex flex-wrap gap-3">
          {filterOptions.map((option, index) => (
            <motion.div
              key={option.key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
            >
              <Button
                variant={filter === option.key ? 'default' : 'outline'}
                onClick={() => onFilterChange(option.key)}
                className={`
                  relative overflow-hidden transition-all duration-300 ease-out
                  min-w-[120px] h-11 font-medium
                  ${filter === option.key 
                    ? 'bg-black text-white scale-105 border-black' 
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:scale-102'
                  }
                `}
              >
                <motion.div
                  className="flex items-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>{option.label}</span>
                  <motion.span
                    className={`
                      text-xs px-2 py-0.5 font-semibold
                      ${filter === option.key 
                        ? 'bg-white/20 text-white' 
                        : 'bg-gray-100 text-gray-600'
                      }
                    `}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    {option.count}
                  </motion.span>
                </motion.div>
                
                {/* Active indicator */}
                {filter === option.key && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                )}
              </Button>
            </motion.div>
          ))}
        </div>
        
        {/* Results Counter */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-sm text-gray-600 bg-gray-50 px-4 py-2 border w-full sm:w-auto text-center sm:text-left"
        >
          <motion.span
            key={`${currentRange.start}-${currentRange.end}-${totalProducts}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Showing <span className="font-semibold text-gray-900">{currentRange.start}-{currentRange.end}</span> of{' '}
            <span className="font-semibold text-gray-900">{totalProducts}</span> products
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
} 