import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import db from "@/lib/db";
import {
  hashPassword,
  signToken,
  SESSION_COOKIE,
  COOKIE_OPTIONS,
} from "@/lib/auth";

/* ─── POST /api/auth/signup ──────────────────────────────────────────────── */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body ?? {};

    /* ── Validation ── */
    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "A valid email is required" },
        { status: 400 }
      );
    }
    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    /* ── Uniqueness check ── */
    const existing = await db("users")
      .where({ email: email.toLowerCase().trim() })
      .first();

    if (existing) {
      return NextResponse.json(
        { error: "An account with that email already exists" },
        { status: 409 }
      );
    }

    /* ── Create user ── */
    const password_hash = await hashPassword(password);
    const [user] = await db("users")
      .insert({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password_hash,
      })
      .returning(["id", "name", "email", "role", "created_at"]);

    /* ── Issue JWT ── */
    const token = await signToken({ sub: user.id, email: user.email, name: user.name, role: user.role });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, token, COOKIE_OPTIONS);

    return NextResponse.json(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/auth/signup]", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
