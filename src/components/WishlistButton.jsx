import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import CustomerLoginModal from './CustomerLoginModal';
import api from '../utils/api';
import toast from 'react-hot-toast';

const buttonStyles = `
@keyframes heartBurst {
  0% { transform: scale(1); }
  50% { transform: scale(1.35); }
  75% { transform: scale(0.92); }
  100% { transform: scale(1.1); }
}
.animate-heart-burst {
  animation: heartBurst 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
}
`;

export default function WishlistButton({ vendorId, vendorType = 'food', className = '' }) {
  const { customer, role } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [triggerAnimate, setTriggerAnimate] = useState(false);

  // Check initial wishlist status on mount or customer changes
  useEffect(() => {
    if (!customer || !customer.id || !vendorId) {
      setIsWishlisted(false);
      return;
    }

    let isMounted = true;
    const checkStatus = async () => {
      try {
        const res = await api.get(`/wishlist/check/${vendorId}?customerId=${customer.id}`);
        if (res.data.success && isMounted) {
          setIsWishlisted(res.data.isWishlisted);
        }
      } catch (err) {
        console.error('Failed to check wishlist status:', err);
      }
    };

    checkStatus();
    return () => {
      isMounted = false;
    };
  }, [customer, vendorId]);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Prevent vendors or admins from wishlisting
    if (role && role !== 'customer') {
      toast.error('Only customers can save vendors to their wishlist.');
      return;
    }

    // Trigger login if guest
    if (!customer || !customer.id) {
      setShowLoginModal(true);
      return;
    }

    if (isPending) return;

    // Optimistic UI Update & Trigger Animation
    const previousState = isWishlisted;
    setIsWishlisted(!previousState);
    if (!previousState) {
      setTriggerAnimate(true);
      // Reset animation class after completion
      setTimeout(() => setTriggerAnimate(false), 500);
    }
    setIsPending(true);

    try {
      const res = await api.post('/wishlist/toggle', {
        customerId: customer.id,
        vendorId
      });
      if (res.data.success) {
        setIsWishlisted(res.data.isWishlisted);
        if (res.data.isWishlisted) {
          toast.success('Saved to wishlist! ❤️');
        } else {
          toast.success('Removed from wishlist');
        }
        // Emit global event to sync wishlist counter across components
        window.dispatchEvent(new CustomEvent('wishlist-updated'));
      } else {
        // Rollback state
        setIsWishlisted(previousState);
        toast.error(res.data.message || 'Failed to update wishlist');
      }
    } catch (err) {
      // Rollback state
      setIsWishlisted(previousState);
      toast.error('Could not update wishlist. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  const isFood = vendorType === 'food';
  
  // Premium glow colors matching theme (Lime-Green for food, Purple/Magenta for salon)
  const activeColorClass = isFood
    ? 'text-[#d4ff00] drop-shadow-[0_0_8px_rgba(212,255,0,0.6)]'
    : 'text-[#c084fc] drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]';

  return (
    <>
      <style>{buttonStyles}</style>
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`relative p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-300 flex items-center justify-center cursor-pointer shadow-sm active:scale-95 disabled:opacity-75 group select-none ${className}`}
        title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className={`w-5 h-5 transition-all duration-300 ease-out transform ${
            isWishlisted 
              ? `${activeColorClass} fill-current scale-110 ${triggerAnimate ? 'animate-heart-burst' : ''}` 
              : 'text-zinc-400 dark:text-zinc-500 fill-none stroke-current stroke-2 group-hover:scale-105 group-hover:text-red-400'
          }`}
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </button>

      <CustomerLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}
