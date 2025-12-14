import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import '../styles/components.css';

const SettingsPanel = ({ onClose }) => {
  const { settings, updateSettings } = useApp();
  const [localSettings, setLocalSettings] = useState(settings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const dietaryOptions = [
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Dairy-Free',
    'Nut-Free',
    'Low-Carb',
    'Keto',
    'Paleo'
  ];

  const cuisineOptions = [
    'Indian',
    'Italian',
    'Chinese',
    'Mexican',
    'Thai',
    'Japanese',
    'American',
    'Mediterranean',
    'French',
    'Korean'
  ];

  const difficultyOptions = [
    { value: '', label: 'Any' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const handleDietaryToggle = (option) => {
    const current = localSettings.dietary_restrictions || [];
    const updated = current.includes(option)
      ? current.filter(item => item !== option)
      : [...current, option];
    setLocalSettings({ ...localSettings, dietary_restrictions: updated });
  };

  const handleCuisineToggle = (option) => {
    const current = localSettings.cuisine_types || [];
    const updated = current.includes(option)
      ? current.filter(item => item !== option)
      : [...current, option];
    setLocalSettings({ ...localSettings, cuisine_types: updated });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateSettings(localSettings);
      onClose();
    } catch (error) {
      alert('Failed to save settings. Please try again.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2 className="settings-title">⚙️ Advanced Settings</h2>
          <button 
            className="settings-close-btn"
            onClick={onClose}
            aria-label="Close settings"
          >
            ×
          </button>
        </div>

        <div className="settings-body">
          <div className="settings-section">
            <h3 className="settings-section-title">Dietary Restrictions</h3>
            <p className="settings-section-description">
              Select any dietary restrictions or preferences
            </p>
            <div className="settings-options-grid">
              {dietaryOptions.map(option => (
                <label key={option} className="settings-option">
                  <input
                    type="checkbox"
                    checked={(localSettings.dietary_restrictions || []).includes(option)}
                    onChange={() => handleDietaryToggle(option)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="settings-section">
            <h3 className="settings-section-title">Preferred Cuisines</h3>
            <p className="settings-section-description">
              Select your favorite cuisine types
            </p>
            <div className="settings-options-grid">
              {cuisineOptions.map(option => (
                <label key={option} className="settings-option">
                  <input
                    type="checkbox"
                    checked={(localSettings.cuisine_types || []).includes(option)}
                    onChange={() => handleCuisineToggle(option)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="settings-section">
            <h3 className="settings-section-title">Cooking Preferences</h3>
            
            <div className="settings-field">
              <label htmlFor="max-time" className="settings-field-label">
                Maximum Cooking Time (minutes)
              </label>
              <input
                id="max-time"
                type="number"
                min="5"
                max="180"
                step="5"
                value={localSettings.max_cooking_time || ''}
                onChange={(e) => setLocalSettings({
                  ...localSettings,
                  max_cooking_time: e.target.value ? parseInt(e.target.value) : null
                })}
                placeholder="e.g., 30"
                className="settings-input"
              />
            </div>

            <div className="settings-field">
              <label htmlFor="difficulty" className="settings-field-label">
                Preferred Difficulty Level
              </label>
              <select
                id="difficulty"
                value={localSettings.difficulty_preference || ''}
                onChange={(e) => setLocalSettings({
                  ...localSettings,
                  difficulty_preference: e.target.value || null
                })}
                className="settings-select"
              >
                {difficultyOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <button 
            className="btn btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;

