import { NextResponse } from "next/server";
import db from "@/lib/db";

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type EventEntry = {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  price: string;
  image: string;
  tag: string;
  created_at: string;
};

/* ─── GET /api/events ────────────────────────────────────────────────────── */
export async function GET() {
  try {
    const events = await db<EventEntry>("events").select("*").orderBy("created_at", "asc");
    return NextResponse.json(events);
  } catch (error) {
    console.error("[GET /api/events]", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

/* ─── POST /api/events ───────────────────────────────────────────────────── */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const [newEvent] = await db<EventEntry>("events")
      .insert({
        title: body.title.trim(),
        description: body.description?.trim() ?? "",
        category: "Other",
        date: body.date ?? "",
        time: body.time ?? "",
        location: body.location?.trim() ?? "",
        attendees: 0,
        price: body.price ? `$${body.price}` : "Free",
        image: body.image?.trim() || "/images/event1.png",
        tag: "New",
      })
      .returning("*");

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("[POST /api/events]", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
