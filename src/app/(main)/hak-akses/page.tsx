"use client";

import { useEffect, useState } from "react";
import {
  Check,
  ChevronDown,
  ShieldCheck,
  Save,
  AlertCircle,
} from "lucide-react";

import {
  roles,
  menus,
  jenisAkses,
  defaultPermissions,
  getStoredPermissions,
  savePermissions,
  hasAccess,
} from "@/lib/permission";

import type {
  RoleName,
  AccessType,
} from "@/lib/permission";

const accessColors: Record<AccessType, string> = {
  Create:
    "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100",
  Read:
    "bg-blue-50 text-blue-700 ring-1 ring-blue-200 hover:bg-blue-100",
  Update:
    "bg-amber-50 text-amber-700 ring-1 ring-amber-200 hover:bg-amber-100",
  Delete:
    "bg-red-50 text-red-700 ring-1 ring-red-200 hover:bg-red-100",
  Export:
    "bg-violet-50 text-violet-700 ring-1 ring-violet-200 hover:bg-violet-100",
};

type PermissionState = Record<
  RoleName,
  Record<string, AccessType[]>
>;

export default function HakAksesPage() {
  const [selectedRole, setSelectedRole] =
    useState<RoleName>("Kasir");

  const [openRole, setOpenRole] =
    useState(false);

  const [permissions, setPermissions] =
    useState<PermissionState>(defaultPermissions);

  const [saved, setSaved] =
    useState(false);

  // Digunakan agar bagian yang membaca localStorage
  // tidak ikut dirender sebelum hydration selesai.
  const [isHydrated, setIsHydrated] =
    useState(false);

  useEffect(() => {
    const stored = getStoredPermissions();

    setPermissions(stored);
    setIsHydrated(true);
  }, []);

  const changeRole = (role: RoleName) => {
    setSelectedRole(role);
    setOpenRole(false);
  };

  const togglePermission = (
    menuName: string,
    accessName: AccessType
  ) => {
    setPermissions((current) => {
      const currentAccess =
        current[selectedRole][menuName] || [];

      const alreadyExists =
        currentAccess.includes(accessName);

      const updatedAccess = alreadyExists
        ? currentAccess.filter(
            (access) => access !== accessName
          )
        : [...currentAccess, accessName];

      return {
        ...current,
        [selectedRole]: {
          ...current[selectedRole],
          [menuName]: updatedAccess,
        },
      };
    });

    setSaved(false);
  };

  const handleSave = () => {
    savePermissions(permissions);

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const isPermissionActive = (
    menuName: string,
    accessName: AccessType
  ) => {
    return (
      permissions[selectedRole]?.[menuName]?.includes(
        accessName
      ) ?? false
    );
  };

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">

        {/* HEADER */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <ShieldCheck size={19} />
                </div>

                <span className="text-sm font-medium text-indigo-600">
                  Pengaturan Sistem
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Hak Akses
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Atur hak akses setiap role terhadap menu dan fitur
                aplikasi.
              </p>
            </div>

            {/* ROLE SELECTOR */}
            <div className="relative w-full sm:w-[220px]">
              <button
                type="button"
                onClick={() =>
                  setOpenRole((current) => !current)
                }
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left shadow-sm outline-none transition-all duration-200 hover:border-slate-300 hover:shadow-md focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              >
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                    Role aktif
                  </p>

                  <p className="mt-0.5 text-sm font-semibold text-slate-800">
                    {selectedRole}
                  </p>
                </div>

                <ChevronDown
                  size={18}
                  className={`text-slate-400 transition-transform duration-200 ${
                    openRole ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openRole && (
                <div className="absolute right-0 top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                  {roles.map((role) => {
                    const active =
                      role.nama_role === selectedRole;

                    return (
                      <button
                        key={role.id_role}
                        type="button"
                        onClick={() =>
                          changeRole(
                            role.nama_role as RoleName
                          )
                        }
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors ${
                          active
                            ? "bg-indigo-50 font-semibold text-indigo-700"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        <div className="text-left">
                          <p className="font-medium">
                            {role.nama_role}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            {role.deskripsi}
                          </p>
                        </div>

                        {active && (
                          <Check
                            size={16}
                            className="text-indigo-600"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PERMISSION CARD */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* CARD HEADER */}
          <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Permission {selectedRole}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Tentukan operasi yang dapat dilakukan pada
                  setiap menu.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                {menus.length} menu
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Menu
                  </th>

                  {jenisAkses.map((akses) => (
                    <th
                      key={akses.id_jenis_akses}
                      className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                      {akses.nama_jenis_akses}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {menus.map((menu) => (
                  <tr
                    key={menu.id_menu}
                    className="border-b border-slate-100 transition-colors last:border-b-0 hover:bg-indigo-50/20"
                  >
                    {/* MENU */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                          <ShieldCheck size={16} />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {menu.nama_menu}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            {menu.kode_menu}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* ACCESS */}
                    {jenisAkses.map((akses) => {
                      const accessName =
                        akses.nama_jenis_akses as AccessType;

                      const active =
                        isPermissionActive(
                          menu.nama_menu,
                          accessName
                        );

                      return (
                        <td
                          key={akses.id_jenis_akses}
                          className="px-4 py-4 text-center"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              togglePermission(
                                menu.nama_menu,
                                accessName
                              )
                            }
                            className={`inline-flex min-w-[78px] items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 ${
                              active
                                ? accessColors[accessName]
                                : "bg-slate-50 text-slate-300 ring-1 ring-slate-200 hover:bg-slate-100 hover:text-slate-500"
                            }`}
                          >
                            {active && (
                              <Check size={13} />
                            )}

                            {active
                              ? "Diizinkan"
                              : "Ditolak"}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FOOTER */}
          <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="text-xs text-slate-400">
              Perubahan belum tersimpan sampai tombol
              <span className="font-medium text-slate-600">
                {" "}
                Simpan Perubahan
              </span>{" "}
              ditekan.
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-200 active:scale-[0.98]"
            >
              <Save size={16} />

              Simpan Perubahan
            </button>
          </div>
        </div>

        {/* ACCESS LEGEND */}
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Keterangan Hak Akses
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Jenis operasi yang tersedia dalam sistem.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {jenisAkses.map((akses) => {
              const accessName =
                akses.nama_jenis_akses as AccessType;

              return (
                <div
                  key={akses.id_jenis_akses}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ${accessColors[accessName]}`}
                >
                  <span>{accessName}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* =====================================================
            PERMISSION DEBUG
            Hanya dirender setelah hydration selesai.
            Ini mencegah hydration mismatch karena hasAccess()
            membaca localStorage.
        ====================================================== */}
        {isHydrated && (
          <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <AlertCircle size={17} />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Permission Debug
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Bagian ini digunakan sementara untuk memastikan
                  pengecekan hak akses dan localStorage bekerja
                  dengan benar.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

              {/* KASIR - BARANG READ */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">
                  Kasir
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  Data Barang
                </p>

                <div className="mt-3">
                  {hasAccess(
                    "Kasir",
                    "Data Barang",
                    "Read"
                  ) ? (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                      <Check size={13} />
                      Diizinkan
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 ring-1 ring-red-200">
                      ✕ Ditolak
                    </span>
                  )}
                </div>
              </div>

              {/* KASIR - BARANG CREATE */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">
                  Kasir
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  Data Barang
                </p>

                <div className="mt-3">
                  {hasAccess(
                    "Kasir",
                    "Data Barang",
                    "Create"
                  ) ? (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                      <Check size={13} />
                      Diizinkan
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 ring-1 ring-red-200">
                      ✕ Ditolak
                    </span>
                  )}
                </div>
              </div>

              {/* MANAGER - BARANG CREATE */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">
                  Manager
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  Data Barang
                </p>

                <div className="mt-3">
                  {hasAccess(
                    "Manager",
                    "Data Barang",
                    "Create"
                  ) ? (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                      <Check size={13} />
                      Diizinkan
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 ring-1 ring-red-200">
                      ✕ Ditolak
                    </span>
                  )}
                </div>
              </div>

              {/* OWNER - HAK AKSES DELETE */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">
                  Owner
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  Hak Akses
                </p>

                <div className="mt-3">
                  {hasAccess(
                    "Owner",
                    "Hak Akses",
                    "Delete"
                  ) ? (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                      <Check size={13} />
                      Diizinkan
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 ring-1 ring-red-200">
                      ✕ Ditolak
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* SUCCESS TOAST */}
      {saved && (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-[200] -translate-x-1/2 animate-in fade-in slide-in-from-bottom-3 duration-300 ease-out">
          <div className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-lg ring-1 ring-white/10">
            <Check
              size={16}
              className="shrink-0 text-emerald-400"
            />

            <span>
              Hak akses berhasil disimpan.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}