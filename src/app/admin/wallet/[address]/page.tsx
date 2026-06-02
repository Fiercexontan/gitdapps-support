"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  FaWallet,
  FaUsers,
  FaArrowsRotate,
  FaCircleNotch,
  FaClock,
  FaHashtag,
} from "react-icons/fa6";

interface User {
  _id: string;
  address: string;
  createdAt: string;
  lastLogin: string;
  loginCount: number;
}

function shortAddress(addr: string) {
  return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function timeAgo(dateString: string) {
  const seconds = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 1000
  );
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin");
      if (res.status === 401) {
        router.push("/");
        return;
      }
      if (res.status === 403) {
        setError("Access denied. Admin only.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setUsers(data.users || []);
    } catch {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
            <div>
              <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-1">
                Admin Panel
              </p>
              <h1 className="text-3xl font-extrabold text-white">
                Connected Wallets
              </h1>
            </div>
            <button
              onClick={fetchUsers}
              className="flex items-center gap-2 text-gray-400 hover:text-white border border-white/10 hover:border-white/30 px-4 py-2 rounded-full text-sm transition-all duration-200"
            >
              <FaArrowsRotate className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {/* Stats Row */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <FaUsers />
                  </div>
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                    Total Users
                  </p>
                </div>
                <p className="text-3xl font-extrabold text-white">
                  {users.length}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
                    <FaClock />
                  </div>
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                    Latest Login
                  </p>
                </div>
                <p className="text-white font-bold text-sm">
                  {users.length > 0 ? timeAgo(users[0].lastLogin) : "—"}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <FaHashtag />
                  </div>
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                    Total Logins
                  </p>
                </div>
                <p className="text-3xl font-extrabold text-white">
                  {users.reduce((acc, u) => acc + u.loginCount, 0)}
                </p>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <FaCircleNotch className="animate-spin text-blue-500 text-3xl" />
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="text-center py-20">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Users Table */}
          {!loading && !error && (
            <div className="rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden">

              {/* Table Header */}
              <div className="grid grid-cols-5 gap-4 px-6 py-3 border-b border-white/10 bg-white/[0.02]">
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                  Wallet Address
                </p>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                  First Seen
                </p>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                  Last Login
                </p>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                  Logins
                </p>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                  Assets
                </p>
              </div>

              {/* Table Rows */}
              {users.length === 0 ? (
                <div className="text-center py-16">
                  <FaWallet className="text-4xl text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm">
                    No wallets connected yet.
                  </p>
                </div>
              ) : (
                users.map((user, i) => (
                  <div
                    key={user._id}
                    className={`grid grid-cols-5 gap-4 px-6 py-4 hover:bg-white/[0.03] transition-colors duration-200 ${
                      i !== users.length - 1 ? "border-b border-white/5" : ""
                    }`}
                  >
                    {/* Address */}
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0" />
                      <span className="text-white text-sm font-mono truncate">
                        {shortAddress(user.address)}
                      </span>
                    </div>

                    {/* First Seen */}
                    <p className="text-gray-400 text-xs self-center">
                      {formatDate(user.createdAt)}
                    </p>

                    {/* Last Login */}
                    <div className="self-center">
                      <p className="text-gray-400 text-xs">
                        {formatDate(user.lastLogin)}
                      </p>
                      <p className="text-gray-600 text-xs mt-0.5">
                        {timeAgo(user.lastLogin)}
                      </p>
                    </div>

                    {/* Login Count */}
                    <div className="self-center">
                      <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
                        {user.loginCount}x
                      </span>
                    </div>

                    {/* View Assets Button */}
                    <div className="self-center">
                      <button
                        onClick={() =>
                          router.push(`/admin/wallet/${user.address}`)
                        }
                        className="text-xs text-blue-400 hover:text-blue-300 border border-blue-500/20 hover:border-blue-500/40 px-3 py-1.5 rounded-full transition-all duration-200"
                      >
                        View Assets
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </section>

      <Footer />
    </main>
  );
}