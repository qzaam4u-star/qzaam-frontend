import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function MainCharacterAuthPage() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
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
          role: "vendor",
        });

        const token =
          res.data?.token ||
          res.data?.accessToken ||
          res.data?.data?.token;

        if (token) {
          localStorage.setItem("ql_token", token);
        }

        toast.success("Account created successfully!");

        navigate("/campaigns/main-character/dashboard");
      }
    } catch (err) {
      console.error(err);

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
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">

      <div className="w-full max-w-md">

        {/* Back */}
        <button
          onClick={() => navigate("/campaigns")}
          className="mb-6 text-sm font-bold text-zinc-500 hover:text-zinc-900"
        >
          ← Back to Campaigns
        </button>

        {/* Card */}
        <div className="bg-white border border-zinc-200 rounded-3xl shadow-lg p-8">

          {/* Header */}
          <div className="text-center mb-8">

            <div className="text-5xl mb-4">
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

          {/* Login / Register Switch */}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

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

          {/* Bottom text */}
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
