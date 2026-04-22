import type { Knex } from "knex";

const DEFAULT_EVENTS = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
];

export async function seed(knex: Knex): Promise<void> {
  // Only seed if the table is empty to avoid duplicates on re-runs
  const existing = await knex("events").count("id as count").first();
  if (existing && Number(existing.count) > 0) {
    console.log("Events table already has data — skipping seed.");
    return;
  }

  await knex("events").insert(DEFAULT_EVENTS);
  console.log(`Seeded ${DEFAULT_EVENTS.length} default events.`);
}
