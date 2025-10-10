import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { fetchThemeSettings, updateThemeSettings, resetThemeSettings } from '../../../services/settings';

export default function ThemeAppearanceModal({ onClose }) {
  const [theme, setTheme] = useState('light');
  const [primaryColor, setPrimaryColor] = useState('blue');
  const [fontSize, setFontSize] = useState(16);
  const [density, setDensity] = useState('comfortable');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load theme settings from database
  useEffect(() => {
    const loadThemeSettings = async () => {
      try {
        setLoading(true);
        const settings = await fetchThemeSettings();
        setTheme(settings.mode || 'light');
        setPrimaryColor(settings.primaryColor || '#6366f1');
        setFontSize(settings.fontSize || 14);
        setDensity(settings.interfaceDensity || 'comfortable');
      } catch (error) {
        console.error('Error loading theme settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadThemeSettings();
  }, []);

  const colors = [
    { name: 'blue', value: '#3B82F6', bg: 'bg-blue-500', border: 'border-blue-500' },
    { name: 'purple', value: '#8B5CF6', bg: 'bg-purple-500', border: 'border-purple-500' },
    { name: 'pink', value: '#EC4899', bg: 'bg-pink-500', border: 'border-pink-500' },
    { name: 'red', value: '#EF4444', bg: 'bg-red-500', border: 'border-red-500' },
    { name: 'orange', value: '#F97316', bg: 'bg-orange-500', border: 'border-orange-500' },
    { name: 'yellow', value: '#EAB308', bg: 'bg-yellow-500', border: 'border-yellow-500' },
    { name: 'green', value: '#10B981', bg: 'bg-green-500', border: 'border-green-500' },
    { name: 'light-blue', value: '#06B6D4', bg: 'bg-cyan-500', border: 'border-cyan-500' },
    { name: 'teal', value: '#14B8A6', bg: 'bg-teal-500', border: 'border-teal-500' }
  ];

  const handleSave = async () => {
    try {
      setSaving(true);
      const settingsData = {
        mode: theme,
        primaryColor: colors.find(c => c.name === primaryColor)?.value || primaryColor,
        fontSize: fontSize,
        interfaceDensity: density
      };

      await updateThemeSettings(settingsData);
      
      // Apply theme changes to DOM
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.style.setProperty('--primary-color', settingsData.primaryColor);
      document.documentElement.style.setProperty('--font-size', `${fontSize}px`);
      
      // Apply dark/light mode class to body and html
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        document.body.classList.add('dark');
        document.body.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
        document.body.classList.add('light');
        document.body.classList.remove('dark');
      }
      
      // Store in localStorage for persistence
      localStorage.setItem('theme-settings', JSON.stringify(settingsData));
      
      onClose();
    } catch (error) {
      console.error('Error saving theme settings:', error);
      alert('Failed to save theme settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      setSaving(true);
      await resetThemeSettings();
      
      // Reset local state
      setTheme('light');
      setPrimaryColor('blue');
      setFontSize(14);
      setDensity('comfortable');
      
      // Apply reset to DOM
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.style.setProperty('--primary-color', '#6366f1');
      document.documentElement.style.setProperty('--font-size', '14px');
      
      // Apply light mode classes
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      document.body.classList.add('light');
      document.body.classList.remove('dark');
      
      // Clear localStorage
      localStorage.removeItem('theme-settings');
    } catch (error) {
      console.error('Error resetting theme settings:', error);
      alert('Failed to reset theme settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Theme & Appearance</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Theme Mode */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Theme Mode</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setTheme('light')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme === 'light'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="bg-white border rounded-lg p-3 mb-2">
                  <div className="bg-blue-500 h-2 rounded mb-2"></div>
                  <div className="space-y-1">
                    <div className="h-2 bg-gray-200 rounded"></div>
                    <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
                <span className="font-medium text-gray-900">Light</span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme === 'dark'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 mb-2">
                  <div className="bg-blue-600 h-2 rounded mb-2"></div>
                  <div className="space-y-1">
                    <div className="h-2 bg-gray-600 rounded"></div>
                    <div className="h-2 bg-gray-600 rounded w-3/4"></div>
                  </div>
                </div>
                <span className="font-medium text-gray-900">Dark</span>
              </button>
            </div>
          </div>

          {/* Primary Color */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Primary Color</h3>
            <div className="flex gap-3 flex-wrap">
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setPrimaryColor(color.name)}
                  className={`w-10 h-10 rounded-full ${color.bg} border-2 transition-all ${
                    primaryColor === color.name ? 'border-gray-900 scale-110' : 'border-white hover:scale-105'
                  }`}
                ></button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Font Size</h3>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">A</span>
              <input
                type="range"
                min="12"
                max="24"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="text-lg text-gray-600">A</span>
              <span className="text-sm text-gray-500 min-w-[3rem]">{fontSize}px</span>
            </div>
          </div>

          {/* Interface Density */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Interface Density</h3>
            <div className="grid grid-cols-3 gap-3">
              {['compact', 'default', 'comfortable'].map((option) => (
                <button
                  key={option}
                  onClick={() => setDensity(option)}
                  className={`py-3 px-4 rounded-lg border-2 transition-all capitalize ${
                    density === option
                      ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
            <div className={`p-4 rounded-lg border ${
              theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Sample Card</h4>
                <button className={`px-3 py-1 rounded text-sm font-medium ${
                  theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                }`}>
                  Action
                </button>
              </div>
              <div className="space-y-2">
                <div className={`h-2 rounded ${
                  theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
                }`}></div>
                <div className={`h-2 rounded w-3/4 ${
                  theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
                }`}></div>
                <div className={`h-2 rounded w-1/2 ${
                  theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
                }`}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <button
            onClick={handleReset}
            disabled={saving}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Resetting...' : 'Reset to Default'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
} 