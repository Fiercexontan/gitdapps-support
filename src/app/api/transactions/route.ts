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

const EXPLORER_URLS: Record<string, string> = {
  ethereum: "https://etherscan.io/tx/",
  polygon: "https://polygonscan.com/tx/",
  arbitrum: "https://arbiscan.io/tx/",
  base: "https://basescan.org/tx/",
  optimism: "https://optimistic.etherscan.io/tx/",
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
    process.env.ADMIN_WALLET?.trim().toLowerCase();

  if (queryAddress && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const address = queryAddress || session.address;
  const alchemyUrl = CHAIN_URLS[chain] || CHAIN_URLS.ethereum;
  const explorerBase = EXPLORER_URLS[chain] || EXPLORER_URLS.ethereum;

  try {
    const categories = ["external", "internal", "erc20"];

    const [sentRes, receivedRes] = await Promise.all([
      fetch(alchemyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "alchemy_getAssetTransfers",
          params: [
            {
              fromBlock: "0x0",
              toBlock: "latest",
              fromAddress: address,
              category: categories,
              withMetadata: true,
              excludeZeroValue: true,
              maxCount: "0xA",
            },
          ],
        }),
      }),
      fetch(alchemyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 2,
          method: "alchemy_getAssetTransfers",
          params: [
            {
              fromBlock: "0x0",
              toBlock: "latest",
              toAddress: address,
              category: categories,
              withMetadata: true,
              excludeZeroValue: true,
              maxCount: "0xA",
            },
          ],
        }),
      }),
    ]);

    const sentData = await sentRes.json();
    const receivedData = await receivedRes.json();

    const sent = (sentData.result?.transfers || []).map((t: any) => ({
      hash: t.hash,
      from: t.from,
      to: t.to,
      value: t.value,
      asset: t.asset,
      category: t.category,
      blockNum: t.blockNum,
      timestamp: t.metadata?.blockTimestamp || null,
      direction: "sent",
      explorerUrl: `${explorerBase}${t.hash}`,
    }));

    const received = (receivedData.result?.transfers || []).map((t: any) => ({
      hash: t.hash,
      from: t.from,
      to: t.to,
      value: t.value,
      asset: t.asset,
      category: t.category,
      blockNum: t.blockNum,
      timestamp: t.metadata?.blockTimestamp || null,
      direction: "received",
      explorerUrl: `${explorerBase}${t.hash}`,
    }));

    const all = [...sent, ...received].sort((a, b) => {
      return parseInt(b.blockNum, 16) - parseInt(a.blockNum, 16);
    });

    return NextResponse.json({ transactions: all.slice(0, 20), chain });
  } catch (error) {
    console.error("Transactions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}