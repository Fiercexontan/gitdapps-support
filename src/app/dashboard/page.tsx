"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useSIWE } from "@/hooks/useSIWE";
import ChainSelector from "@/components/ui/ChainSelector";
import SendTransaction from "@/components/ui/SendTransaction";
import Image from "next/image";
import {
  FaWallet,
  FaArrowRightFromBracket,
  FaCopy,
  FaCheck,
  FaCircleNotch,
  FaEthereum,
  FaImage,
  FaArrowsRotate,
} from "react-icons/fa6";

interface SessionData {
  isLoggedIn: boolean;
  address?: string;
}

interface Token {
  address: string;
  symbol: string;
  name: string;
  logo: string | null;
  balance: string;
}

interface NFT {
  tokenId: string;
  name: string;
  collection: string;
  image: string | null;
  contractAddress: string;
}

const chainNativeSymbol: Record<string, string> = {
  ethereum: "ETH",
  polygon: "MATIC",
  arbitrum: "ETH",
  base: "ETH",
  optimism: "ETH",
};

const chainNames: Record<string, string> = {
  ethereum: "Ethereum Mainnet",
  polygon: "Polygon",
  arbitrum: "Arbitrum One",
  base: "Base",
  optimism: "Optimism",
};

function shortAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const { signIn, signOut, loading, error } = useSIWE();
  const [session, setSession] = useState<SessionData | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeChain, setActiveChain] = useState("ethereum");
  const [nativeBalance, setNativeBalance] = useState<string | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [activeTab, setActiveTab] = useState<"tokens" | "nfts">("tokens");

  useEffect(() => {
    const fetchSession = async () => {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      setSession(data);
      setCheckingSession(false);
    };
    fetchSession();
  }, []);

  useEffect(() => {
    if (session?.isLoggedIn) {
      fetchAssets(activeChain);
    }
  }, [session, activeChain]);

  const fetchAssets = async (chain: string) => {
    setLoadingAssets(true);
    setNativeBalance(null);
    setTokens([]);
    setNfts([]);
    try {
      const [assetsRes, nftsRes] = await Promise.all([
        fetch(`/api/assets?chain=${chain}`),
        fetch(`/api/nfts?chain=${chain}`),
      ]);
      const assetsData = await assetsRes.json();
      const nftsData = await nftsRes.json();
      setNativeBalance(assetsData.nativeBalance ?? "0.000000");
      setTokens(assetsData.tokens || []);
      setNfts(nftsData.nfts || []);
    } catch {
      console.error("Failed to fetch assets");
    } finally {
      setLoadingAssets(false);
    }
  };

  const handleChainChange = (chain: string) => {
    setActiveChain(chain);
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (checkingSession) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <FaCircleNotch className="animate-spin text-blue-500 text-3xl" />
      </main>
    );
  }

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
            Use the Connect Wallet button in the navbar to connect your wallet.
          </p>
        </section>
        <Footer />
      </main>
    );
  }

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
            Sign a message to verify wallet ownership. No gas required.
          </p>
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
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

          {/* Wallet + Balance */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
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
                    {chainNames[activeChain]}
                  </p>
                </div>
                <button
                  onClick={copyAddress}
                  className="ml-auto flex items-center gap-1.5 text-gray-500 hover:text-white text-xs border border-white/10 hover:border-white/30 px-3 py-1.5 rounded-full transition-all"
                >
                  {copied ? <FaCheck className="text-green-400" /> : <FaCopy />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            {/* Native Balance */}
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">
                Native Balance
              </p>
              {loadingAssets ? (
                <FaCircleNotch className="animate-spin text-blue-400" />
              ) : (
                <div className="flex items-center gap-2">
                  <FaEthereum className="text-blue-400 text-xl" />
                  <p className="text-white font-bold text-xl">
                    {nativeBalance ?? "0.000000"}
                  </p>
                </div>
              )}
              <p className="text-gray-600 text-xs mt-1">
                {chainNativeSymbol[activeChain]} on {chainNames[activeChain]}
              </p>
            </div>
          </div>

          {/* Chain Selector */}
          <ChainSelector
            activeChain={activeChain}
            onChange={handleChainChange}
          />

          {/* Refresh */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("tokens")}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeTab === "tokens"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "bg-white/5 text-gray-400 hover:text-white border border-white/10"
                }`}
              >
                Tokens
              </button>
              <button
                onClick={() => setActiveTab("nfts")}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeTab === "nfts"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "bg-white/5 text-gray-400 hover:text-white border border-white/10"
                }`}
              >
                NFTs
              </button>
            </div>
            <button
              onClick={() => fetchAssets(activeChain)}
              className="flex items-center gap-2 text-gray-400 hover:text-white border border-white/10 hover:border-white/30 px-4 py-2 rounded-full text-xs transition-all"
            >
              <FaArrowsRotate className={loadingAssets ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {/* Tokens */}
          {activeTab === "tokens" && (
            <div className="rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden">
              {loadingAssets ? (
                <div className="flex items-center justify-center py-16">
                  <FaCircleNotch className="animate-spin text-blue-500 text-2xl" />
                </div>
              ) : tokens.length === 0 ? (
                <div className="text-center py-16">
                  <FaWallet className="text-4xl text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm">
                    No tokens on {chainNames[activeChain]}.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-4 px-6 py-3 border-b border-white/10 bg-white/[0.02]">
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Token</p>
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Name</p>
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider text-right">Balance</p>
                  </div>
                  {tokens.map((token, i) => (
                    <div
                      key={token.address}
                      className={`grid grid-cols-3 gap-4 px-6 py-4 hover:bg-white/[0.03] transition-colors ${
                        i !== tokens.length - 1 ? "border-b border-white/5" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {token.logo ? (
                          <Image src={token.logo} alt={token.symbol} width={28} height={28} className="rounded-full" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">
                            {token.symbol.slice(0, 2)}
                          </div>
                        )}
                        <span className="text-white text-sm font-semibold">{token.symbol}</span>
                      </div>
                      <p className="text-gray-400 text-sm self-center truncate">{token.name}</p>
                      <p className="text-white text-sm font-mono text-right self-center">{token.balance}</p>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {/* NFTs */}
          {activeTab === "nfts" && (
            <div>
              {loadingAssets ? (
                <div className="rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center py-16">
                  <FaCircleNotch className="animate-spin text-blue-500 text-2xl" />
                </div>
              ) : nfts.length === 0 ? (
                <div className="rounded-2xl bg-white/[0.03] border border-white/10 text-center py-16">
                  <FaImage className="text-4xl text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm">
                    No NFTs on {chainNames[activeChain]}.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {nfts.map((nft) => (
                    <div
                      key={`${nft.contractAddress}-${nft.tokenId}`}
                      className="rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 overflow-hidden transition-all group"
                    >
                      <div className="relative w-full aspect-square bg-white/5">
                        {nft.image ? (
                          <Image src={nft.image} alt={nft.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FaImage className="text-gray-700 text-3xl" />
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-white text-sm font-semibold truncate">{nft.name}</p>
                        <p className="text-gray-500 text-xs truncate mt-0.5">{nft.collection}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Send ETH */}
          <div className="mt-8">
            <SendTransaction />
          </div>

        </div>
      </section>
      <Footer />
    </main>
  );
}