"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifyToken } from "@/lib/auth";

export async function bookTicket(eventId: string, name: string, email: string, qty: number) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  let userId = null;
  
  if (token) {
    try {
      const payload = await verifyToken(token);
      userId = payload.sub;
    } catch {}
  }
  // Use a transaction to ensure both operations succeed or fail together
  await db.transaction(async (trx) => {
    // 1. Insert the booking record
    await trx("bookings").insert({
      event_id: eventId,
      user_id: userId,
      name,
      email,
      qty,
    });

    // 2. Increment the attendees count for this event
    await trx("events").where({ id: eventId }).increment("attendees", qty);
  });

  // Because the events are listed on the home page, 
  // we revalidate it to reflect the new attendees count instantly
  revalidatePath("/");
}

// ─── NEW MUTATION: LIKE EVENT ──────────────────────────────────────────────
export async function likeEvent(eventId: string) {
  if (!eventId) return;

  try {
    await db("events").where({ id: eventId }).increment("likes", 1);
    
    // We strictly use revalidatePath to ensure Next.js updates its server cache globally!
    revalidatePath("/");
    revalidatePath(`/event/${eventId}`);
    revalidatePath("/manage");
  } catch (err) {
    console.error("Failed to like event", err);
  }
}

// ─── CANCEL BOOKING ───────────────────────────────────────────────────────
export async function cancelBooking(bookingId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) throw new Error("Unauthorized");

  let payload;
  try {
    payload = await verifyToken(token);
  } catch {
    throw new Error("Unauthorized");
  }

  const booking = await db("bookings").where({ id: bookingId }).first();
  if (!booking) return;

  // Enforce ownership: 
  // You can only cancel a booking if you are an admin, OR you own the booking natively via user_id.
  if (payload.role !== "admin" && booking.user_id !== payload.sub) {
    throw new Error("Forbidden");
  }

  await db.transaction(async (trx) => {
    // 1. Delete the booking record
    await trx("bookings").where({ id: bookingId }).delete();

    // 2. Decrement the attendees count for this event
    await trx("events").where({ id: booking.event_id }).decrement("attendees", booking.qty);
  });

  revalidatePath("/");
  revalidatePath("/bookings");
}
