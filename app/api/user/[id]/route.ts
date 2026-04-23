import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import db from "@/lib/db";
import { verifyToken, hashPassword, signToken, SESSION_COOKIE, COOKIE_OPTIONS } from "@/lib/auth";

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

/* ─── GET /api/user/[id] ─────────────────────────────────────────────────── */
/**
 * Fetch any user's public profile by id.
 * Requires authentication.
 */
export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/user/[id]">
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await ctx.params;

  try {
    const user = await db("users")
      .where({ id })
      .select("id", "name", "email", "created_at")
      .first();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("[GET /api/user/[id]]", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

/* ─── PATCH /api/user/[id] ───────────────────────────────────────────────── */
/**
 * Update a user's name, email, or password.
 * A user may only update their own record.
 * Body (all fields optional):
 *   { name?: string, email?: string, password?: string }
 */
export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/user/[id]">
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await ctx.params;

  // Users may only edit themselves
  if (session.sub !== id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
      const taken = await db("users")
        .where({ email: body.email.toLowerCase().trim() })
        .whereNot({ id })
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
      return NextResponse.json(
        { error: "Nothing to update" },
        { status: 400 }
      );
    }

    const [user] = await db("users")
      .where({ id })
      .update(updates)
      .returning(["id", "name", "email", "role", "updated_at"]);

    // Reissue token with new name/email/role
    const cookieStore = await cookies();
    const newToken = await signToken({
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
    cookieStore.set(SESSION_COOKIE, newToken, COOKIE_OPTIONS);

    return NextResponse.json(user);
  } catch (error) {
    console.error("[PATCH /api/user/[id]]", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

/* ─── DELETE /api/user/[id] ──────────────────────────────────────────────── */
/**
 * Delete a user by id.
 * A user may only delete their own account.
 */
export async function DELETE(
  _req: NextRequest,
  ctx: RouteContext<"/api/user/[id]">
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await ctx.params;

  if (session.sub !== id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await db("users").where({ id }).delete();

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, "", { maxAge: 0, path: "/" });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/user/[id]]", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
