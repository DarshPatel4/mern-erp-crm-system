const ThemeSettings = require('../models/ThemeSettings');

// Get theme settings
exports.getThemeSettings = async (req, res) => {
  try {
    let settings = await ThemeSettings.findOne();
    
    if (!settings) {
      // Create default settings if none exists
      settings = new ThemeSettings({
        mode: 'light',
        primaryColor: '#6366f1',
        secondaryColor: '#f3f4f6',
        accentColor: '#8b5cf6',
        fontSize: 14,
        interfaceDensity: 'comfortable',
        fontFamily: 'Inter',
        borderRadius: 8,
        shadows: true,
        animations: true
      });
      await settings.save();
    }
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update theme settings
exports.updateThemeSettings = async (req, res) => {
  try {
    const updates = req.body;
    
    let settings = await ThemeSettings.findOne();
    
    if (!settings) {
      settings = new ThemeSettings(updates);
    } else {
      Object.assign(settings, updates);
    }
    
    const savedSettings = await settings.save();
    res.json(savedSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset theme settings to default
exports.resetThemeSettings = async (req, res) => {
  try {
    let settings = await ThemeSettings.findOne();
    
    if (!settings) {
      settings = new ThemeSettings();
    }
    
    // Reset to default values
    settings.mode = 'light';
    settings.primaryColor = '#6366f1';
    settings.secondaryColor = '#f3f4f6';
    settings.accentColor = '#8b5cf6';
    settings.fontSize = 14;
    settings.interfaceDensity = 'comfortable';
    settings.fontFamily = 'Inter';
    settings.borderRadius = 8;
    settings.shadows = true;
    settings.animations = true;
    
    const savedSettings = await settings.save();
    res.json(savedSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 