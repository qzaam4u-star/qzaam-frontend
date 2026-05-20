import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import Card from '../../components/Card';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminChangePasswordPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const validate = () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setError('All fields are required.');
      return false;
    }
    if (form.newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return false;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError('New password and confirm password do not match.');
      return false;
    }
    if (form.currentPassword === form.newPassword) {
      setError('New password must be different from the current password.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await api.put('/admin/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      });

      if (res.data.success) {
        toast.success('Password updated successfully! Please log in again.');
        // Clear fields
        setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        // Redirect to logout after brief pause so toast is visible
        setTimeout(() => navigate('/admin/logout'), 1800);
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update password. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const EyeButton = ({ show, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors text-lg"
      tabIndex={-1}
    >
      {show ? '👁️' : '👁️‍🗨️'}
    </button>
  );

  return (
    <AdminLayout>
      <div className="max-w-lg mx-auto mt-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">🔐</span>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Change Password</h1>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 ml-10">
            Update your admin account password. You will be logged out after a successful change.
          </p>
        </div>

        <Card className="p-8 border-zinc-200 dark:border-zinc-800 shadow-[0_8px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_40px_rgba(212,255,0,0.04)]">
          {/* Security badge */}
          <div className="flex items-center gap-2 p-3 bg-[#d4ff00]/10 dark:bg-[#d4ff00]/5 rounded-xl border border-[#d4ff00]/20 mb-8">
            <span className="text-sm">🛡️</span>
            <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400">
              Passwords are hashed with bcrypt — never stored in plain text.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 rounded-xl text-sm text-red-600 dark:text-red-400 font-medium flex items-start gap-2">
                <span className="mt-0.5 shrink-0">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Current Password */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  name="currentPassword"
                  type={showCurrent ? 'text' : 'password'}
                  value={form.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-11 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#d4ff00]/30 focus:border-[#d4ff00] transition-all"
                />
                <EyeButton show={showCurrent} onClick={() => setShowCurrent(v => !v)} />
              </div>
            </div>

            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-2" />

            {/* New Password */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2">
                New Password <span className="text-zinc-400 normal-case font-normal">(min. 6 characters)</span>
              </label>
              <div className="relative">
                <input
                  name="newPassword"
                  type={showNew ? 'text' : 'password'}
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  className="w-full px-4 py-3 pr-11 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#d4ff00]/30 focus:border-[#d4ff00] transition-all"
                />
                <EyeButton show={showNew} onClick={() => setShowNew(v => !v)} />
              </div>
              {/* Strength hint */}
              {form.newPassword.length > 0 && (
                <div className="mt-1.5 flex items-center gap-1.5">
                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        form.newPassword.length >= i * 3
                          ? i <= 1 ? 'bg-red-400'
                          : i <= 2 ? 'bg-yellow-400'
                          : i <= 3 ? 'bg-blue-400'
                          : 'bg-[#d4ff00]'
                          : 'bg-zinc-200 dark:bg-zinc-800'
                      }`}
                    />
                  ))}
                  <span className="text-[10px] text-zinc-400 ml-1 shrink-0">
                    {form.newPassword.length < 3 ? 'Weak' : form.newPassword.length < 6 ? 'Fair' : form.newPassword.length < 9 ? 'Good' : 'Strong'}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat new password"
                  autoComplete="new-password"
                  className={`w-full px-4 py-3 pr-11 bg-zinc-50 dark:bg-zinc-900 border rounded-xl text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 transition-all ${
                    form.confirmPassword && form.confirmPassword !== form.newPassword
                      ? 'border-red-400 focus:ring-red-400/30 focus:border-red-400'
                      : form.confirmPassword && form.confirmPassword === form.newPassword
                      ? 'border-[#d4ff00] focus:ring-[#d4ff00]/30'
                      : 'border-zinc-200 dark:border-zinc-700 focus:ring-[#d4ff00]/30 focus:border-[#d4ff00]'
                  }`}
                />
                <EyeButton show={showConfirm} onClick={() => setShowConfirm(v => !v)} />
                {form.confirmPassword && (
                  <span className="absolute right-10 top-1/2 -translate-y-1/2 text-sm">
                    {form.confirmPassword === form.newPassword ? '✅' : '❌'}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="flex-1 px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !form.currentPassword || !form.newPassword || !form.confirmPassword}
                className="flex-1 px-4 py-3 bg-[#d4ff00] hover:bg-[#c0e600] disabled:opacity-50 disabled:cursor-not-allowed text-black font-black rounded-xl text-sm transition-all shadow-[0_4px_15px_rgba(212,255,0,0.3)] hover:shadow-[0_4px_20px_rgba(212,255,0,0.5)] active:scale-95"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  '🔐 Update Password'
                )}
              </button>
            </div>
          </form>
        </Card>

        {/* Info box */}
        <div className="mt-4 p-4 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl">
          <p className="text-xs text-zinc-500 leading-relaxed">
            <span className="font-bold text-zinc-700 dark:text-zinc-300">Note:</span> After changing your password, you will be automatically logged out and redirected to the login page. Use your new password to log back in.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
