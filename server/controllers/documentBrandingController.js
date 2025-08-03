const DocumentBranding = require('../models/DocumentBranding');

// Get document branding settings
exports.getDocumentBranding = async (req, res) => {
  try {
    let branding = await DocumentBranding.findOne();
    
    if (!branding) {
      // Create default branding if none exists
      branding = new DocumentBranding({
        logos: {
          primary: '',
          secondary: '',
          favicon: ''
        },
        header: {
          showLogo: true,
          showCompanyName: true,
          showContactInfo: true,
          showSocialLinks: false
        },
        footer: {
          showLogo: true,
          showCompanyName: true,
          showContactInfo: true,
          showSocialLinks: false
        },
        documentSettings: {
          pageSize: 'A4',
          orientation: 'portrait',
          margins: 20,
          fontFamily: 'Arial',
          fontSize: 12,
          primaryColor: '#6366f1',
          secondaryColor: '#f3f4f6'
        }
      });
      await branding.save();
    }
    
    res.json(branding);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update document branding settings
exports.updateDocumentBranding = async (req, res) => {
  try {
    const updates = req.body;
    
    let branding = await DocumentBranding.findOne();
    
    if (!branding) {
      branding = new DocumentBranding(updates);
    } else {
      Object.assign(branding, updates);
    }
    
    const savedBranding = await branding.save();
    res.json(savedBranding);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload logo
exports.uploadLogo = async (req, res) => {
  try {
    const { logoType, logoUrl } = req.body;
    
    let branding = await DocumentBranding.findOne();
    if (!branding) {
      branding = new DocumentBranding();
    }
    
    if (logoType === 'primary') {
      branding.logos.primary = logoUrl;
    } else if (logoType === 'secondary') {
      branding.logos.secondary = logoUrl;
    } else if (logoType === 'favicon') {
      branding.logos.favicon = logoUrl;
    }
    
    const savedBranding = await branding.save();
    res.json(savedBranding);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 