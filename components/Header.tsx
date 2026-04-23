"use client";

import Link from "next/link";
import { User, LogOut, Settings, CalendarRange } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

import { useUser } from "@/components/UserProvider";

export function Header() {
  const user = useUser();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.refresh();
      router.push('/');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-16 border-b border-white/5 bg-[#0d161a]/60 backdrop-blur-md px-6 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold font-[var(--font-schibsted-grotesk)] text-white tracking-wide flex items-center gap-2">
        <div className="size-6 rounded-md bg-[#59deca] flex items-center justify-center">
            <span className="text-[#0d161a] text-sm font-black">E</span>
        </div>
        <span>Even<span className="text-[#59deca]">za</span></span>
      </Link>

      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <Link href="/login" className="text-sm font-medium text-[#bdbdbd] hover:text-white transition-colors">
              Log in
            </Link>
            <Link href="/signup" className="rounded-full bg-[#59deca] px-4 py-1.5 text-sm font-bold text-black hover:bg-[#59deca]/85 transition-colors">
              Sign up
            </Link>
          </>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 pl-2 pr-4 py-1 hover:bg-white/10 transition-colors"
            >
              <div className="size-6 rounded-full bg-[#59deca]/20 text-[#59deca] flex items-center justify-center">
                <User size={14} />
              </div>
              <span className="text-sm font-medium text-white">{user.name || user.email.split('@')[0]}</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-[#0d161a] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 origin-top-right">
                <div className="px-4 py-3 border-b border-white/5 flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-white truncate">{user.name}</span>
                  <span className="text-xs text-[#bdbdbd] truncate">{user.email}</span>
                </div>
                <div className="p-1">
                  <Link
                    href="/manage"
                    onClick={() => setDropdownOpen(false)}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-[#e7f2ff] hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <CalendarRange size={16} />
                    Manage Events
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-[#e7f2ff] hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <Settings size={16} />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left"
                  >
                    <LogOut size={16} />
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
