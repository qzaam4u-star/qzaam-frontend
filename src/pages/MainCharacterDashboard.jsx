import { useNavigate } from "react-router-dom";

export default function MainCharacterDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] px-6 py-12">

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-5xl mb-4">
            🎬
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-zinc-900">
            Main Character Dashboard
          </h1>

          <p className="mt-3 text-lg text-zinc-500">
            Create and manage your campaigns.
          </p>
        </div>

        {/* Options */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* CREATE CAMPAIGN */}
          <button
            onClick={() => navigate("/vendor/campaigns/create")}
            className="text-left bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition"
          >
            <div className="text-5xl mb-6">
              🎬
            </div>

            <h2 className="text-2xl font-black text-zinc-900">
              Create Campaign
            </h2>

            <p className="mt-3 text-zinc-500 leading-relaxed">
              Create a new campaign and find Brand Ambassadors
              for your salon.
            </p>

            <div className="mt-7">
              <span className="inline-block bg-[#d4ff00] px-5 py-3 rounded-xl font-black">
                Create Campaign →
              </span>
            </div>
          </button>

          {/* YOUR CAMPAIGNS */}
          <button
            onClick={() => navigate("/vendor/campaigns/main-character/campaigns")}
            className="text-left bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition"
          >
            <div className="text-5xl mb-6">
              📋
            </div>

            <h2 className="text-2xl font-black text-zinc-900">
              Your Campaigns
            </h2>

            <p className="mt-3 text-zinc-500 leading-relaxed">
              View your created campaigns and manage your
              campaign activities.
            </p>

            <div className="mt-7">
              <span className="inline-block bg-[#d4ff00] px-5 py-3 rounded-xl font-black">
                View Campaigns →
              </span>
            </div>
          </button>

          {/* PROFILE */}
          <button
            onClick={() => navigate("/vendor/profile")}
            className="text-left bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition"
          >
            <div className="text-5xl mb-6">
              👤
            </div>

            <h2 className="text-2xl font-black text-zinc-900">
              Profile
            </h2>

            <p className="mt-3 text-zinc-500 leading-relaxed">
              View and update your Main Character profile and
              outlet information.
            </p>

            <div className="mt-7">
              <span className="inline-block bg-[#d4ff00] px-5 py-3 rounded-xl font-black">
                View Profile →
              </span>
            </div>
          </button>

        </div>
      </div>
    </div>
  );
}
