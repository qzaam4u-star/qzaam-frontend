import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';
import CustomerLoginModal from '../../components/CustomerLoginModal';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const { customer } = useAuth();
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const fetchWishlist = async () => {
    if (!customer || !customer.id) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await api.get(`/wishlist?customerId=${customer.id}`);
      if (res.data.success) {
        setVendors(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load wishlist:', err);
      toast.error('Could not load your saved spots.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [customer]);

  const handleRemove = async (vendorId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!customer || !customer.id) return;
    
    try {
      const res = await api.post('/wishlist/toggle', {
        customerId: customer.id,
        vendorId
      });
      
      if (res.data.success && !res.data.isWishlisted) {
        // Fade out transition simulation by updating state
        setVendors(prev => prev.filter(v => v.id !== vendorId));
        toast.success('Removed from wishlist');
        // Notify Navbar to update count
        window.dispatchEvent(new CustomEvent('wishlist-updated'));
      }
    } catch (err) {
      toast.error('Could not remove vendor. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center pt-20">
        <Spinner size="lg" />
      </div>
    );
  }

  // Guest State - Customer not logged in
  if (!customer || !customer.id) {
    return (
      <div className="min-h-screen bg-white dark:bg-black pt-28 pb-12 px-4 transition-colors">
        <div className="max-w-md mx-auto text-center rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
          </div>
          <div className="w-16 h-16 bg-[#d4ff00]/10 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6">
            ❤️
          </div>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-3">Saved Spots</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-8">
            Create an account or log in to bookmark your favorite food stalls and salon vendors for fast access!
          </p>
          <Button fullWidth size="lg" onClick={() => setShowLoginModal(true)}>
            Log In / Register
          </Button>
          <Link to="/" className="block mt-4 text-xs font-bold uppercase tracking-widest text-[#8cb800] dark:text-[#d4ff00] hover:underline">
            ← Browse Home
          </Link>
        </div>
        <CustomerLoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
              My <span className="text-[#8cb800] dark:text-[#d4ff00]">Wishlist</span>
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
              Your favorite dining and grooming spots saved in one place.
            </p>
          </div>
          <div className="text-zinc-500 dark:text-zinc-400 text-xs font-black uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 w-fit">
            ❤️ {vendors.length} saved spot{vendors.length !== 1 ? 's' : ''}
          </div>
        </div>

        {vendors.length === 0 ? (
          <div className="rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 p-8">
            <EmptyState
              text="No saved spots yet"
              subtitle="Browse around, scan vendor QR codes, and click the heart icon to save them here!"
              variant="calendar"
            />
            <div className="text-center mt-2">
              <Link to="/">
                <Button size="md" className="px-6 bg-[#d4ff00] text-black font-black hover:bg-[#c0e600]">
                  Find Vendors
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.map((vendor) => {
              const isFood = vendor.vendorType === 'food';
              
              return (
                <div
                  key={vendor.id}
                  className="group relative rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 hover:-translate-y-1 shadow-sm overflow-hidden flex flex-col justify-between"
                >
                  {/* Card Top: Gradient + Image */}
                  <div className="h-32 relative bg-zinc-200 dark:bg-zinc-950 overflow-hidden">
                    {vendor.profileImage ? (
                      <img
                        src={vendor.profileImage}
                        alt={vendor.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center text-4xl select-none ${
                        isFood 
                          ? 'bg-gradient-to-br from-[#d4ff00]/20 to-[#d4ff00]/5 text-[#8cb800] dark:text-[#d4ff00]' 
                          : 'bg-gradient-to-br from-purple-500/20 to-pink-500/5 text-purple-500'
                      }`}>
                        {isFood ? '🍽️' : '💇'}
                      </div>
                    )}
                    
                    {/* Floating Heart Check Box */}
                    <button
                      onClick={(e) => handleRemove(vendor.id, e)}
                      className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-md hover:bg-black/60 rounded-full text-red-400 hover:text-red-500 hover:scale-110 transition-all duration-200 border border-white/10"
                      title="Remove from Wishlist"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </button>
                    
                    {/* Vendor Category Tag */}
                    <div className="absolute bottom-4 left-4">
                      {isFood ? (
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#8cb800] dark:text-[#d4ff00] bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#d4ff00]/20">
                          Food Vendor
                        </span>
                      ) : (
                        <span className="text-[10px] font-black uppercase tracking-widest text-purple-400 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-purple-500/20">
                          Salon & Spa
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-2 mb-6">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-lg text-zinc-900 dark:text-white leading-tight group-hover:text-[#8cb800] dark:group-hover:text-[#d4ff00] transition-colors truncate">
                          {vendor.name}
                        </h3>
                        <div className="flex items-center gap-1 shrink-0 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 rounded-md text-xs font-black">
                          <span className="text-amber-400">★</span>
                          <span>{vendor.rating}</span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                        {vendor.address}
                      </p>

                      <div className="flex items-center gap-2 pt-1.5">
                        {vendor.isOpen ? (
                          <Badge variant="green">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                            Open Now
                          </Badge>
                        ) : (
                          <Badge variant="red">
                            <span className="w-1.5 h-1.5 bg-rose-400 rounded-full" />
                            Closed
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => navigate(`/menu?vendorId=${vendor.id}`)}
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-200 active:scale-98 border cursor-pointer ${
                        isFood 
                          ? 'bg-[#d4ff00] text-black border-[#d4ff00] hover:bg-[#c0e600] shadow-[0_4px_15px_rgba(212,255,0,0.15)]' 
                          : 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700 shadow-[0_4px_15px_rgba(147,51,234,0.15)]'
                      }`}
                    >
                      {isFood ? '🍽️ View Menu' : '📅 Book Slot'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <CustomerLoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
}
