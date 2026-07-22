import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import CartDrawer from "../components/CartDrawer";
import Spinner from "../components/Spinner";

import VendorHeader from "./MenuPage/VendorHeader";
import MenuContent from "./MenuPage/MenuContent";
import ShareModal from "./MenuPage/ShareModal";
import CartStickyBar from "./MenuPage/CartStickyBar";

export default function FoodVendorPage() {
  const { vendorId } = useParams();
  const navigate = useNavigate();

  const { setActiveVendorId } = useAuth();
  const { itemCount, total, items: cartItems, clearCart } = useCart();

  // ── State Management ──────────────────────────────────────────────────
  const [items, setItems] = useState([]);
  const [vendorData, setVendorData] = useState({
    name: "Vendor",
    cuisine: "Local Store",
    waitTime: 15,
    rating: "0.0",
    reviews: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const frontendBaseUrl =
    import.meta.env.VITE_APP_URL ||
    import.meta.env.VITE_FRONTEND_URL ||
    window.location.origin;

  // ── Handle Share Click ────────────────────────────────────────────────
  const handleShareClick = async () => {
    const shareUrl = `${frontendBaseUrl}/food/${vendorId}`;
    const shareText = `Check out the menu of ${vendorData.name} on Qzaam! 🍽️`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: vendorData.name,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.log("Native share failed or cancelled", err);
        if (err.name !== "AbortError") {
          setIsShareModalOpen(true);
        }
      }
    } else {
      setIsShareModalOpen(true);
    }
  };

  // ── Persist vendor ID and validate cart ──────────────────────────────
  useEffect(() => {
    if (vendorId) {
      setActiveVendorId(vendorId);
      localStorage.setItem("ql_vendor", vendorId);
    }

    // Clear cart if switching vendors
    if (cartItems && cartItems.length > 0 && vendorId) {
      const cartVendorId = cartItems[0]?.vendorId;
      if (cartVendorId && cartVendorId !== vendorId) {
        clearCart();
      }
    }
  }, [vendorId, setActiveVendorId, cartItems, clearCart]);

  // ── Fetch Vendor & Menu Data ────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuRes, vendorRes, reviewsRes] = await Promise.all([
          api.get(`/menus/${vendorId}`),
          api.get(`/vendors/${vendorId}`),
          api
            .get(`/reviews/vendor/${vendorId}`)
            .catch(() => ({ data: { avgRating: "0.0", totalReviews: 0 } })),
        ]);

        setItems(menuRes.data.data);
        setVendorData({
          id: vendorRes.data.data.id,
          name: vendorRes.data.data.outletName || vendorRes.data.data.name,
          outletName:
            vendorRes.data.data.outletName || vendorRes.data.data.name,
          address: vendorRes.data.data.address || "",
          mobile: vendorRes.data.data.mobile || "",
          cuisine: vendorRes.data.data.address?.split("\n")[0] || "",
          waitTime: vendorRes.data.data.averagePrepTime || 15,
          rating: reviewsRes.data.avgRating || "0.0",
          reviews: reviewsRes.data.totalReviews || 0,
          vendorType: vendorRes.data.data.vendorType || "food",
          slotEnabled: vendorRes.data.data.slotEnabled,
          openingTime: vendorRes.data.data.openingTime,
          closingTime: vendorRes.data.data.closingTime,
          slotDuration: vendorRes.data.data.slotDuration,
          maxOrdersPerSlot: vendorRes.data.data.maxOrdersPerSlot,
        });
      } catch {
        setError("Failed to fetch menu or store details.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [vendorId]);

  // ── Loading State ────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // ── Error State ──────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-black pt-28 px-4 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center text-3xl mb-6">
          🏪
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
          Vendor not found
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2 max-w-xs leading-relaxed">
          {error}
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#8cb800] dark:bg-[#d4ff00] text-white dark:text-black font-bold hover:opacity-90 transition-opacity"
        >
          Return Home
        </button>
      </div>
    );
  }

  // ── Prepare Categories ───────────────────────────────────────────────
  const categories = ["All", ...new Set((items || []).map((i) => i.category))];

  // ── Main Render ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white pb-32 sm:pb-24 transition-colors duration-300">
      {/* Vendor Header */}
      <VendorHeader vendorData={vendorData} onShare={handleShareClick} />

      {/* Menu Content */}
      <MenuContent
        items={items}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        categories={categories}
      />

      {/* Sticky Cart Bar (Mobile Only) */}
      <CartStickyBar vendorId={vendorId} itemCount={itemCount} total={total} />

      {/* Cart Drawer (Desktop) */}
      <CartDrawer />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        vendorData={vendorData}
        vendorId={vendorId}
        frontendBaseUrl={frontendBaseUrl}
      />
    </div>
  );
}
