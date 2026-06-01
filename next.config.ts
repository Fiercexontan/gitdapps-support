import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "images.cryptocompare.com" },
      { protocol: "https", hostname: "www.cryptocompare.com" },
      { protocol: "https", hostname: "nft-cdn.alchemy.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "ipfs.io" },
      { protocol: "https", hostname: "**.ipfs.dweb.link" },
    ],
  },
};

export default nextConfig;