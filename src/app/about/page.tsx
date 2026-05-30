import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FaGithub, FaBolt, FaShieldHalved, FaUsers } from "react-icons/fa6";

const values = [
  {
    icon: <FaShieldHalved />,
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    title: "Non-Custodial First",
    description:
      "We never hold your keys or funds. GitDapps is a read-and-interact layer — your wallet stays yours, always.",
  },
  {
    icon: <FaBolt />,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/20",
    title: "Built for Speed",
    description:
      "Every interaction is optimized. From wallet connection to asset display, GitDapps is engineered to be instant.",
  },
  {
    icon: <FaUsers />,
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    title: "Community Driven",
    description:
      "GitDapps is open source and built in public. Every commit is visible, every decision is transparent.",
  },
  {
    icon: <FaGithub />,
    color: "text-white",
    bg: "bg-white/5 border-white/10",
    title: "Developer Native",
    description:
      "Built by a developer, for developers. Deep GitHub integration means your on-chain identity meets your open source work.",
  },
];

const stack = [
  { name: "Next.js", color: "bg-white/10 text-white" },
  { name: "React", color: "bg-blue-500/10 text-blue-400" },
  { name: "Tailwind CSS", color: "bg-cyan-500/10 text-cyan-400" },
  { name: "TypeScript", color: "bg-blue-600/10 text-blue-300" },
  { name: "wagmi", color: "bg-purple-500/10 text-purple-400" },
  { name: "RainbowKit", color: "bg-pink-500/10 text-pink-400" },
  { name: "Node.js", color: "bg-green-500/10 text-green-400" },
  { name: "Vercel", color: "bg-white/10 text-white" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-40 pb-24 px-6 text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="text-blue-400 text-sm font-semibold tracking-widest uppercase">
            About GitDapps
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mt-4 leading-tight">
            Web3 built for{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              real people.
            </span>
          </h1>
          <p className="text-gray-400 mt-6 text-lg leading-relaxed">
            GitDapps started as a vision to make Web3 accessible, beautiful, and
            trustworthy. We believe connecting your crypto wallet should feel as
            natural as logging into a website.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
              Our Mission
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              The crypto world is powerful but often intimidating. Wallets are
              fragmented, interfaces are confusing, and trust is hard to earn.
              GitDapps fixes that.
            </p>
            <p className="text-gray-400 leading-relaxed">
              We are building the platform that bridges your GitHub developer
              identity with your on-chain wallet activity — giving you one clean,
              beautiful place to manage everything.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                L
              </div>
              <div>
                <p className="text-white font-semibold">Lincoln</p>
                <p className="text-gray-500 text-xs">Founder & Developer</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed italic">
              &quot;I built GitDapps because I wanted a wallet platform that felt
              like a product — not a tool. Something fast, clean, and
              connected to how developers actually work.&quot;
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="https://github.com/Fiercexontan"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-xs transition-colors"
              >
                <FaGithub />
                github.com/Fiercexontan
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-10 text-center">
            What we stand for
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((value, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className={`w-10 h-10 rounded-xl border ${value.bg} flex items-center justify-center ${value.color} text-base mb-4`}>
                  {value.icon}
                </div>
                <h3 className="text-white font-semibold text-sm mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
            Built with modern tech
          </h2>
          <p className="text-gray-500 text-sm mb-10">
            Every tool in our stack was chosen for performance, scalability, and
            developer experience.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {stack.map((tech) => (
              <span
                key={tech.name}
                className={`px-4 py-2 rounded-full text-xs font-semibold border border-white/10 ${tech.color}`}
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}