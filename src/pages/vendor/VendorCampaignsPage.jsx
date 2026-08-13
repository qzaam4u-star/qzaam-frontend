import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function VendorCampaignsPage() {
  const navigate = useNavigate();

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCampaigns = async () => {
    try {
      const response = await api.get("/campaigns/vendor/my");

      setCampaigns(response.data.data || []);
    } catch (err) {
      console.error("Failed to load campaigns:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10">
        Loading your campaigns...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black">
            Your Campaigns
          </h1>

          <p className="mt-2 text-gray-500">
            View all campaigns created by you.
          </p>
        </div>

        <button
          onClick={() => navigate("/vendor/campaigns/create")}
          className="bg-[#d4ff00] px-5 py-3 rounded-xl font-black"
        >
          + Create Campaign
        </button>
      </div>

      {campaigns.length === 0 ? (
        <div className="mt-8 border rounded-xl p-8 text-center">
          <p className="text-gray-500">
            You haven't created any campaigns yet.
          </p>

          <button
            onClick={() => navigate("/vendor/campaigns/create")}
            className="mt-4 bg-[#d4ff00] px-5 py-3 rounded-xl font-black"
          >
            Create Your First Campaign
          </button>
        </div>
      ) : (
        <div className="mt-8 space-y-5">

          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="border rounded-xl p-6"
            >
              <div className="flex justify-between items-start">

                <div>
                  <h2 className="text-xl font-bold">
                    {campaign.title}
                  </h2>

                  <p className="mt-2 text-gray-600">
                    {campaign.description}
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full text-sm font-bold border">
                  {campaign.status}
                </span>

              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

                <div>
                  <p className="text-sm text-gray-500">
                    Salon Tier
                  </p>
                  <p className="font-bold">
                    {campaign.salonTier}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Followers
                  </p>
                  <p className="font-bold">
                    {campaign.minFollowers || 0} -{" "}
                    {campaign.maxFollowers || 0}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Platform
                  </p>
                  <p className="font-bold">
                    {campaign.preferredPlatform || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Location
                  </p>
                  <p className="font-bold">
                    {campaign.location || "-"}
                  </p>
                </div>

              </div>

              <div className="mt-5 text-sm text-gray-500">
                Campaign date:{" "}
                {campaign.campaignDate
                  ? new Date(
                      campaign.campaignDate
                    ).toLocaleDateString()
                  : "-"}
              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}
