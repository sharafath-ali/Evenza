import { NextResponse } from "next/server";

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type EventEntry = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: string;
  image: string;
  tag: string;
  category: string;
  attendees: number;
  createdAt: string;
};

/* ─── In-memory store (seeded with default events) ───────────────────────── */
// Lives in Node.js module scope — persists across requests until the server restarts.

const events: EventEntry[] = [
  {
    id: "1",
    title: "Neon Nights Music Festival",
    description: "An electrifying night of live music under the stars.",
    category: "Music",
    date: "May 24, 2025",
    time: "8:00 PM",
    location: "Pulse Arena, Mumbai",
    attendees: 4200,
    price: "₹999",
    image: "/images/event1.png",
    tag: "Trending",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "TechSurge Developer Summit",
    description: "Three days of cutting-edge talks, workshops and networking.",
    category: "Tech",
    date: "Jun 7, 2025",
    time: "10:00 AM",
    location: "Nexus Hub, Bangalore",
    attendees: 1800,
    price: "₹499",
    image: "/images/event2.png",
    tag: "Selling Fast",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Indie Art & Culture Fair",
    description: "Celebrate independent artists with installations and live demos.",
    category: "Art",
    date: "Jun 15, 2025",
    time: "11:00 AM",
    location: "Gallery Commons, Delhi",
    attendees: 900,
    price: "Free",
    image: "/images/event3.png",
    tag: "Free Entry",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Street Food Carnival",
    description: "Over 100 stalls serving cuisines from every corner of India.",
    category: "Food",
    date: "Jun 22, 2025",
    time: "12:00 PM",
    location: "Central Park, Pune",
    attendees: 3100,
    price: "₹199",
    image: "/images/event4.png",
    tag: "New",
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Comedy Nights Live",
    description: "Stand-up comedy with the nation's funniest acts.",
    category: "Comedy",
    date: "Jul 5, 2025",
    time: "7:30 PM",
    location: "Laugh Factory, Chennai",
    attendees: 620,
    price: "₹799",
    image: "/images/event5.png",
    tag: "Limited Seats",
    createdAt: new Date().toISOString(),
  },
  {
    id: "6",
    title: "Premier League Watch Party",
    description: "Catch all the action on giant screens with fellow fans.",
    category: "Sports",
    date: "Jul 12, 2025",
    time: "9:00 PM",
    location: "FanZone Bar, Hyderabad",
    attendees: 450,
    price: "₹299",
    image: "/images/event6.png",
    tag: "Hot",
    createdAt: new Date().toISOString(),
  },
];

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
      category: "Other",
      date: body.date ?? "",
      time: body.time ?? "",
      location: body.location?.trim() ?? "",
      attendees: 0,
      price: body.price ? `$${body.price}` : "Free",
      image: body.image?.trim() || "/images/event1.png",
      tag: "New",
      createdAt: new Date().toISOString(),
    };

    events.push(newEvent);

    return NextResponse.json(newEvent, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
