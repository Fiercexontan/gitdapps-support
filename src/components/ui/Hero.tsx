"use client";

import { useCountUp } from "@/hooks/useCountUp";
import FloatingWallets from "@/components/ui/FloatingWallets";

function StatCard({
  target,
  suffix,
  prefix,
  label,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  label: string;
}) {
  const { count, ref } = useCountUp(target);
  return (
    <div ref={ref} className="text-center animate-count">
      <p className="text-3xl font-bold text-white">
        {prefix}{count.toLocaleString()}{suffix}
      </p>
      <p className="text-gray-500 text-sm mt-1">{label}</p>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-black flex flex-col items-center justify-center text-center px-6 overflow-hidden">

      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-purple-700/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-blue-800/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating Wallets */}
      <FloatingWallets />

      {/* Badge */}
      <div className="mb-6 px-4 py-1.5 rounded-full border border-blue-500/40 bg-blue-500/10 text-blue-400 text-xs font-semibold tracking-widest uppercase">
        Web3 Wallet Platform
      </div>

      {/* Headline */}
      <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight max-w-4xl">
        Connect Your Wallet.{" "}
        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent">
          Own Your Assets.
        </span>
      </h1>

      {/* Subheadline */}
      <p className="mt-6 text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed">
        GitDapps gives you a seamless interface to connect, manage, and track
        your crypto assets — beautifully designed and fully secure.
      </p>

      {/* CTA Buttons */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center">
        <button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-full text-sm transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50">
          Connect Wallet
        </button>
        <button className="border border-white/20 hover:border-white/40 text-white font-semibold px-8 py-3 rounded-full text-sm transition-all duration-200 bg-white/5 hover:bg-white/10">
          Explore Features
        </button>
      </div>

      {/* Live Animated Stats */}
      <div className="mt-16 flex flex-col sm:flex-row gap-8 sm:gap-16 items-center">
        <StatCard target={2400000000} prefix="$" suffix="+" label="Assets Tracked" />
        <div className="hidden sm:block w-px h-10 bg-white/10" />
        <StatCard target={120000} suffix="+" label="Wallets Connected" />
        <div className="hidden sm:block w-px h-10 bg-white/10" />
        <StatCard target={50} suffix="+" label="Supported Chains" />
      </div>

    </section>
  );
}