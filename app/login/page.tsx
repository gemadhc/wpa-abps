'use client';

import { useState } from "react";
import { login } from "../../actions/session.js";
import { useSession } from "../../helpers/session";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react"; // ⬅️ nice loading icon

export default function Home() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false); // ✅ loading state
  const { setSession } = useSession();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // show animation

    try {
      const data = await login(formData);
      console.log("setting this session: ", data);

      setSession(data);
      localStorage.setItem("session", JSON.stringify(data));

      // Small delay for smoother UX
      setTimeout(() => {
        router.push("/dispatch");
      }, 500);
    } catch (err) {
      console.error("Login error:", err);
      alert("Invalid login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white shadow-md rounded-xl p-6 border border-gray-200">
        {/* Title */}
        <h1 className="text-center text-xl font-semibold text-gray-800 mb-4">
          Welcome Back
        </h1>
        <p className="text-center text-sm text-gray-500 mb-6">
          Please sign in to continue
        </p>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 bg-blue-600 text-white rounded-lg py-2 font-medium transition ${
              loading
                ? "opacity-75 cursor-not-allowed"
                : "hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          © {new Date().getFullYear()} American Backflow & Plumbing Services, Inc.
        </p>
      </div>
    </div>
  );
}
