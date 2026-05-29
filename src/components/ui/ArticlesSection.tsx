"use client";

import { useState, useEffect } from "react";
import {
  FaGithub,
  FaNewspaper,
  FaArrowUpRightFromSquare,
  FaStar,
  FaCodeFork,
} from "react-icons/fa6";
import Image from "next/image";

const articles = [
  {
    tag: "Web3 Wallets",
    tagColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    title: "Why Every Developer Should Understand Crypto Wallets in 2025",
    description:
      "Crypto wallets are no longer just for traders. As Web3 grows, understanding how wallets work — from private keys to smart contract interaction — is becoming a core developer skill.",
    author: "Lincoln",
    readTime: "5 min read",
  },
  {
    tag: "Blockchain",
    tagColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    title:
      "How Blockchain Technology is Reshaping Open Source Collaboration",
    description:
      "GitHub has long been the home of open source. Now blockchain protocols are introducing decentralized governance, token-based contributions, and on-chain reputation for developers.",
    author: "GitDapps Team",
    readTime: "4 min read",
  },
  {
    tag: "DeFi",
    tagColor: "text-green-400 bg-green-500/10 border-green-500/20",
    title:
      "DeFi Explained: Borrowing, Lending and Earning Without a Bank",
    description:
      "Decentralized Finance removes the middleman entirely. Learn how protocols like Aave and Compound allow anyone with a wallet to access financial services once reserved for institutions.",
    author: "GitDapps Team",
    readTime: "6 min read",
  },
  {
    tag: "Security",
    tagColor: "text-red-400 bg-red-500/10 border-red-500/20",
    title:
      "The Most Common Crypto Wallet Mistakes and How to Avoid Them",
    description:
      "From exposed seed phrases to signing malicious contracts, wallet security mistakes cost users billions each year. Here is what every Web3 user must know before connecting their wallet.",
    author: "Lincoln",
    readTime: "5 min read",
  },
  {
    tag: "GitHub + Web3",
    tagColor: "text-gray-300 bg-white/5 border-white/10",
    title:
      "Building Your Web3 Reputation on GitHub: A Developer Guide",
    description:
      "Your GitHub profile is your Web3 resume. Contributing to blockchain protocols, writing Solidity, and building dApps publicly signals serious credibility in the crypto developer space.",
    author: "GitDapps Team",
    readTime: "4 min read",
  },
  {
    tag: "Smart Contracts",
    tagColor: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    title: "Smart Contracts: The Code That Runs the New Internet",
    description:
      "Smart contracts are self-executing programs that live on the blockchain. They power everything from DeFi protocols to NFTs to DAOs — and they cannot be altered once deployed.",
    author: "Lincoln",
    readTime: "7 min read",
  },
];

const langColors: Record<string, string> = {
  TypeScript: "bg-blue-500",
  JavaScript: "bg-yellow-500",
  Python: "bg-green-500",
  Rust: "bg-orange-500",
  Go: "bg-cyan-500",
  Solidity: "bg-purple-500",
};

interface GitHubRepo {
  id: number;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  owner: {
    avatar_url: string;
    login: string;
  };
}

