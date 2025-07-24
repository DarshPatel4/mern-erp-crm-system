import React, { useState } from 'react';
import Sidebar from '../admin/components/Sidebar'; // Assuming Sidebar is in admin/components
import Header from '../admin/components/Header';   // Assuming Header is in admin/components
import SettingsCard from './components/SettingsCard';
import RolesPermissions from './components/RolesPermissions';

// Import icons for each setting card
import { FaShieldAlt, FaBuilding, FaBriefcase, FaEnvelope, FaPaintBrush, FaBell, FaDatabase, FaPalette } from 'react-icons/fa';

export default function SettingsPage() {
  // State to manage which settings section is currently active/selected
  const [activeSetting, setActiveSetting] = useState('roles-permissions'); // Default to Roles & Permissions

  // Define the settings cards data
  const settingsCards = [
    {
      id: 'roles-permissions',
      icon: <FaShieldAlt className="text-violet-500 text-2xl" />,
      title: 'Roles & Permissions',
      description: 'Manage user roles and access controls',
    },
    {
      id: 'department-management',
      icon: <FaBuilding className="text-blue-500 text-2xl" />,
      title: 'Department Management',
      description: 'Organize teams and departments',
    },
    {
      id: 'company-profile',
      icon: <FaBriefcase className="text-green-500 text-2xl" />,
      title: 'Company Profile',
      description: 'Update company information',
    },
    {
      id: 'email-sms-config',
      icon: <FaEnvelope className="text-yellow-500 text-2xl" />,
      title: 'Email & SMS Config',
      description: 'Configure messaging services',
    },
    {
      id: 'document-branding',
      icon: <FaPaintBrush className="text-red-500 text-2xl" />,
      title: 'Document Branding',
      description: 'Customize document appearance',
    },
    {
      id: 'notification-preferences',
      icon: <FaBell className="text-orange-500 text-2xl" />,
      title: 'Notification Preferences',
      description: 'Manage alert and notification settings',
    },
    {
      id: 'data-backup-restore',
      icon: <FaDatabase className="text-teal-500 text-2xl" />,
      title: 'Data Backup & Restore',
      description: 'Manage data backup options',
    },
    {
      id: 'theme-appearance',
      icon: <FaPalette className="text-pink-500 text-2xl" />,
      title: 'Theme & Appearance',
      description: 'Customize interface appearance',
    },
  ];

  // Function to handle opening modals/placeholders for other settings
  const handleOtherSettingsClick = (settingId) => {
    // For demonstration, we'll use simple alert popups.
    // In a real application, you would render specific modal components here.
    switch (settingId) {
      case 'department-management':
        alert('Department Management: This would open a modal to manage departments.');
        break;
      case 'company-profile':
        alert('Company Profile: This would open a modal to edit company details.');
        break;
      case 'email-sms-config':
        alert('Email & SMS Config: This would open a modal for email/SMS settings.');
        break;
      case 'document-branding':
        alert('Document Branding: This would open a modal to customize document templates.');
        break;
      case 'notification-preferences':
        alert('Notification Preferences: This would open a modal for notification settings.');
        break;
      case 'data-backup-restore':
        alert('Data Backup & Restore: This would open a modal for backup/restore options.');
        break;
      case 'theme-appearance':
        alert('Theme & Appearance: This would open a modal for theme customization.');
        break;
      default:
        // If it's 'roles-permissions', we handle it by setting activeSetting
        setActiveSetting(settingId);
        break;
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen h-screen">
      <div className="sticky top-0 left-0 h-screen z-30">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col min-h-screen h-screen">
        <div className="sticky top-0 z-20">
          <Header />
        </div>
        <main className="flex-1 p-8 bg-gray-50 overflow-y-auto h-[calc(100vh-80px)]">
          <div className="text-2xl font-bold text-gray-800 mb-2">Settings</div>
          <div className="text-gray-500 mb-6">Manage your ERP-CRM system configurations</div>

          {/* Settings Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {settingsCards.map((card) => (
              <SettingsCard
                key={card.id}
                id={card.id}
                icon={card.icon}
                title={card.title}
                description={card.description}
                isSelected={activeSetting === card.id}
                onClick={() => handleOtherSettingsClick(card.id)}
              />
            ))}
          </div>

          {/* Conditional Rendering for Active Setting Section */}
          {activeSetting === 'roles-permissions' && <RolesPermissions />}

          {/* Other settings sections would be rendered here conditionally as well,
              or handled by modals triggered by handleOtherSettingsClick */}

        </main>
      </div>
    </div>
  );
}
