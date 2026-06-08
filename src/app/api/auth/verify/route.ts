import { NextRequest, NextResponse } from "next/server";
import { SiweMessage } from "siwe";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendLoginNotification(address: string, isNewUser: boolean, loginCount: number) {
  try {
    await resend.emails.send({
      from: "GitDapps <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL!,
      subject: isNewUser
        ? `🆕 New Wallet Connected — ${address.slice(0, 8)}...${address.slice(-6)}`
        : `🔁 Wallet Signed In — ${address.slice(0, 8)}...${address.slice(-6)}`,
      html: `
        <div style="font-family: sans-serif; background: #0a0a0a; color: #ffffff; padding: 32px; border-radius: 12px; max-width: 520px; margin: 0 auto;">
          
          <div style="margin-bottom: 24px;">
            <span style="background: #1d4ed8; color: white; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; padding: 4px 10px; border-radius: 20px;">
              ${isNewUser ? "New User" : "Returning User"}
            </span>
          </div>

          <h1 style="font-size: 22px; font-weight: 800; margin: 0 0 8px 0; color: #ffffff;">
            ${isNewUser ? "New Wallet Connected" : "Wallet Signed In"}
          </h1>
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 28px 0;">
            ${new Date().toUTCString()}
          </p>

          <div style="background: #111111; border: 1px solid #1f2937; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
            <p style="color: #6b7280; font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; margin: 0 0 6px 0;">
              Wallet Address
            </p>
            <p style="color: #60a5fa; font-family: monospace; font-size: 14px; word-break: break-all; margin: 0;">
              ${address}
            </p>
          </div>

          <div style="display: grid; gap: 12px;">
            <div style="background: #111111; border: 1px solid #1f2937; border-radius: 10px; padding: 16px;">
              <p style="color: #6b7280; font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; margin: 0 0 4px 0;">
                Total Logins
              </p>
              <p style="color: #ffffff; font-size: 20px; font-weight: 800; margin: 0;">
                ${loginCount}x
              </p>
            </div>
          </div>

          <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #1f2937;">
            <a href="https://gitdapps-support.vercel.app/admin" 
               style="background: #1d4ed8; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px;">
              View Admin Panel →
            </a>
          </div>

          <p style="color: #374151; font-size: 11px; margin-top: 24px; margin-bottom: 0;">
            GitDapps Admin Notifications
          </p>
        </div>
      `,
    });
  } catch (emailError) {
    // Email failure should never break login — just log it
    console.error("Email notification failed:", emailError);
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

    // Send email notification — runs after DB save, never blocks login
    await sendLoginNotification(
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