import db from "@/lib/db";
import Link from "next/link";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import { cancelBooking } from "@/app/actions/events";

export default async function MyBookings() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) redirect("/login");

  let user: { sub: string; role: string } | null = null;
  try {
    user = (await verifyToken(token)) as any;
  } catch (e) {
    redirect("/login");
  }

  // Fetch the user's bookings, joined with event details
  const bookings = await db("bookings")
    .join("events", "bookings.event_id", "events.id")
    .where("bookings.user_id", user!.sub)
    .select(
      "bookings.id as booking_id",
      "bookings.qty",
      "bookings.created_at as booked_at",
      "events.id as event_id",
      "events.title",
      "events.date",
      "events.location",
      "events.image"
    )
    .orderBy("bookings.created_at", "desc");

  return (
    <main className="max-w-5xl mx-auto py-24 px-6 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">My Bookings</h1>
        <Link
          href="/"
          className="text-sm font-semibold text-[#59deca] bg-[#59deca]/10 px-4 py-2 rounded-lg hover:bg-[#59deca]/20 transition-colors"
        >
          ← Back to Events
        </Link>
      </div>

      <p className="text-[#bdbdbd] mb-4">
        Below are all the tickets you have successfully booked for upcoming events.
      </p>

      {bookings.length === 0 ? (
        <div className="text-center py-20 text-[#bdbdbd]">
          You have no active bookings! Explore the home page to find your next adventure.
        </div>
      ) : (
        <div className="grid gap-4">
          {bookings.map((b) => (
            <div
              key={b.booking_id}
              className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm"
            >
              <div className="flex flex-col gap-1">
                <span className="text-white font-semibold text-lg">{b.title}</span>
                <span className="text-[#bdbdbd] text-sm">{b.date} · {b.location}</span>
                <span className="text-[#59deca] text-xs font-bold uppercase tracking-wide mt-1">
                  Ticket Qty: {b.qty}
                </span>
              </div>

              {/* Server Action Form to Cancel */}
              <form 
                action={async () => {
                  "use server";
                  await cancelBooking(b.booking_id);
                }}
              >
                <button
                  type="submit"
                  className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-500 hover:text-white transition-all"
                >
                  Cancel Booking
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
