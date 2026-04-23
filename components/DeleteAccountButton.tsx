"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function DeleteAccountButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsPending(true);
    try {
      const res = await fetch("/api/auth/delete", {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete account");
      }

      router.refresh();
      router.push("/");
    } catch (err) {
      console.error(err);
      alert("Failed to delete account. Please try again.");
    } finally {
      setIsPending(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="mt-2 flex items-center gap-3">
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="flex items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending && <Loader2 className="size-4 animate-spin" />}
          {isPending ? "Deleting..." : "Yes, Delete It"}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={isPending}
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-[#bdbdbd] hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="w-fit mt-2 flex items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-6 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
    >
      Delete Account
    </button>
  );
}
