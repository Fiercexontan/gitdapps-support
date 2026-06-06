"use client";

import { useEffect, useState } from "react";
import {
  FaChartPie,
  FaArrowUp,
  FaArrowDown,
  FaCircleNotch,
} from "react-icons/fa6";

interface Token {
  symbol: string;
  name: string;
  balance: string;
  logo: string | null;
}

interface PortfolioSummaryProps {
  nativeBalance: string;
  tokens: Token[];
  chain: string;
}

interface PriceData {
  usd: number;
  usd_24h_change?: number;
}

const SYMBOL_TO_COINGECKO: Record<string, string> = {
  ETH: "ethereum",
  MATIC: "matic-network",
  USDT: "tether",
  USDC: "usd-coin",
  DAI: "dai",
  WETH: "weth",
  WBTC: "wrapped-bitcoin",
  UNI: "uniswap",
  LINK: "chainlink",
  AAVE: "aave",
  OP: "optimism",
  ARB: "arbitrum",
};

const NATIVE_SYMBOLS: Record<string, string> = {
  ethereum: "ETH",
  polygon: "MATIC",
  arbitrum: "ETH",
  base: "ETH",
  optimism: "ETH",
};

export default function PortfolioSummary({
  nativeBalance,
  tokens,
  chain,
}: PortfolioSummaryProps) {
  const [prices, setPrices] = useState<Record<string, PriceData>>({});
  const [loading, setLoading] = useState(true);

  const nativeSymbol = NATIVE_SYMBOLS[chain] || "ETH";

  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true);
      try {
        const symbolIds = tokens
          .map((t) => SYMBOL_TO_COINGECKO[t.symbol.toUpperCase()])
          .filter(Boolean);

        const nativeId =
          SYMBOL_TO_COINGECKO[nativeSymbol] || "ethereum";

        const allIds = [...new Set([nativeId, ...symbolIds])];

        const res = await fetch("/api/prices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            symbols: allIds,
            chain,
          }),
        });
        const data = await res.json();
        setPrices(data);
      } catch {
        console.error("Failed to fetch prices");
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, [nativeBalance, tokens, chain]);

  const nativeId =
    SYMBOL_TO_COINGECKO[nativeSymbol] || "ethereum";
  const nativePrice = prices[nativeId]?.usd || 0;
  const nativeValue =
    parseFloat(nativeBalance || "0") * nativePrice;

  const tokenValues = tokens.map((token) => {
    const id =
      SYMBOL_TO_COINGECKO[token.symbol.toUpperCase()];
    const price = id ? prices[id]?.usd || 0 : 0;
    const value = parseFloat(token.balance) * price;
    const change24h = id
      ? prices[id]?.usd_24h_change || 0
      : 0;
    return { ...token, price, value, change24h };
  });

  const totalValue =
    nativeValue +
    tokenValues.reduce((acc, t) => acc + t.value, 0);

  const allAssets = [
    {
      symbol: nativeSymbol,
      name: chain.charAt(0).toUpperCase() + chain.slice(1),
      balance: nativeBalance,
      value: nativeValue,
      price: nativePrice,
      change24h: prices[nativeId]?.usd_24h_change || 0,
      logo: null,
    },
    ...tokenValues,
  ].filter((a) => a.value > 0);

  if (loading) {
    return (
      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
        <FaCircleNotch className="animate-spin text-blue-400" />
        <span className="text-gray-500 text-sm">
          Loading portfolio value...
        </span>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 mb-8">

      {/* Total Value */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
          <FaChartPie />
        </div>
        <div>
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
            Total Portfolio Value
          </p>
          <p className="text-white text-3xl font-extrabold">
            ${totalValue.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>

      {/* Asset Breakdown */}
      {allAssets.length > 0 ? (
        <div className="space-y-3">
          {allAssets.map((asset, i) => {
            const percentage =
              totalValue > 0
                ? (asset.value / totalValue) * 100
                : 0;
            return (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-semibold">
                      {asset.symbol}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {parseFloat(asset.balance).toFixed(4)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex items-center gap-1 text-xs ${
                        asset.change24h >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {asset.change24h >= 0 ? (
                        <FaArrowUp />
                      ) : (
                        <FaArrowDown />
                      )}
                      {Math.abs(asset.change24h).toFixed(2)}%
                    </div>
                    <span className="text-white text-sm font-semibold">
                      ${asset.value.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-600 text-sm text-center py-4">
          No assets with known USD value on this chain.
        </p>
      )}
    </div>
  );
}