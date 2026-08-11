import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function VendorCreateCampaign() {

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [minFollowers, setMinFollowers] = useState("");
  const [maxFollowers, setMaxFollowers] = useState("");

  const [videoLength, setVideoLength] = useState("30");

  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");
  const [campaignDate, setCampaignDate] = useState("");

  const [preferredPlatform, setPreferredPlatform] =
    useState("Instagram");

  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);

  const submitCampaign = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("salonTier", "STANDARD");
      formData.append("description", description);
      formData.append("minFollowers", minFollowers);
      formData.append("maxFollowers", maxFollowers);
      formData.append("videoLength", videoLength);
      formData.append("budget", budget);
      formData.append("location", location);
      formData.append("campaignDate", campaignDate);
      formData.append(
        "preferredPlatform",
        preferredPlatform
      );

      if (image) {
        formData.append("image", image);
      }

      await api.post("/campaigns", formData);

      alert(
        "Campaign submitted successfully. Waiting for admin approval."
      );

      navigate("/campaigns");

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Failed to create campaign"
      );

    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="max-w-3xl mx-auto px-6 py-12">

      <h1 className="text-3xl font-black">
        Create Campaign
      </h1>

      <form
        onSubmit={submitCampaign}
        className="mt-8 space-y-5"
      >

        <input
          className="w-full border rounded-xl p-3"
          placeholder="Campaign title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className="w-full border rounded-xl p-3"
          placeholder="Campaign description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          rows="5"
        />

        <div className="grid grid-cols-2 gap-4">

          <input
            type="number"
            className="border rounded-xl p-3"
            placeholder="Minimum followers"
            value={minFollowers}
            onChange={(e) =>
              setMinFollowers(e.target.value)
            }
          />

          <input
            type="number"
            className="border rounded-xl p-3"
            placeholder="Maximum followers"
            value={maxFollowers}
            onChange={(e) =>
              setMaxFollowers(e.target.value)
            }
          />

        </div>

        <input
          type="number"
          className="w-full border rounded-xl p-3"
          placeholder="Video length in seconds"
          value={videoLength}
          onChange={(e) =>
            setVideoLength(e.target.value)
          }
        />

        <input
          className="w-full border rounded-xl p-3"
          placeholder="Budget (example: Will discuss)"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />

        <input
          className="w-full border rounded-xl p-3"
          placeholder="Location"
          value={location}
          onChange={(e) =>
            setLocation(e.target.value)
          }
        />

        <input
          type="date"
          className="w-full border rounded-xl p-3"
          value={campaignDate}
          onChange={(e) =>
            setCampaignDate(e.target.value)
          }
        />

        <select
          className="w-full border rounded-xl p-3"
          value={preferredPlatform}
          onChange={(e) =>
            setPreferredPlatform(e.target.value)
          }
        >
          <option value="Instagram">
            Instagram
          </option>

          <option value="YouTube">
            YouTube
          </option>

          <option value="Facebook">
            Facebook
          </option>

          <option value="Instagram + YouTube">
            Instagram + YouTube
          </option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setImage(e.target.files[0])
          }
        />

        <button
          disabled={loading}
          className="w-full bg-[#d4ff00] py-3 rounded-xl font-black"
        >
          {loading
            ? "Submitting..."
            : "Submit Campaign"}
        </button>

      </form>

    </div>
  );
}
