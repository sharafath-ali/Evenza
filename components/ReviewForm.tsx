"use client";

import { useActionState, useState, useEffect } from "react";
import { addReview } from "@/app/actions/reviews";

interface ReviewFormProps {
  eventId: string;
}

export function ReviewForm({ eventId }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [state, formAction, isPending] = useActionState(addReview, { success: false, isInitial: true });

  // On success, we can clear out the form natively!
  useEffect(() => {
    if (state.success && !state.isInitial) {
      // Form resets automatically via browser form behavior if uncontrolled, but since we control rating:
      setRating(1);
      const form = document.getElementById("review-form") as HTMLFormElement;
      if (form) form.reset();
    }
  }, [state]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
      <h3 className="text-xl font-bold text-white mb-4">Leave a Review</h3>
      
      {state.success && !state.isInitial ? (
        <div className="rounded-lg bg-[#59deca]/10 border border-[#59deca]/30 p-4 text-[#59deca] text-sm font-semibold mb-4 text-center">
          Thank you for your review!
        </div>
      ) : null}

      <form id="review-form" action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="eventId" value={eventId} />
        {/* Hidden internal tracking for the star rating since we render custom stars */}
        <input type="hidden" name="rating" value={rating} />
        
        <div>
          <label className="block text-xs font-semibold tracking-widest text-[#59deca] uppercase mb-1.5">Your Name</label>
          <input
            type="text"
            name="name"
            disabled={isPending}
            placeholder="John Doe"
            className="w-full rounded-lg bg-[#0d161a] border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-[#bdbdbd] outline-none focus:border-[#59deca]/50 disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold tracking-widest text-[#59deca] uppercase mb-1.5">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                disabled={isPending}
                onClick={() => setRating(star)}
                className={`text-2xl transition-colors ${
                  star <= rating ? "text-yellow-400" : "text-[#bdbdbd]/30"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold tracking-widest text-[#59deca] uppercase mb-1.5">Review</label>
          <textarea
            name="comment"
            disabled={isPending}
            placeholder="What did you think of the event?"
            rows={4}
            className="w-full rounded-lg bg-[#0d161a] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-[#bdbdbd] outline-none focus:border-[#59deca]/50 resize-none disabled:opacity-50"
          />
        </div>

        {/* Server Validation Error */}
        {state.error && (
          <div className="text-red-400 text-xs font-semibold px-1 flex items-center gap-1.5">
            <svg className="size-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
            </svg>
            {state.error}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl w-full bg-[#59deca] px-4 py-3 text-sm font-bold text-black border border-transparent shadow-[0_0_15px_rgba(89,222,202,0.15)] hover:bg-[#59deca]/85 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isPending ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
