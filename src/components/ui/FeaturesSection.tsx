"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import {
  FaWallet,
  FaChartLine,
  FaShieldHalved,
  FaGithub,
  FaLink,
  FaBolt,
} from "react-icons/fa6";

const features = [
  {
    icon: <FaWallet />,
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    glow: "group-hover:shadow-blue-500/20",
    title: "Connect Any Wallet",
    description:
      "Seamlessly connect MetaMask, Phantom, Coinbase Wallet, Trust Wallet and more with one click. No complicated setup required.",
  },
  {
    icon: <FaChartLine />,
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    glow: "group-hover:shadow-purple-500/20",
    title: "Track Your Assets",
    description:
      "View your entire crypto portfolio in real-time. Balances, prices, and performance across every connected wallet.",
  },
  {
    icon: <FaShieldHalved />,
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/20",
    glow: "group-hover:shadow-green-500/20",
    title: "Non-Custodial Security",
    description:
      "Your keys, your crypto. GitDapps never holds your funds or private keys. You stay in full control at all times.",
  },
  {
    icon: <FaGithub />,
    color: "text-white",
    bg: "bg-white/5 border-white/10",
    glow: "group-hover:shadow-white/10",
    title: "GitHub Integration",
    description:
      "Connect your GitHub identity to your wallet. Show your on-chain activity alongside your open source contributions.",
  },
  {
    icon: <FaLink />,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
    glow: "group-hover:shadow-cyan-500/20",
    title: "Multi-Chain Support",
    description:
      "Ethereum, Solana, BNB Chain, Polygon, Arbitrum and 45+ more chains. One dashboard for your entire Web3 world.",
  },
  {
    icon: <FaBolt />,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/20",
    glow: "group-hover:shadow-yellow-500/20",
    title: "Instant Transactions",
    description:
      "Send, receive, and swap assets at lightning speed. Real-time transaction tracking with full status updates.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative bg-black py-24 px-6 overflow-hidden">

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-blue-400 text-sm font-semibold tracking-widest uppercase">
            Everything You Need
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-3">
            Built for the{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent">
              Web3 generation.
            </span>
          </h2>
          <p className="text-gray-500 mt-4 text-base max-w-xl mx-auto">
            GitDapps combines powerful wallet tools with a beautiful interface
            so you can focus on what matters — your assets.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`group relative p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 hover:bg-white/[0.06] transition-all duration-300 hover:shadow-xl ${feature.glow}`}
            >
              {/* Icon */}
              <div className={`w-11 h-11 rounded-xl border ${feature.bg} flex items-center justify-center ${feature.color} text-lg mb-5`}>
                {feature.icon}
              </div>

              {/* Text */}
              <h3 className="text-white font-semibold text-base mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Hover glow line */}
              <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <ConnectButton label="Get Started — Connect Wallet" />
            Get Started — Connect Wallet

          <p className="text-gray-600 text-xs mt-3">
            No sign up required. Non-custodial. Fully open source.
          </p>
        </div>

      </div>
    </section>
  );
}