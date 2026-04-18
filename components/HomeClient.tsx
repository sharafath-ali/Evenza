"use client";

import { useState, useMemo } from "react";
import Image from "next/image";

/* ─── Data ──────────────────────────────────────────────────────────────── */

const ALL_EVENTS = [
  {
    id: 1,
    title: "Neon Nights Music Festival",
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
    id: 2,
    title: "TechSurge Developer Summit",
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
    id: 3,
    title: "Indie Art & Culture Fair",
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
    id: 4,
    title: "Street Food Carnival",
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
    id: 5,
    title: "Comedy Nights Live",
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
    id: 6,
    title: "Premier League Watch Party",
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

const CATEGORIES = ["All", "Music", "Tech", "Art", "Food", "Comedy", "Sports"];

/* ─── Booking Modal ─────────────────────────────────────────────────────── */

type Event = (typeof ALL_EVENTS)[0];

function BookingModal({
  event,
  onClose,
}: {
  event: Event;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [qty, setQty] = useState(1);
  const [booked, setBooked] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setBooked(true);
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0d161a] shadow-[0_0_60px_rgba(89,222,202,0.15)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top image strip */}
        <div className="relative h-36 w-full">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
            sizes="448px"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0d161a]" />
          {/* Close */}
          <button
            id="modal-close-btn"
            onClick={onClose}
            className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-white/20 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="px-6 pb-6 -mt-1 flex flex-col gap-5">
          {booked ? (
            /* ── Success state ── */
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <span className="text-5xl">🎉</span>
              <h3 className="text-xl font-bold text-white">You&apos;re booked!</h3>
              <p className="text-[#bdbdbd] text-sm">
                Confirmation for&nbsp;
                <span className="text-[#59deca] font-semibold">{event.title}</span>
                &nbsp;has been sent to&nbsp;
                <span className="text-[#59deca] font-semibold">{email}</span>.
              </p>
              <button
                id="modal-done-btn"
                onClick={onClose}
                className="mt-2 w-full rounded-lg bg-[#59deca] py-2.5 text-sm font-bold text-black hover:bg-[#59deca]/85 transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            /* ── Form state ── */
            <>
              <div className="flex flex-col gap-1">
                <span className="pill w-fit">{event.category}</span>
                <h3 className="text-lg font-bold text-white mt-1">{event.title}</h3>
                <p className="text-xs text-[#bdbdbd]">
                  {event.date} · {event.time} · {event.location}
                </p>
              </div>

              <form id="booking-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#e7f2ff]">Full Name</label>
                  <input
                    id="booking-name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="rounded-lg bg-[#182830] border border-white/8 px-4 py-2.5 text-sm text-white placeholder:text-[#bdbdbd] outline-none focus:border-[#59deca]/50 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#e7f2ff]">Email</label>
                  <input
                    id="booking-email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="rounded-lg bg-[#182830] border border-white/8 px-4 py-2.5 text-sm text-white placeholder:text-[#bdbdbd] outline-none focus:border-[#59deca]/50 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#e7f2ff]">Tickets</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      id="qty-decrease-btn"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="size-8 rounded-lg bg-[#182830] border border-white/8 text-white hover:border-[#59deca]/40 transition-colors flex-center font-bold"
                    >
                      −
                    </button>
                    <span className="text-sm font-bold text-white w-6 text-center">{qty}</span>
                    <button
                      type="button"
                      id="qty-increase-btn"
                      onClick={() => setQty((q) => Math.min(10, q + 1))}
                      className="size-8 rounded-lg bg-[#182830] border border-white/8 text-white hover:border-[#59deca]/40 transition-colors flex-center font-bold"
                    >
                      +
                    </button>
                    <span className="ml-auto text-xs text-[#bdbdbd]">
                      {event.price === "Free"
                        ? "Free"
                        : `Total: ${event.price.replace("₹", "₹")} × ${qty}`}
                    </span>
                  </div>
                </div>

                <button
                  id="confirm-booking-btn"
                  type="submit"
                  className="w-full rounded-lg bg-[#59deca] py-2.5 text-sm font-bold text-black hover:bg-[#59deca]/85 transition-colors shadow-[0_0_20px_rgba(89,222,202,0.25)]"
                >
                  Confirm Booking
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Event Card ────────────────────────────────────────────────────────── */

function EventCard({
  event,
  onBook,
}: {
  event: Event;
  onBook: (event: Event) => void;
}) {
  return (
    <article
      id={`event-card-${event.id}`}
      className="group flex flex-col rounded-2xl border border-white/8 bg-[#0d161a]/60 overflow-hidden hover:border-[#59deca]/30 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-[220px] w-full overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d161a] via-transparent to-transparent" />
        <span className="absolute top-3 left-3 rounded-full bg-black/55 px-3 py-1 text-[10px] font-semibold text-[#59deca] backdrop-blur-md border border-[#59deca]/25">
          {event.tag}
        </span>
        <span className="absolute top-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
          {event.price}
        </span>
      </div>

      <div className="flex flex-col gap-2 px-4 pb-5 pt-3">
        <span className="pill w-fit">{event.category}</span>
        <h3 className="text-base font-semibold text-white leading-snug line-clamp-1 group-hover:text-[#59deca] transition-colors">
          {event.title}
        </h3>

        <div className="flex flex-col gap-1.5 text-[#bdbdbd] text-xs">
          <div className="flex items-center gap-2">
            <svg className="size-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {event.date} · {event.time}
          </div>
          <div className="flex items-center gap-2">
            <svg className="size-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {event.location}
          </div>
          <div className="flex items-center gap-2">
            <svg className="size-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            {event.attendees.toLocaleString()} going
          </div>
        </div>

        <button
          id={`book-btn-${event.id}`}
          onClick={() => onBook(event)}
          className="mt-2 w-full rounded-lg bg-[#59deca]/10 border border-[#59deca]/20 py-2 text-xs font-semibold text-[#59deca] hover:bg-[#59deca] hover:text-black transition-all duration-200 cursor-pointer"
        >
          Book Now
        </button>
      </div>
    </article>
  );
}

/* ─── Main Client Component ─────────────────────────────────────────────── */

export default function HomeClient() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const filtered = useMemo(() => {
    return ALL_EVENTS.filter((e) => {
      const matchCat =
        activeCategory === "All" || e.category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [search, activeCategory]);

  return (
    <>
      {/* ─── Search Bar ─────────────────────────────────────────── */}
      <div className="mt-2 flex w-full max-w-xl items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-lg shadow-[0_0_40px_rgba(89,222,202,0.08)] self-center">
        <svg
          className="size-4 text-[#bdbdbd] shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          id="search-input"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search events, artists, venues…"
          className="flex-1 bg-transparent text-sm text-white placeholder:text-[#bdbdbd] outline-none"
        />
        {search && (
          <button
            id="search-clear-btn"
            onClick={() => setSearch("")}
            className="text-[#bdbdbd] hover:text-white transition-colors text-xs"
          >
            ✕
          </button>
        )}
        <button
          id="search-btn"
          className="rounded-full bg-[#59deca] px-5 py-1.5 text-sm font-semibold text-black hover:bg-[#59deca]/80 transition-colors cursor-pointer"
        >
          Search
        </button>
      </div>

      {/* ─── Category Filter ─────────────────────────────────────── */}
      <div className="flex flex-wrap justify-center gap-2 mt-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            id={`filter-${cat.toLowerCase()}`}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full border px-5 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
              activeCategory === cat
                ? "border-[#59deca] bg-[#59deca]/15 text-[#59deca]"
                : "border-white/10 bg-white/5 text-[#bdbdbd] hover:border-white/20 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ─── Results Count ───────────────────────────────────────── */}
      {(search || activeCategory !== "All") && (
        <p className="text-center text-xs text-[#bdbdbd]">
          Showing{" "}
          <span className="text-[#59deca] font-semibold">{filtered.length}</span>{" "}
          {filtered.length === 1 ? "event" : "events"}
          {activeCategory !== "All" && (
            <> in <span className="text-[#59deca] font-semibold">{activeCategory}</span></>
          )}
          {search && (
            <> for &ldquo;<span className="text-[#59deca] font-semibold">{search}</span>&rdquo;</>
          )}
        </p>
      )}

      {/* ─── Event Grid ──────────────────────────────────────────── */}
      {filtered.length > 0 ? (
        <div className="events">
          {filtered.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onBook={setSelectedEvent}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <span className="text-4xl">🔍</span>
          <p className="text-[#e7f2ff] font-semibold">No events found</p>
          <p className="text-[#bdbdbd] text-sm">Try a different search or category</p>
          <button
            id="clear-filters-btn"
            onClick={() => { setSearch(""); setActiveCategory("All"); }}
            className="mt-2 rounded-full border border-[#59deca]/30 px-6 py-2 text-xs font-semibold text-[#59deca] hover:bg-[#59deca]/10 transition-colors cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* ─── Booking Modal ───────────────────────────────────────── */}
      {selectedEvent && (
        <BookingModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </>
  );
}
