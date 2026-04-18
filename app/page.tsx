import Link from "next/link";

const featuredEvents = [
  {
    id: 1,
    title: "Neon Nights Music Festival",
    category: "Music",
    date: "May 24, 2025",
    time: "8:00 PM",
    location: "Pulse Arena, Mumbai",
    attendees: 4200,
    price: "₹999",
    gradient: "from-green-900/60 to-teal-900/40",
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
    gradient: "from-emerald-900/60 to-green-900/40",
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
    gradient: "from-teal-900/60 to-emerald-900/40",
    tag: "Free Entry",
  },
];

const categories = [
  { label: "Music", icon: "🎵", count: 124 },
  { label: "Tech", icon: "💻", count: 87 },
  { label: "Art", icon: "🎨", count: 63 },
  { label: "Sports", icon: "⚽", count: 95 },
  { label: "Food", icon: "🍜", count: 42 },
  { label: "Comedy", icon: "🎭", count: 31 },
];

const stats = [
  { value: "50K+", label: "Happy Attendees" },
  { value: "1,200+", label: "Events Hosted" },
  { value: "80+", label: "Cities" },
  { value: "4.9★", label: "Avg. Rating" },
];

export default function Home() {
  return (
    <main
      id="home"
      className="relative flex flex-col gap-24 pb-24"
      style={{ background: "transparent" }}
    >
      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="flex flex-col items-center text-center pt-24 gap-8">
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

        {/* Search bar */}
        <div className="mt-2 flex w-full max-w-xl items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-lg shadow-[0_0_40px_rgba(89,222,202,0.08)]">
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
            type="text"
            placeholder="Search events, artists, venues…"
            className="flex-1 bg-transparent text-sm text-white placeholder:text-[#bdbdbd] outline-none"
          />
          <button
            id="search-btn"
            className="rounded-full bg-[#59deca] px-5 py-1.5 text-sm font-semibold text-black hover:bg-[#59deca]/80 transition-colors"
          >
            Search
          </button>
        </div>

        {/* CTA row */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            id="explore-btn"
            className="rounded-full border border-[#182830] bg-[#0d161a] px-8 py-3.5 text-sm font-semibold text-white hover:bg-[#182830] transition-colors"
          >
            <Link href="#events" className="flex items-center gap-2">
              <span>Explore Events</span>
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </button>
          <button
            id="host-btn"
            className="rounded-full border border-white/10 bg-transparent px-8 py-3.5 text-sm font-semibold text-[#e7f2ff] hover:bg-white/5 transition-colors"
          >
            Host an Event
          </button>
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

      {/* ─── CATEGORIES ───────────────────────────────────────────── */}
      <section className="flex flex-col gap-6">
        <h2 className="text-xl font-bold text-[#e7f2ff] font-[var(--font-schibsted-grotesk)]">
          Browse by Category
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {categories.map(({ label, icon, count }) => (
            <button
              key={label}
              id={`cat-${label.toLowerCase()}`}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-white/8 bg-white/4 py-5 hover:border-[#59deca]/40 hover:bg-[#59deca]/6 transition-all duration-300 cursor-pointer"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                {icon}
              </span>
              <span className="text-xs font-semibold text-[#e7f2ff]">{label}</span>
              <span className="text-[10px] text-[#bdbdbd]">{count} events</span>
            </button>
          ))}
        </div>
      </section>

      {/* ─── FEATURED EVENTS ───────────────────────────────────────── */}
      <section id="events" className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#e7f2ff] font-[var(--font-schibsted-grotesk)]">
            Featured Events
          </h2>
          <Link
            href="#"
            className="text-sm text-[#59deca] hover:underline underline-offset-4"
          >
            View all →
          </Link>
        </div>

        <div className="events">
          {featuredEvents.map((event) => (
            <article
              key={event.id}
              id={`event-card-${event.id}`}
              className="group flex flex-col gap-4 rounded-2xl border border-white/8 bg-gradient-to-br p-1 hover:border-[#59deca]/30 transition-all duration-300 cursor-pointer"
            >
              {/* Poster placeholder */}
              <div
                className={`relative h-[220px] w-full rounded-xl bg-gradient-to-br ${event.gradient} overflow-hidden`}
              >
                {/* Decorative glow */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(89,222,202,0.15),transparent_60%)]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl opacity-30">
                    {event.category === "Music"
                      ? "🎵"
                      : event.category === "Tech"
                      ? "💻"
                      : "🎨"}
                  </span>
                </div>
                {/* Tag */}
                <span className="absolute top-3 left-3 rounded-full bg-black/50 px-3 py-1 text-[10px] font-semibold text-[#59deca] backdrop-blur-md border border-[#59deca]/30">
                  {event.tag}
                </span>
                {/* Price */}
                <span className="absolute top-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                  {event.price}
                </span>
              </div>

              <div className="flex flex-col gap-2 px-3 pb-4">
                <span className="pill w-fit">{event.category}</span>
                <h3 className="text-base font-semibold text-white leading-snug line-clamp-1 group-hover:text-[#59deca] transition-colors">
                  {event.title}
                </h3>

                <div className="flex flex-col gap-1.5 text-[#bdbdbd] text-xs">
                  <div className="flex items-center gap-2">
                    <svg className="size-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
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
                  id={`book-${event.id}`}
                  className="mt-2 w-full rounded-lg bg-[#59deca]/10 border border-[#59deca]/20 py-2 text-xs font-semibold text-[#59deca] hover:bg-[#59deca] hover:text-black transition-all duration-200"
                >
                  Book Now
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ─── CTA BANNER ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0d161a] to-[#182830] px-10 py-16 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,rgba(89,222,202,0.12),transparent_65%)]" />
        <div className="relative flex flex-col items-center gap-6">
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
            className="rounded-full bg-[#59deca] px-10 py-3.5 text-sm font-bold text-black hover:bg-[#59deca]/85 transition-colors shadow-[0_0_30px_rgba(89,222,202,0.3)]"
          >
            Get Started Free →
          </button>
        </div>
      </section>
    </main>
  );
}
