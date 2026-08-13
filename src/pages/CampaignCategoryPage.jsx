import { useNavigate } from "react-router-dom";

export default function CampaignCategoryPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-16">
      <div className="max-w-5xl mx-auto">

        <div className="text-center">
          <h1 className="text-5xl font-black text-zinc-900">
            Campaign
          </h1>

          <p className="mt-4 text-lg text-zinc-500">
            Choose how you want to participate in campaigns.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-12">

          {/* MAIN CHARACTER */}
          <button
            onClick={() => navigate("/campaigns/main-character")}
            className="text-left bg-white border rounded-3xl p-8 shadow-sm hover:shadow-lg transition"
          >
            <div className="text-5xl mb-6">
              🎬
            </div>

            <h2 className="text-3xl font-black text-zinc-900">
              Main Character
            </h2>

            <p className="mt-4 text-zinc-500 leading-relaxed">
              Create campaigns for your salon, find Brand Ambassadors,
              and manage your campaign activities.
            </p>

            <div className="mt-8">
              <span className="inline-block bg-[#d4ff00] px-6 py-3 rounded-xl font-black">
                Continue →
              </span>
            </div>
          </button>

          {/* BRAND AMBASSADOR */}
          <button
            <button
            onClick={() => navigate("/campaigns/random-ambassador")}
            className="text-left bg-white border rounded-3xl p-8 shadow-sm hover:shadow-lg transition"
          >
            <div className="text-5xl mb-6">
              ⭐
            </div>

            <h2 className="text-3xl font-black text-zinc-900">
              Brand Ambassador
            </h2>

            <p className="mt-4 text-zinc-500 leading-relaxed">
              Discover campaigns, manage your profile and interests,
              and collaborate with salons and brands.
            </p>

            <div className="mt-8">
              <span className="inline-block bg-[#d4ff00] px-6 py-3 rounded-xl font-black">
                Continue →
              </span>
            </div>
          </button>

        </div>

      </div>
    </div>
  );
}
