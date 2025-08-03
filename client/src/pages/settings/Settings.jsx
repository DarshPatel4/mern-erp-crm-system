import { useState } from 'react';
import { FaShieldAlt, FaBuilding, FaBriefcase, FaEnvelope, FaPaintBrush, FaBell, FaDatabase, FaPalette } from 'react-icons/fa';
import ThemeAppearanceModal from './components/ThemeAppearanceModal';
import AddRoleModal from './components/AddRoleModal';
import DepartmentManagementModal from './components/DepartmentManagementModal';
import CompanyProfileModal from './components/CompanyProfileModal';
import EmailSmsConfigModal from './components/EmailSmsConfigModal';
import DocumentBrandingModal from './components/DocumentBrandingModal';
import NotificationPreferencesModal from './components/NotificationPreferencesModal';
import DataBackupModal from './components/DataBackupModal';
import RolesPermissions from './components/RolesPermissions';

export default function Settings() {
  const [activeModal, setActiveModal] = useState(null);

  const settingsCards = [
    {
      id: 'roles-permissions',
      title: 'Roles & Permissions',
      description: 'Manage user roles and access controls',
      icon: <FaShieldAlt className="text-purple-600" />,
      onClick: () => setActiveModal('roles-permissions')
    },
    {
      id: 'department-management',
      title: 'Department Management',
      description: 'Organize teams and departments',
      icon: <FaBuilding className="text-blue-600" />,
      onClick: () => setActiveModal('department-management')
    },
    {
      id: 'company-profile',
      title: 'Company Profile',
      description: 'Update company information',
      icon: <FaBriefcase className="text-green-600" />,
      onClick: () => setActiveModal('company-profile')
    },
    {
      id: 'email-sms-config',
      title: 'Email & SMS Config',
      description: 'Configure messaging services',
      icon: <FaEnvelope className="text-yellow-600" />,
      onClick: () => setActiveModal('email-sms-config')
    },
    {
      id: 'document-branding',
      title: 'Document Branding',
      description: 'Customize document appearance',
      icon: <FaPaintBrush className="text-red-600" />,
      onClick: () => setActiveModal('document-branding')
    },
    {
      id: 'notification-preferences',
      title: 'Notification Preferences',
      description: 'Manage alert and notification settings',
      icon: <FaBell className="text-orange-600" />,
      onClick: () => setActiveModal('notification-preferences')
    },
    {
      id: 'data-backup-restore',
      title: 'Data Backup & Restore',
      description: 'Manage data backup options',
      icon: <FaDatabase className="text-teal-600" />,
      onClick: () => setActiveModal('data-backup-restore')
    },
    {
      id: 'theme-appearance',
      title: 'Theme & Appearance',
      description: 'Customize interface appearance',
      icon: <FaPalette className="text-pink-600" />,
      onClick: () => setActiveModal('theme-appearance')
    }
  ];

  const closeModal = () => setActiveModal(null);

  return (
    <div className="flex-1 p-8 bg-gray-50 overflow-y-auto h-[calc(100vh-80px)]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your ERP-CRM system configurations</p>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {settingsCards.map((card) => (
            <div
              key={card.id}
              onClick={card.onClick}
              className="bg-white rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-gray-200"
            >
              <div className="flex flex-col items-center text-center">
                <div className="text-3xl mb-4">{card.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-600">{card.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Roles & Permissions Section */}
        {activeModal === 'roles-permissions' && (
          <RolesPermissions onClose={closeModal} />
        )}

        {/* Modals */}
        {activeModal === 'theme-appearance' && (
          <ThemeAppearanceModal onClose={closeModal} />
        )}
        {activeModal === 'add-role' && (
          <AddRoleModal onClose={closeModal} />
        )}
        {activeModal === 'department-management' && (
          <DepartmentManagementModal onClose={closeModal} />
        )}
        {activeModal === 'company-profile' && (
          <CompanyProfileModal onClose={closeModal} />
        )}
        {activeModal === 'email-sms-config' && (
          <EmailSmsConfigModal onClose={closeModal} />
        )}
        {activeModal === 'document-branding' && (
          <DocumentBrandingModal onClose={closeModal} />
        )}
        {activeModal === 'notification-preferences' && (
          <NotificationPreferencesModal onClose={closeModal} />
        )}
        {activeModal === 'data-backup-restore' && (
          <DataBackupModal onClose={closeModal} />
        )}
      </div>
    </div>
  );
} 