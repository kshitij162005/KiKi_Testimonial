import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { cn } from '../../../lib/utils';
import Button from '../Button/Button';
import './SearchInput.css';

const SearchInput = ({
  onSearch,
  placeholder = 'Search...',
  debounceMs = 300,
  filters = [],
  selectedFilters = [],
  onFilterChange,
  showFilters = false,
  className,
  disabled = false,
  autoFocus = false
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch?.(searchValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchValue, debounceMs, onSearch]);

  // Auto focus effect
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleClear = () => {
    setSearchValue('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      if (searchValue) {
        handleClear();
      } else {
        inputRef.current?.blur();
      }
    }
  };

  const handleFilterToggle = (filterId) => {
    if (!onFilterChange) return;
    
    const newFilters = selectedFilters.includes(filterId)
      ? selectedFilters.filter(id => id !== filterId)
      : [...selectedFilters, filterId];
    
    onFilterChange(newFilters);
  };

  const activeFiltersCount = selectedFilters?.length || 0;

  return (
    <div className={cn('search-input-container', className)}>
      <div className="search-input-wrapper">
        <div className="search-input-icon">
          <Search className="w-4 h-4" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'search-input',
            {
              'search-input-disabled': disabled,
              'search-input-with-filters': showFilters
            }
          )}
        />
        
        {searchValue && (
          <button
            onClick={handleClear}
            className="search-input-clear"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        
        {showFilters && filters.length > 0 && (
          <div className="search-input-filter-container" ref={dropdownRef}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className={cn(
                'search-input-filter-button',
                {
                  'search-input-filter-active': activeFiltersCount > 0
                }
              )}
            >
              <Filter className="w-4 h-4" />
              {activeFiltersCount > 0 && (
                <span className="search-input-filter-badge">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
            
            {showFilterDropdown && (
              <div className="search-input-filter-dropdown">
                <div className="search-input-filter-header">
                  <span className="text-sm font-medium text-gray-200">Filters</span>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={() => onFilterChange?.([])}
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                
                <div className="search-input-filter-list">
                  {filters.map((filter) => (
                    <label
                      key={filter.id}
                      className="search-input-filter-item"
                    >
                      <input
                        type="checkbox"
                        checked={selectedFilters.includes(filter.id)}
                        onChange={() => handleFilterToggle(filter.id)}
                        className="search-input-filter-checkbox"
                      />
                      <span className="search-input-filter-label">
                        {filter.label}
                      </span>
                      {filter.count !== undefined && (
                        <span className="search-input-filter-count">
                          {filter.count}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {activeFiltersCount > 0 && (
        <div className="search-input-active-filters">
          {selectedFilters.map((filterId) => {
            const filter = filters.find(f => f.id === filterId);
            if (!filter) return null;
            
            return (
              <span
                key={filterId}
                className="search-input-active-filter-tag"
              >
                {filter.label}
                <button
                  onClick={() => handleFilterToggle(filterId)}
                  className="search-input-active-filter-remove"
                  aria-label={`Remove ${filter.label} filter`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchInput;