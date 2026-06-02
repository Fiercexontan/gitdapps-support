"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import {
  FaArrowLeft,
  FaCircleNotch,
  FaEthereum,
  FaWallet,
  FaImage,
  FaCopy,
  FaCheck,
} from "react-icons/fa6";

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

export default function WalletDetailPage() {
  const { address } = useParams();
  const router = useRouter();
  const [ethBalance, setEthBalance] = useState<string | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"tokens" | "nfts">("tokens");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const walletAddress = (Array.isArray(address) ? address[0] : address) as string;

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError("");
      try {
        const [assetsRes, nftsRes] = await Promise.all([
          fetch(`/api/assets?address=${walletAddress}`),
          fetch(`/api/nfts?address=${walletAddress}`),
        ]);

        if (assetsRes.status === 401 || assetsRes.status === 403) {
          router.push("/");
          return;
        }

        const assetsData = await assetsRes.json();
        const nftsData = await nftsRes.json();

        setEthBalance(assetsData.ethBalance);
        setTokens(assetsData.tokens || []);
        setNfts(nftsData.nfts || []);
      } catch {
        setError("Failed to load wallet data.");
      } finally {
        setLoading(false);
      }
    };

    if (walletAddress) fetchAll();
  }, [walletAddress]);

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shortAddress = (addr: string) =>
    `${addr.slice(0, 8)}...${addr.slice(-6)}`;

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Back Button */}
          <button
            onClick={() => router.push("/admin")}
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors"
          >
            <FaArrowLeft />
            Back to Admin
          </button>

          {/* Header */}
          <div className="flex items-start justify-between mb-10 flex-wrap gap-4">
            <div>
              <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-1">
                Wallet Detail
              </p>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white font-mono">
                {shortAddress(walletAddress)}
              </h1>
            </div>
            <button
              onClick={copyAddress}
              className="flex items-center gap-2 text-gray-400 hover:text-white border border-white/10 hover:border-white/30 px-4 py-2 rounded-full text-sm transition-all"
            >
              {copied ? (
                <FaCheck className="text-green-400" />
              ) : (
                <FaCopy />
              )}
              {copied ? "Copied" : "Copy Address"}
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <FaCircleNotch className="animate-spin text-blue-500 text-3xl" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-400">{error}</p>
            </div>
          ) : (
            <>
              {/* ETH Balance Card */}
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 mb-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-xl">
                  <FaEthereum />
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
                    ETH Balance
                  </p>
                  <p className="text-white text-2xl font-extrabold">
                    {ethBalance ?? "0.000000"} ETH
                  </p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={() => setActiveTab("tokens")}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    activeTab === "tokens"
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                      : "bg-white/5 text-gray-400 hover:text-white border border-white/10"
                  }`}
                >
                  Tokens ({tokens.length})
                </button>
                <button
                  onClick={() => setActiveTab("nfts")}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    activeTab === "nfts"
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                      : "bg-white/5 text-gray-400 hover:text-white border border-white/10"
                  }`}
                >
                  NFTs ({nfts.length})
                </button>
              </div>

              {/* Tokens Tab */}
              {activeTab === "tokens" && (
                <div className="rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden">
                  {tokens.length === 0 ? (
                    <div className="text-center py-16">
                      <FaWallet className="text-4xl text-gray-700 mx-auto mb-3" />
                      <p className="text-gray-600 text-sm">
                        No tokens found for this wallet.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-3 gap-4 px-6 py-3 border-b border-white/10 bg-white/[0.02]">
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                          Token
                        </p>
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                          Name
                        </p>
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider text-right">
                          Balance
                        </p>
                      </div>
                      {tokens.map((token, i) => (
                        <div
                          key={token.address}
                          className={`grid grid-cols-3 gap-4 px-6 py-4 hover:bg-white/[0.03] transition-colors ${
                            i !== tokens.length - 1
                              ? "border-b border-white/5"
                              : ""
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {token.logo ? (
                              <Image
                                src={token.logo}
                                alt={token.symbol}
                                width={28}
                                height={28}
                                className="rounded-full"
                              />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">
                                {token.symbol.slice(0, 2)}
                              </div>
                            )}
                            <span className="text-white text-sm font-semibold">
                              {token.symbol}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm self-center truncate">
                            {token.name}
                          </p>
                          <p className="text-white text-sm font-mono text-right self-center">
                            {token.balance}
                          </p>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}

              {/* NFTs Tab */}
              {activeTab === "nfts" && (
                <div>
                  {nfts.length === 0 ? (
                    <div className="rounded-2xl bg-white/[0.03] border border-white/10 text-center py-16">
                      <FaImage className="text-4xl text-gray-700 mx-auto mb-3" />
                      <p className="text-gray-600 text-sm">
                        No NFTs found for this wallet.
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
                              <Image
                                src={nft.image}
                                alt={nft.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FaImage className="text-gray-700 text-3xl" />
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <p className="text-white text-sm font-semibold truncate">
                              {nft.name}
                            </p>
                            <p className="text-gray-500 text-xs truncate mt-0.5">
                              {nft.collection}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}