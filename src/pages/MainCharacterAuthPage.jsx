import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function MainCharacterAuthPage() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    outletName: "",
    address: "",
    averagePrepTime: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (isLogin) {
        // LOGIN
        const res = await api.post("/auth/login", {
          email: form.email,
          password: form.password,
        });

        const token =
          res.data?.token ||
          res.data?.accessToken ||
          res.data?.data?.token;

        if (token) {
          localStorage.setItem("ql_token", token);
        }

        toast.success("Login successful!");

        navigate("/campaigns/main-character/dashboard");
      } else {
        // REGISTER
        const res = await api.post("/auth/register", {
          name: form.name,
          email: form.email,
          mobile: form.mobile,
          password: form.password,

          // Main Character = Vendor
          role: "vendor",

          // Required vendor fields
          outletName: form.outletName,
          address: form.address,
          averagePrepTime: Number(form.averagePrepTime),
        });

        const token =
          res.data?.token ||
          res.data?.accessToken ||
          res.data?.data?.token;

        if (token) {
          localStorage.setItem("ql_token", token);
        }

        toast.success("Main Character account created!");

        navigate("/campaigns/main-character/dashboard");
      }
    } catch (err) {
      console.error("Main Character auth error:", err);

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Something went wrong. Please try again.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10 bg-white">

      <div className="w-full max-w-xl">

        {/* Back */}
        <button
          type="button"
          onClick={() => navigate("/campaigns")}
          className="mb-5 text-sm font-bold text-zinc-500 hover:text-zinc-900"
        >
          ← Back to Campaigns
        </button>

        <div className="bg-white border border-zinc-200 rounded-3xl shadow-lg p-8">

          {/* Header */}
          <div className="text-center mb-7">

            <div className="text-5xl mb-3">
              🎬
            </div>

            <h1 className="text-3xl font-black text-zinc-900">
              Main Character
            </h1>

            <p className="mt-2 text-zinc-500">
              {isLogin
                ? "Login to manage your campaigns."
                : "Create your Main Character account."}
            </p>

          </div>

          {/* Login / Register tabs */}
          <div className="grid grid-cols-2 bg-zinc-100 rounded-xl p-1 mb-7">

            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`py-3 rounded-lg font-bold transition ${
                isLogin
                  ? "bg-[#d4ff00] text-zinc-900"
                  : "text-zinc-500"
              }`}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`py-3 rounded-lg font-bold transition ${
                !isLogin
                  ? "bg-[#d4ff00] text-zinc-900"
                  : "text-zinc-500"
              }`}
            >
              Register
            </button>

          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* REGISTER ONLY */}
            {!isLogin && (
              <>
                {/* Name */}
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    className="w-full border border-zinc-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#d4ff00]"
                  />
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Mobile
                  </label>

                  <input
                    type="tel"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    placeholder="Enter mobile number"
                    required
                    className="w-full border border-zinc-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#d4ff00]"
                  />
                </div>

                {/* Outlet Name */}
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Outlet Name
                  </label>

                  <input
                    type="text"
                    name="outletName"
                    value={form.outletName}
                    onChange={handleChange}
                    placeholder="Enter salon / outlet name"
                    required
                    className="w-full border border-zinc-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#d4ff00]"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Address
                  </label>

                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Enter outlet address"
                    required
                    rows={3}
                    className="w-full border border-zinc-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#d4ff00]"
                  />
                </div>

                {/* Prep Time */}
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Average Prep Time (minutes)
                  </label>

                  <input
                    type="number"
                    name="averagePrepTime"
                    value={form.averagePrepTime}
                    onChange={handleChange}
                    placeholder="Example: 30"
                    min="1"
                    required
                    className="w-full border border-zinc-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#d4ff00]"
                  />
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full border border-zinc-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#d4ff00]"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full border border-zinc-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#d4ff00]"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#d4ff00] py-4 rounded-xl font-black text-lg hover:brightness-95 transition disabled:opacity-60"
            >
              {loading
                ? "Please wait..."
                : isLogin
                ? "Login →"
                : "Create Account →"}
            </button>

          </form>

          {/* Switch */}
          <p className="text-center text-sm text-zinc-500 mt-6">
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}{" "}

            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="font-black text-zinc-900 underline"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}
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
            onClick={() => navigate("/campaigns/main-character/campaigns")}
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
