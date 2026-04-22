"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function bookTicket(eventId: string, name: string, email: string, qty: number) {
  // Use a transaction to ensure both operations succeed or fail together
  await db.transaction(async (trx) => {
    // 1. Insert the booking record
    await trx("bookings").insert({
      event_id: eventId,
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
