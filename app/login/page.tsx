'use client';

import { createContext, useContext, useState, useEffect } from "react";
import { login } from "../../actions/session.js"
import { useSession } from "../../helpers/session";
import { useRouter } from "next/navigation";

export default function Home() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const { setSession } = useSession();
  const router = useRouter();

  // Empty handler functions
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(formData).then((data, err)=>{
      setSession({
        data
      });
      
      localStorage.setItem(
          "session",
          JSON.stringify(data)
      );
      router.push("/dispatch");
    })
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
            className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 transition"
          >
            Sign In
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
