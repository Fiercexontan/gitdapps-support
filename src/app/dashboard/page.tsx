"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useSIWE } from "@/hooks/useSIWE";
import {
  FaWallet,
  FaArrowRightFromBracket,
  FaCopy,
  FaCheck,
  FaCircleNotch,
} from "react-icons/fa6";

interface SessionData {
  isLoggedIn: boolean;
  address?: string;
}

const chains: Record<number, string> = {
  1: "Ethereum Mainnet",
  137: "Polygon",
  42161: "Arbitrum One",
  10: "Optimism",
  8453: "Base",
};

export default function DashboardPage() {
  const { address, chainId, isConnected } = useAccount();
  const { signIn, signOut, loading, error } = useSIWE();
  const [session, setSession] = useState<SessionData | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      setSession(data);
      setCheckingSession(false);
    };
    fetchSession();
  }, []);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shortAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  // Loading state
  if (checkingSession) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <FaCircleNotch className="animate-spin text-blue-500 text-3xl" />
      </main>
    );
  }

  // Not connected — show connect prompt
  if (!isConnected) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Navbar />
        <section className="flex flex-col items-center justify-center min-h-screen text-center px-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-2xl mb-6">
            <FaWallet />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-3">
            Connect your wallet first
          </h1>
          <p className="text-gray-500 text-sm max-w-sm">
            Use the Connect Wallet button in the navbar to connect, then sign
            in to access your dashboard.
          </p>
        </section>
        <Footer />
      </main>
    );
  }

  // Connected but not signed in
  if (!session?.isLoggedIn) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Navbar />
        <section className="flex flex-col items-center justify-center min-h-screen text-center px-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-2xl mb-6">
            <FaWallet />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-3">
            Sign in to GitDapps
          </h1>
          <p className="text-gray-500 text-sm max-w-sm mb-8">
            Your wallet is connected. Sign a message to verify ownership and
            access your dashboard. This does not cost any gas.
          </p>
          {error && (
            <p className="text-red-400 text-sm mb-4">{error}</p>
          )}
          <button
            onClick={signIn}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold px-8 py-3 rounded-full text-sm transition-all duration-200 shadow-lg shadow-blue-600/30 flex items-center gap-2"
          >
            {loading ? (
              <FaCircleNotch className="animate-spin" />
            ) : (
              <FaWallet />
            )}
            {loading ? "Waiting for signature..." : "Sign In With Ethereum"}
          </button>
        </section>
        <Footer />
      </main>
    );
  }

  // Fully signed in — show dashboard
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
            <div>
              <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-1">
                Dashboard
              </p>
              <h1 className="text-3xl font-extrabold text-white">
                Welcome back.
              </h1>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-2 text-gray-400 hover:text-white border border-white/10 hover:border-white/30 px-4 py-2 rounded-full text-sm transition-all duration-200"
            >
              <FaArrowRightFromBracket />
              Sign Out
            </button>
          </div>

          {/* Wallet Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

            {/* Address */}
            <div className="col-span-2 p-6 rounded-2xl bg-white/[0.03] border border-white/10">
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">
                Connected Wallet
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-white font-semibold text-base truncate">
                    {address ? shortAddress(address) : "—"}
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {chainId ? chains[chainId] || `Chain ${chainId}` : "Unknown Network"}
                  </p>
                </div>
                <button
                  onClick={copyAddress}
                  className="ml-auto flex items-center gap-1.5 text-gray-500 hover:text-white text-xs border border-white/10 hover:border-white/30 px-3 py-1.5 rounded-full transition-all duration-200"
                >
                  {copied ? <FaCheck className="text-green-400" /> : <FaCopy />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            {/* Status */}
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">
                Status
              </p>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-green-400 text-sm font-medium">Active</span>
              </div>
              <p className="text-gray-600 text-xs">
                Authenticated via SIWE
              </p>
              <p className="text-gray-600 text-xs mt-1">
                Session valid for 7 days
              </p>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                label: "Authentication",
                value: "Sign In With Ethereum",
                sub: "EIP-4361 Standard",
                color: "text-blue-400",
              },
              {
                label: "Network",
                value: chainId ? chains[chainId] || `Chain ${chainId}` : "—",
                sub: "Active chain",
                color: "text-purple-400",
              },
              {
                label: "Session",
                value: "Secure",
                sub: "iron-session encrypted",
                color: "text-green-400",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-white/[0.03] border border-white/10"
              >
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">
                  {card.label}
                </p>
                <p className={`font-bold text-base ${card.color}`}>
                  {card.value}
                </p>
                <p className="text-gray-600 text-xs mt-1">{card.sub}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}