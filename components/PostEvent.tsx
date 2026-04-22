"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function PostEvent() {
  const router = useRouter();
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    price: "",
    image: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to publish event");
      }

      setStatus("success");
      // Redirect to homepage after a short delay so the user sees the success state
      setTimeout(() => router.push("/"), 1500);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const inputClass =
    "w-full rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-[#e7f2ff] placeholder-[#5a7080] outline-none transition-all duration-200 focus:border-[#59deca]/60 focus:bg-white/8 focus:ring-2 focus:ring-[#59deca]/15 backdrop-blur-sm";

  const labelClass = "block text-xs font-semibold tracking-widest text-[#59deca] uppercase mb-1.5";

  return (
    <section
      id="post-event"
      className="min-h-screen flex items-center justify-center px-4 py-16"
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-[#59deca]/6 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-widest text-[#94eaff] uppercase backdrop-blur-md mb-4">
            <span className="size-1.5 rounded-full bg-[#59deca] animate-pulse" />
            Create · Publish · Inspire
          </span>
          <h1 className="text-4xl font-bold mb-2">
            Host an{" "}
            <span className="text-gradient">Event</span>
          </h1>
          <p className="text-[#bdbdbd] text-sm max-w-sm mx-auto">
            Fill in the details below and publish your event to thousands of
            eager attendees on Evenza.
          </p>
        </div>

        {/* Glass card */}
        <div className="relative rounded-3xl border border-white/10 bg-white/4 p-8 backdrop-blur-2xl shadow-[0_8px_60px_rgba(0,0,0,0.5)]">
          {/* Subtle inner top highlight */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <form id="add-event-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className={labelClass}>
                Event Title
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#59deca]/60">
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                    <path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5L2.1 7.9c-.3.3-.5.7-.5 1.1V20c0 .6.4 1 1 1h13c.6 0 1-.4 1-1V3c0-.6-.4-1-1-1z"/>
                    <path d="M3 8h4a1 1 0 0 0 1-1V3"/>
                    <path d="M7 13h8M7 17h5"/>
                  </svg>
                </span>
                <input
                  id="title"
                  type="text"
                  name="title"
                  placeholder="e.g. Grand Summer Music Festival"
                  value={eventData.title}
                  onChange={handleChange}
                  required
                  className={`${inputClass} pl-11`}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className={labelClass}>
                Description
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-[#59deca]/60">
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </span>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Tell attendees what makes your event special..."
                  value={eventData.description}
                  onChange={handleChange}
                  rows={3}
                  className={`${inputClass} pl-11 resize-none`}
                />
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className={labelClass}>
                  Date
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#59deca]/60">
                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                      <rect x="3" y="4" width="18" height="18" rx="2"/>
                      <path d="M16 2v4M8 2v4M3 10h18"/>
                    </svg>
                  </span>
                  <input
                    id="date"
                    type="date"
                    name="date"
                    value={eventData.date}
                    onChange={handleChange}
                    required
                    className={`${inputClass} pl-11`}
                    style={{ colorScheme: "dark" }}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="time" className={labelClass}>
                  Time
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#59deca]/60">
                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 6v6l4 2"/>
                    </svg>
                  </span>
                  <input
                    id="time"
                    type="time"
                    name="time"
                    value={eventData.time}
                    onChange={handleChange}
                    required
                    className={`${inputClass} pl-11`}
                    style={{ colorScheme: "dark" }}
                  />
                </div>
              </div>
            </div>

            {/* Location & Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="location" className={labelClass}>
                  Location
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#59deca]/60">
                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                      <path d="M12 21c-4-4-8-7.5-8-11a8 8 0 0 1 16 0c0 3.5-4 7-8 11z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </span>
                  <input
                    id="location"
                    type="text"
                    name="location"
                    placeholder="Venue or city"
                    value={eventData.location}
                    onChange={handleChange}
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="price" className={labelClass}>
                  Ticket Price
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#59deca]/60 font-bold text-base leading-none">
                    $
                  </span>
                  <input
                    id="price"
                    type="number"
                    name="price"
                    placeholder="0 for free"
                    value={eventData.price}
                    onChange={handleChange}
                    min={0}
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="image" className={labelClass}>
                Event Banner URL
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#59deca]/60">
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="M21 15l-5-5L5 21"/>
                  </svg>
                </span>
                <input
                  id="image"
                  type="url"
                  name="image"
                  placeholder="https://..."
                  value={eventData.image}
                  onChange={handleChange}
                  className={`${inputClass} pl-11`}
                />
              </div>
            </div>

            {/* Error message */}
            {status === "error" && (
              <p className="text-center text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
                ⚠ {errorMsg}
              </p>
            )}

            {/* Submit */}
            <button
              id="submit-event-btn"
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="group relative mt-2 w-full overflow-hidden rounded-xl bg-[#59deca] px-6 py-4 text-sm font-bold text-black shadow-[0_0_32px_rgba(89,222,202,0.3)] transition-all duration-300 hover:bg-[#59deca]/90 hover:shadow-[0_0_48px_rgba(89,222,202,0.45)] active:scale-[0.98] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {status === "loading" && (
                  <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                )}
                {status === "success" ? "✓ Published! Redirecting…" : status === "loading" ? "Publishing…" : "Publish Event"}
                {status === "idle" && (
                  <svg
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </span>
              {/* shimmer */}
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default PostEvent;
