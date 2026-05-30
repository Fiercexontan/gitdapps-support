import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  FaWallet,
  FaLink,
  FaChartLine,
  FaShieldHalved,
  FaCircleQuestion,
  FaCodeBranch,
} from "react-icons/fa6";

const sections = [
  {
    id: "getting-started",
    icon: <FaWallet />,
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    title: "Getting Started",
    content: [
      {
        heading: "How to connect your wallet",
        body: "Click the Connect Wallet button in the top navigation bar or the hero section. A modal will appear showing all supported wallets. Select your wallet, approve the connection request, and you are in.",
      },
      {
        heading: "No account required",
        body: "GitDapps does not require email sign-up or passwords. Your wallet IS your identity. Connection is instant and non-custodial — we never store your private keys.",
      },
    ],
  },
  {
    id: "supported-wallets",
    icon: <FaLink />,
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    title: "Supported Wallets",
    content: [
      {
        heading: "Browser extension wallets",
        body: "MetaMask, Coinbase Wallet, Brave Wallet, and any injected Web3 provider are fully supported on desktop browsers.",
      },
      {
        heading: "Mobile wallets",
        body: "Phantom, Trust Wallet, Rainbow, and WalletConnect-compatible mobile wallets can connect by scanning a QR code from the connection modal.",
      },
    ],
  },
  {
    id: "supported-chains",
    icon: <FaCodeBranch />,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
    title: "Supported Chains",
    content: [
      {
        heading: "EVM-compatible chains",
        body: "Ethereum Mainnet, Polygon, Arbitrum One, Optimism, Base, BNB Smart Chain, Avalanche, and all major EVM testnets are supported.",
      },
      {
        heading: "Switching networks",
        body: "Once connected, you can switch between supported chains directly from your wallet. GitDapps automatically detects the active chain and updates your asset display.",
      },
    ],
  },
  {
    id: "asset-tracking",
    icon: <FaChartLine />,
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/20",
    title: "Asset Tracking",
    content: [
      {
        heading: "What assets are displayed",
        body: "After connecting, GitDapps reads your wallet's public on-chain data and displays native token balances, ERC-20 tokens, and NFTs where supported.",
      },
      {
        heading: "Real-time updates",
        body: "Balances and prices update in real time. Any incoming or outgoing transaction is reflected immediately without needing to refresh the page.",
      },
    ],
  },
  {
    id: "security",
    icon: <FaShieldHalved />,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/20",
    title: "Security",
    content: [
      {
        heading: "What we can and cannot access",
        body: "GitDapps can only read your public wallet address and on-chain data. We cannot access private keys, sign transactions without your approval, or move any funds.",
      },
      {
        heading: "Every action requires your approval",
        body: "Any transaction — sending, swapping, or interacting with a contract — will always trigger a confirmation in your wallet. GitDapps never acts without explicit user approval.",
      },
    ],
  },
  {
    id: "faq",
    icon: <FaCircleQuestion />,
    color: "text-pink-400",
    bg: "bg-pink-500/10 border-pink-500/20",
    title: "FAQ",
    content: [
      {
        heading: "Is GitDapps free to use?",
        body: "Yes. GitDapps is completely free. We do not charge for wallet connection, asset viewing, or any read operations. Network gas fees for transactions are paid directly by you to the blockchain.",
      },
      {
        heading: "Is my data stored anywhere?",
        body: "No personal data is stored on our servers. Your wallet address is used only client-side to fetch on-chain data. We do not track, sell, or store any user data.",
      },
      {
        heading: "What if my wallet is not listed?",
        body: "If your wallet supports WalletConnect or is an injected Web3 provider, it will work with GitDapps. Open the connection modal and look for the WalletConnect option to scan with any compatible wallet.",
      },
    ],
  },
];

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Header */}
      <section className="relative pt-40 pb-16 px-6 text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="text-blue-400 text-sm font-semibold tracking-widest uppercase">
            Documentation
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-4 leading-tight">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              get started.
            </span>
          </h1>
          <p className="text-gray-400 mt-4 text-base">
            Simple, clear guides for connecting your wallet and using GitDapps.
          </p>
        </div>
      </section>

      {/* Docs Content */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {sections.map((section) => (
            <div
              key={section.id}
              id={section.id}
              className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl border ${section.bg} flex items-center justify-center ${section.color} text-base`}>
                  {section.icon}
                </div>
                <h2 className="text-white font-bold text-lg">
                  {section.title}
                </h2>
              </div>

              {/* Section Content */}
              <div className="space-y-5">
                {section.content.map((item, i) => (
                  <div key={i} className="pl-4 border-l border-white/10">
                    <h3 className="text-white text-sm font-semibold mb-1">
                      {item.heading}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}