"use client";

import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Navbar() {
  return (
    <nav className="w-full px-6 py-4 flex items-center justify-between border-b border-white/10 bg-black/80 backdrop-blur-md fixed top-0 left-0 z-50">

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white tracking-tight">
        <FaGithub className="text-white text-2xl" />
        Git<span className="text-blue-500">Dapps</span>
      </Link>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
        <Link href="/#features" className="hover:text-white transition-colors">
          Features
        </Link>
        <Link href="/about" className="hover:text-white transition-colors">
          About
        </Link>
        <Link href="/docs" className="hover:text-white transition-colors">
          Docs
        </Link>
      </div>
      
      {/* RainbowKit Connect Button */}
      <ConnectButton
        label="Connect Wallet"
        accountStatus="avatar"
        chainStatus="icon"
        showBalance={true}
      />

    </nav>
  );
}