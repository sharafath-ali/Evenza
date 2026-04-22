"use client";

import { useFormStatus } from "react-dom";

export function DeleteSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}
