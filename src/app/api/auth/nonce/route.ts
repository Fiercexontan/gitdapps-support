import { NextResponse } from "next/server";
import { generateNonce } from "siwe";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";

export async function GET() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );
  const nonce = generateNonce();
  (session as any).nonce = nonce;
  await session.save();
  return NextResponse.json({ nonce });
}