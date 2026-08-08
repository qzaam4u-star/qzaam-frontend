import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function CampaignsPage() {
  const navigate = useNavigate();

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const res = await api.get("/campaigns");

      if (res.data.success) {
        setCampaigns(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading campaigns...</div>;
  }

  return (
    <div className="px-6 py-10">

      <h1 className="text-4xl font-black">
        Influencer Campaigns
      </h1>

      <p className="mt-2 text-zinc-500">
        Find collaboration opportunities from salons.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">

        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="rounded-3xl border overflow-hidden bg-white shadow-sm"
          >

            {campaign.imageUrl && (
              <img
                src={campaign.imageUrl}
                className="w-full h-52 object-cover"
                alt={campaign.title}
              />
            )}

            <div className="p-6">

              <span className="text-xs font-bold uppercase">
                {campaign.salonTier}
              </span>

              <h2 className="text-2xl font-black mt-2">
                {campaign.title}
              </h2>

              <p className="mt-3 text-zinc-600">
                {campaign.description}
              </p>

              <div className="mt-5 space-y-2 text-sm">

                <p>
                  👥 Followers:{" "}
                  {campaign.minFollowers?.toLocaleString()} -
                  {campaign.maxFollowers?.toLocaleString()}
                </p>

                <p>
                  🎥 Video: {campaign.videoLength} sec
                </p>

                <p>
                  📍 {campaign.location}
                </p>

                <p>
                  💰 Budget: {campaign.budget || "Will discuss"}
                </p>

              </div>

              <button
                onClick={() =>
                  navigate(`/campaigns/${campaign.id}`)
                }
                className="mt-6 w-full bg-[#d4ff00] py-3 rounded-xl font-black"
              >
                View Campaign →
              </button>

            </div>
          </div>
        ))}

      </div>

    </div>
  );
}
