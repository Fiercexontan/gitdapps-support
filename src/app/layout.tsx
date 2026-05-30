import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Providers from "@/lib/providers";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GitDapps — Web3 Wallet Platform",
  description: "Connect your wallet. Own your assets.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-black antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}