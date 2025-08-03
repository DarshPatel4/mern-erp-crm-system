import { useState } from 'react';
import { FaTimes, FaUpload, FaEye, FaDownload, FaPalette } from 'react-icons/fa';

export default function DocumentBrandingModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('logos');
  const [logos, setLogos] = useState({
    primary: null,
    secondary: null,
    favicon: null
  });
  const [headerFooter, setHeaderFooter] = useState({
    header: {
      enabled: true,
      logo: true,
      companyName: true,
      contactInfo: false
    },
    footer: {
      enabled: true,
      logo: false,
      companyName: true,
      contactInfo: true,
      socialLinks: false
    }
  });
  const [documentSettings, setDocumentSettings] = useState({
    pageSize: 'A4',
    orientation: 'portrait',
    margins: 'normal',
    fontFamily: 'Arial',
    fontSize: '12',
    primaryColor: '#3B82F6',
    secondaryColor: '#6B7280'
  });

  const [logoPreviews, setLogoPreviews] = useState({});

  const handleLogoUpload = (type, file) => {
    if (file) {
      setLogos(prev => ({ ...prev, [type]: file }));
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreviews(prev => ({ ...prev, [type]: e.target.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleHeaderFooterChange = (section, field, value) => {
    setHeaderFooter(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleDocumentSettingChange = (field, value) => {
    setDocumentSettings(prev => ({ ...prev, [field]: value }));
  };

  const handlePreview = () => {
    // Handle preview logic
    console.log('Preview document with current settings');
  };

  const handleSave = () => {
    // Handle save logic
    console.log('Saving branding settings:', { logos, headerFooter, documentSettings });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Document Branding</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('logos')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'logos'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FaUpload size={16} />
              Logos
            </button>
            <button
              onClick={() => setActiveTab('header-footer')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'header-footer'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FaEye size={16} />
              Header & Footer
            </button>
            <button
              onClick={() => setActiveTab('document-settings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'document-settings'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FaPalette size={16} />
              Document Settings
            </button>
          </div>

          {/* Logos Tab */}
          {activeTab === 'logos' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { key: 'primary', label: 'Primary Logo', description: 'Main company logo for documents' },
                  { key: 'secondary', label: 'Secondary Logo', description: 'Alternative logo for specific documents' },
                  { key: 'favicon', label: 'Favicon', description: 'Small icon for web documents' }
                ].map((logo) => (
                  <div key={logo.key} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">{logo.label}</h3>
                    <p className="text-sm text-gray-600 mb-4">{logo.description}</p>
                    <div className="space-y-3">
                      <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                        {logoPreviews[logo.key] ? (
                          <img src={logoPreviews[logo.key]} alt={`${logo.label} preview`} className="max-w-full max-h-full object-contain" />
                        ) : (
                          <FaUpload className="text-gray-400" size={24} />
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLogoUpload(logo.key, e.target.files[0])}
                        className="hidden"
                        id={`${logo.key}-upload`}
                      />
                      <label
                        htmlFor={`${logo.key}-upload`}
                        className="block w-full px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer text-center font-medium"
                      >
                        Upload {logo.label}
                      </label>
                      <p className="text-xs text-gray-500 text-center">
                        PNG, JPG up to 2MB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Header & Footer Tab */}
          {activeTab === 'header-footer' && (
            <div className="space-y-6">
              {/* Header Settings */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Header Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Enable Header</span>
                    <input
                      type="checkbox"
                      checked={headerFooter.header.enabled}
                      onChange={(e) => handleHeaderFooterChange('header', 'enabled', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  {headerFooter.header.enabled && (
                    <div className="space-y-3 pl-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Show Logo</span>
                        <input
                          type="checkbox"
                          checked={headerFooter.header.logo}
                          onChange={(e) => handleHeaderFooterChange('header', 'logo', e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Show Company Name</span>
                        <input
                          type="checkbox"
                          checked={headerFooter.header.companyName}
                          onChange={(e) => handleHeaderFooterChange('header', 'companyName', e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Show Contact Info</span>
                        <input
                          type="checkbox"
                          checked={headerFooter.header.contactInfo}
                          onChange={(e) => handleHeaderFooterChange('header', 'contactInfo', e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Settings */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Footer Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Enable Footer</span>
                    <input
                      type="checkbox"
                      checked={headerFooter.footer.enabled}
                      onChange={(e) => handleHeaderFooterChange('footer', 'enabled', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  {headerFooter.footer.enabled && (
                    <div className="space-y-3 pl-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Show Logo</span>
                        <input
                          type="checkbox"
                          checked={headerFooter.footer.logo}
                          onChange={(e) => handleHeaderFooterChange('footer', 'logo', e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Show Company Name</span>
                        <input
                          type="checkbox"
                          checked={headerFooter.footer.companyName}
                          onChange={(e) => handleHeaderFooterChange('footer', 'companyName', e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Show Contact Info</span>
                        <input
                          type="checkbox"
                          checked={headerFooter.footer.contactInfo}
                          onChange={(e) => handleHeaderFooterChange('footer', 'contactInfo', e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Show Social Links</span>
                        <input
                          type="checkbox"
                          checked={headerFooter.footer.socialLinks}
                          onChange={(e) => handleHeaderFooterChange('footer', 'socialLinks', e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Document Settings Tab */}
          {activeTab === 'document-settings' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Page Size</label>
                  <select
                    value={documentSettings.pageSize}
                    onChange={(e) => handleDocumentSettingChange('pageSize', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="A4">A4</option>
                    <option value="A3">A3</option>
                    <option value="Letter">Letter</option>
                    <option value="Legal">Legal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Orientation</label>
                  <select
                    value={documentSettings.orientation}
                    onChange={(e) => handleDocumentSettingChange('orientation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Margins</label>
                  <select
                    value={documentSettings.margins}
                    onChange={(e) => handleDocumentSettingChange('margins', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="normal">Normal</option>
                    <option value="narrow">Narrow</option>
                    <option value="wide">Wide</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                  <select
                    value={documentSettings.fontFamily}
                    onChange={(e) => handleDocumentSettingChange('fontFamily', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Arial">Arial</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Calibri">Calibri</option>
                    <option value="Helvetica">Helvetica</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                  <select
                    value={documentSettings.fontSize}
                    onChange={(e) => handleDocumentSettingChange('fontSize', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="10">10pt</option>
                    <option value="11">11pt</option>
                    <option value="12">12pt</option>
                    <option value="14">14pt</option>
                    <option value="16">16pt</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                  <input
                    type="color"
                    value={documentSettings.primaryColor}
                    onChange={(e) => handleDocumentSettingChange('primaryColor', e.target.value)}
                    className="w-full h-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                  <input
                    type="color"
                    value={documentSettings.secondaryColor}
                    onChange={(e) => handleDocumentSettingChange('secondaryColor', e.target.value)}
                    className="w-full h-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={handlePreview}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
          >
            Preview
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
} 