import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

/* ─── Constants ──────────────────────────────────────────────────────────── */

export const SESSION_COOKIE = "evenza_token";

/** 7-day cookie; maxAge is in seconds */
export const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
  // secure should be true in production (HTTPS)
  secure: process.env.NODE_ENV === "production",
};

/* ─── Password helpers ───────────────────────────────────────────────────── */

/** Hash a plain-text password using bcrypt (cost factor 12). */
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

/** Compare a plain-text password against a stored hash. */
export async function verifyPassword(
  plain: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/* ─── JWT helpers (via jose) ─────────────────────────────────────────────── */

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET env var is not set");
  return new TextEncoder().encode(secret);
}

export interface JwtPayload {
  sub: string;   // user id
  email: string;
  name: string;
  role: string;
}

/**
 * Sign a JWT that expires in 7 days.
 * Returns the compact JWT string.
 */
export async function signToken(payload: JwtPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

/**
 * Verify a JWT and return its payload.
 * Throws if the token is invalid or expired.
 */
export async function verifyToken(token: string): Promise<JwtPayload> {
  const { payload } = await jwtVerify(token, getSecret());
  return payload as unknown as JwtPayload;
}
