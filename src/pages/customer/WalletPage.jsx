import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import Button from '../../components/Button';
import Card from '../../components/Card';
import toast from 'react-hot-toast';

export default function WalletPage() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [referralCode, setReferralCode] = useState('');
  const [topUpAmount, setTopUpAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Referral System States
  const [totalSuccessfulReferrals, setTotalSuccessfulReferrals] = useState(0);
  const [referralsRemaining, setReferralsRemaining] = useState(5);
  const [giftHamperEligible, setGiftHamperEligible] = useState(false);
  const [referralsHistory, setReferralsHistory] = useState([]);

  const customer = JSON.parse(localStorage.getItem('ql_customer') || '{}');
  const phone = user?.mobile || customer?.phone || '';

  const fetchWalletDetails = () => {
    if (phone) {
      api.get(`/wallet?phone=${phone}`)
        .then(res => {
          setBalance(res.data.wallet?.balance || 0);
          setTransactions(res.data.transactions || []);
          if (res.data.referralCode) {
            setReferralCode(res.data.referralCode);
          }
          setTotalSuccessfulReferrals(res.data.totalSuccessfulReferrals || 0);
          setReferralsRemaining(res.data.referralsRemaining !== undefined ? res.data.referralsRemaining : 5);
          setGiftHamperEligible(res.data.giftHamperEligible || false);
          setReferralsHistory(res.data.referralsHistory || []);
        })
        .catch(err => {
          console.error('Failed to load wallet details:', err);
        });
    }
  };

  useEffect(() => {
    fetchWalletDetails();
  }, [user, phone]);

  const handleTopUp = async (e) => {
    e.preventDefault();
    if (!phone) {
      toast.error('Please log in with your phone number to top up your wallet.');
      return;
    }
    if (!topUpAmount || parseFloat(topUpAmount) <= 0) {
      toast.error('Please enter a valid amount.');
      return;
    }

    setLoading(true);
    try {
      // 🔹 Step 0: Ensure Razorpay SDK is loaded
      const loadRazorpay = () => {
        return new Promise((resolve) => {
          if (window.Razorpay) {
            resolve(true);
            return;
          }
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        toast.error('Razorpay SDK failed to load. Please check your internet connection.');
        setLoading(false);
        return;
      }

      // 🔹 Step 1: Create top-up order on backend
      const orderRes = await api.post('/payment/topup/create-order', {
        amount: parseFloat(topUpAmount)
      });
      const order = orderRes.data;

      // 🔹 Step 2: Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: 'Qzaam Wallet',
        description: `Top-up for ₹${topUpAmount}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            // 🔹 Step 3: Verify payment and update wallet balance
            const verifyRes = await api.post('/payment/topup/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: parseFloat(topUpAmount),
              phone
            });

            if (verifyRes.data.success) {
              toast.success(`₹${topUpAmount} added to your wallet!`);
              setBalance(verifyRes.data.balance);
              setTopUpAmount('');
            } else {
              toast.error('Payment verification failed.');
            }
          } catch (err) {
            console.error('Verification error:', err);
            toast.error('Payment verification failed.');
          }
        },
        prefill: {
          contact: phone
        },
        theme: {
          color: '#d4ff00'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Top-up error:', err);
      toast.error('Failed to initiate top-up.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Referral code copied!');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-28 pb-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center transition-colors duration-300">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-12 items-start">
        
        {/* Balance & Add Money Section */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4ff00]/10 text-[#8cb800] dark:text-[#d4ff00] text-[10px] font-black uppercase tracking-widest">
            Qzaam Digital Cash
          </div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white leading-tight">
            My <span className="text-[#8cb800] dark:text-[#d4ff00]">Wallet</span>
          </h1>

          <Card className="p-6 sm:p-8 bg-[#d4ff00]/10 border border-dashed border-[#d4ff00] rounded-2xl flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-[#8cb800] dark:text-[#d4ff00]">Available Balance</p>
                <h2 className="text-5xl font-black text-zinc-900 dark:text-white mt-1">₹{balance.toFixed(2)}</h2>
              </div>
              <span className="text-3xl">💳</span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 text-xs mt-3 leading-relaxed">
              Use your digital cash for single-tap, instant checkout. Fast, secure, and always ready.
            </p>
          </Card>

          <Card className="p-6 sm:p-8 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">Top up your Wallet</h3>
            <form onSubmit={handleTopUp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Top-up Amount</label>
                <input
                  type="number"
                  required
                  placeholder="Enter amount (e.g. 250)"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#d4ff00] w-full transition-colors"
                />
              </div>

              <Button fullWidth type="submit" disabled={loading || !topUpAmount}>
                {loading ? 'Processing...' : 'Complete Top-up'}
              </Button>
            </form>
          </Card>
        </div>

        {/* Copy Referral Code Section */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4ff00]/10 text-[#8cb800] dark:text-[#d4ff00] text-[10px] font-black uppercase tracking-widest">
            Qzaam Referral Code
          </div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white leading-tight">
            {referralCode.startsWith('VENDOR-') ? (
              <>Gift <span className="text-[#8cb800] dark:text-[#d4ff00]">₹100</span></>
            ) : (
              <>Earn <span className="text-[#8cb800] dark:text-[#d4ff00]">Gifts</span></>
            )}
          </h1>

          <Card className="p-6 sm:p-8 bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col items-center justify-center text-center space-y-6">
            <div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                {referralCode.startsWith('VENDOR-') ? 'Your Unique Referral Code' : '🎁 Invite Friends & Earn Gifts'}
              </h3>
              <p className="text-sm text-zinc-500 mt-1">
                {referralCode.startsWith('VENDOR-') 
                  ? 'Share with friends to onboard as vendors.' 
                  : 'Share your referral code with friends. When 5 friends complete their first order or booking, you become eligible for an exclusive Gift Hamper.'}
              </p>
              {!referralCode.startsWith('VENDOR-') && (
                <div className="mt-3 p-3 bg-[#d4ff00]/5 border border-[#d4ff00]/20 rounded-xl text-left">
                  <p className="text-xs font-black text-[#8cb800] dark:text-[#d4ff00] uppercase tracking-wider">Friend Benefit:</p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">Friends get platform fee waived on their first order or booking.</p>
                </div>
              )}
            </div>

            {referralCode ? (
              <div className="w-full flex flex-col items-center space-y-4">
                <div className="px-8 py-4 bg-[#d4ff00]/10 border border-dashed border-[#d4ff00] rounded-2xl select-all">
                  <span className="text-4xl font-black text-zinc-900 dark:text-white tracking-widest">
                    {referralCode}
                  </span>
                </div>
                <Button fullWidth onClick={handleCopy}>
                  {copied ? 'Copied to clipboard!' : 'Copy Code'}
                </Button>
              </div>
            ) : (
              <div className="p-6 text-zinc-500 text-sm font-medium">
                {phone ? 'Loading code...' : 'Enter your name and phone in checkout to generate a code!'}
              </div>
            )}
          </Card>

          {referralCode && !referralCode.startsWith('VENDOR-') && (
            <div className="space-y-4">
              {/* Celebratory Unlocked Card or Referral Progress Tracker */}
              <Card className={`p-6 border-2 transition-all duration-500 relative overflow-hidden ${
                giftHamperEligible 
                  ? 'border-[#d4ff00] bg-gradient-to-br from-zinc-900 to-black text-white shadow-[0_0_30px_rgba(212,255,0,0.15)]' 
                  : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
              }`}>
                {giftHamperEligible && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4ff00]/10 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse" />
                )}
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className={`text-lg font-black tracking-tight ${giftHamperEligible ? 'text-[#d4ff00]' : 'text-zinc-900 dark:text-white'}`}>
                      {giftHamperEligible ? '🎁 Gift Hamper Unlocked!' : 'Referral Campaign Progress'}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      {giftHamperEligible 
                        ? 'Congratulations! You are now eligible for an exclusive Gift Hamper.' 
                        : 'Refer 5 friends to unlock your exclusive gift.'}
                    </p>
                  </div>
                  <span className="text-2xl animate-bounce">🎁</span>
                </div>

                {/* Progress bar with Animated Visuals */}
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between text-xs font-bold">
                    <span className={giftHamperEligible ? 'text-[#d4ff00]' : 'text-zinc-600 dark:text-zinc-300'}>
                      {Math.min(5, totalSuccessfulReferrals)} / 5 Completed
                    </span>
                    <span className="text-zinc-500 dark:text-zinc-400">
                      {Math.round(Math.min(100, (totalSuccessfulReferrals / 5) * 100))}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[#d4ff00] to-[#8cb800] h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${Math.min(100, (totalSuccessfulReferrals / 5) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Over-referral Details */}
                <div className="flex justify-between items-center mt-5 pt-4 border-t border-zinc-200 dark:border-zinc-800/60 text-xs">
                  <span className="text-zinc-500 dark:text-zinc-400">Total Friends Referred</span>
                  <span className={`font-black ${giftHamperEligible ? 'text-[#d4ff00]' : 'text-zinc-900 dark:text-white'}`}>
                    {totalSuccessfulReferrals} Friend{totalSuccessfulReferrals !== 1 ? 's' : ''}
                  </span>
                </div>
              </Card>
            </div>
          )}

          <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs text-zinc-500 dark:text-zinc-400">
            <p className="font-bold mb-1 text-zinc-700 dark:text-zinc-300">Terms & Conditions:</p>
            <p>• Digital Cash inside your wallet is non-refundable and cannot be withdrawn.</p>
            {referralCode.startsWith('VENDOR-') ? (
              <p>• Referral rewards are granted instantly when the referred vendor processes their first 10 orders.</p>
            ) : (
              <p>• Milestone rewards are earned when 5 unique referred friends complete their first food order or salon booking.</p>
            )}
          </div>
        </div>

        {/* Transaction History Section */}
        <div className="mt-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-[10px] font-black uppercase tracking-widest">
            Audit Trail
          </div>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white">Transaction History</h2>

          <Card className="p-4 sm:p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            {transactions.length === 0 ? (
              <p className="text-zinc-500 dark:text-zinc-400 text-center py-6">No transactions yet.</p>
            ) : (
              <div className="space-y-3">
                {transactions.map(tx => (
                  <div key={tx.id} className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white">
                        {tx.source === "topup" && "Wallet Top-up"}
                        {tx.source === "order" && "Order Payment"}
                        {tx.source === "referral" && "Referral Reward"}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {new Date(tx.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className={`font-black ${tx.type === "credit" ? "text-green-500" : "text-red-500"}`}>
                      {tx.type === "credit" ? "+" : "-"}₹{tx.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Referred Friends History Section */}
        <div className="mt-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-[10px] font-black uppercase tracking-widest">
            Network Growth
          </div>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white">Friends Referred</h2>

          <Card className="p-4 sm:p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            {referralsHistory.length === 0 ? (
              <p className="text-zinc-500 dark:text-zinc-400 text-center py-6">No friends referred yet. Share your code to get started!</p>
            ) : (
              <div className="space-y-3">
                {referralsHistory.map(ref => (
                  <div key={ref.id} className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white">
                        {ref.name}
                      </p>
                      <p className="text-xs text-zinc-500">
                        Joined: {new Date(ref.joinedAt).toLocaleDateString()} · {ref.phone}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#d4ff00]/10 text-[#8cb800] dark:text-[#d4ff00] border border-[#d4ff00]/20">
                        {ref.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

      </div>
    </div>
  );
}