function formatNumber(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

export default function ArticlesSection() {
  const [activeTab, setActiveTab] = useState<"articles" | "github">(
    "articles"
  );

  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(true);
  const [errorRepos, setErrorRepos] = useState(false);

  useEffect(() => {
    const fetchRepos = async () => {
      setLoadingRepos(true);
      setErrorRepos(false);

      try {
        const res = await fetch(
          "https://api.github.com/search/repositories?q=topic:blockchain+topic:cryptocurrency&sort=stars&order=desc&per_page=6"
        );

        const data = await res.json();

        setRepos(data.items || []);
      } catch {
        setErrorRepos(true);
      } finally {
        setLoadingRepos(false);
      }
    };

    fetchRepos();
  }, []);

  return (
    <section className="relative bg-black py-24 px-6 overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[400px] h-[300px] bg-blue-800/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <FaNewspaper className="text-blue-400" />

            <span className="text-blue-400 text-sm font-semibold tracking-widest uppercase">
              Articles and Insights
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-2">
            Learn the ecosystem.{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Build with confidence.
            </span>
          </h2>

          <p className="text-gray-500 mt-2 text-sm">
            Insights on crypto wallets, blockchain development, DeFi, and
            trending GitHub projects.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab("articles")}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              activeTab === "articles"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                : "bg-white/5 text-gray-400 hover:text-white border border-white/10 hover:border-white/20"
            }`}
          >
            <FaNewspaper />
            Articles
          </button>

          <button
            onClick={() => setActiveTab("github")}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              activeTab === "github"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                : "bg-white/5 text-gray-400 hover:text-white border border-white/10 hover:border-white/20"
            }`}
          >
            <FaGithub />
            GitHub Trending
          </button>
        </div>

        {/* Articles Grid */}
        {activeTab === "articles" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map((item, i) => (
              <div
                key={i}
                className="group flex flex-col p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-500/30 hover:bg-white/[0.06] transition-all duration-300 cursor-pointer"
              >
                <span
                  className={`self-start text-[10px] font-semibold uppercase tracking-wider border px-2.5 py-0.5 rounded-full mb-3 ${item.tagColor}`}
                >
                  {item.tag}
                </span>

                <h3 className="text-white text-sm font-semibold leading-snug line-clamp-2 group-hover:text-blue-300 transition-colors flex-1">
                  {item.title}
                </h3>

                <p className="text-gray-500 text-xs mt-2 leading-relaxed line-clamp-3">
                  {item.description}
                </p>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                      <FaGithub className="text-white text-[10px]" />
                    </div>

                    <span className="text-gray-600 text-xs">
                      {item.author}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-gray-600 text-xs group-hover:text-blue-400 transition-colors">
                    {item.readTime}

                    <FaArrowUpRightFromSquare className="text-[10px]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* GitHub Trending Grid */}
        {activeTab === "github" && (
          <div>
            {/* Loading */}
            {loadingRepos && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-44 rounded-2xl bg-white/5 border border-white/10 animate-pulse"
                  />
                ))}
              </div>
            )}

            {/* Error */}
            {errorRepos && !loadingRepos && (
              <div className="text-center py-16 text-gray-500">
                <FaGithub className="text-5xl mx-auto mb-4 opacity-20" />

                <p>Could not load GitHub repos. Try again later.</p>
              </div>
            )}

            {/* Repos */}
            {!loadingRepos && !errorRepos && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {repos.map((repo) => (
                  <a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/40 hover:bg-white/[0.06] transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/10 flex-shrink-0">
                        <Image
                          src={repo.owner.avatar_url}
                          alt={repo.owner.login}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="text-white text-sm font-semibold truncate group-hover:text-purple-300 transition-colors">
                          {repo.full_name}
                        </p>

                        <p className="text-gray-600 text-xs">
                          {repo.owner.login}
                        </p>
                      </div>

                      <FaArrowUpRightFromSquare className="text-gray-600 group-hover:text-purple-400 transition-colors ml-auto flex-shrink-0 text-xs" />
                    </div>

                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 flex-1">
                      {repo.description || "No description provided."}
                    </p>

                    <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/5">
                      {repo.language && (
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              langColors[repo.language] || "bg-gray-500"
                            }`}
                          />

                          <span className="text-gray-500 text-xs">
                            {repo.language}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-1 text-gray-500 text-xs">
                        <FaStar className="text-yellow-500/70" />

                        {formatNumber(repo.stargazers_count)}
                      </div>

                      <div className="flex items-center gap-1 text-gray-500 text-xs">
                        <FaCodeFork className="text-gray-500" />

                        {formatNumber(repo.forks_count)}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}