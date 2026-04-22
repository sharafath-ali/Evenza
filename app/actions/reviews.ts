"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export type ReviewState = {
  success: boolean;
  error?: string;
  isInitial?: boolean;
};

export async function addReview(prevState: ReviewState, formData: FormData): Promise<ReviewState> {
  const eventId = formData.get("eventId") as string;
  const name = formData.get("name") as string;
  const ratingStr = formData.get("rating") as string;
  const comment = formData.get("comment") as string;

  if (!eventId) {
    return { success: false, error: "Event ID is missing." };
  }

  if (!name || name.trim().length === 0) {
    return { success: false, error: "Please provide your name." };
  }

  const rating = parseInt(ratingStr, 10);
  if (isNaN(rating) || rating < 1 || rating > 5) {
    return { success: false, error: "Please select a valid rating between 1 and 5." };
  }

  if (!comment || comment.trim().length < 5) {
    return { success: false, error: "Your review comment is too short." };
  }

  try {
    await db("reviews").insert({
      event_id: eventId,
      name: name.trim(),
      rating,
      comment: comment.trim(),
    });

    // Revalidate the dynamic route page so the new review appears instantly
    revalidatePath(`/event/${eventId}`);
    
    return { success: true };
  } catch (err) {
    console.error("Failed to add review", err);
    return { success: false, error: "An unexpected database error occurred while saving the review." };
  }
}
