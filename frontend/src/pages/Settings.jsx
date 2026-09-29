import React, { useState } from 'react';
import {
  User,
  Palette,
  Bell,
  Lock,
  ShieldAlert,
  Sun,
  Moon,
  Laptop,
  Check,
  LogOut,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { userService } from '../services/api';
import { ConfirmModal } from '../components/Modal';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('appearance');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  // Notification toggles
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [reminderNotifs, setReminderNotifs] = useState(true);

  // Delete account modal
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      showError('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      showError('New password must be at least 6 characters');
      return;
    }

    try {
      setPwLoading(true);
      await userService.changePassword({
        currentPassword,
        newPassword,
        confirmNewPassword,
      });
      showSuccess('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setPwLoading(false);
    }
  };

  const confirmDeleteAccount = async () => {
    try {
      setDeleteLoading(true);
      await userService.deleteAccount();
      showSuccess('Account and all associated notes purged.');
      logout();
      navigate('/login');
    } catch (err) {
      showError('Failed to delete account');
    } finally {
      setDeleteLoading(false);
    }
  };

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'account', label: 'Account', icon: ShieldAlert },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Configure application theme, security credentials, and account settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Navigation */}
        <div className="md:col-span-1 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors text-left ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#172033]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Content */}
        <div className="md:col-span-3">
          <div className="bg-white dark:bg-[#111827] rounded-3xl border border-gray-200 dark:border-[#263244] shadow-subtle p-6 sm:p-8">
            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Theme Preference
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Choose how SmartNotes looks to you. Seamlessly switches across light and dark palettes.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Light Theme */}
                  <button
                    onClick={() => setTheme('light')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      theme === 'light'
                        ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/20 shadow-xs'
                        : 'border-gray-200 dark:border-[#263244] hover:border-gray-300 dark:hover:border-gray-700'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 text-amber-500 flex items-center justify-center mb-3 shadow-xs">
                      <Sun className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">Light</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Clean white & slate backgrounds
                    </p>
                  </button>

                  {/* Dark Theme */}
                  <button
                    onClick={() => setTheme('dark')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      theme === 'dark'
                        ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/20 shadow-xs'
                        : 'border-gray-200 dark:border-[#263244] hover:border-gray-300 dark:hover:border-gray-700'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 text-indigo-400 flex items-center justify-center mb-3 shadow-xs">
                      <Moon className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">Dark</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Deep blue-gray night mode
                    </p>
                  </button>

                  {/* System Theme */}
                  <button
                    onClick={() => setTheme('system')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      theme === 'system'
                        ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/20 shadow-xs'
                        : 'border-gray-200 dark:border-[#263244] hover:border-gray-300 dark:hover:border-gray-700'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center mb-3 shadow-xs">
                      <Laptop className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">System</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Syncs with OS theme
                    </p>
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Notification Preferences
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Control in-app updates and study reminder notifications.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-[#172033] border border-gray-100 dark:border-gray-800">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        In-App Toasts & Alerts
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Show visual confirmation popups when creating, updating, and deleting notes.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailNotifs}
                      onChange={(e) => setEmailNotifs(e.target.checked)}
                      className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-[#172033] border border-gray-100 dark:border-gray-800">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        Study Review Reminders
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Periodic highlights for notes in active semester courses.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={reminderNotifs}
                      onChange={(e) => setReminderNotifs(e.target.checked)}
                      className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <form onSubmit={handlePasswordChange} className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Change Password
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Update your account password using bcrypt encryption.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <label
                      htmlFor="settings-current-pw"
                      className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Current Password
                    </label>
                    <input
                      id="settings-current-pw"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 text-sm bg-gray-50 dark:bg-[#172033] border border-gray-200 dark:border-[#263244] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="settings-new-pw"
                      className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1"
                    >
                      New Password
                    </label>
                    <input
                      id="settings-new-pw"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full px-3.5 py-2.5 text-sm bg-gray-50 dark:bg-[#172033] border border-gray-200 dark:border-[#263244] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="settings-confirm-new-pw"
                      className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Confirm New Password
                    </label>
                    <input
                      id="settings-confirm-new-pw"
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full px-3.5 py-2.5 text-sm bg-gray-50 dark:bg-[#172033] border border-gray-200 dark:border-[#263244] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={pwLoading}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-xs transition-all active:scale-95"
                  >
                    {pwLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Account Management
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Manage session status and permanent account deletion.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-[#172033] border border-gray-100 dark:border-gray-800">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        Sign Out of Session
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Safely terminate your authenticated JWT token on this device.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        navigate('/login');
                      }}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-xs font-semibold rounded-xl transition-colors"
                    >
                      Logout
                    </button>
                  </div>

                  {/* Danger Zone */}
                  <div className="p-5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 space-y-3">
                    <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                      <ShieldAlert className="w-5 h-5 shrink-0" />
                      <h4 className="text-sm font-bold">Danger Zone</h4>
                    </div>
                    <p className="text-xs text-rose-800 dark:text-rose-300 leading-relaxed">
                      Permanently delete your user account and purge all created notes, categories, and tags from MongoDB. This action is irreversible.
                    </p>
                    <button
                      type="button"
                      onClick={() => setDeleteAccountModal(true)}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs active:scale-95"
                    >
                      Delete Account Permanently
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteAccountModal}
        onClose={() => setDeleteAccountModal(false)}
        onConfirm={confirmDeleteAccount}
        title="Delete Account Permanently"
        message="Are you completely sure? Your user account and ALL stored notes will be erased from MongoDB immediately."
        confirmText="Confirm & Delete Everything"
        loading={deleteLoading}
      />
    </div>
  );
};

export default Settings;
