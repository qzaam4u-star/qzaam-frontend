import toast from "react-hot-toast";

export default function ShareModal({
  isOpen,
  onClose,
  vendorData,
  vendorId,
  frontendBaseUrl,
}) {
  const handleCopyLink = async () => {
    const shareUrl = `${frontendBaseUrl}/menu?vendorId=${vendorId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("✅ Menu link copied");
      setTimeout(() => {
        // copied state would be managed in parent if needed
      }, 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
      toast.error("Failed to copy link");
    }
  };

  if (!isOpen) return null;

  const shareUrl = `${frontendBaseUrl}/menu?vendorId=${vendorId}`;
  const shareText = `Check out the menu of ${vendorData.name} on Qzaam! 🍽️`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden transition-all transform scale-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Decorative Gradient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-gradient-to-br from-[#8cb800]/10 to-[#8cb800]/2 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 transition-colors cursor-pointer"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mt-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#8cb800]/10 dark:bg-[#d4ff00]/10 border border-[#8cb800]/20 dark:border-[#d4ff00]/20 flex items-center justify-center text-2xl mb-3 shadow-inner">
            📤
          </div>
          <h3 className="text-xl font-black text-zinc-900 dark:text-white">
            Share Menu
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-[240px]">
            Share this delicious menu with your friends and family!
          </p>
        </div>

        {/* Vendor Live Preview Box */}
        <div className="mb-6 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8cb800]/20 to-[#8cb800]/5 border border-[#8cb800]/20 flex items-center justify-center text-lg shrink-0">
            🍽
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-sm text-zinc-900 dark:text-white truncate">
              {vendorData.name}
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
              {vendorData.cuisine || "Local Store"}
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[10px] font-black text-emerald-500 dark:text-emerald-400 uppercase tracking-widest block">
              Active Menu
            </span>
            <span className="text-[10px] text-zinc-400 block mt-0.5 font-semibold">
              ⭐ {vendorData.rating}
            </span>
          </div>
        </div>

        {/* Quick Share Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* WhatsApp Button */}
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
              `Check out the menu of ${vendorData.name} on Qzaam! 🍽️\nBrowse and order directly: ${shareUrl}`,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer text-center gap-1"
          >
            <span className="text-2xl">💬</span>
            <span>WhatsApp</span>
          </a>

          {/* Telegram Button */}
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(
              shareUrl,
            )}&text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-3 rounded-2xl border border-sky-500/20 bg-sky-500/5 hover:bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold text-xs transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer text-center gap-1"
          >
            <span className="text-2xl">✈️</span>
            <span>Telegram</span>
          </a>
        </div>

        {/* Copy Link Input Section */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
            Direct Link
          </label>
          <div className="flex gap-2 p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full bg-transparent text-xs text-zinc-600 dark:text-zinc-400 rounded-xl px-2.5 outline-none select-all truncate font-mono"
            />
            <button
              onClick={handleCopyLink}
              className="bg-[#8cb800] dark:bg-[#d4ff00] hover:bg-[#7ba200] dark:hover:bg-[#c2eb00] text-white dark:text-black font-black text-xs rounded-xl px-4 py-2.5 transition-all duration-200 hover:scale-[1.02] active:scale-95 shrink-0 cursor-pointer shadow-md"
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
