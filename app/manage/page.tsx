import db from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { revalidatePath } from "next/cache";
import type { EventEntry } from "@/app/api/events/route";

export default async function ManageEvents() {
  // Directly fetch data because this is a Server Component!
  const events = await db<EventEntry>("events").select("*").orderBy("created_at", "desc");

  // ─── INLINE SERVER ACTION ──────────────────────────────────────────────────
  async function deleteEvent(formData: FormData) {
    "use server"; // Magic directive telling Next.js this is an RPC endpoint

    const eventId = formData.get("eventId") as string;
    if (!eventId) return;

    // Since we have a cascading foreign key, deleting the event also cleans up bookings!
    await db("events").where({ id: eventId }).delete();

    // Revalidate both the manage page and the root page so updates are instant
    revalidatePath("/manage");
    revalidatePath("/");
  }

  return (
    <main className="max-w-5xl mx-auto py-24 px-6 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Manage Events</h1>
        <Link
          href="/"
          className="text-sm font-semibold text-[#59deca] bg-[#59deca]/10 px-4 py-2 rounded-lg hover:bg-[#59deca]/20 transition-colors"
        >
          ← Back to App
        </Link>
      </div>

      <p className="text-[#bdbdbd] mb-4">
        As an admin, you can delete events below. This page is a <strong>Server Component</strong>, and the delete button triggers a <strong>Server Action</strong>.
      </p>

      {events.length === 0 ? (
        <div className="text-center py-20 text-[#bdbdbd]">No events found.</div>
      ) : (
        <div className="grid gap-4">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/10 shrink-0">
                  <Image src={evt.image || "/images/event1.png"} alt={evt.title} fill className="object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-semibold">{evt.title}</span>
                  <span className="text-[#bdbdbd] text-xs">{evt.date} · {evt.location}</span>
                </div>
              </div>

              {/* Notice how we use a standard HTML form connected directly to a Server Action */}
              <form action={deleteEvent}>
                <input type="hidden" name="eventId" value={evt.id} />
                <button
                  type="submit"
                  className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                >
                  Delete
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
