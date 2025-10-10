import { useEffect, useState } from 'react';
import { FaTimes, FaDownload, FaUpload, FaHistory, FaTrash, FaPlay, FaPause } from 'react-icons/fa';
const API_URL = 'http://localhost:5000/api';

export default function DataBackupModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('backup');
  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    frequency: 'daily',
    time: '02:00',
    retention: '30',
    includeFiles: true,
    includeDatabase: true,
    compression: true
  });

  const [backupHistory, setBackupHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);

  const handleSettingChange = (field, value) => {
    setBackupSettings(prev => ({ ...prev, [field]: value }));
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
  };

  const loadBackups = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/settings/backup/list`, { headers: getAuthHeaders() });
      const data = await res.json();
      setBackupHistory(data.map(d => ({ id: d.name, name: d.name, date: new Date(d.date).toLocaleString(), size: `${(d.size/1024/1024).toFixed(2)} MB`, status: 'completed', type: 'manual' })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBackups(); }, []);

  const handleCreateBackup = async () => {
    setIsBackingUp(true);
    setBackupProgress(0);
    try {
      await fetch(`${API_URL}/settings/backup`, { method: 'POST', headers: getAuthHeaders() });
      // poll briefly to simulate progress
      const interval = setInterval(async () => {
        setBackupProgress(prev => {
          const next = prev + 25;
          if (next >= 100) {
            clearInterval(interval);
            setIsBackingUp(false);
            loadBackups();
            return 0;
          }
          return next;
        });
      }, 300);
    } catch (e) {
      setIsBackingUp(false);
      alert('Backup failed');
    }
  };

  const handleRestore = async (backupId) => {
    if (!window.confirm('Restoring will overwrite current data. Proceed?')) return;
    try {
      await fetch(`${API_URL}/settings/backup/restore`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify({ file: backupId, drop: true }) });
      alert('Restore triggered');
    } catch (e) {
      alert('Restore failed');
    }
  };

  const handleDeleteBackup = async (backupId) => {
    // Optional: could add delete route; for now just hide
    setBackupHistory(prev => prev.filter(backup => backup.id !== backupId));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'in-progress':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type) => {
    return type === 'auto' ? 'text-blue-600 bg-blue-100' : 'text-purple-600 bg-purple-100';
  };

  return (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Data Backup & Restore</h2>
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
              onClick={() => setActiveTab('backup')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'backup'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FaDownload size={16} />
              Backup Settings
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'history'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FaHistory size={16} />
              Backup History
            </button>
            <button
              onClick={() => setActiveTab('restore')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'restore'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FaUpload size={16} />
              Restore
            </button>
          </div>

          {/* Backup Settings Tab */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              {/* Auto Backup Settings */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Automatic Backup</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={backupSettings.autoBackup}
                      onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                {backupSettings.autoBackup && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                      <select
                        value={backupSettings.frequency}
                        onChange={(e) => handleSettingChange('frequency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                      <input
                        type="time"
                        value={backupSettings.time}
                        onChange={(e) => handleSettingChange('time', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Retention (days)</label>
                      <input
                        type="number"
                        value={backupSettings.retention}
                        onChange={(e) => handleSettingChange('retention', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Backup Options */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Backup Options</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Include Database</span>
                      <p className="text-xs text-gray-500">Backup all database tables and data</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={backupSettings.includeDatabase}
                      onChange={(e) => handleSettingChange('includeDatabase', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Include Files</span>
                      <p className="text-xs text-gray-500">Backup uploaded files and documents</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={backupSettings.includeFiles}
                      onChange={(e) => handleSettingChange('includeFiles', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Compress Backup</span>
                      <p className="text-xs text-gray-500">Reduce backup file size</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={backupSettings.compression}
                      onChange={(e) => handleSettingChange('compression', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Manual Backup */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Manual Backup</h3>
                <div className="space-y-4">
                  {isBackingUp && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Creating backup...</span>
                        <span>{backupProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${backupProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={handleCreateBackup}
                    disabled={isBackingUp}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isBackingUp ? 'Creating Backup...' : 'Create Manual Backup'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Backup History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-3 font-medium text-gray-900">Backup Name</th>
                      <th className="text-left py-3 px-3 font-medium text-gray-900">Date</th>
                      <th className="text-left py-3 px-3 font-medium text-gray-900">Size</th>
                      <th className="text-left py-3 px-3 font-medium text-gray-900">Type</th>
                      <th className="text-left py-3 px-3 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-3 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {backupHistory.map((backup) => (
                      <tr key={backup.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-3">
                          <span className="font-medium text-gray-900">{backup.name}</span>
                        </td>
                        <td className="py-3 px-3 text-sm text-gray-600">{backup.date}</td>
                        <td className="py-3 px-3 text-sm text-gray-600">{backup.size}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(backup.type)}`}>
                            {backup.type}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(backup.status)}`}>
                            {backup.status}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleRestore(backup.id)}
                              className="text-blue-500 hover:text-blue-700"
                              title="Restore"
                            >
                              <FaPlay size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteBackup(backup.id)}
                              className="text-red-500 hover:text-red-700"
                              title="Delete"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Restore Tab */}
          {activeTab === 'restore' && (
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Restore from Backup</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Backup</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Choose a backup to restore from...</option>
                      {backupHistory.filter(b => b.status === 'completed').map((backup) => (
                        <option key={backup.id} value={backup.id}>
                          {backup.name} ({backup.date})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Restore Database</span>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Restore Files</span>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Overwrite Existing Data</span>
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      />
                    </div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      <strong>Warning:</strong> Restoring from a backup will overwrite current data. Make sure to backup current data before proceeding.
                    </p>
                  </div>
                  <button className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium">
                    Restore from Backup
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 