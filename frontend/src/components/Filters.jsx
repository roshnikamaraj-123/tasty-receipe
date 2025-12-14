import React from 'react';
import { useApp } from '../context/AppContext';
import '../styles/components.css';

const Filters = () => {
  const { filters, updateFilters } = useApp();

  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'];
  const difficulties = ['All', 'beginner', 'intermediate', 'advanced'];
  const timeOptions = [
    { value: '', label: 'Any time' },
    { value: '15', label: '≤ 15 min' },
    { value: '30', label: '≤ 30 min' },
    { value: '45', label: '≤ 45 min' },
    { value: '60', label: '≤ 60 min' }
  ];

  const handleSearchChange = (e) => {
    updateFilters({ search: e.target.value });
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value === 'All' ? '' : e.target.value;
    updateFilters({ category: value });
  };

  const handleDifficultyChange = (e) => {
    const value = e.target.value === 'All' ? '' : e.target.value;
    updateFilters({ difficulty: value });
  };

  const handleTimeChange = (e) => {
    updateFilters({ maxTime: e.target.value });
  };

  const clearFilters = () => {
    updateFilters({
      search: '',
      category: '',
      difficulty: '',
      maxTime: ''
    });
  };

  const hasActiveFilters = filters.search || filters.category || filters.difficulty || filters.maxTime;

  return (
    <div className="filters-container">
      <div className="filters-header">
        <h2 className="filters-title">Find Your Recipe</h2>
        {hasActiveFilters && (
          <button className="btn btn-ghost clear-filters-btn" onClick={clearFilters}>
            Clear Filters
          </button>
        )}
      </div>

      <div className="filters-grid">
        <div className="filter-group">
          <label htmlFor="search" className="filter-label">🔍 Search</label>
          <input
            id="search"
            type="text"
            className="filter-input"
            placeholder="Search by name, ingredient, or tag..."
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="category" className="filter-label">📂 Category</label>
          <select
            id="category"
            className="filter-select"
            value={filters.category || 'All'}
            onChange={handleCategoryChange}
          >
            {categories.map(cat => (
              <option key={cat} value={cat === 'All' ? '' : cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="difficulty" className="filter-label">⭐ Difficulty</label>
          <select
            id="difficulty"
            className="filter-select"
            value={filters.difficulty || 'All'}
            onChange={handleDifficultyChange}
          >
            {difficulties.map(diff => (
              <option key={diff} value={diff === 'All' ? '' : diff}>
                {diff === 'All' ? diff : diff.charAt(0).toUpperCase() + diff.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="time" className="filter-label">⏱️ Max Time</label>
          <select
            id="time"
            className="filter-select"
            value={filters.maxTime}
            onChange={handleTimeChange}
          >
            {timeOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="quick-filters">
        <span className="quick-filters-label">Quick Filters:</span>
        <button
          className={`quick-filter-btn ${filters.maxTime === '30' ? 'active' : ''}`}
          onClick={() => updateFilters({ maxTime: filters.maxTime === '30' ? '' : '30' })}
        >
          ⚡ Quick (≤30 min)
        </button>
        <button
          className={`quick-filter-btn ${filters.difficulty === 'beginner' ? 'active' : ''}`}
          onClick={() => updateFilters({ difficulty: filters.difficulty === 'beginner' ? '' : 'beginner' })}
        >
          🎯 Beginner Friendly
        </button>
      </div>
    </div>
  );
};

export default Filters;

