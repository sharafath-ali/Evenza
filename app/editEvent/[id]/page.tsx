import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import db from "@/lib/db";
import { SESSION_COOKIE, verifyToken } from "@/lib/auth";
import type { EventEntry } from "@/app/api/events/route";
import { PostEvent } from "@/components/PostEvent";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) redirect("/login");

  let payload;
  try {
    payload = await verifyToken(token);
  } catch {
    redirect("/login");
  }

  const event = await db<EventEntry & { user_id: string }>("events")
    .where({ id })
    .first();

  if (!event) return notFound();

  // Enforce ownership
  if (payload.role !== "admin" && event.user_id !== payload.sub) {
    redirect("/manage");
  }

  return (
    <main>
      <PostEvent initialData={event} />
    </main>
  );
}
