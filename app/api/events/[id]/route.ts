import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import db from "@/lib/db";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth";
import type { EventEntry } from "../route";

/* ─── PUT/PATCH /api/events/[id] ─────────────────────────────────────────── */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    
    let payload;
    try {
      payload = await verifyToken(token);
    } catch {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    // Verify ownership or system admin
    const event = await db("events").where({ id }).first();
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    if (payload.role !== "admin" && event.user_id !== payload.sub) {
      return NextResponse.json({ error: "Forbidden: You do not own this event" }, { status: 403 });
    }

    if (!body.title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const [updatedEvent] = await db<EventEntry>("events")
      .where({ id })
      .update({
        title: body.title.trim(),
        description: body.description?.trim() ?? "",
        date: body.date ?? "",
        time: body.time ?? "",
        location: body.location?.trim() ?? "",
        price: String(body.price).startsWith("$") 
          ? body.price 
          : (body.price && body.price !== "0" && body.price !== "Free" ? `$${body.price}` : "Free"),
        image: body.image?.trim() || "/images/event1.png",
      })
      .returning("*");

    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error) {
    console.error("[PATCH /api/events/[id]]", error);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}
