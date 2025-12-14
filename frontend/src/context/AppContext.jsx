import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    maxTime: '',
    difficulty: '',
    dietaryRestrictions: [],
    cuisineTypes: []
  });
  const [settings, setSettings] = useState({
    dietary_restrictions: [],
    cuisine_types: [],
    max_cooking_time: null,
    difficulty_preference: null,
    theme: 'default'
  });

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Load recipes
  useEffect(() => {
    loadRecipes();
  }, [filters]);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getRecipes(filters);
      setRecipes(data);
      setFilteredRecipes(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const data = await api.getSettings();
      setSettings(data);
      // Apply settings to filters
      setFilters(prev => ({
        ...prev,
        dietaryRestrictions: data.dietary_restrictions || [],
        cuisineTypes: data.cuisine_types || [],
        maxTime: data.max_cooking_time || '',
        difficulty: data.difficulty_preference || ''
      }));
    } catch (err) {
      console.error('Error loading settings:', err);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      await api.updateSettings(newSettings);
      setSettings(newSettings);
      // Update filters based on new settings
      setFilters(prev => ({
        ...prev,
        dietaryRestrictions: newSettings.dietary_restrictions || [],
        cuisineTypes: newSettings.cuisine_types || [],
        maxTime: newSettings.max_cooking_time || '',
        difficulty: newSettings.difficulty_preference || ''
      }));
      // Reload recipes with new filters
      await loadRecipes();
    } catch (err) {
      console.error('Error updating settings:', err);
      throw err;
    }
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const value = {
    recipes,
    filteredRecipes,
    loading,
    error,
    filters,
    settings,
    updateFilters,
    updateSettings,
    loadRecipes,
    loadSettings
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

