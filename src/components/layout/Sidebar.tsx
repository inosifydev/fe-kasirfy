'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { LayoutDashboard, ShoppingCart, Package, Boxes, FileText, Users, ShieldCheck, X, Store, LogOut, AlertTriangle, type LucideIcon } from 'lucide-react';
import { clearSession, getSession } from '@/lib/auth';
import { getProfile, getPermissions, logout } from '@/services/auth.service';
import { getStoredApiPermissions } from '@/services/auth.service';
import { menus } from '@/features/menu/data';
import type { AuthPermissions, AuthSession } from '@/features/user/types';
interface SidebarProps {
  open: boolean;
  onClose: () => void;
}
const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Boxes,
  FileText,
  Users,
  ShieldCheck,
};
export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [permissions, setPermissions] = useState<AuthPermissions | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  useEffect(() => {
    let mounted = true;
    async function loadUserData() {
      try {
        /**
         * SESSION LOKAL
         */
        const localSession = getSession();
        if (mounted && localSession) {
          setSession(localSession);
        }

        /**
         * PERMISSION LOKAL
         */
        const localPermissions = getStoredApiPermissions();
        if (mounted && localPermissions) {
          setPermissions(localPermissions);
        }

        /**
         * PROFILE TERBARU
         */
        const profile = await getProfile();
        if (!mounted) return;
        if (profile) {
          const storedPermissions = getStoredApiPermissions();
          const updatedSession: AuthSession = {
            id_user: profile.id_user,
            username: profile.username,
            nama_lengkap: profile.nama_lengkap,
            email: profile.email,
            no_hp: profile.no_hp,
            id_role: profile.id_role,
            role: profile.role
              ? {
                  id_role: profile.role.id_role,
                  nama_role: profile.role.nama_role,
                  deskripsi: profile.role.deskripsi || '',
                  created_at: profile.role.created_at || profile.created_at,
                }
              : undefined,
          };
          setSession(updatedSession);
          localStorage.setItem('kasirfy_session', JSON.stringify(updatedSession));

          /**
           * PERMISSION TERBARU
           */
          const latestPermissions = await getPermissions();
          if (mounted && latestPermissions) {
            setPermissions(latestPermissions);
            localStorage.setItem('kasirfy_permissions_api', JSON.stringify(latestPermissions));
          } else if (mounted && storedPermissions) {
            setPermissions(storedPermissions);
          }
        }
      } catch (error) {
        console.error('[Sidebar] Gagal mengambil data user:', error);
        if (!mounted) return;
        setSession(getSession());
        setPermissions(getStoredApiPermissions());
      } finally {
        if (mounted) {
          setIsLoadingProfile(false);
        }
      }
    }
    loadUserData();
    return () => {
      mounted = false;
    };
  }, []);

  /**
   * CHECK PERMISSION MENU
   *
   * module dari API dicocokkan
   * dengan kode_menu.
   */
  const visibleMenus = useMemo(() => {
    /**
     * Jika permission belum tersedia,
     * sementara tampilkan dashboard.
     */
    if (!permissions || !Array.isArray(permissions.permissions)) {
      return menus.filter((menu) => menu.kode_menu === 'dashboard');
    }
    return menus
      .filter((menu) => menu.is_active)
      .filter((menu) => {
        /**
         * Dashboard selalu boleh
         * ditampilkan jika aktif.
         */
        if (menu.kode_menu === 'dashboard') {
          return true;
        }

        /**
         * Cari permission berdasarkan
         * kode/module menu.
         */
        return permissions.permissions.some((permission) => {
          const moduleName = permission.module?.toLowerCase().trim();
          const menuCode = menu.kode_menu.toLowerCase().trim();
          const menuName = menu.nama_menu.toLowerCase().trim();
          return moduleName === menuCode || moduleName === menuName;
        });
      })
      .sort((a, b) => a.urutan - b.urutan);
  }, [permissions]);
  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('[Sidebar] Logout error:', error);
    } finally {
      clearSession();
      localStorage.removeItem('kasirfy_permissions_api');
      setTimeout(() => {
        router.replace('/login');
      }, 300);
    }
  };
  const getInitials = (name?: string): string => {
    if (!name) {
      return 'US';
    }
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  };
  return (
    <>
      {/* MOBILE OVERLAY */}
      <div className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px] transition-all duration-300 lg:hidden ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`} onClick={onClose} />

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-out lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* LOGO */}
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
          <Link href="/dashboard" onClick={onClose} className="group flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 transition duration-200 group-hover:scale-105">
              <Store size={18} className="text-white" />
            </div>

            <div>
              <p className="text-base font-bold tracking-tight text-slate-900">Kasirfy</p>

              <p className="text-[10px] text-slate-400">Point of Sale</p>
            </div>
          </Link>

          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 transition duration-200 hover:bg-slate-100 hover:text-slate-700 active:scale-95 lg:hidden">
            <X size={19} />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Menu Utama</p>

          <div className="space-y-1">
            {visibleMenus.map((menu) => {
              const Icon = iconMap[menu.icon] || Package;
              const isActive = pathname === menu.path || pathname.startsWith(`${menu.path}/`);
              return (
                <Link key={menu.id_menu} href={menu.path} onClick={onClose} className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${isActive ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                  <Icon size={18} className="transition-transform duration-200 group-hover:scale-105" />

                  <span>{menu.nama_menu}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* USER */}
        <div className="border-t border-slate-100 p-3">
          <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2.5 transition duration-200 hover:bg-slate-100">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">{isLoadingProfile ? '...' : getInitials(session?.nama_lengkap)}</div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-800">{isLoadingProfile ? 'Memuat...' : session?.nama_lengkap || 'Pengguna'}</p>

                <p className="truncate text-xs text-slate-400">{isLoadingProfile ? '...' : session?.role?.nama_role || permissions?.role || 'User'}</p>
              </div>
            </div>

            <button type="button" onClick={() => setShowLogoutModal(true)} title="Keluar" className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-all duration-200 hover:bg-red-50 hover:text-red-600 active:scale-95">
              <LogOut size={18} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[3px] animate-in fade-in duration-200">
          <div className="w-full max-w-sm animate-in zoom-in-95 slide-in-from-bottom-2 duration-200 rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                <AlertTriangle size={23} className="text-red-500" />
              </div>
            </div>

            <div className="mt-4 text-center">
              <h2 className="text-lg font-semibold text-slate-900">Yakin ingin keluar?</h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">Anda akan keluar dari akun Kasirfy. Pastikan semua pekerjaan Anda sudah selesai.</p>
            </div>

            <div className="mt-6 flex gap-3">
              <button type="button" disabled={isLoggingOut} onClick={() => setShowLogoutModal(false)} className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-50 active:scale-[0.98] disabled:opacity-50">
                Batal
              </button>

              <button type="button" disabled={isLoggingOut} onClick={handleLogout} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-red-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60">
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