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

// ─── NEW MUTATION: DELETE EVENT ──────────────────────────────────────────
export async function deleteEvent(formData: FormData) {
  const eventId = formData.get("eventId") as string;
  
  if (!eventId) return;

  // Since we have a cascading foreign key, deleting the event also cleans up bookings!
  await db("events").where({ id: eventId }).delete();

  // Revalidate both the manage page and the root page so updates are instant
  revalidatePath("/manage");
  revalidatePath("/");
}
