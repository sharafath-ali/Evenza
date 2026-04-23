import db from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { EventEntry } from "@/app/api/events/route";
import { DeleteSubmitButton } from "@/components/DeleteSubmitButton";

export default async function ManageEvents() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) redirect("/login");

  let user: { sub: string; role: string } | null = null;
  try {
    user = (await verifyToken(token)) as any;
  } catch (e) {
    redirect("/login");
  }

  // Data fetching logic based on role
  let query = db<EventEntry & { user_id: string }>("events").select("*").orderBy("created_at", "desc");
  if (user.role !== "admin") {
    query = query.where({ user_id: user.sub });
  }

  const events = await query;

  // ─── INLINE SERVER ACTION ──────────────────────────────────────────────────
  async function deleteEvent(formData: FormData) {
    "use server"; // Magic directive telling Next.js this is an RPC endpoint

    const actionCookie = await cookies();
    const actionToken = actionCookie.get(SESSION_COOKIE)?.value;
    if (!actionToken) throw new Error("Unauthorized");
    
    let actionUser;
    try {
      actionUser = (await verifyToken(actionToken)) as any;
    } catch {
      throw new Error("Unauthorized");
    }

    const eventId = formData.get("eventId") as string;
    if (!eventId) return;

    // Strict validation: Must be an admin, or the owner of the event
    if (actionUser.role === "admin") {
      await db("events").where({ id: eventId }).delete();
    } else {
      await db("events").where({ id: eventId, user_id: actionUser.sub }).delete();
    }

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
        As {user.role === 'admin' ? "an admin" : "a user"}, you can delete {user.role === 'admin' ? "any event" : "your created events"} below. This page is a <strong>Server Component</strong>, and the delete button triggers a <strong>Server Action</strong>.
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
                <DeleteSubmitButton />
              </form>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
