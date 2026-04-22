"use client";

import { useState, useMemo, useEffect } from "react";
import type { EventEntry } from "@/app/api/events/route";
import { EventCard } from "@/components/EventCard";
import { BookingModal } from "@/components/BookingModal";

type Event = EventEntry;

const CATEGORIES = ["All", "Music", "Tech", "Art", "Food", "Comedy", "Sports", "Other"];

export default function HomeClient() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((data: Event[]) => setAllEvents(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return allEvents.filter((e) => {
      const matchCat = activeCategory === "All" || e.category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [search, activeCategory, allEvents]);

  return (
    <>
      {/* ─── Search Bar ─────────────────────────────────────────── */}
      <div className="mt-2 flex w-full max-w-xl items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-lg shadow-[0_0_40px_rgba(89,222,202,0.08)] self-center">
        <svg className="size-4 text-[#bdbdbd] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
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
      {loading ? (
        <div className="flex justify-center py-16">
          <svg className="size-8 animate-spin text-[#59deca]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-8 w-full">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} onBook={setSelectedEvent} />
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
        <BookingModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </>
  );
}
