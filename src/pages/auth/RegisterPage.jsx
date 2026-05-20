import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import Card from '../../components/Card';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    outletName: '',
    email: '',
    password: '',
    mobile: '',
    address: '',
    averagePrepTime: '',
    hasGst: false,
    gstNumber: '',
    referralCode: '',
    vendorType: 'food'
  });

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'gstNumber') {
      setFormData(prev => ({ ...prev, [name]: value.toUpperCase() }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    if (!formData.name || !formData.email || !formData.mobile || !formData.password) {
      setError('Please fill in all required fields.');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }
    if (formData.password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    if (!/^\d{10}$/.test(formData.mobile)) {
      setError('Mobile number must be exactly 10 digits.');
      return false;
    }
    if (!formData.outletName || !formData.address || !formData.averagePrepTime) {
      setError('Outlet name, address, and prep time are required.');
      return false;
    }
    if (formData.hasGst && !formData.gstNumber) {
      setError('Please provide your GST number.');
      return false;
    }
    if (!acceptedTerms) {
      setError('You must accept the Terms & Conditions and Privacy Policy to continue.');
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
      const payload = {
        ...formData,
        averagePrepTime: parseInt(formData.averagePrepTime),
        hasGst: formData.hasGst,
        gstNumber: formData.hasGst ? formData.gstNumber : null,
        acceptedTerms: true
      };

      await register(payload, 'vendor');
      setSuccessMsg('Your vendor account was created! Redirecting to login...');
      setTimeout(() => navigate('/auth'), 1500);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-zinc-900 dark:text-white">
          Vendor Onboarding
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Fill in your details to create your vendor account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 sm:px-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(212,255,0,0.05)] border-zinc-200 dark:border-zinc-800">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl border border-red-200 dark:border-red-800/50">
                {error}
              </div>
            )}
            {successMsg && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm font-medium rounded-xl border border-emerald-200 dark:border-emerald-800/50">
                {successMsg}
              </div>
            )}

            <div className="space-y-5 animate-in fade-in slide-in-from-left-4 duration-300">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-400 mb-1">Full Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-2xl shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#d4ff00]/20 focus:border-[#d4ff00] transition-all bg-white dark:bg-zinc-900/50 text-zinc-900 dark:text-white sm:text-sm"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-400 mb-1">Email Address</label>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d4ff00]/20 focus:border-[#d4ff00] transition-all bg-white dark:bg-zinc-900/50 text-zinc-900 dark:text-white sm:text-sm"
                />
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-400 mb-1">Mobile Number</label>
                <input
                  name="mobile"
                  type="tel"
                  maxLength="10"
                  required
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="10-digit number"
                  className="appearance-none block w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d4ff00]/20 focus:border-[#d4ff00] transition-all bg-white dark:bg-zinc-900/50 text-zinc-900 dark:text-white sm:text-sm font-mono"
                />
              </div>

              {/* Business Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-400 mb-2">Business Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[{ value: 'food', icon: '🍔', label: 'Food Vendor' }, { value: 'salon', icon: '💇', label: 'Salon / Beauty' }].map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, vendorType: opt.value }))}
                        className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl border-2 text-sm font-bold transition-all ${formData.vendorType === opt.value ? 'border-[#d4ff00] bg-[#d4ff00]/10 text-zinc-900 dark:text-white' : 'border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600'}`}
                      >
                        <span className="text-xl">{opt.icon}</span>
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Outlet Name */}
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-400 mb-1">Outlet Name</label>
                  <input
                    name="outletName"
                    type="text"
                    required
                    value={formData.outletName}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d4ff00]/20 focus:border-[#d4ff00] transition-all bg-white dark:bg-zinc-900/50 text-zinc-900 dark:text-white sm:text-sm"
                  />
                </div>
              </div>

              {/* Avg Prep Time */}
              <div>
                <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-400 mb-1">Average Prep Time (minutes)</label>
                <input
                  name="averagePrepTime"
                  type="number"
                  required
                  min="1"
                  value={formData.averagePrepTime}
                  onChange={handleChange}
                  placeholder="e.g. 15"
                  className="appearance-none block w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d4ff00]/20 focus:border-[#d4ff00] transition-all bg-white dark:bg-zinc-900/50 text-zinc-900 dark:text-white sm:text-sm"
                />
              </div>

              {/* Business Address */}
              <div>
                <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-400 mb-1">Business Address</label>
                <textarea
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d4ff00]/20 focus:border-[#d4ff00] transition-all bg-white dark:bg-zinc-900/50 text-zinc-900 dark:text-white sm:text-sm h-20 resize-none"
                />
              </div>

              {/* GST */}
              <div className="space-y-4 pt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="hasGst"
                    checked={formData.hasGst}
                    onChange={handleChange}
                    className="w-5 h-5 rounded-lg border-zinc-300 dark:border-zinc-700 text-[#d4ff00] focus:ring-[#d4ff00] transition-all"
                  />
                  <span className="text-sm font-bold text-zinc-700 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                    Do you have GST?
                  </span>
                </label>

                {formData.hasGst && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#8cb800] dark:text-[#d4ff00] mb-1 ml-1">GST Number</label>
                    <input
                      name="gstNumber"
                      type="text"
                      required
                      placeholder="Enter 15-digit GSTIN"
                      maxLength="15"
                      value={formData.gstNumber}
                      onChange={handleChange}
                      className="appearance-none block w-full px-4 py-3 border border-[#8cb800]/30 dark:border-[#d4ff00]/30 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d4ff00]/20 focus:border-[#d4ff00] transition-all bg-[#8cb800]/5 dark:bg-[#d4ff00]/5 text-zinc-900 dark:text-white sm:text-sm font-mono uppercase"
                    />
                  </div>
                )}
              </div>

              {/* Referral Code */}
              <div>
                <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-400 mb-1">Referral Code (Optional)</label>
                <input
                  name="referralCode"
                  type="text"
                  placeholder="Enter Referral Code (Optional)"
                  value={formData.referralCode}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d4ff00]/20 focus:border-[#d4ff00] transition-all bg-white dark:bg-zinc-900/50 text-zinc-900 dark:text-white sm:text-sm font-mono uppercase"
                />
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-400 mb-1">Password</label>
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d4ff00]/20 focus:border-[#d4ff00] transition-all bg-white dark:bg-zinc-900/50 text-zinc-900 dark:text-white sm:text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[34px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                <div className="relative">
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-400 mb-1">Confirm Password</label>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d4ff00]/20 focus:border-[#d4ff00] transition-all bg-white dark:bg-zinc-900/50 text-zinc-900 dark:text-white sm:text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-[34px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {/* Terms & Conditions — Required */}
              <div className="flex items-start gap-3 mt-6 p-1">
                <button
                  type="button"
                  onClick={() => setAcceptedTerms(!acceptedTerms)}
                  className={`shrink-0 w-5 h-5 rounded-md border transition-all flex items-center justify-center ${
                    acceptedTerms
                      ? 'bg-[#d4ff00] border-[#d4ff00] text-black shadow-[0_0_15px_rgba(212,255,0,0.3)]'
                      : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900'
                  } hover:scale-110 active:scale-95`}
                >
                  {acceptedTerms && <span className="text-[10px] font-black">✓</span>}
                </button>

                <p className="text-xs text-zinc-500 leading-relaxed select-none cursor-default">
                  I agree to the{' '}
                  <Link to="/terms" target="_blank" className="font-bold text-zinc-700 dark:text-zinc-300 underline underline-offset-2 hover:text-[#8cb800] dark:hover:text-[#d4ff00] transition-colors">
                    Terms & Conditions
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" target="_blank" className="font-bold text-zinc-700 dark:text-zinc-300 underline underline-offset-2 hover:text-[#8cb800] dark:hover:text-[#d4ff00] transition-colors">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                fullWidth
                disabled={isLoading || !!successMsg || !formData.password || formData.password.length < 6 || !acceptedTerms}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800 text-center text-sm">
            <span className="text-zinc-600 dark:text-zinc-500">Already have an account? </span>
            <Link to="/auth" className="font-bold text-[#d4ff00] hover:text-[#c0e600] transition-colors underline underline-offset-4 decoration-[#d4ff00]/30">
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
