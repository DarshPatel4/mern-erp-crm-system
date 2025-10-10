
const CompanyProfile = require('../models/CompanyProfile');

// Get company profile
exports.getCompanyProfile = async (req, res) => {
  try {
    let profile = await CompanyProfile.findOne();
    
    if (!profile) {
      // Create default profile if none exists
      profile = new CompanyProfile({
        name: 'Your Company Name',
        industry: 'Technology',
        foundedYear: new Date().getFullYear(),
        employeeCount: 0,
        description: 'Update your company description here',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        contact: {
          phone: '',
          email: '',
          website: ''
        },
        socialMedia: {
          linkedin: '',
          twitter: '',
          facebook: ''
        }
      });
      await profile.save();
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update company profile
exports.updateCompanyProfile = async (req, res) => {
  try {
    const updates = req.body;
    
    let profile = await CompanyProfile.findOne();
    
    if (!profile) {
      profile = new CompanyProfile(updates);
    } else {
      Object.assign(profile, updates);
    }
    
    const savedProfile = await profile.save();
    res.json(savedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload company logo
exports.uploadLogo = async (req, res) => {
  try {
    // In a real application, you would handle file upload here
    // For now, we'll just update the logo URL
    const { logoUrl } = req.body;
    
    let profile = await CompanyProfile.findOne();
    if (!profile) {
      profile = new CompanyProfile({ logo: logoUrl });
    } else {
      profile.logo = logoUrl;
    }
    
    const savedProfile = await profile.save();
    res.json(savedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 