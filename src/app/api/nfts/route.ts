import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";

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
  const isAdmin =
    session.address.toLowerCase() ===
    process.env.ADMIN_WALLET?.toLowerCase();

  if (queryAddress && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const address = queryAddress || session.address;
  const alchemyUrl = process.env.ALCHEMY_API_URL;
  const baseUrl = alchemyUrl!.replace("/v2/", "/nft/v3/");

  try {
    const res = await fetch(
      `${baseUrl}/getNFTsForOwner?owner=${address}&withMetadata=true&pageSize=9`
    );
    const data = await res.json();

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

    return NextResponse.json({ nfts });
  } catch (error) {
    console.error("NFT fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch NFTs" },
      { status: 500 }
    );
  }
}