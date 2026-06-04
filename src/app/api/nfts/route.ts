import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";

const CHAIN_URLS: Record<string, string> = {
  ethereum: process.env.ALCHEMY_API_URL!,
  polygon: process.env.ALCHEMY_POLYGON_URL!,
  arbitrum: process.env.ALCHEMY_ARBITRUM_URL!,
  base: process.env.ALCHEMY_BASE_URL!,
  optimism: process.env.ALCHEMY_OPTIMISM_URL!,
};

const NFT_HOSTS: Record<string, string> = {
  ethereum: "eth-mainnet.g.alchemy.com",
  polygon: "polygon-mainnet.g.alchemy.com",
  arbitrum: "arb-mainnet.g.alchemy.com",
  base: "base-mainnet.g.alchemy.com",
  optimism: "opt-mainnet.g.alchemy.com",
};

export async function GET(req: NextRequest) {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );

  if (!session.isLoggedIn || !session.address) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const queryAddress = searchParams.get("address");
  const chain = searchParams.get("chain") || "ethereum";
  const isAdmin =
    session.address.toLowerCase() ===
    process.env.ADMIN_WALLET?.toLowerCase();

  if (queryAddress && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const address = queryAddress || session.address;
  const alchemyUrl = CHAIN_URLS[chain] || CHAIN_URLS.ethereum;
  const apiKey = alchemyUrl.split("/v2/")[1];
  const nftHost = NFT_HOSTS[chain] || NFT_HOSTS.ethereum;
  const nftBaseUrl = `https://${nftHost}/nft/v3/${apiKey}`;

  try {
    const res = await fetch(
      `${nftBaseUrl}/getNFTsForOwner?owner=${address}&withMetadata=true&pageSize=9`
    );
    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ nfts: [] });
    }

    const nfts = (data.ownedNfts || []).map((nft: any) => ({
      tokenId: nft.tokenId,
      name: nft.name || `#${nft.tokenId}`,
      collection: nft.contract?.name || "Unknown Collection",
      image:
        nft.image?.thumbnailUrl ||
        nft.image?.cachedUrl ||
        nft.image?.originalUrl ||
        null,
      contractAddress: nft.contract?.address,
    }));

    return NextResponse.json({ nfts, chain });
  } catch (error) {
    console.error("NFT error:", error);
    return NextResponse.json({ nfts: [] });
  }
}