import { NextRequest, NextResponse } from "next/server";

const CHAIN_IDS: Record<string, string> = {
  ethereum: "ethereum",
  polygon: "matic-network",
  arbitrum: "ethereum",
  base: "ethereum",
  optimism: "ethereum",
};

const NATIVE_SYMBOLS: Record<string, string> = {
  ethereum: "ethereum",
  polygon: "matic-network",
  arbitrum: "ethereum",
  base: "ethereum",
  optimism: "ethereum",
};

export async function POST(req: NextRequest) {
  try {
    const { symbols, chain } = await req.json();

    const nativeId = NATIVE_SYMBOLS[chain] || "ethereum";
    const allIds = [nativeId, ...symbols].join(",");

    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${allIds}&vs_currencies=usd&include_24hr_change=true`,
      { next: { revalidate: 60 } }
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Price fetch error:", error);
    return NextResponse.json({}, { status: 500 });
  }
}