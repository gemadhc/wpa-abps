"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updatePassword, requestIfActivated } from "../../actions/employee";
import { useSession } from "../../helpers/session";
import { CheckCircle2 } from "lucide-react";

export default function Page() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("verifying"); // "verifying" | "verified" | "ready"
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    capital: false,
  });

  const router = useRouter();
  const { session } = useSession();

  useEffect(() => {
    if (!session) router.push("/login");
  }, [session, router]);

  useEffect(() => {
    setPasswordChecks({
      length: password.length >= 6,
      capital: /[A-Z]/.test(password),
    });
  }, [password]);

  useEffect(() => {
    requestIfActivated().then((data) => {
      if (data.isActivated) {
        setStatus("verified"); // trigger verified animation
        setTimeout(() => router.push("/offline"), 1500); // delay before redirect
      } else {
        setStatus("ready"); // show password form
      }
    });
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!passwordChecks.length || !passwordChecks.capital) {
      setError("Password does not meet all requirements.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await updatePassword(password);
      setStatus("verified");
      setTimeout(() => router.push("/offline"), 1500);
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col shadow h-screen p-5 max-w-md mx-auto justify-center shadow-2xl text-black">
      {status === "verifying" && (
        <div className="text-center">
          <h2 className="italic text-lg">VERIFYING ACCOUNT...</h2>
        </div>
      )}

      {status === "verified" && (
        <div className="flex flex-col items-center justify-center">
          <CheckCircle2 className="w-16 h-16 text-green-600 animate-bounce mb-4" />
          <h2 className="text-2xl font-bold">Account Verified!</h2>
          <p className="text-gray-600 mt-2">Redirecting...</p>
        </div>
      )}

      {status === "ready" && (
        <div>
          <h1 className="text-2xl font-bold mb-6">Set Password</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block font-medium mb-1">New Password</label>
              <input
                type="password"
                className="w-full border rounded p-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="mt-2 text-sm">
                <p className={passwordChecks.length ? "text-green-600" : "text-red-600"}>
                  • At least 6 characters
                </p>
                <p className={passwordChecks.capital ? "text-green-600" : "text-red-600"}>
                  • At least one capital letter (A–Z)
                </p>
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1">Confirm Password</label>
              <input
                type="password"
                className="w-full border rounded p-2"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white py-2 rounded flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading && (
                <div className="h-5 w-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
              )}
              {loading ? "Saving..." : "Set Password"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
