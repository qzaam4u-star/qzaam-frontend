import { Link } from "react-router-dom";

export default function OffersPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white">

      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-black/90 backdrop-blur border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto flex items-center justify-between p-4">
          <h1 className="text-2xl font-black">
            Exclusive Offers
          </h1>

          <Link
            to="/"
            className="text-[#8cb800] font-semibold"
          >
            Home
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        <p className="text-zinc-500 mb-8">
          Announcement posters uploaded by salons.
        </p>

        <div className="space-y-6">

          {[1,2,3].map((item)=>(

            <div
              key={item}
              className="overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-xl transition"
            >

              {/* Poster */}
              <div className="aspect-[16/9] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">

                <span className="text-zinc-400">
                  Poster Image
                </span>

              </div>

              <div className="p-5">

                <h2 className="text-xl font-bold">
                  Luxe Salon
                </h2>

                <p className="text-zinc-500 mt-1">
                  Valid till 15 Aug
                </p>

                <button className="mt-5 rounded-xl bg-[#8cb800] px-6 py-3 text-white font-semibold">
                  View Salon
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>
    </div>
  );
}
