"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsPending(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to sign up");
      }

      router.refresh();
      router.push(callbackUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center -translate-y-16 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0d161a]/80 p-8 shadow-[0_0_60px_rgba(89,222,202,0.1)] backdrop-blur-md">
        <div className="mb-8 text-center flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-white font-[var(--font-schibsted-grotesk)]">Create an account</h1>
            <p className="text-sm text-[#bdbdbd]">Join Evenza to start booking events</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#e7f2ff]">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
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
              placeholder="you@example.com"
              required
              className="rounded-lg bg-[#182830] border border-white/8 px-4 py-2.5 text-sm text-white placeholder:text-[#bdbdbd]/50 outline-none focus:border-[#59deca]/50 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#e7f2ff]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
              required
              className="rounded-lg bg-[#182830] border border-white/8 px-4 py-2.5 text-sm text-white placeholder:text-[#bdbdbd]/50 outline-none focus:border-[#59deca]/50 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#59deca] py-2.5 text-sm font-bold text-black hover:bg-[#59deca]/85 transition-colors shadow-[0_0_20px_rgba(89,222,202,0.25)] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            {isPending ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#bdbdbd]">
          Already have an account?{" "}
          <Link href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="font-semibold text-[#59deca] hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
