"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Edit2, X, Check } from "lucide-react";

export function EditProfileForm({ user }: { user: { id: string; name: string; email: string } }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsPending(true);

    try {
      const body: any = {};
      if (name !== user.name) body.name = name;
      if (email !== user.email) body.email = email;
      if (password) body.password = password;

      if (Object.keys(body).length === 0) {
        setIsEditing(false);
        setIsPending(false);
        return;
      }

      const res = await fetch(`/api/user/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      setIsEditing(false);
      setPassword(""); // Clear password field
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsPending(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setName(user.name || "");
    setEmail(user.email);
    setPassword("");
    setError("");
  };

  if (!isEditing) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center group">
          <div>
            <p className="text-sm text-[#e7f2ff]">Full Name</p>
            <p className="text-lg font-medium text-white">{user.name || "N/A"}</p>
          </div>
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-sm text-[#bdbdbd] hover:text-white hover:bg-white/10 transition-all"
          >
            <Edit2 size={14} /> Edit
          </button>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-[#e7f2ff]">Email Address</p>
            <p className="text-lg font-medium text-white">{user.email}</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-[#e7f2ff]">Password</p>
            <p className="text-lg font-medium text-white">••••••••</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-4 rounded-xl border border-white/10 bg-[#0d161a] p-5 shadow-inner">
      {error && (
        <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
          {error}
        </div>
      )}
      
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-[#e7f2ff]">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="rounded-lg bg-[#182830] border border-white/8 px-4 py-2.5 text-sm text-white placeholder:text-[#bdbdbd]/50 outline-none focus:border-[#59deca]/50 transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-[#e7f2ff]">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-lg bg-[#182830] border border-white/8 px-4 py-2.5 text-sm text-white placeholder:text-[#bdbdbd]/50 outline-none focus:border-[#59deca]/50 transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-[#e7f2ff]">New Password <span className="text-white/40 font-normal">(leave blank to keep current)</span></label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password..."
          className="rounded-lg bg-[#182830] border border-white/8 px-4 py-2.5 text-sm text-white placeholder:text-[#bdbdbd]/50 outline-none focus:border-[#59deca]/50 transition-colors"
        />
      </div>

      <div className="flex justify-end items-center gap-2 pt-2">
        <button
          type="button"
          onClick={cancelEdit}
          disabled={isPending}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-[#bdbdbd] hover:bg-white/5 transition-colors disabled:opacity-50"
        >
          <X size={16} /> Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#59deca] text-sm font-bold text-black border border-[#59deca] shadow-md shadow-[#59deca]/20 hover:bg-[#59deca]/85 hover:shadow-[#59deca]/30 transition-all disabled:opacity-50"
        >
          {isPending ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} 
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
