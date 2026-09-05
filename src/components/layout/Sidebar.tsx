"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  X,
  Store,
  LogOut,
  AlertTriangle,
} from "lucide-react";

import {
  clearSession,
  getSession,
} from "@/lib/auth";

import { AuthSession } from "@/features/user/types";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const menus = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Transaksi",
    path: "/transaksi",
    icon: ShoppingCart,
  },
  {
    name: "Barang",
    path: "/barang",
    icon: Package,
  },
];

export default function Sidebar({
  open,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [session, setSession] =
    useState<AuthSession | null>(null);

  const [showLogoutModal, setShowLogoutModal] =
    useState(false);

  const [isLoggingOut, setIsLoggingOut] =
    useState(false);

  useEffect(() => {
    setSession(getSession());
  }, []);

  const handleLogout = () => {
    setIsLoggingOut(true);

    setTimeout(() => {
      clearSession();
      router.replace("/login");
    }, 300);
  };

  return (
    <>
      {/* MOBILE OVERLAY */}

      <div
        className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px] transition-all duration-300 lg:hidden ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      {/* SIDEBAR */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-out lg:translate-x-0 ${
          open
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* Logo */}

        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="group flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 transition duration-200 group-hover:scale-105">
              <Store
                size={18}
                className="text-white"
              />
            </div>

            <div>
              <p className="text-base font-bold tracking-tight text-slate-900">
                Kasirfy
              </p>

              <p className="text-[10px] text-slate-400">
                Point of Sale
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition duration-200 hover:bg-slate-100 hover:text-slate-700 active:scale-95 lg:hidden"
          >
            <X size={19} />
          </button>
        </div>

        {/* Navigation */}

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Menu Utama
          </p>

          <div className="space-y-1">
            {menus.map((menu) => {
              const Icon = menu.icon;

              const isActive =
                pathname === menu.path ||
                pathname.startsWith(
                  `${menu.path}/`
                );

              return (
                <Link
                  key={menu.path}
                  href={menu.path}
                  onClick={onClose}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon
                    size={18}
                    className="transition-transform duration-200 group-hover:scale-105"
                  />

                  <span>{menu.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User */}

        <div className="border-t border-slate-100 p-3">
          <div className="mb-2 flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3 transition duration-200 hover:bg-slate-100">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
              {session?.nama_lengkap
                ? session.nama_lengkap
                    .slice(0, 2)
                    .toUpperCase()
                : "US"}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-800">
                {session?.nama_lengkap ??
                  "Pengguna"}
              </p>

              <p className="truncate text-xs text-slate-400">
                {session?.role?.nama_role ??
                  "User"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setShowLogoutModal(true)
            }
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600 active:scale-[0.99]"
          >
            <LogOut
              size={18}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />

            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* LOGOUT MODAL */}

      {showLogoutModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[3px] animate-in fade-in duration-200">
          <div className="w-full max-w-sm animate-in zoom-in-95 slide-in-from-bottom-2 duration-200 rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                <AlertTriangle
                  size={23}
                  className="text-red-500"
                />
              </div>
            </div>

            <div className="mt-4 text-center">
              <h2 className="text-lg font-semibold text-slate-900">
                Yakin ingin keluar?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Anda akan keluar dari akun Kasirfy.
                Pastikan semua pekerjaan Anda sudah
                selesai.
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                disabled={isLoggingOut}
                onClick={() =>
                  setShowLogoutModal(false)
                }
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-50 active:scale-[0.98] disabled:opacity-50"
              >
                Batal
              </button>

              <button
                type="button"
                disabled={isLoggingOut}
                onClick={handleLogout}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-red-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoggingOut ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Keluar...
                  </>
                ) : (
                  <>
                    <LogOut size={16} />
                    Keluar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}