import { NextRequest, NextResponse } from "next/server";
import { SiweMessage } from "siwe";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models";

async function sendDiscordNotification(
  address: string,
  isNewUser: boolean,
  loginCount: number
) {
  try {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) return;

    const shortAddr = `${address.slice(0, 8)}...${address.slice(-6)}`;
    const now = new Date().toUTCString();

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [
          {
            title: isNewUser
              ? "🆕 New Wallet Connected"
              : "🔁 Wallet Signed In",
            color: isNewUser ? 0x3b82f6 : 0x8b5cf6,
            fields: [
              {
                name: "Wallet Address",
                value: `\`${address}\``,
                inline: false,
              },
              {
                name: "Short",
                value: shortAddr,
                inline: true,
              },
              {
                name: "Total Logins",
                value: `${loginCount}x`,
                inline: true,
              },
              {
                name: "Type",
                value: isNewUser ? "New User 🆕" : "Returning User 🔁",
                inline: true,
              },
              {
                name: "Time",
                value: now,
                inline: false,
              },
            ],
            footer: {
              text: "GitDapps Admin Alerts",
            },
          },
        ],
      }),
    });
  } catch (discordError) {
    // Never block login if Discord fails
    console.error("Discord notification failed:", discordError);
  }
}

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

    let loginCount = 1;

    if (existing) {
      await User.updateOne(
        { address: fields.address.toLowerCase() },
        { lastLogin: new Date(), $inc: { loginCount: 1 } }
      );
      loginCount = (existing.loginCount || 0) + 1;
    } else {
      await User.create({ address: fields.address.toLowerCase() });
    }

    // Send Discord notification — never blocks login if it fails
    await sendDiscordNotification(
      fields.address.toLowerCase(),
      !existing,
      loginCount
    );

    session.address = fields.address.toLowerCase();
    session.isLoggedIn = true;
    await session.save();

    return NextResponse.json({ ok: true, address: fields.address });
  } catch (error) {
    console.error("SIWE verify error:", error);
    return NextResponse.json(
      { ok: false, error: "Verification failed" },
      { status: 401 }
    );
  }
}