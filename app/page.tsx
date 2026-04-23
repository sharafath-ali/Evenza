import Link from "next/link";
import Image from "next/image";
import db from "@/lib/db";
import type { EventEntry } from "@/app/api/events/route";
import { BookingModal } from "@/components/BookingModal";
import { EventCard } from "@/components/EventCard";
import { SearchForm } from "@/components/SearchForm";
import { CategoryFilter } from "@/components/CategoryFilter";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifyToken } from "@/lib/auth";

const stats = [
  { value: "50K+", label: "Happy Attendees" },
  { value: "1,200+", label: "Events Hosted" },
  { value: "80+", label: "Cities" },
  { value: "4.9★", label: "Avg. Rating" },
];

export default async function Home(props: {
  searchParams: Promise<{ q?: string; category?: string; book?: string }>;
}) {
  const { q = "", category = "All", book } = await props.searchParams;

  // Formulate purely Server-Side Query
  let query = db<EventEntry>("events").select("*").orderBy("created_at", "desc");

  if (category !== "All") {
    query = query.where({ category });
  }

  if (q) {
    query = query.where((builder) => {
      builder.whereILike("title", `%${q}%`)
             .orWhereILike("location", `%${q}%`)
             .orWhereILike("category", `%${q}%`);
    });
  }

  const filteredEvents = await query;
  let bookEvent = null;
  if (book) {
    bookEvent = await db<EventEntry>("events").where({ id: book }).first();
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  let user = null;
  if (token) {
    try {
      user = await verifyToken(token);
    } catch (e) {}
  }

  return (
    <main
      id="home"
      className="relative flex flex-col gap-24 pb-24"
      style={{ background: "transparent" }}
    >
      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="flex flex-col items-center text-center pt-24 gap-6">
        {/* Pill badge */}
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-widest text-[#94eaff] uppercase backdrop-blur-md">
          <span className="size-1.5 rounded-full bg-[#59deca] animate-pulse" />
          Discover · Book · Experience
        </span>

        <h1 className="max-w-3xl leading-tight">
          Find Events That&nbsp;
          <span className="text-gradient">Move You</span>
        </h1>

        <p className="subheading max-w-xl">
          Evenza brings the best live experiences — concerts, conferences,
          festivals and more — right to your fingertips. Book in seconds, make
          memories that last forever.
        </p>

        {/* ── Interactive search + category filter + event grid ── */}
        <SearchForm defaultValue={q} />
        <CategoryFilter activeCategory={category} currentQuery={q} />

        {/* ─── Results Count ───────────────────────────────────────── */}
        {(q || category !== "All") && (
          <p className="text-center text-xs text-[#bdbdbd] mt-2 mb-4">
            Showing{" "}
            <span className="text-[#59deca] font-semibold">{filteredEvents.length}</span>{" "}
            {filteredEvents.length === 1 ? "event" : "events"}
            {category !== "All" && (
              <> in <span className="text-[#59deca] font-semibold">{category}</span></>
            )}
            {q && (
              <> for &ldquo;<span className="text-[#59deca] font-semibold">{q}</span>&rdquo;</>
            )}
          </p>
        )}

        {/* ─── Natively Rendered SubGrid ──────────────────────────── */}
        {filteredEvents.length > 0 ? (
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-8 w-full mt-4 text-left">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-16 text-center w-full">
            <span className="text-4xl">🔍</span>
            <p className="text-[#e7f2ff] font-semibold">No events found</p>
            <p className="text-[#bdbdbd] text-sm">Try a different search or category</p>
            <Link
              href="/"
              className="mt-2 rounded-full border border-[#59deca]/30 px-6 py-2 text-xs font-semibold text-[#59deca] hover:bg-[#59deca]/10 transition-colors cursor-pointer"
            >
              Clear filters
            </Link>
          </div>
        )}

        {/* CTA row */}
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <Link
            href="#events"
            id="explore-events-btn"
            className="flex items-center gap-2 rounded-full border border-[#182830] bg-[#0d161a] px-8 py-3.5 text-sm font-semibold text-white hover:bg-[#182830] transition-colors"
          >
            <span>Explore Events</span>
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/addEvent"
            id="host-btn"
            className="rounded-full border border-white/10 bg-transparent px-8 py-3.5 text-sm font-semibold text-[#e7f2ff] hover:bg-white/5 transition-colors cursor-pointer"
          >
            Host an Event
          </Link>
          <Link
            href="/manage"
            className="rounded-full border border-[#59deca]/20 bg-[#59deca]/5 px-8 py-3.5 text-sm font-semibold text-[#59deca] hover:bg-[#59deca]/10 transition-colors cursor-pointer"
          >
            Manage Events
          </Link>
        </div>
      </section>

      {/* ─── STATS ─────────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {stats.map(({ value, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1 rounded-2xl border border-white/8 bg-white/4 py-7 backdrop-blur-md"
          >
            <span className="text-3xl font-bold text-[#59deca]">{value}</span>
            <span className="text-xs text-[#bdbdbd] tracking-wide">{label}</span>
          </div>
        ))}
      </section>

      {/* ─── HERO FULL IMAGE ──────────────────────────────────────── */}
      <section className="relative w-full h-[420px] rounded-3xl overflow-hidden">
        <Image
          src="/images/event-full.png"
          alt="Featured event spotlight"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-10 max-w-lg gap-4">
          <span className="pill w-fit">Spotlight</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight font-[var(--font-schibsted-grotesk)]">
            Grand Summer<br />
            <span className="text-[#59deca]">Music Festival 2025</span>
          </h2>
          <p className="text-[#bdbdbd] text-sm">
            The biggest outdoor music event of the year. 30+ artists, 3 stages,
            1 unforgettable weekend.
          </p>
          <button
            id="spotlight-book-btn"
            className="w-fit rounded-full bg-[#59deca] px-7 py-2.5 text-sm font-bold text-black hover:bg-[#59deca]/85 transition-colors shadow-[0_0_24px_rgba(89,222,202,0.35)] cursor-pointer"
          >
            Get Tickets →
          </button>
        </div>
      </section>

      {/* ─── CTA BANNER ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10">
        <div className="absolute inset-0">
          <Image
            src="/images/event-full.png"
            alt="Host your own event"
            fill
            className="object-cover opacity-20"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d161a]/95 via-[#0d161a]/80 to-[#182830]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,rgba(89,222,202,0.12),transparent_65%)]" />

        <div className="relative flex flex-col items-center gap-6 px-10 py-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white max-w-lg leading-tight font-[var(--font-schibsted-grotesk)]">
            Ready to Host Your&nbsp;
            <span className="text-[#59deca]">Own Event?</span>
          </h2>
          <p className="text-[#bdbdbd] text-sm max-w-md">
            Join thousands of creators who trust Evenza to manage ticketing,
            registrations, and audience engagement — all in one place.
          </p>
          <button
            id="host-cta-btn"
            className="rounded-full bg-[#59deca] px-10 py-3.5 text-sm font-bold text-black hover:bg-[#59deca]/85 transition-colors shadow-[0_0_30px_rgba(89,222,202,0.3)] cursor-pointer"
          >
            Get Started Free →
          </button>
        </div>
      </section>

      {/* ─── URL-Driven Booking Modal ──────────────────────────────── */}
      {bookEvent && <BookingModal event={bookEvent as EventEntry} />}
    </main>
  );
}
