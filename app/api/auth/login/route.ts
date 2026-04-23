import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import db from "@/lib/db";
import {
  verifyPassword,
  signToken,
  SESSION_COOKIE,
  COOKIE_OPTIONS,
} from "@/lib/auth";

/* ─── POST /api/auth/login ───────────────────────────────────────────────── */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body ?? {};

    /* ── Validation ── */
    if (!email?.trim() || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    /* ── Look up user ── */
    const user = await db("users")
      .where({ email: email.toLowerCase().trim() })
      .first();

    if (!user) {
      // Return a generic message to avoid email enumeration
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    /* ── Verify password ── */
    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    /* ── Issue JWT ── */
    const token = await signToken({
      sub: user.id,
      email: user.email,
      name: user.name,
    });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, token, COOKIE_OPTIONS);

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("[POST /api/auth/login]", error);
    return NextResponse.json({ error: "Failed to log in" }, { status: 500 });
  }
}
