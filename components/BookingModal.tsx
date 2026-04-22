"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { EventEntry } from "@/app/api/events/route";
import { bookTicket } from "@/app/actions/events";

type Event = EventEntry;

export function BookingModal({ event }: { event: Event }) {
  const router = useRouter();
  
  const handleClose = () => {
    router.push("/", { scroll: false });
  };
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [qty, setQty] = useState(1);
  const [booked, setBooked] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    
    setIsPending(true);
    try {
      await bookTicket(event.id, name, email, qty);
      setBooked(true);
    } catch (err) {
      console.error(err);
      alert("Failed to book ticket");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={handleClose}
    >
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
          <button
            id="modal-close-btn"
            onClick={handleClose}
            className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-white/20 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="px-6 pb-6 -mt-1 flex flex-col gap-5">
          {booked ? (
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
                onClick={handleClose}
                className="mt-2 w-full rounded-lg bg-[#59deca] py-2.5 text-sm font-bold text-black hover:bg-[#59deca]/85 transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
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
                        : `Total: ${event.price} × ${qty}`}
                    </span>
                  </div>
                </div>

                <button
                  id="confirm-booking-btn"
                  type="submit"
                  disabled={isPending}
                  className="w-full rounded-lg bg-[#59deca] py-2.5 text-sm font-bold text-black hover:bg-[#59deca]/85 transition-colors shadow-[0_0_20px_rgba(89,222,202,0.25)] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isPending ? "Booking..." : "Confirm Booking"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
