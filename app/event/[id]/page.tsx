import db from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { EventEntry } from "@/app/api/events/route";
import { ReviewForm } from "@/components/ReviewForm";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  // In Next.js 15, dynamic route params are implicitly resolved Promises
  const { id } = await params;

  // Parallel fetch: Event Data & Reviews
  const [eventData, reviews] = await Promise.all([
    db<EventEntry>("events").where({ id }).first(),
    db<Review>("reviews").where({ event_id: id }).orderBy("created_at", "desc"),
  ]);

  if (!eventData) {
    notFound();
  }

  // Calculate average rating
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <main className="max-w-5xl mx-auto py-24 px-6 flex flex-col gap-12">
      {/* ─── Header & Nav ────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-semibold text-[#59deca] bg-[#59deca]/10 px-4 py-2 rounded-lg hover:bg-[#59deca]/20 transition-colors"
        >
          ← Back to Events
        </Link>
      </div>

      {/* ─── Event Details ───────────────────────────────────────── */}
      <section className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-1/2 relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(89,222,202,0.1)]">
          <Image src={eventData.image || "/images/event-full.png"} alt={eventData.title} fill className="object-cover" />
        </div>
        
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 w-fit px-3 py-1 text-xs font-semibold text-[#59deca]">
            {eventData.category}
          </span>
          
          <h1 className="text-4xl font-bold text-white">{eventData.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-[#bdbdbd]">
            <span className="flex items-center gap-1.5">
              📅 {eventData.date}
            </span>
            <span className="flex items-center gap-1.5">
              🕒 {eventData.time}
            </span>
            <span className="flex items-center gap-1.5">
              📍 {eventData.location}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 my-2">
            <span className="text-2xl font-bold text-white">
              {eventData.price > 0 ? `$${eventData.price}` : "Free"}
            </span>
            <div className="h-4 w-px bg-white/20" />
            <span className="text-[#59deca] font-semibold">
              {eventData.attendees} Attending
            </span>
            {avgRating && (
              <>
                 <div className="h-4 w-px bg-white/20" />
                 <span className="text-yellow-400 font-bold flex items-center gap-1">
                   ★ {avgRating} <span className="text-xs text-[#bdbdbd] font-normal">({reviews.length})</span>
                 </span>
              </>
            )}
          </div>

          <div className="text-[#e7f2ff] leading-relaxed pt-4 border-t border-white/10">
            {eventData.description}
          </div>
        </div>
      </section>

      {/* ─── Reviews & Ratings ───────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/10 pt-12">
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-white">Attendee Reviews</h2>
          
          {reviews.length === 0 ? (
            <p className="text-[#bdbdbd] italic">No reviews yet. Be the first to share your experience!</p>
          ) : (
            <div className="flex flex-col gap-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="rounded-xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold">{rev.name}</span>
                    <span className="text-yellow-400 font-bold tracking-widest text-sm">
                      {"★".repeat(rev.rating)}
                      <span className="text-[#bdbdbd]/30">{"★".repeat(5 - rev.rating)}</span>
                    </span>
                  </div>
                  <p className="text-[#bdbdbd] text-sm">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <ReviewForm eventId={id} />
        </div>
      </section>
    </main>
  );
}
