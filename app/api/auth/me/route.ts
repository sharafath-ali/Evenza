import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import db from "@/lib/db";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth";

/* ─── GET /api/auth/me ───────────────────────────────────────────────────── */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    /* ── Verify JWT ── */
    let payload;
    try {
      payload = await verifyToken(token);
    } catch {
      return NextResponse.json(
        { error: "Invalid or expired session" },
        { status: 401 }
      );
    }

    /* ── Fetch fresh user from DB ── */
    const user = await db("users")
      .where({ id: payload.sub })
      .select("id", "name", "email", "created_at")
      .first();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
    });
  } catch (error) {
    console.error("[GET /api/auth/me]", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
