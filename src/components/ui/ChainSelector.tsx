"use client";

const chains = [
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    color: "bg-blue-500/10 border-blue-500/30 text-blue-400",
    active: "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/30",
    dot: "bg-blue-400",
  },
  {
    id: "polygon",
    name: "Polygon",
    symbol: "MATIC",
    color: "bg-purple-500/10 border-purple-500/30 text-purple-400",
    active: "bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-600/30",
    dot: "bg-purple-400",
  },
  {
    id: "arbitrum",
    name: "Arbitrum",
    symbol: "ARB",
    color: "bg-sky-500/10 border-sky-500/30 text-sky-400",
    active: "bg-sky-600 text-white border-sky-600 shadow-lg shadow-sky-600/30",
    dot: "bg-sky-400",
  },
  {
    id: "base",
    name: "Base",
    symbol: "BASE",
    color: "bg-indigo-500/10 border-indigo-500/30 text-indigo-400",
    active: "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/30",
    dot: "bg-indigo-400",
  },
  {
    id: "optimism",
    name: "Optimism",
    symbol: "OP",
    color: "bg-red-500/10 border-red-500/30 text-red-400",
    active: "bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/30",
    dot: "bg-red-400",
  },
];

interface ChainSelectorProps {
  activeChain: string;
  onChange: (chain: string) => void;
}

export default function ChainSelector({
  activeChain,
  onChange,
}: ChainSelectorProps) {
  return (
    <div className="mb-6">
      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">
        Select Network
      </p>
      <div className="flex flex-wrap gap-2">
        {chains.map((chain) => (
          <button
            key={chain.id}
            onClick={() => onChange(chain.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 ${
              activeChain === chain.id ? chain.active : chain.color
            }`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                activeChain === chain.id ? "bg-white" : chain.dot
              }`}
            />
            {chain.name}
          </button>
        ))}
      </div>
    </div>
  );
}