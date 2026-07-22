import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/api";
import Spinner from "../components/Spinner";
import SalonBookingPage from "./SalonBookingPage";

export default function SalonVendorPage() {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const res = await api.get(`/vendors/${vendorId}`);
        setVendor(res.data.data);
      } catch {
        setError("Failed to load salon details.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchVendor();
  }, [vendorId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="min-h-screen bg-white dark:bg-black pt-28 px-4 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center text-3xl mb-6">
          ✂️
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
          Salon not found
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2 max-w-xs leading-relaxed">
          {error || "The salon you're looking for doesn't exist."}
        </p>
        <button
          onClick={() => navigate("/discover")}
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#8cb800] dark:bg-[#d4ff00] text-white dark:text-black font-bold hover:opacity-90 transition-opacity"
        >
          Back to Discovery
        </button>
      </div>
    );
  }

  return <SalonBookingPage vendor={vendor} vendorId={vendorId} />;
}
