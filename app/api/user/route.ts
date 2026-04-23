import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import db from "@/lib/db";
import { verifyToken, hashPassword, SESSION_COOKIE } from "@/lib/auth";

/* ─── Auth guard ──────────────────────────────────────────────────────────── */

async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    return await verifyToken(token);
  } catch {
    return null;
  }
}

/* ─── GET /api/user ──────────────────────────────────────────────────────── */
/**
 * Returns the currently authenticated user's profile.
 * Requires a valid `evenza_token` cookie.
 */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = await db("users")
    .where({ id: session.sub })
    .select("id", "name", "email", "created_at", "updated_at")
    .first();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

/* ─── PATCH /api/user ────────────────────────────────────────────────────── */
/**
 * Update the currently authenticated user's name, email, or password.
 * Body (all fields optional):
 *   { name?: string, email?: string, password?: string }
 */
export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updates: Record<string, unknown> = { updated_at: new Date() };

    if (body.name?.trim()) {
      updates.name = body.name.trim();
    }

    if (body.email?.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
        return NextResponse.json(
          { error: "Invalid email address" },
          { status: 400 }
        );
      }
      // Check uniqueness (exclude self)
      const taken = await db("users")
        .where({ email: body.email.toLowerCase().trim() })
        .whereNot({ id: session.sub })
        .first();
      if (taken) {
        return NextResponse.json(
          { error: "That email is already in use" },
          { status: 409 }
        );
      }
      updates.email = body.email.toLowerCase().trim();
    }

    if (body.password) {
      if (body.password.length < 8) {
        return NextResponse.json(
          { error: "Password must be at least 8 characters" },
          { status: 400 }
        );
      }
      updates.password_hash = await hashPassword(body.password);
    }

    if (Object.keys(updates).length === 1) {
      // Only updated_at — nothing meaningful was sent
      return NextResponse.json(
        { error: "Nothing to update" },
        { status: 400 }
      );
    }

    const [user] = await db("users")
      .where({ id: session.sub })
      .update(updates)
      .returning(["id", "name", "email", "updated_at"]);

    return NextResponse.json(user);
  } catch (error) {
    console.error("[PATCH /api/user]", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

/* ─── DELETE /api/user ───────────────────────────────────────────────────── */
/**
 * Permanently delete the currently authenticated user's account.
 * Also clears the session cookie.
 */
export async function DELETE() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    await db("users").where({ id: session.sub }).delete();

    // Clear the session cookie
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, "", { maxAge: 0, path: "/" });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/user]", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
