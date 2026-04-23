import { cookies } from "next/headers";
import { SESSION_COOKIE, verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DeleteAccountButton } from "@/components/DeleteAccountButton";

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    redirect("/login");
  }

  let user = null;
  try {
    user = await verifyToken(token);
  } catch (e) {
    redirect("/login");
  }

  return (
    <main className="flex flex-col items-center pt-32 px-4 pb-24 min-h-screen">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0d161a]/60 p-8 md:p-12 shadow-[0_0_40px_rgba(89,222,202,0.05)] backdrop-blur-md">
        <h1 className="text-3xl font-bold text-white font-[var(--font-schibsted-grotesk)] mb-2">Account Settings</h1>
        <p className="text-sm text-[#bdbdbd] mb-8">Manage your account details and preferences.</p>

        <div className="space-y-6">
          <div className="flex flex-col gap-2 border-b border-white/10 pb-6">
            <span className="text-xs font-semibold text-[#59deca] uppercase tracking-wider">Profile</span>
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm text-[#e7f2ff]">Full Name</p>
                    <p className="text-lg font-medium text-white">{user.name || "N/A"}</p>
                </div>
            </div>
            <div className="flex justify-between items-center mt-2">
                <div>
                    <p className="text-sm text-[#e7f2ff]">Email Address</p>
                    <p className="text-lg font-medium text-white">{user.email}</p>
                </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 pt-2">
            <span className="text-xs font-semibold text-[#59deca] uppercase tracking-wider">Danger Zone</span>
            <p className="text-sm text-[#bdbdbd] max-w-sm">Once you delete your account, there is no going back. Please be certain.</p>
            <DeleteAccountButton />
          </div>
        </div>
      </div>
    </main>
  );
}
