"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Menu,
  Search,
} from "lucide-react";

import { getSession } from "@/lib/auth";

interface TopbarProps {
  onMenuClick: () => void;
}

interface SessionUser {
  nama_lengkap?: string;
  role?: {
    nama_role?: string;
  };
}

export default function Topbar({
  onMenuClick,
}: TopbarProps) {
  const [session, setSession] = useState<SessionUser | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const currentSession = getSession();

    setSession(currentSession);
  }, []);

  const initials = session?.nama_lengkap
    ? session.nama_lengkap
        .split(" ")
        .filter(Boolean)
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "US";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Buka menu"
          className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 lg:hidden"
        >
          <Menu size={21} />
        </button>

        {/* Search */}
        <div className="hidden md:flex md:w-64 lg:w-80">
          <div className="relative w-full">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Cari..."
              className="w-full rounded-xl bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
            />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-2">
        {/* Notification */}
        <button
          type="button"
          aria-label="Notifikasi"
          className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100"
        >
          <Bell size={19} />

          {/* Notification indicator */}
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button>

        {/* Divider */}
        <div className="hidden h-7 w-px bg-slate-200 sm:block" />

        {/* User Profile */}
        <div className="flex items-center gap-3">
          {/* User Information */}
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-slate-800">
              {mounted
                ? session?.nama_lengkap ?? "Pengguna"
                : "Pengguna"}
            </p>

            <p className="text-[11px] text-slate-400">
              {mounted
                ? session?.role?.nama_role ?? "User"
                : "User"}
            </p>
          </div>

          {/* Avatar */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
            {mounted ? initials : "US"}
          </div>
        </div>
      </div>
    </header>
  );
}