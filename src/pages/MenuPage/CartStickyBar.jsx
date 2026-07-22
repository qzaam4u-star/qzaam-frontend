import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";

export default function CartStickyBar({ vendorId, itemCount, total }) {
  const navigate = useNavigate();

  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-30 px-4 pb-4 pt-2 sm:hidden animate-in slide-in-from-bottom-full duration-300">
      <button
        onClick={() => navigate(`/cart?vendorId=${vendorId}`)}
        className="w-full flex items-center justify-between bg-[#8cb800] dark:bg-[#d4ff00] text-white dark:text-black rounded-2xl px-5 py-4 font-bold shadow-[0_0_30px_rgba(140,184,0,0.25)] dark:shadow-[0_0_30px_rgba(212,255,0,0.25)]"
      >
        <div className="flex items-center gap-3">
          <span className="bg-white dark:bg-black text-[#8cb800] dark:text-[#d4ff00] text-xs font-black w-6 h-6 rounded-full flex items-center justify-center">
            {itemCount}
          </span>
          <span>View Cart</span>
        </div>
        <span>{formatCurrency(total)}</span>
      </button>
    </div>
  );
}
