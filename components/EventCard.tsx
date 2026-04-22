"use client";

import Image from "next/image";
import Link from "next/link";
import { useOptimistic, useTransition } from "react";
import { likeEvent } from "@/app/actions/events";
import type { EventEntry } from "@/app/api/events/route";

type Event = EventEntry;

export function EventCard({
  event,
  onBook,
}: {
  event: Event;
  onBook: (event: Event) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    event.likes ?? 0,
    (state, amount: number) => state + amount
  );

  return (
    <article
      id={`event-card-${event.id}`}
      className="group flex flex-col rounded-2xl border border-white/10 bg-white/6 backdrop-blur-md overflow-hidden hover:border-[#59deca]/35 hover:bg-white/9 transition-all duration-300"
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
        <div className="flex items-center justify-between">
          <span className="pill w-fit">{event.category}</span>
          <button 
            type="button" 
            onClick={() => {
              startTransition(() => {
                addOptimisticLike(1);
                likeEvent(event.id);
              });
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-[#bdbdbd] hover:text-red-400 transition-colors cursor-pointer group/like"
          >
            <svg 
              className={`size-4 transition-all duration-300 group-hover/like:scale-110 ${optimisticLikes > (event.likes ?? 0) ? "fill-red-400 text-red-400 scale-110" : ""}`} 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth={2}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {optimisticLikes}
          </button>
        </div>
        
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
          {event.attendees > 0 && (
            <div className="flex items-center gap-2">
              <svg className="size-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              {event.attendees.toLocaleString()} going
            </div>
          )}
        </div>

        <div className="mt-2 flex items-center gap-2">
          <Link
            href={`/event/${event.id}`}
            className="flex-1 text-center rounded-lg border border-white/10 bg-white/5 py-2 text-xs font-semibold text-[#bdbdbd] hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            Details & Reviews
          </Link>
          <button
            id={`book-btn-${event.id}`}
            onClick={() => onBook(event)}
            className="flex-1 rounded-lg bg-[#59deca]/10 border border-[#59deca]/20 py-2 text-xs font-semibold text-[#59deca] hover:bg-[#59deca] hover:text-black transition-all duration-200 cursor-pointer"
          >
            Book Now
          </button>
        </div>
      </div>
    </article>
  );
}
