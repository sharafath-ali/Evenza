import { NextResponse } from "next/server";

/* ─── In-memory store ────────────────────────────────────────────────────── */
// Lives in Node.js module scope — persists across requests until the server restarts.

export type EventEntry = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: string;
  image: string;
  createdAt: string;
};

const events: EventEntry[] = [];

/* ─── GET /api/events ────────────────────────────────────────────────────── */
export function GET() {
  return NextResponse.json(events);
}

/* ─── POST /api/events ───────────────────────────────────────────────────── */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const newEvent: EventEntry = {
      id: crypto.randomUUID(),
      title: body.title.trim(),
      description: body.description?.trim() ?? "",
      date: body.date ?? "",
      time: body.time ?? "",
      location: body.location?.trim() ?? "",
      price: body.price ? `$${body.price}` : "Free",
      image: body.image?.trim() ?? "",
      createdAt: new Date().toISOString(),
    };

    events.push(newEvent);

    return NextResponse.json(newEvent, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
