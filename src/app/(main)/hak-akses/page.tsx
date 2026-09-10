"use client";

import { useEffect, useMemo, useState } from "react";
import { Manrope, JetBrains_Mono } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jbMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
});

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

interface Role {
  id_role: string;
  nama_role: string;
  deskripsi?: string;
}

interface Menu {
  id_menu: string;
  kode_menu: string;
  nama_menu: string;
}

interface AccessType {
  id_jenis_akses: string;
  nama_jenis_akses: string;
  label: string;
  desc: string;
}

interface Permission {
  id_hak_akses: string;
  id_role: string;
  id_menu: string;
  id_jenis_akses: string;
}

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

// ---------------------------------------------------------------------------
// FALLBACK
// ---------------------------------------------------------------------------

const FALLBACK = {
  roles: [
    {
      id_role: "4d42385c-659a-4f48-86da-a43b1b7221ce",
      nama_role: "Owner",
    },
    {
      id_role: "ee1629b7-489d-474c-adb3-a7a9cfb00bf2",
      nama_role: "Manager",
    },
    {
      id_role: "d061710e-4900-4e74-8b44-a9653c6d4e1f",
      nama_role: "Kasir",
    },
  ],

  menus: [
    {
      id_menu: "m-dash",
      kode_menu: "dashboard",
      nama_menu: "Dashboard",
    },
    {
      id_menu: "m-user",
      kode_menu: "user",
      nama_menu: "Pengguna",
    },
    {
      id_menu: "m-produk",
      kode_menu: "produk",
      nama_menu: "Produk",
    },
    {
      id_menu: "m-transaksi",
      kode_menu: "transaksi",
      nama_menu: "Transaksi",
    },
    {
      id_menu: "m-laporan",
      kode_menu: "laporan",
      nama_menu: "Laporan",
    },
    {
      id_menu: "m-hakakses",
      kode_menu: "hak_akses",
      nama_menu: "Hak Akses",
    },
  ],

  access_types: [
    {
      id_jenis_akses: "a-read",
      nama_jenis_akses: "read",
      label: "Lihat",
      desc: "Bisa membuka dan melihat isi menu ini",
    },
    {
      id_jenis_akses: "a-create",
      nama_jenis_akses: "create",
      label: "Tambah",
      desc: "Bisa menambahkan data baru",
    },
    {
      id_jenis_akses: "a-update",
      nama_jenis_akses: "update",
      label: "Ubah",
      desc: "Bisa mengubah data yang sudah ada",
    },
    {
      id_jenis_akses: "a-delete",
      nama_jenis_akses: "delete",
      label: "Hapus",
      desc: "Bisa menghapus atau menonaktifkan data",
    },
  ],

  permissions: [
    {
      id_hak_akses: "p1",
      id_role: "4d42385c-659a-4f48-86da-a43b1b7221ce",
      id_menu: "m-user",
      id_jenis_akses: "a-read",
    },
    {
      id_hak_akses: "p2",
      id_role: "4d42385c-659a-4f48-86da-a43b1b7221ce",
      id_menu: "m-user",
      id_jenis_akses: "a-create",
    },
    {
      id_hak_akses: "p3",
      id_role: "4d42385c-659a-4f48-86da-a43b1b7221ce",
      id_menu: "m-user",
      id_jenis_akses: "a-update",
    },
    {
      id_hak_akses: "p4",
      id_role: "4d42385c-659a-4f48-86da-a43b1b7221ce",
      id_menu: "m-user",
      id_jenis_akses: "a-delete",
    },

    {
      id_hak_akses: "p9",
      id_role: "ee1629b7-489d-474c-adb3-a7a9cfb00bf2",
      id_menu: "m-user",
      id_jenis_akses: "a-read",
    },

    {
      id_hak_akses: "p11",
      id_role: "ee1629b7-489d-474c-adb3-a7a9cfb00bf2",
      id_menu: "m-produk",
      id_jenis_akses: "a-read",
    },
    {
      id_hak_akses: "p12",
      id_role: "ee1629b7-489d-474c-adb3-a7a9cfb00bf2",
      id_menu: "m-produk",
      id_jenis_akses: "a-create",
    },

    {
      id_hak_akses: "p15",
      id_role: "d061710e-4900-4e74-8b44-a9653c6d4e1f",
      id_menu: "m-user",
      id_jenis_akses: "a-read",
    },
    {
      id_hak_akses: "p16",
      id_role: "d061710e-4900-4e74-8b44-a9653c6d4e1f",
      id_menu: "m-produk",
      id_jenis_akses: "a-read",
    },
  ],
};

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") {
    return {};
  }

  const token = window.localStorage.getItem("access_token");

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

