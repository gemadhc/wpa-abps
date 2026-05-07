'use client';

import { useState } from "react";
import { login } from "../../actions/session.js";
import { useSession } from "../../helpers/session";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { setSession } = useSession();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    setErrorMessage("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage("");

    try {
      const data = await login(formData);

      console.log("API response:", data);

      // Handle error response
      if (typeof data === "string") {
        setErrorMessage(data);
        return;
      }

      // Immediately blank page before redirect
      // prevents iOS swipe-back snapshot
      setRedirecting(true);

      // Save session
      setSession(data);

      localStorage.setItem(
        "session",
        JSON.stringify(data)
      );

      // Small delay lets Safari capture
      // the blank page instead of login form
      setTimeout(() => {
        window.location.replace('/offline');
      }, 50);

    } catch (err) {
      console.error("Login error:", err);

      setErrorMessage(
        "An unexpected error occurred. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------
  // Redirecting Screen
  // Prevents login snapshot during
  // iOS swipe-back navigation
  // -----------------------------------
  if (redirecting) {
    return (
      <div className="w-screen h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 min-h-screen flex items-center justify-center bg-gray-50 px-4 w-full">
      <div className="w-full max-w-sm bg-white shadow-md rounded-xl p-6 border border-gray-200">

        <h1 className="text-center text-xl font-semibold text-gray-800 mb-4">
          Welcome Back
        </h1>

        <p className="text-center text-sm text-gray-500 mb-6">
          Please sign in to continue
        </p>

        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >

          <div>
            <label
              htmlFor="username"
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

          {errorMessage && (
            <p className="text-red-600 text-sm">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 bg-slate-600 text-white rounded-lg py-2 font-medium transition ${
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

        <p className="text-center text-xs text-gray-500 mt-6">
          © {new Date().getFullYear()} American Backflow & Plumbing Services, Inc.
        </p>
      </div>
    </div>
  );
}