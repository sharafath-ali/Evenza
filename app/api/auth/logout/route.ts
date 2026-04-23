import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/auth";

/* ─── POST /api/auth/logout ──────────────────────────────────────────────── */
export async function POST() {
  try {
    const cookieStore = await cookies();
    // Delete the session cookie by setting maxAge to 0
    cookieStore.set(SESSION_COOKIE, "", { maxAge: 0, path: "/" });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[POST /api/auth/logout]", error);
    return NextResponse.json({ error: "Failed to log out" }, { status: 500 });
  }
}