// ---------------------------------------------------------------------------
// PAGE
// ---------------------------------------------------------------------------

export default function HakAksesPage() {
  const [roles, setRoles] = useState<Role[]>(FALLBACK.roles);
  const [menus, setMenus] = useState<Menu[]>(FALLBACK.menus);
  const [accessTypes, setAccessTypes] = useState<AccessType[]>(
    FALLBACK.access_types
  );
  const [permissions, setPermissions] = useState<Permission[]>(
    FALLBACK.permissions
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);

  const [pending, setPending] = useState<Record<string, boolean>>({});
  const [toasts, setToasts] = useState<Toast[]>([]);

  // -------------------------------------------------------------------------
  // LOAD DATA
  // -------------------------------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        if (!API_BASE) {
          throw new Error(
            "NEXT_PUBLIC_API_URL belum dikonfigurasi"
          );
        }

        const res = await fetch(`${API_BASE}/api/v1/hak-akses`, {
          headers: {
            ...getAuthHeaders(),
          },
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Gagal memuat data hak akses");
        }

        const json = await res.json();

        if (!cancelled && json?.data) {
          setRoles(json.data.roles ?? FALLBACK.roles);
          setMenus(json.data.menus ?? FALLBACK.menus);
          setAccessTypes(
            json.data.access_types ?? FALLBACK.access_types
          );
          setPermissions(
            json.data.permissions ?? FALLBACK.permissions
          );
        }
      } catch (error) {
        console.error("Hak akses:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  // -------------------------------------------------------------------------
  // TOAST
  // -------------------------------------------------------------------------

  function addToast(
    message: string,
    type: "success" | "error" = "success"
  ) {
    const id = Date.now() + Math.random();

    setToasts((prev) => [
      ...prev,
      {
        id,
        message,
        type,
      },
    ]);

    setTimeout(() => {
      setToasts((prev) =>
        prev.filter((item) => item.id !== id)
      );
    }, 3000);
  }

  // -------------------------------------------------------------------------
  // PERMISSION HELPERS
  // -------------------------------------------------------------------------

  function grantedAccessIds(
    idRole: string,
    idMenu: string
  ): string[] {
    return permissions
      .filter(
        (permission) =>
          permission.id_role === idRole &&
          permission.id_menu === idMenu
      )
      .map((permission) => permission.id_jenis_akses);
  }

  function grantedCount(
    idRole: string,
    idMenu: string
  ): number {
    return grantedAccessIds(idRole, idMenu).length;
  }

  const currentGranted = useMemo(() => {
    if (!selectedRole || !selectedMenu) {
      return [];
    }

    return grantedAccessIds(
      selectedRole,
      selectedMenu
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRole, selectedMenu, permissions]);

  // -------------------------------------------------------------------------
  // SELECT ROLE
  // -------------------------------------------------------------------------

  function handleSelectRole(idRole: string) {
    setSelectedRole(idRole);
    setSelectedMenu(null);
    setPending({});
  }

  // -------------------------------------------------------------------------
  // SELECT MENU
  // -------------------------------------------------------------------------

  function handleSelectMenu(idMenu: string) {
    setSelectedMenu(idMenu);
    setPending({});
  }

  // -------------------------------------------------------------------------
  // TOGGLE
  // -------------------------------------------------------------------------

  function handleToggle(
    idAccess: string,
    checked: boolean
  ) {
    const wasGranted = currentGranted.includes(idAccess);

    setPending((prev) => {
      const next = {
        ...prev,
      };

      if (checked !== wasGranted) {
        next[idAccess] = checked;
      } else {
        delete next[idAccess];
      }

      return next;
    });
  }

  // -------------------------------------------------------------------------
  // SAVE
  // -------------------------------------------------------------------------

  async function handleSave() {
    if (
      !selectedRole ||
      !selectedMenu ||
      Object.keys(pending).length === 0
    ) {
      return;
    }

    if (!API_BASE) {
      addToast(
        "NEXT_PUBLIC_API_URL belum dikonfigurasi",
        "error"
      );
      return;
    }

    setSaving(true);

    try {
      const entries = Object.entries(pending);

      const results = await Promise.allSettled(
        entries.map(
          async ([idAccess, shouldGrant]) => {
            // ---------------------------------------------------------------
            // CREATE
            // ---------------------------------------------------------------

            if (shouldGrant) {
              const res = await fetch(
                `${API_BASE}/api/v1/hak-akses`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeaders(),
                  },
                  credentials: "include",
                  body: JSON.stringify({
                    id_role: selectedRole,
                    id_menu: selectedMenu,
                    id_jenis_akses: idAccess,
                  }),
                }
              );

              if (!res.ok) {
                throw new Error(
                  "Gagal menambahkan hak akses"
                );
              }

              const json = await res.json();

              return {
                type: "add" as const,
                record:
                  json?.data?.permission ??
                  json?.data ??
                  {
                    id_hak_akses: `local-${Date.now()}-${idAccess}`,
                    id_role: selectedRole,
                    id_menu: selectedMenu,
                    id_jenis_akses: idAccess,
                  },
              };
            }

            // ---------------------------------------------------------------
            // DELETE
            // ---------------------------------------------------------------

            const existing = permissions.find(
              (permission) =>
                permission.id_role === selectedRole &&
                permission.id_menu === selectedMenu &&
                permission.id_jenis_akses === idAccess
            );

            if (!existing) {
              return {
                type: "remove" as const,
                idAccess,
              };
            }

            const res = await fetch(
              `${API_BASE}/api/v1/hak-akses/${existing.id_hak_akses}`,
              {
                method: "DELETE",
                headers: {
                  ...getAuthHeaders(),
                },
                credentials: "include",
              }
            );

            if (!res.ok) {
              throw new Error(
                "Gagal menghapus hak akses"
              );
            }

            return {
              type: "remove" as const,
              idAccess,
            };
          }
        )
      );

      // ---------------------------------------------------------------------
      // UPDATE LOCAL STATE
      // ---------------------------------------------------------------------

      setPermissions((prev) => {
        let next = [...prev];

        results.forEach((result) => {
          if (result.status !== "fulfilled") {
            return;
          }

          if (result.value.type === "add") {
            const alreadyExists = next.some(
              (permission) =>
                permission.id_role ===
                  result.value.record.id_role &&
                permission.id_menu ===
                  result.value.record.id_menu &&
                permission.id_jenis_akses ===
                  result.value.record.id_jenis_akses
            );

            if (!alreadyExists) {
              next.push(result.value.record);
            }
          }

          if (result.value.type === "remove") {
            next = next.filter(
              (permission) =>
                !(
                  permission.id_role === selectedRole &&
                  permission.id_menu === selectedMenu &&
                  permission.id_jenis_akses ===
                    result.value.idAccess
                )
            );
          }
        });

        return next;
      });

      const failed = results.filter(
        (result) => result.status === "rejected"
      ).length;

      if (failed > 0) {
        addToast(
          `${failed} perubahan gagal disimpan`,
          "error"
        );
      } else {
        addToast(
          "Hak akses berhasil disimpan"
        );
      }

      setPending({});
    } catch (error) {
      console.error(error);

      addToast(
        "Terjadi kesalahan saat menyimpan hak akses",
        "error"
      );
    } finally {
      setSaving(false);
    }
  }

  // -------------------------------------------------------------------------
  // SELECTED OBJECT
  // -------------------------------------------------------------------------

  const roleObj = roles.find(
    (role) => role.id_role === selectedRole
  );

  const menuObj = menus.find(
    (menu) => menu.id_menu === selectedMenu
  );

  const pendingCount =
    Object.keys(pending).length;

  // -------------------------------------------------------------------------
  // UI
  // -------------------------------------------------------------------------

  return (
    <div className={`${manrope.className} ha-page`}>
      {/* HEADER */}
      <div className="ha-page-head">
        <div>
          <h1 className="ha-title">
            Hak akses
          </h1>

          <p className="ha-desc">
            Atur hak akses setiap role berdasarkan
            menu dan tindakan yang diperbolehkan.
          </p>
        </div>
      </div>

      {/* BREADCRUMB */}
      {selectedRole && (
        <div className="ha-crumb">
          <button
            type="button"
            onClick={() => {
              setSelectedMenu(null);
              setPending({});
            }}
          >
            Role
          </button>

          <ChevronIcon />

          {selectedMenu ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setSelectedMenu(null);
                  setPending({});
                }}
              >
                {roleObj?.nama_role}
              </button>

              <ChevronIcon />

              <span>
                {menuObj?.nama_menu}
              </span>
            </>
          ) : (
            <span>
              {roleObj?.nama_role}
            </span>
          )}
        </div>
      )}

      {/* MAIN TABLE */}
      <div className="ha-panels">
        {/* =============================================================== */}
        {/* ROLE */}
        {/* =============================================================== */}

        <div
          className="ha-panel"
          data-hidden={
            selectedRole ? "true" : "false"
          }
        >
          <div className="ha-panel-head">
            <div className="ha-panel-title">
              Role
            </div>

            <div className="ha-panel-subtitle">
              Pilih role
            </div>
          </div>

          <div className="ha-panel-list">
            {loading ? (
              <div className="ha-loading">
                Memuat role…
              </div>
            ) : (
              roles.map((role) => (
                <button
                  key={role.id_role}
                  type="button"
                  className={`ha-list-item ${
                    role.id_role ===
                    selectedRole
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    handleSelectRole(
                      role.id_role
                    )
                  }
                >
                  <span>
                    {role.nama_role}
                  </span>

                  <ChevronIcon className="ha-chevron" />
                </button>
              ))
            )}
          </div>
        </div>

        {/* =============================================================== */}
        {/* MENU */}
        {/* =============================================================== */}

        <div
          className="ha-panel"
          data-hidden={
            !selectedRole
              ? "true"
              : selectedMenu
              ? "true"
              : "false"
          }
        >
          <div className="ha-panel-head">
            <div className="ha-panel-title">
              Menu
            </div>

            <div className="ha-panel-subtitle">
              {roleObj?.nama_role ||
                "Pilih role terlebih dahulu"}
            </div>
          </div>

          <div className="ha-panel-list">
            {selectedRole &&
              menus.map((menu) => {
                const count =
                  grantedCount(
                    selectedRole,
                    menu.id_menu
                  );

                const allGranted =
                  count ===
                    accessTypes.length &&
                  accessTypes.length > 0;

                return (
                  <button
                    key={menu.id_menu}
                    type="button"
                    className={`ha-list-item ${
                      menu.id_menu ===
                      selectedMenu
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      handleSelectMenu(
                        menu.id_menu
                      )
                    }
                  >
                    <div className="ha-menu-name">
                      <span>
                        {menu.nama_menu}
                      </span>

                      <small
                        className={`${jbMono.className} ha-menu-code`}
                      >
                        {menu.kode_menu}
                      </small>
                    </div>

                    <div className="ha-menu-meta">
                      <span
                        className={`ha-count ${
                          allGranted
                            ? "complete"
                            : ""
                        } ${jbMono.className}`}
                      >
                        {count}/
                        {accessTypes.length}
                      </span>

                      <ChevronIcon className="ha-chevron" />
                    </div>
                  </button>
                );
              })}
          </div>
        </div>

        {/* =============================================================== */}
        {/* ACCESS */}
        {/* =============================================================== */}

        <div
          className="ha-panel ha-panel-access"
          data-hidden={
            !(
              selectedRole &&
              selectedMenu
            )
              ? "true"
              : "false"
          }
        >
          {selectedRole &&
            selectedMenu && (
              <div className="ha-access-body">
                {/* CONTEXT */}
                <div className="ha-access-header">
                  <div>
                    <div className="ha-access-kicker">
                      Hak akses
                    </div>

                    <div className="ha-access-title">
                      {menuObj?.nama_menu}
                    </div>

                    <div className="ha-access-role">
                      Role:{" "}
                      <strong>
                        {roleObj?.nama_role}
                      </strong>
                    </div>
                  </div>

                  <div
                    className={`${jbMono.className} ha-access-total`}
                  >
                    {currentGranted.length}/
                    {accessTypes.length}
                  </div>
                </div>

                {/* ACCESS LIST */}
                <div className="ha-access-list">
                  {accessTypes.map(
                    (access) => {
                      const isGranted =
                        pending[
                          access.id_jenis_akses
                        ] !== undefined
                          ? pending[
                              access
                                .id_jenis_akses
                            ]
                          : currentGranted.includes(
                              access.id_jenis_akses
                            );

                      return (
                        <div
                          className={`ha-access-row ${
                            isGranted
                              ? "granted"
                              : ""
                          }`}
                          key={
                            access.id_jenis_akses
                          }
                        >
                          <div className="ha-access-info">
                            <div className="ha-access-label">
                              {access.label}
                            </div>

                            <div className="ha-access-type">
                              <span
                                className={`${jbMono.className}`}
                              >
                                {
                                  access.nama_jenis_akses
                                }
                              </span>
                            </div>

                            <div className="ha-access-desc">
                              {access.desc}
                            </div>
                          </div>

                          <div className="ha-switch-wrapper">
                            <span
                              className={`ha-switch-status ${
                                isGranted
                                  ? "on"
                                  : "off"
                              }`}
                            >
                              {isGranted
                                ? "ON"
                                : "OFF"}
                            </span>

                            <label className="ha-switch">
                              <input
                                type="checkbox"
                                checked={
                                  isGranted
                                }
                                onChange={(event) =>
                                  handleToggle(
                                    access.id_jenis_akses,
                                    event.target
                                      .checked
                                  )
                                }
                              />

                              <span className="ha-track" />

                              <span className="ha-thumb" />
                            </label>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>

                {/* FOOTER */}
                <div className="ha-access-foot">
                  <div>
                    {pendingCount === 0 ? (
                      <span className="ha-save-hint">
                        Tidak ada perubahan
                      </span>
                    ) : (
                      <span className="ha-save-hint pending">
                        {pendingCount} perubahan
                        belum disimpan
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    className="ha-btn ha-btn-primary"
                    disabled={
                      pendingCount === 0 ||
                      saving
                    }
                    onClick={handleSave}
                  >
                    {saving
                      ? "Menyimpan…"
                      : "Simpan perubahan"}
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>

      {/* NOTE */}
      <div className="ha-below-note">
        <InfoIcon />

        <span>
          Pengaturan ini menentukan hak akses
          berdasarkan role dan menu. Server tetap
          harus memvalidasi izin pada setiap
          request API.
        </span>
      </div>

      {/* TOAST */}
      <div className="ha-toast-stack">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`ha-toast ${
              toast.type === "error"
                ? "error"
                : ""
            }`}
          >
            {toast.type === "error" ? (
              <ErrorIcon />
            ) : (
              <CheckIcon />
            )}

            <span>
              {toast.message}
            </span>
          </div>
        ))}
      </div>

      {/* ================================================================ */}
      {/* STYLE */}
      {/* ================================================================ */}

      <style jsx>{`
        .ha-page {
          --ink: #171a21;
          --ink-soft: #626978;
          --paper: #f4f5f8;
          --surface: #ffffff;
          --line: #e3e6ec;
          --line-strong: #cdd1da;
          --authority: #24435f;
          --authority-soft: #e9eff4;
          --granted: #1f7a5c;
          --granted-soft: #edf8f3;
          --danger: #b3261e;

          --radius-s: 7px;
          --radius-m: 11px;

          --shadow-card:
            0 1px 2px rgba(23, 26, 33, 0.04),
            0 1px 0 rgba(23, 26, 33, 0.03);

          --shadow-pop:
            0 8px 24px rgba(23, 26, 33, 0.14),
            0 2px 6px rgba(23, 26, 33, 0.08);

          min-height: 100vh;
          padding: 26px 30px 60px;

          background: var(--paper);
          color: var(--ink);

          max-width: 1180px;

          font-size: 14.5px;
          line-height: 1.5;
        }

        .ha-page :global(*) {
          box-sizing: border-box;
        }

        .ha-page :global(button) {
          font-family: inherit;
        }

        .ha-page :global(:focus-visible) {
          outline: 2px solid var(--authority);
          outline-offset: 2px;
        }

        /* HEADER */

        .ha-page-head {
          margin-bottom: 20px;
        }

        .ha-title {
          margin: 0 0 4px;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.01em;
        }

        .ha-desc {
          margin: 0;
          max-width: 62ch;
          color: var(--ink-soft);
          font-size: 13.6px;
        }

        /* BREADCRUMB */

        .ha-crumb {
          display: none;
          align-items: center;
          gap: 6px;

          margin-bottom: 14px;

          color: var(--ink-soft);
          font-size: 13px;
        }

        .ha-crumb button {
          all: unset;
          cursor: pointer;

          color: var(--authority);
          font-weight: 600;
        }

        /* PANELS */

        .ha-panels {
          display: grid;

          grid-template-columns:
            205px
            285px
            minmax(0, 1fr);

          min-height: 470px;

          overflow: hidden;

          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: var(--radius-m);

          box-shadow: var(--shadow-card);
        }

        .ha-panel {
          min-width: 0;
          border-right: 1px solid var(--line);
        }

        .ha-panel:last-child {
          border-right: none;
        }

        .ha-panel-head {
          padding: 15px 16px 11px;
        }

        .ha-panel-title {
          color: var(--ink);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.01em;
        }

        .ha-panel-subtitle {
          margin-top: 2px;
          color: var(--ink-soft);
          font-size: 11.5px;
        }

        .ha-panel-list {
          display: flex;
          flex-direction: column;
          gap: 2px;

          padding: 0 8px 12px;
        }

        .ha-loading {
          padding: 14px 10px;
          color: var(--ink-soft);
          font-size: 13px;
        }

        /* LIST ITEM */

        .ha-list-item {
          width: 100%;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 8px;

          padding: 10px;

          background: transparent;

          border: 1px solid transparent;
          border-radius: var(--radius-s);

          color: var(--ink);

          font-size: 13.5px;
          font-weight: 600;

          text-align: left;

          cursor: pointer;

          transition:
            background 0.15s ease,
            border-color 0.15s ease;
        }

        .ha-list-item:hover {
          background: #f5f6f9;
        }

        .ha-list-item.active {
          background: var(--authority-soft);
          border-color: #d3e0ea;
          color: var(--authority);
        }

        .ha-chevron {
          width: 14px;
          height: 14px;

          flex-shrink: 0;

          color: var(--line-strong);
        }

        .ha-list-item.active
          :global(.ha-chevron) {
          color: var(--authority);
        }

        /* MENU */

        .ha-menu-name {
          min-width: 0;

          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .ha-menu-name > span {
          overflow: hidden;

          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .ha-menu-code {
          color: var(--ink-soft);
          font-size: 9.5px;
          font-weight: 400;
        }

        .ha-menu-meta {
          display: flex;
          align-items: center;
          gap: 5px;

          flex-shrink: 0;
        }

        .ha-count {
          min-width: 34px;

          padding: 2px 6px;

          background: #eef0f4;

          border-radius: 20px;

          color: var(--ink-soft);

          font-size: 10px;
          font-weight: 700;

          text-align: center;
        }

        .ha-count.complete {
          background: #dff1e9;
          color: var(--granted);
        }

        .ha-list-item.active
          .ha-count {
          background: #d3e0ea;
          color: var(--authority);
        }

        /* ACCESS */

        .ha-panel-access {
          background: #fff;
        }

        .ha-access-body {
          padding: 18px 20px 20px;
        }

        .ha-access-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;

          gap: 15px;

          padding-bottom: 16px;

          border-bottom: 1px solid var(--line);
        }

        .ha-access-kicker {
          margin-bottom: 2px;

          color: var(--ink-soft);

          font-size: 10.5px;
          font-weight: 700;

          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .ha-access-title {
          font-size: 17px;
          font-weight: 800;
        }

        .ha-access-role {
          margin-top: 2px;

          color: var(--ink-soft);

          font-size: 12px;
        }

        .ha-access-role strong {
          color: var(--ink);
        }

        .ha-access-total {
          padding: 5px 8px;

          background: #eef0f4;

          border-radius: 6px;

          color: var(--authority);

          font-size: 11px;
          font-weight: 700;
        }

        /* ACCESS LIST */

        .ha-access-list {
          display: flex;
          flex-direction: column;
        }

        .ha-access-row {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 16px;

          padding: 15px 4px;

          border-bottom: 1px solid var(--line);

          transition:
            background 0.15s ease;
        }

        .ha-access-row.granted {
          background: linear-gradient(
            to right,
            rgba(31, 122, 92, 0.025),
            transparent
          );
        }

        .ha-access-info {
          min-width: 0;
        }

        .ha-access-label {
          font-size: 14px;
          font-weight: 700;
        }

        .ha-access-type {
          margin-top: 1px;
        }

        .ha-access-type span {
          color: var(--authority);
          font-size: 9.5px;
        }

        .ha-access-desc {
          margin-top: 2px;

          color: var(--ink-soft);

          font-size: 12px;
        }

        /* SWITCH */

        .ha-switch-wrapper {
          display: flex;
          align-items: center;
          gap: 9px;

          flex-shrink: 0;
        }

        .ha-switch-status {
          min-width: 26px;

          font-family: ${jbMono.style.fontFamily};

          font-size: 9px;
          font-weight: 700;

          text-align: right;
        }

        .ha-switch-status.on {
          color: var(--granted);
        }

        .ha-switch-status.off {
          color: #a0a5b0;
        }

        .ha-switch {
          position: relative;

          display: inline-block;

          width: 38px;
          height: 22px;

          flex-shrink: 0;
        }

        .ha-switch input {
          position: absolute;

          width: 100%;
          height: 100%;

          margin: 0;

          opacity: 0;

          cursor: pointer;

          z-index: 2;
        }

        .ha-track {
          position: absolute;
          inset: 0;

          background: #d6d9e1;

          border-radius: 20px;

          transition:
            background 0.15s ease;
        }

        .ha-thumb {
          position: absolute;

          top: 2px;
          left: 2px;

          width: 18px;
          height: 18px;

          background: #fff;

          border-radius: 50%;

          box-shadow:
            0 1px 2px rgba(0, 0, 0, 0.25);

          transition:
            transform 0.15s ease;
        }

        .ha-switch
          input:checked
          ~ .ha-track {
          background: var(--granted);
        }

        .ha-switch
          input:checked
          ~ .ha-track
          ~ .ha-thumb {
          transform: translateX(16px);
        }

        .ha-switch
          input:focus-visible
          ~ .ha-track {
          outline: 2px solid var(--authority);
          outline-offset: 2px;
        }

        /* FOOTER */

        .ha-access-foot {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 12px;

          margin-top: 16px;
          padding-top: 14px;

          border-top: 1px solid var(--line);
        }

        .ha-save-hint {
          color: var(--ink-soft);
          font-size: 12px;
        }

        .ha-save-hint.pending {
          color: var(--authority);
          font-weight: 600;
        }

        .ha-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          min-height: 36px;

          padding: 8px 14px;

          border: 1px solid var(--line-strong);
          border-radius: var(--radius-s);

          background: var(--surface);

          color: var(--ink);

          font-size: 13px;
          font-weight: 700;

          cursor: pointer;
        }

        .ha-btn-primary {
          background: var(--authority);
          border-color: var(--authority);
          color: #fff;
        }

        .ha-btn-primary:hover:not(:disabled) {
          filter: brightness(0.94);
        }

        .ha-btn-primary:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        /* NOTE */

        .ha-below-note {
          display: flex;
          align-items: flex-start;

          gap: 8px;

          margin-top: 14px;

          color: var(--ink-soft);

          font-size: 12.2px;
        }

        .ha-below-note
          :global(svg) {
          width: 14px;
          height: 14px;

          flex-shrink: 0;

          margin-top: 1px;
        }

        /* TOAST */

        .ha-toast-stack {
          position: fixed;

          right: 20px;
          bottom: 20px;

          display: flex;
          flex-direction: column;

          gap: 8px;

          z-index: 80;
        }

        .ha-toast {
          display: flex;
          align-items: center;

          gap: 9px;

          min-width: 230px;

          padding: 11px 15px;

          background: #171a21;

          border-radius: 8px;

          color: #fff;

          font-size: 13px;
          font-weight: 500;

          box-shadow: var(--shadow-pop);
        }

        .ha-toast.error {
          background: var(--danger);
        }

        /* MOBILE */

        @media (max-width: 880px) {
          .ha-page {
            padding: 20px 16px 50px;
          }

          .ha-crumb {
            display: flex;
          }

          .ha-panels {
            grid-template-columns: 1fr;

            min-height: auto;
          }

          .ha-panel {
            border-right: none;
            border-bottom: 1px solid var(--line);
          }

          .ha-panel:last-child {
            border-bottom: none;
          }

          .ha-panel[data-hidden="true"] {
            display: none;
          }

          .ha-access-body {
            padding: 16px;
          }
        }

        @media (max-width: 520px) {
          .ha-page-head {
            margin-bottom: 14px;
          }

          .ha-title {
            font-size: 20px;
          }

          .ha-desc {
            font-size: 12.8px;
          }

          .ha-access-header {
            align-items: center;
          }

          .ha-access-title {
            font-size: 16px;
          }

          .ha-access-row {
            gap: 10px;
          }

          .ha-access-desc {
            max-width: 220px;
          }

          .ha-switch-status {
            display: none;
          }

          .ha-access-foot {
            align-items: stretch;
            flex-direction: column;
          }

          .ha-btn {
            width: 100%;
          }

          .ha-toast-stack {
            right: 12px;
            bottom: 12px;
            left: 12px;
          }

          .ha-toast {
            min-width: 0;
          }
        }
      `}</style>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ICONS
// ---------------------------------------------------------------------------

function ChevronIcon(
  props: React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8h.01M11 12h1v4h1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5M12 16h.01" />
    </svg>
  );
}