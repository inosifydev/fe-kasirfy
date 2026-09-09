"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Check,
  ChevronRight,
  Save,
  ShieldCheck,
  Users,
} from "lucide-react";

import {
  roles,
  menus,
  jenisAkses,
  defaultPermissions,
  getStoredPermissions,
  savePermissions,
} from "@/lib/permission";

import type { RoleName, AccessType } from "@/lib/permission";

const accessColors: Record<AccessType, string> = {
  Create:
    "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100",
  Read:
    "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100",
  Update:
    "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100",
  Delete:
    "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100",
  Export:
    "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100",
};

const accessLabels: Record<AccessType, string> = {
  Create: "Tambah",
  Read: "Lihat",
  Update: "Ubah",
  Delete: "Hapus",
  Export: "Export",
};

const accessDescriptions: Record<AccessType, string> = {
  Create: "Bisa menambahkan data baru",
  Read: "Bisa membuka dan melihat isi menu ini",
  Update: "Bisa mengubah data yang sudah ada",
  Delete: "Bisa menghapus atau menonaktifkan data",
  Export: "Bisa mengekspor data",
};

type PermissionState = Record<
  RoleName,
  Record<string, AccessType[]>
>;

export default function HakAksesPage() {
  const [selectedRole, setSelectedRole] =
    useState<RoleName>("Owner");

  const [selectedMenu, setSelectedMenu] =
    useState<string>("Dashboard");

  const [permissions, setPermissions] =
    useState<PermissionState>(defaultPermissions);

  const [savedPermissions, setSavedPermissions] =
    useState<PermissionState>(defaultPermissions);

  const [isHydrated, setIsHydrated] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const [showSuccess, setShowSuccess] =
    useState(false);

  const [showError, setShowError] =
    useState(false);

  /*
   * Load permission dari localStorage
   */
  useEffect(() => {
    const stored = getStoredPermissions();

    setPermissions(stored);
    setSavedPermissions(stored);
    setIsHydrated(true);
  }, []);

  /*
   * Menu yang sedang dipilih
   */
  const currentMenu = useMemo(() => {
    return menus.find(
      (menu) => menu.nama_menu === selectedMenu
    );
  }, [selectedMenu]);

  /*
   * Jumlah permission aktif pada sebuah menu
   */
  const getPermissionCount = (
    roleName: RoleName,
    menuName: string
  ) => {
    return permissions[roleName]?.[menuName]?.length ?? 0;
  };

  /*
   * Jumlah seluruh permission sebuah role
   */
  const getRoleTotalAccess = (
    roleName: RoleName
  ) => {
    return menus.reduce((total, menu) => {
      return (
        total +
        getPermissionCount(
          roleName,
          menu.nama_menu
        )
      );
    }, 0);
  };

  /*
   * Total permission yang mungkin
   *
   * 7 menu x 5 permission = 35
   */
  const totalPossibleAccess =
    menus.length * jenisAkses.length;

  /*
   * Permission pada menu yang sedang dipilih
   */
  const currentMenuPermissions =
    permissions[selectedRole]?.[selectedMenu] ?? [];

  /*
   * Mengecek apakah ada perubahan
   */
  const hasChanges = useMemo(() => {
    return (
      JSON.stringify(permissions) !==
      JSON.stringify(savedPermissions)
    );
  }, [permissions, savedPermissions]);

  /*
   * Menghitung jumlah perubahan
   */
  const changeCount = useMemo(() => {
    let count = 0;

    roles.forEach((role) => {
      menus.forEach((menu) => {
        const current =
          permissions[role.nama_role as RoleName]?.[
            menu.nama_menu
          ] ?? [];

        const saved =
          savedPermissions[
            role.nama_role as RoleName
          ]?.[menu.nama_menu] ?? [];

        jenisAkses.forEach((access) => {
          const accessName =
            access.nama_jenis_akses as AccessType;

          const currentActive =
            current.includes(accessName);

          const savedActive =
            saved.includes(accessName);

          if (currentActive !== savedActive) {
            count++;
          }
        });
      });
    });

    return count;
  }, [permissions, savedPermissions]);

  /*
   * Toggle permission
   */
  const togglePermission = (
    menuName: string,
    accessName: AccessType
  ) => {
    setPermissions((prev) => {
      const rolePermissions = prev[selectedRole] ?? {};

      const currentPermissions =
        rolePermissions[menuName] ?? [];

      const exists =
        currentPermissions.includes(accessName);

      const updatedPermissions = exists
        ? currentPermissions.filter(
            (item) => item !== accessName
          )
        : [...currentPermissions, accessName];

      return {
        ...prev,
        [selectedRole]: {
          ...rolePermissions,
          [menuName]: updatedPermissions,
        },
      };
    });

    setShowSuccess(false);
    setShowError(false);
  };

  /*
   * Simpan permission
   */
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setShowSuccess(false);
      setShowError(false);

      await new Promise((resolve) =>
        setTimeout(resolve, 400)
      );

      savePermissions(permissions);

      setSavedPermissions(permissions);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 2500);
    } catch (error) {
      console.error(
        "Gagal menyimpan permission:",
        error
      );

      setShowError(true);

      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } finally {
      setIsSaving(false);
    }
  };

  /*
   * Ganti role
   */
  const handleSelectRole = (roleName: RoleName) => {
    setSelectedRole(roleName);
    setShowSuccess(false);
    setShowError(false);
  };

  /*
   * Ganti menu
   */
  const handleSelectMenu = (menuName: string) => {
    setSelectedMenu(menuName);
    setShowSuccess(false);
    setShowError(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[1500px] space-y-6 p-4 sm:p-6 lg:p-8">

        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <ShieldCheck
                  size={19}
                  strokeWidth={2}
                />
              </div>

              <span className="text-sm font-medium text-indigo-600">
                Manajemen Akses
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Hak Akses
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Atur hak akses setiap role terhadap menu
              aplikasi.
            </p>
          </div>
        </div>

        {/* =====================================================
            MAIN PERMISSION PANEL
        ====================================================== */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="grid min-h-[620px] grid-cols-1 lg:grid-cols-[190px_240px_minmax(0,1fr)]">

            {/* =================================================
                COLUMN 1 — ROLE
            ================================================== */}
            <div className="border-b border-slate-200 lg:border-b-0 lg:border-r">
              <div className="border-b border-slate-200 px-4 py-4">
                <div className="flex items-center gap-2">
                  <Users
                    size={16}
                    className="text-slate-500"
                  />

                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Role
                  </span>
                </div>
              </div>

              <div className="space-y-1 p-2">
                {roles.map((role) => {
                  const roleName =
                    role.nama_role as RoleName;

                  const isSelected =
                    selectedRole === roleName;

                  const totalAccess =
                    getRoleTotalAccess(roleName);

                  return (
                    <button
                      key={role.id_role}
                      type="button"
                      onClick={() =>
                        handleSelectRole(roleName)
                      }
                      className={`
                        group flex w-full items-center justify-between
                        rounded-lg px-3 py-2.5 text-left
                        transition-all duration-150
                        ${
                          isSelected
                            ? "bg-indigo-50 text-indigo-700"
                            : "text-slate-700 hover:bg-slate-50"
                        }
                      `}
                    >
                      <div className="min-w-0">
                        <p
                          className={`
                            truncate text-sm font-medium
                            ${
                              isSelected
                                ? "text-indigo-700"
                                : "text-slate-700"
                            }
                          `}
                        >
                          {role.nama_role}
                        </p>

                        <p
                          className={`
                            mt-0.5 text-[11px]
                            ${
                              isSelected
                                ? "text-indigo-500"
                                : "text-slate-400"
                            }
                          `}
                        >
                          {totalAccess}/
                          {totalPossibleAccess} akses
                        </p>
                      </div>

                      <ChevronRight
                        size={15}
                        className={`
                          shrink-0 transition-transform
                          ${
                            isSelected
                              ? "translate-x-0 text-indigo-500"
                              : "text-slate-300 group-hover:translate-x-0.5 group-hover:text-slate-400"
                          }
                        `}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* =================================================
                COLUMN 2 — MENU
            ================================================== */}
            <div className="border-b border-slate-200 lg:border-b-0 lg:border-r">
              <div className="border-b border-slate-200 px-4 py-4">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Menu
                </span>
              </div>

              <div className="space-y-1 p-2">
                {menus.map((menu) => {
                  const count =
                    getPermissionCount(
                      selectedRole,
                      menu.nama_menu
                    );

                  const isSelected =
                    selectedMenu ===
                    menu.nama_menu;

                  return (
                    <button
                    key={menu.id_menu}
                    type="button"
                    onClick={() =>
                      handleSelectMenu(menu.nama_menu)
                    }
                    className={`
                      flex w-full items-center justify-between
                      rounded-lg px-3 py-2.5 text-left
                      transition-all duration-150
                      ${
                        isSelected
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                      }
                    `}
                  >
                      <span
                        className={`
                          truncate text-sm
                          ${
                            isSelected
                            ? "text-indigo-700"
                            : "text-slate-500"
                          }
                        `}
                      >
                        {menu.nama_menu}
                      </span>

                      <span
                        className={`
                          ml-3 shrink-0 rounded-lg px-2.5 py-1
                          text-sm font-normal
                          ${
                            count === jenisAkses.length
                              ? "bg-emerald-50 text-emerald-00"
                              : count > 0
                              ? "bg-slate-100 text-slate-600"
                              : "bg-slate-100 text-slate-500"
                          }
                        `}
                      >
                        {count}/{jenisAkses.length}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* =================================================
                COLUMN 3 — PERMISSION
            ================================================== */}
            <div className="flex min-w-0 flex-col">

              {/* Header */}
              <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      <span className="text-indigo-600">
                        {selectedRole}
                      </span>
                      <span className="mx-1 text-slate-300">
                        ·
                      </span>
                      {currentMenu?.nama_menu ??
                        selectedMenu}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Atur permission yang dapat
                      digunakan oleh role ini.
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500">
                    {currentMenuPermissions.length}/
                    {jenisAkses.length} akses
                  </div>
                </div>
              </div>

              {/* Permission List */}
              <div className="flex-1 px-5 sm:px-6">
                {jenisAkses.map((access) => {
                  const accessName =
                    access.nama_jenis_akses as AccessType;

                  const isActive =
                    currentMenuPermissions.includes(
                      accessName
                    );

                  return (
                    <div
                      key={access.id_jenis_akses}
                      className="flex items-center justify-between gap-4 border-b border-slate-100 py-4 last:border-b-0"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800">
                          {accessLabels[accessName]}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-400">
                          {
                            accessDescriptions[
                              accessName
                            ]
                          }
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          togglePermission(
                            selectedMenu,
                            accessName
                          )
                        }
                        className={`
                          shrink-0 rounded-lg px-3 py-2
                          text-xs font-semibold
                          transition-all duration-150
                          ${
                            isActive
                              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100"
                              : "bg-red-50 text-red-600 ring-1 ring-red-200 hover:bg-red-100"
                          }
                        `}
                      >
                        <span className="flex items-center gap-1.5">
                          {isActive && (
                            <Check size={13} />
                          )}

                          {isActive
                            ? "Diizinkan"
                            : "Ditolak"}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="border-t border-slate-200 bg-slate-50/70 px-5 py-4 sm:px-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                  <div className="text-xs">
                    {hasChanges ? (
                      <span className="text-slate-500">
                        <span className="font-semibold text-slate-700">
                          {changeCount}
                        </span>{" "}
                        perubahan belum disimpan
                      </span>
                    ) : (
                      <span className="text-slate-400">
                        Semua perubahan sudah disimpan
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={
                      !hasChanges || isSaving
                    }
                    className={`
                      inline-flex items-center justify-center
                      gap-2 rounded-lg px-4 py-2.5
                      text-sm font-semibold
                      transition-all duration-200
                      ${
                        hasChanges && !isSaving
                          ? "bg-slate-800 text-white shadow-sm hover:bg-slate-900"
                          : "cursor-not-allowed bg-slate-200 text-slate-400"
                      }
                    `}
                  >
                    {isSaving ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save size={15} />
                        Simpan perubahan
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            LEGEND
        ====================================================== */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-slate-800">
              Jenis akses
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Setiap menu memiliki lima jenis permission.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {jenisAkses.map((access) => {
              const accessName =
                access.nama_jenis_akses as AccessType;

              return (
                <div
                  key={access.id_jenis_akses}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-3"
                >
                  <div
                    className={`
                      mb-2 inline-flex rounded-lg px-2.5 py-1
                      text-xs font-semibold
                      ${accessColors[accessName]}
                    `}
                  >
                    {accessLabels[accessName]}
                  </div>

                  <p className="text-xs leading-5 text-slate-500">
                    {
                      accessDescriptions[
                        accessName
                      ]
                    }
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* =====================================================
            TEMPORARY DEBUG
        ====================================================== */}
        {isHydrated && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <AlertCircle
                size={15}
                className="text-slate-400"
              />

              <h2 className="text-sm font-semibold text-slate-700">
                Permission Debug
              </h2>
            </div>

            <div className="grid gap-2 text-xs text-slate-500 sm:grid-cols-3">
              <div>
                <span className="text-slate-400">
                  Role aktif:
                </span>{" "}
                <span className="font-semibold text-slate-700">
                  {selectedRole}
                </span>
              </div>

              <div>
                <span className="text-slate-400">
                  Menu aktif:
                </span>{" "}
                <span className="font-semibold text-slate-700">
                  {selectedMenu}
                </span>
              </div>

              <div>
                <span className="text-slate-400">
                  Permission:
                </span>{" "}
                <span className="font-semibold text-slate-700">
                  {currentMenuPermissions.length}/
                  {jenisAkses.length}
                </span>
              </div>
            </div>

            <div className="mt-3 rounded-lg bg-slate-50 p-3 font-mono text-[11px] text-slate-500">
              {JSON.stringify(
                currentMenuPermissions,
                null,
                2
              )}
            </div>
          </div>
        )}

        {/* =====================================================
            TOAST SUCCESS
        ====================================================== */}
        {showSuccess && (
          <div className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2">
            <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-lg ring-1 ring-slate-200">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Check size={17} />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Berhasil disimpan
                </p>

                <p className="text-xs text-slate-400">
                  Perubahan hak akses telah
                  disimpan.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            TOAST ERROR
        ====================================================== */}
        {showError && (
          <div className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2">
            <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-lg ring-1 ring-slate-200">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-600">
                <AlertCircle size={17} />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Gagal menyimpan
                </p>

                <p className="text-xs text-slate-400">
                  Terjadi kesalahan saat menyimpan
                  perubahan.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}