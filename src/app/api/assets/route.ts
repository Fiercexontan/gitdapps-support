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
  const alchemyUrl = process.env.ALCHEMY_API_URL!;

  try {
    // ETH Balance
    const balanceRes = await fetch(alchemyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getBalance",
        params: [address, "latest"],
      }),
    });
    const balanceData = await balanceRes.json();
    const ethBalance = parseInt(balanceData.result, 16) / 1e18;

    // Token Balances
    const tokenBalanceRes = await fetch(alchemyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 2,
        method: "alchemy_getTokenBalances",
        params: [address, "erc20"],
      }),
    });
    const tokenBalanceData = await tokenBalanceRes.json();
    const tokenBalances =
      tokenBalanceData.result?.tokenBalances || [];

    const nonZeroTokens = tokenBalances.filter(
      (t: any) =>
        t.tokenBalance &&
        BigInt(t.tokenBalance) > BigInt(0)
    );

    const tokenDetails = await Promise.all(
      nonZeroTokens.slice(0, 10).map(async (token: any) => {
        const metaRes = await fetch(alchemyUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "alchemy_getTokenMetadata",
            params: [token.contractAddress],
          }),
        });
        const meta = await metaRes.json();
        const decimals = meta.result?.decimals || 18;
        const balance =
          Number(BigInt(token.tokenBalance)) /
          Math.pow(10, decimals);
        return {
          address: token.contractAddress,
          symbol: meta.result?.symbol || "???",
          name: meta.result?.name || "Unknown Token",
          logo: meta.result?.logo || null,
          balance: balance.toFixed(4),
        };
      })
    );

    return NextResponse.json({
      ethBalance: ethBalance.toFixed(6),
      tokens: tokenDetails,
    });
  } catch (error) {
    console.error("Assets error:", error);
    return NextResponse.json(
      { error: "Failed to fetch assets" },
      { status: 500 }
    );
  }
}