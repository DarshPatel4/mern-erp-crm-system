import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { updateEmployeeProfile, updateProfilePicture } from '../../services/employeePortal';

export default function Profile() {
  const { user, employeeId, refreshProfile, showToast } = useOutletContext();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    }
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setFormState({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      emergencyContact: {
        name: user.emergencyContact?.name || '',
        relationship: user.emergencyContact?.relationship || '',
        phone: user.emergencyContact?.phone || ''
      }
    });
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name.startsWith('emergencyContact.')) {
      const key = name.split('.')[1];
      setFormState((prev) => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [key]: value
        }
      }));
      return;
    }

    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!employeeId) return;

    try {
      setIsSaving(true);
      await updateEmployeeProfile(employeeId, formState);
      await refreshProfile();
      showToast('success', 'Profile updated successfully');
    } catch (error) {
      showToast('error', error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfilePictureChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !employeeId) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        setIsUploading(true);
        await updateProfilePicture(employeeId, reader.result);
        await refreshProfile();
        showToast('success', 'Profile picture updated');
      } catch (error) {
        showToast('error', error.message || 'Failed to update picture');
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
          <p className="text-sm text-gray-600">Manage your personal information and contact details.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-20 h-20 object-cover"
                />
              ) : (
                <span className="text-2xl font-semibold text-blue-600">
                  {user?.name?.split(' ').map((chunk) => chunk[0]).join('').toUpperCase() || 'U'}
                </span>
              )}
            </div>
            <label className="absolute -bottom-2 -right-1 bg-blue-600 text-white px-2 py-1 text-xs rounded-full cursor-pointer">
              {isUploading ? '...' : 'Change'}
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="hidden"
                disabled={isUploading}
              />
            </label>
          </div>
        </div>
      </div>

      <form className="bg-white rounded-2xl p-6 shadow space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formState.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formState.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formState.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              name="address"
              value={formState.address}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div>
          <h3 className="text-md font-semibold text-gray-900 mb-3">Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="emergencyContact.name"
                value={formState.emergencyContact.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
              <input
                type="text"
                name="emergencyContact.relationship"
                value={formState.emergencyContact.relationship}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                name="emergencyContact.phone"
                value={formState.emergencyContact.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
