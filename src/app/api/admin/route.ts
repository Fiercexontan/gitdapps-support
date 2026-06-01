import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models";

export async function GET() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );

  if (!session.isLoggedIn || !session.address) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminWallet = process.env.ADMIN_WALLET?.toLowerCase();

  if (session.address.toLowerCase() !== adminWallet) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await connectDB();

  const users = await User.find({})
    .sort({ lastLogin: -1 })
    .lean();

  return NextResponse.json({ users });
}