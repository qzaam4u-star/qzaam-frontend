import WishlistButton from "../../components/WishlistButton";
import Button from "../../components/Button";
import Badge from "../../components/Badge";

export default function VendorHeader({ vendorData, onShare }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-6">
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d4ff00]/20 to-[#d4ff00]/5 border border-[#d4ff00]/20 flex items-center justify-center text-2xl shrink-0">
              🍽
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
                {vendorData.name}
              </h1>
              <p className="text-sm text-zinc-500">{vendorData.cuisine}</p>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <Badge variant="green">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  Open
                </Badge>
                <span className="text-xs text-zinc-500">
                  ⏱ {vendorData.waitTime} min wait
                </span>
                <span className="text-xs text-zinc-500">
                  ⭐ {vendorData.rating} ({vendorData.reviews})
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
            <WishlistButton vendorId={vendorData.id} vendorType="food" />
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-sm text-zinc-600 dark:text-zinc-400">
              <span>📱</span>
              <span>Scanned via QR</span>
            </div>
            <button
              onClick={onShare}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
            >
              <span>📤</span>
              <span>Share Menu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
