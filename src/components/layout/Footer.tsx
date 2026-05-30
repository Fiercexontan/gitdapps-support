import Link from "next/link";
import {
  FaGithub,
  FaXTwitter,
  FaDiscord,
  FaTelegram,
} from "react-icons/fa6";

const footerLinks = {
  Product: ["Features", "Security", "Roadmap", "Changelog"],
  Developers: ["Documentation", "GitHub", "API", "Open Source"],
  Company: ["About", "Blog", "Careers", "Press"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
};

export default function Footer() {
  return (
    <footer className="relative bg-black border-t border-white/10 pt-16 pb-8 px-6 overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-blue-900/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Top Row */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-16">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold text-white mb-4"
            >
              <FaGithub className="text-white text-2xl" />
              Git<span className="text-blue-500">Dapps</span>
            </Link>

            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              The Web3 wallet platform built for developers and crypto
              natives. Connect, track, and manage your assets beautifully.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://github.com/Fiercexontan"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all duration-200"
              >
                <FaGithub />
              </a>

              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all duration-200"
              >
                <FaXTwitter />
              </a>

              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all duration-200"
              >
                <FaDiscord />
              </a>

              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all duration-200"
              >
                <FaTelegram />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white text-sm font-semibold mb-4">
                {category}
              </h4>

              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-gray-500 text-sm hover:text-white transition-colors duration-200"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs">
            © 2026 GitDapps. Built by{" "}
            <a
              href="https://github.com/Fiercexontan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-400 transition-colors"
            >
              Lincoln (@Fiercexontan)
            </a>
            . All rights reserved.
          </p>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-gray-600 text-xs">
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}