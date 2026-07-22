import { useNavigate } from "react-router-dom";

const services = [
  {
    key: "salon",
    title: "Salons",
    subtitle: "Book grooming and styling appointments.",
    path: "/menu/salon",
    icon: "✂️",
  },
  {
    key: "clinic",
    title: "Clinics",
    subtitle: "Book medical and health-related appointments.",
    path: "/menu/clinic",
    icon: "🏥",
    comingSoon: true,
  },
  // {
  //   key: "food",
  //   title: "Food Courts",
  //   subtitle: "Order fresh meals from top-rated food vendors.",
  //   path: "/menu/food",
  //   icon: "🍽️",
  // },
];

export default function ServiceSelectionPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white transition-colors duration-300">
      <div className="relative overflow-hidden pt-24 pb-10 px-4">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#d4ff00]/10 dark:bg-[#d4ff00]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-16 right-0 w-72 h-72 bg-emerald-400/10 dark:bg-emerald-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#8cb800]/10 dark:bg-[#d4ff00]/10 border border-[#8cb800]/20 dark:border-[#d4ff00]/20 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#8cb800] dark:bg-[#d4ff00] animate-pulse" />
            <span className="text-xs font-bold text-[#8cb800] dark:text-[#d4ff00] tracking-wider uppercase">
              Pick a service
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 dark:text-white leading-tight mb-3">
            Start with the service
            <br />
            <span className="text-[#8cb800] dark:text-[#d4ff00]">you need</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base max-w-xl leading-relaxed mb-10">
            Choose between salon bookings or clinic appointments to see providers
            available in your area.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {services.map((service) => (
              <button
                key={service.key}
                type="button"
                disabled={service.comingSoon}
                onClick={() => !service.comingSoon && navigate(service.path)}
                className={`group relative flex flex-col items-center gap-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 text-left shadow-sm transition-shadow duration-300 ${
                  service.comingSoon
                    ? "opacity-60 grayscale cursor-not-allowed"
                    : "hover:shadow-xl cursor-pointer"
                }`}
              >
                {service.comingSoon && (
                  <span className="absolute top-4 right-4 text-[10px] font-black uppercase tracking-wider bg-zinc-900 dark:bg-neon text-white dark:text-black px-2.5 py-1 rounded-full">
                    Coming soon
                  </span>
                )}
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-[#8cb800]/15 to-emerald-400/15 text-4xl">
                  {service.icon}
                </div>
                <div className="text-center">
                  <p className="text-xl font-black text-zinc-900 dark:text-white">
                    {service.title}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                    {service.subtitle}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-100 dark:border-zinc-900 py-6 px-4 text-center">
        <p className="text-xs text-zinc-400 dark:text-zinc-600">
          You can also browse all services from the Discover page.
        </p>
      </div>
    </div>
  );
}
