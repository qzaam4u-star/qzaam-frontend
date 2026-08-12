import { useEffect, useState } from "react";
import api from "../../utils/api";

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCampaigns = async () => {
    try {
      const response = await api.get("/campaigns/admin/pending");

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
      <div className="p-8">
        Loading campaigns...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      <h1 className="text-3xl font-black">
        Campaign Approval
      </h1>

      <p className="mt-2 text-gray-500">
        Review campaigns submitted by vendors.
      </p>

      {campaigns.length === 0 ? (
        <div className="mt-8 border rounded-xl p-8 text-center">
          No pending campaigns.
        </div>
      ) : (
        <div className="mt-8 space-y-5">

          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="border rounded-xl p-6"
            >

              <h2 className="text-xl font-bold">
                {campaign.title}
              </h2>

              <p className="mt-2">
                {campaign.description}
              </p>

              <p className="mt-3">
                Vendor:{" "}
                <strong>
                  {campaign.vendor?.name}
                </strong>
              </p>

              <p>
                Salon Tier:{" "}
                <strong>
                  {campaign.salonTier}
                </strong>
              </p>

              <p>
                Followers:{" "}
                {campaign.minFollowers || 0} -{" "}
                {campaign.maxFollowers || 0}
              </p>

              <p>
                Platform:{" "}
                {campaign.preferredPlatform}
              </p>

              <p>
                Location:{" "}
                {campaign.location}
              </p>

              <p>
                Status:{" "}
                <strong>{campaign.status}</strong>
              </p>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}
