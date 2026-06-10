import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Spinner from '../components/Spinner';

// ─── Star Rating Display ─────────────────────────────────────────────────────
function StarRating({ rating, count }) {
  const num = parseFloat(rating) || 0;
  const full = Math.floor(num);
  const half = num - full >= 0.5;
  return (
    <span className="flex items-center gap-1">
      <span className="flex items-center">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg
            key={i}
            className={`w-3.5 h-3.5 ${
              i <= full
                ? 'text-amber-400'
                : i === full + 1 && half
                ? 'text-amber-300'
                : 'text-zinc-300 dark:text-zinc-600'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </span>
      <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
        {rating ?? '—'}
      </span>
      {count > 0 && (
        <span className="text-xs text-zinc-400">({count})</span>
      )}
    </span>
  );
}

// ─── Single Vendor Card ───────────────────────────────────────────────────────
function VendorCard({ vendor, onClick }) {
  const isOpen = vendor.openStatus === 'open';
  const emoji = vendor.vendorType === 'salon' ? '✂️' : '🍽️';

  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    >
      {/* Image / Placeholder */}
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 shrink-0">
        {vendor.profileImage ? (
          <img
            src={vendor.profileImage}
            alt={vendor.outletName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 select-none">
            <span className="text-5xl">{emoji}</span>
          </div>
        )}

        {/* Open / Closed badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md ${
              isOpen
                ? 'bg-emerald-500/90 text-white'
                : 'bg-zinc-800/80 text-zinc-300'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isOpen ? 'bg-white animate-pulse' : 'bg-zinc-500'
              }`}
            />
            {isOpen ? 'Open' : 'Closed'}
          </span>
        </div>

        {/* Hover cta overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs font-black px-4 py-2 rounded-full shadow-lg tracking-wide">
            {vendor.vendorType === 'salon' ? 'Book Now →' : 'View Menu →'}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-black text-zinc-900 dark:text-white text-sm sm:text-base leading-snug line-clamp-1">
          {vendor.outletName}
        </h3>

        <StarRating rating={vendor.averageRating} count={vendor.totalReviews} />

        {vendor.address && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            📍 {vendor.address}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Section with heading + grid ─────────────────────────────────────────────
function VendorSection({ title, emoji, description, vendors, onCardClick, emptyMsg }) {
  return (
    <section className="mb-14">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">{emoji}</span>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
            {title}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{description}</p>
        </div>
      </div>

      {/* Decorative divider */}
      <div className="h-px bg-gradient-to-r from-[#8cb800]/30 dark:from-[#d4ff00]/20 via-zinc-200 dark:via-zinc-800 to-transparent mb-6 mt-3" />

      {vendors.length === 0 ? (
        <div className="py-12 text-center bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
          <span className="text-4xl block mb-3">{emoji}</span>
          <p className="text-zinc-400 dark:text-zinc-500 text-sm font-medium">{emptyMsg}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {vendors.map((v) => (
            <VendorCard key={v.id} vendor={v} onClick={() => onCardClick(v)} />
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Main Discovery Page ──────────────────────────────────────────────────────
export default function VendorDiscoveryPage() {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await api.get('/vendors');
        setVendors(res.data.data || []);
      } catch {
        setError('Could not load vendors. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchVendors();
  }, []);

  const handleCardClick = (vendor) => {
    navigate(`/menu?vendorId=${vendor.id}`);
  };

  const filtered = search.trim()
    ? vendors.filter((v) =>
        v.outletName.toLowerCase().includes(search.trim().toLowerCase()) ||
        (v.address || '').toLowerCase().includes(search.trim().toLowerCase())
      )
    : vendors;

  const foodVendors = filtered.filter((v) => v.vendorType === 'food');
  const salonVendors = filtered.filter((v) => v.vendorType === 'salon');

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white transition-colors duration-300">
      {/* ── Hero Header ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden pt-24 pb-10 px-4">
        {/* Background glow blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#d4ff00]/10 dark:bg-[#d4ff00]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-16 right-0 w-72 h-72 bg-emerald-400/10 dark:bg-emerald-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#8cb800]/10 dark:bg-[#d4ff00]/10 border border-[#8cb800]/20 dark:border-[#d4ff00]/20 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#8cb800] dark:bg-[#d4ff00] animate-pulse" />
            <span className="text-xs font-bold text-[#8cb800] dark:text-[#d4ff00] tracking-wider uppercase">
              Discover Nearby
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 dark:text-white leading-tight mb-3">
            Find Your Perfect<br />
            <span className="text-[#8cb800] dark:text-[#d4ff00]">Vendor</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base max-w-md leading-relaxed mb-8">
            Browse food courts and salons near you. Click a card to order food or book an appointment instantly.
          </p>

          {/* ── Search Bar ─────────────────────────── */}
          <div className="relative max-w-md">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">🔍</span>
            <input
              id="vendor-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or area…"
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 outline-none focus:border-[#8cb800] dark:focus:border-[#d4ff00] focus:ring-2 focus:ring-[#8cb800]/20 dark:focus:ring-[#d4ff00]/20 transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Spinner size="lg" />
            <p className="text-zinc-400 text-sm animate-pulse">Loading vendors…</p>
          </div>
        ) : error ? (
          <div className="py-20 text-center">
            <span className="text-5xl block mb-4">⚠️</span>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2.5 rounded-xl bg-[#8cb800] dark:bg-[#d4ff00] text-white dark:text-black text-sm font-bold hover:opacity-90 transition-opacity"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Stats row */}
            {!search && (
              <div className="flex items-center gap-6 mb-10 px-1">
                <div className="text-center">
                  <p className="text-2xl font-black text-zinc-900 dark:text-white">{vendors.length}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Total Vendors</p>
                </div>
                <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-800" />
                <div className="text-center">
                  <p className="text-2xl font-black text-zinc-900 dark:text-white">{foodVendors.length}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Food Courts</p>
                </div>
                <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-800" />
                <div className="text-center">
                  <p className="text-2xl font-black text-zinc-900 dark:text-white">{salonVendors.length}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Saloons</p>
                </div>
                <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-800" />
                <div className="text-center">
                  <p className="text-2xl font-black text-[#8cb800] dark:text-[#d4ff00]">
                    {vendors.filter((v) => v.openStatus === 'open').length}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">Open Now</p>
                </div>
              </div>
            )}

            {/* Food Courts */}
            <VendorSection
              title="Food Courts"
              emoji="🍽️"
              description="Order fresh meals from top-rated food vendors"
              vendors={foodVendors}
              onCardClick={handleCardClick}
              emptyMsg={search ? 'No food vendors match your search.' : 'No food vendors available right now.'}
            />

            {/* Saloons */}
            <VendorSection
              title="Saloons"
              emoji="✂️"
              description="Book grooming & styling appointments"
              vendors={salonVendors}
              onCardClick={handleCardClick}
              emptyMsg={search ? 'No salons match your search.' : 'No salons available right now.'}
            />

            {filtered.length === 0 && search && (
              <div className="text-center py-10">
                <span className="text-4xl block mb-3">🔍</span>
                <p className="text-zinc-500 dark:text-zinc-400 font-medium">
                  No vendors found for "<span className="text-zinc-800 dark:text-zinc-200">{search}</span>"
                </p>
                <button
                  onClick={() => setSearch('')}
                  className="mt-4 text-xs font-bold text-[#8cb800] dark:text-[#d4ff00] underline underline-offset-2"
                >
                  Clear search
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Footer Note ─────────────────────────────────────────── */}
      <div className="border-t border-zinc-100 dark:border-zinc-900 py-6 px-4 text-center">
        <p className="text-xs text-zinc-400 dark:text-zinc-600">
          📱 Already have a QR code? Scan it to go directly to your vendor's page.
        </p>
      </div>
    </div>
  );
}
