import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import db from "@/lib/db";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth";

/* ─── DELETE /api/auth/delete ──────────────────────────────────────────────── */
export async function DELETE() {
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

    /* ── Delete account from DB ── */
    await db("users").where({ id: payload.sub }).delete();

    /* ── Clear session cookie ── */
    cookieStore.delete(SESSION_COOKIE);

    return NextResponse.json({ success: true, message: "Account deleted" });
  } catch (error) {
    console.error("[DELETE /api/auth/delete]", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
