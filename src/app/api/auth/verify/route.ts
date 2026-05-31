import { NextRequest, NextResponse } from "next/server";
import { SiweMessage } from "siwe";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models";

export async function POST(req: NextRequest) {
  try {
    const { message, signature } = await req.json();
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions
    );

    const siweMessage = new SiweMessage(message);
    const { data: fields } = await siweMessage.verify({
      signature,
      nonce: (session as any).nonce,
    });

    await connectDB();

    const existing = await User.findOne({
      address: fields.address.toLowerCase(),
    });

    if (existing) {
      await User.updateOne(
        { address: fields.address.toLowerCase() },
        { lastLogin: new Date(), $inc: { loginCount: 1 } }
      );
    } else {
      await User.create({ address: fields.address.toLowerCase() });
    }

    session.address = fields.address.toLowerCase();
    session.isLoggedIn = true;
    await session.save();

    return NextResponse.json({ ok: true, address: fields.address });
  } catch (error) {
    console.error("SIWE verify error:", error);
    return NextResponse.json({ ok: false, error: "Verification failed" }, { status: 401 });
  }
}