import { useEffect, useState } from "react";
import api from "../utils/api";

export default function InfluencerProfile() {

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {

      const res = await api.get(
        "/influencers/me"
      );

      setProfile(res.data.data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }
  };

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  return (

    <div className="max-w-3xl mx-auto px-6 py-12">

      <h1 className="text-3xl font-black">
        My Influencer Profile
      </h1>

      <div className="mt-8 border rounded-3xl p-6">

        <p>
          <b>Name:</b> {profile?.name}
        </p>

        <p className="mt-3">
          <b>Instagram:</b>{" "}
          {profile?.instagramId}
        </p>

        <p className="mt-3">
          <b>Followers:</b>{" "}
          {profile?.followers?.toLocaleString()}
        </p>

        <p className="mt-3">
          <b>Rate / 30 sec:</b>{" "}
          ₹{profile?.ratePer30Sec}
        </p>

        <p className="mt-3">
          <b>Platform:</b>{" "}
          {profile?.preferredPlatform}
        </p>

        <p className="mt-3">
          <b>Location:</b>{" "}
          {profile?.location}
        </p>

        <p className="mt-6">

          <b>Profile Status:</b>{" "}

          {profile?.status}

        </p>

      </div>

    </div>

  );
}
