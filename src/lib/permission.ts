export type RoleName = "Kasir" | "Manager" | "Owner";

export type AccessType =
  | "Create"
  | "Read"
  | "Update"
  | "Delete"
  | "Export";

export interface Role {
  id_role: string;
  nama_role: string;
  deskripsi: string;
  created_at: string;
}

export interface Menu {
  id_menu: string;
  nama_menu: string;
  kode_menu: string;
  icon: string;
  path: string;
  urutan: number;
  is_active: boolean;
  created_at: string;
}

export interface JenisAkses {
  id_jenis_akses: string;
  nama_jenis_akses: string;
  deskripsi: string;
  created_at: string;
}

export interface HakAkses {
  id_hak_akses: string;
  id_role: string;
  id_menu: string;
  id_jenis_akses: string;
  keterangan: string;
  created_at: string;
}

/* =========================================================
   ROLE
========================================================= */

export const roles: Role[] = [
  {
    id_role: "role-kasir",
    nama_role: "Kasir",
    deskripsi: "Mengelola transaksi dan melihat data yang diperlukan.",
    created_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id_role: "role-manager",
    nama_role: "Manager",
    deskripsi: "Mengelola operasional dan data sistem.",
    created_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id_role: "role-owner",
    nama_role: "Owner",
    deskripsi: "Memiliki akses penuh terhadap seluruh sistem.",
    created_at: "2026-01-01T00:00:00.000Z",
  },
];

/* =========================================================
   MENU
========================================================= */

export const menus: Menu[] = [
  {
    id_menu: "menu-dashboard",
    nama_menu: "Dashboard",
    kode_menu: "dashboard",
    icon: "LayoutDashboard",
    path: "/dashboard",
    urutan: 1,
    is_active: true,
    created_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id_menu: "menu-barang",
    nama_menu: "Data Barang",
    kode_menu: "barang",
    icon: "Package",
    path: "/barang",
    urutan: 2,
    is_active: true,
    created_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id_menu: "menu-transaksi",
    nama_menu: "Transaksi",
    kode_menu: "transaksi",
    icon: "ShoppingCart",
    path: "/transaksi",
    urutan: 3,
    is_active: true,
    created_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id_menu: "menu-stok",
    nama_menu: "Stok",
    kode_menu: "stok",
    icon: "Boxes",
    path: "/stok",
    urutan: 4,
    is_active: true,
    created_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id_menu: "menu-laporan",
    nama_menu: "Laporan",
    kode_menu: "laporan",
    icon: "FileText",
    path: "/laporan",
    urutan: 5,
    is_active: true,
    created_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id_menu: "menu-pengguna",
    nama_menu: "Pengguna",
    kode_menu: "pengguna",
    icon: "Users",
    path: "/pengguna",
    urutan: 6,
    is_active: true,
    created_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id_menu: "menu-hak-akses",
    nama_menu: "Hak Akses",
    kode_menu: "hak-akses",
    icon: "ShieldCheck",
    path: "/hak-akses",
    urutan: 7,
    is_active: true,
    created_at: "2026-01-01T00:00:00.000Z",
  },
];

/* =========================================================
   JENIS AKSES
========================================================= */

export const jenisAkses: JenisAkses[] = [
  {
    id_jenis_akses: "access-create",
    nama_jenis_akses: "Create",
    deskripsi: "Menambahkan data baru.",
    created_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id_jenis_akses: "access-read",
    nama_jenis_akses: "Read",
    deskripsi: "Melihat data.",
    created_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id_jenis_akses: "access-update",
    nama_jenis_akses: "Update",
    deskripsi: "Mengubah data.",
    created_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id_jenis_akses: "access-delete",
    nama_jenis_akses: "Delete",
    deskripsi: "Menghapus data.",
    created_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id_jenis_akses: "access-export",
    nama_jenis_akses: "Export",
    deskripsi: "Mengekspor data.",
    created_at: "2026-01-01T00:00:00.000Z",
  },
];

/* =========================================================
   DEFAULT PERMISSIONS
========================================================= */

export const defaultPermissions: Record<
  RoleName,
  Record<string, AccessType[]>
> = {
  Kasir: {
    Dashboard: ["Read"],
    "Data Barang": ["Read"],
    Transaksi: ["Create", "Read"],
    Stok: [],
    Laporan: ["Read"],
    Pengguna: [],
    "Hak Akses": [],
  },

  Manager: {
    Dashboard: ["Read"],
    "Data Barang": [
      "Create",
      "Delete",
      "Export",
      "Read",
      "Update",
    ],
    Transaksi: [
      "Create",
      "Delete",
      "Export",
      "Read",
      "Update",
    ],
    Stok: [
      "Create",
      "Delete",
      "Export",
      "Read",
      "Update",
    ],
    Laporan: [
      "Create",
      "Delete",
      "Export",
      "Read",
      "Update",
    ],
    Pengguna: ["Read"],
    "Hak Akses": [],
  },

  Owner: {
    Dashboard: [
      "Create",
      "Delete",
      "Export",
      "Read",
      "Update",
    ],
    "Data Barang": [
      "Create",
      "Delete",
      "Export",
      "Read",
      "Update",
    ],
    Transaksi: [
      "Create",
      "Delete",
      "Export",
      "Read",
      "Update",
    ],
    Stok: [
      "Create",
      "Delete",
      "Export",
      "Read",
      "Update",
    ],
    Laporan: [
      "Create",
      "Delete",
      "Export",
      "Read",
      "Update",
    ],
    Pengguna: [
      "Create",
      "Delete",
      "Export",
      "Read",
      "Update",
    ],
    "Hak Akses": [
      "Create",
      "Delete",
      "Export",
      "Read",
      "Update",
    ],
  },
};

/* =========================================================
   LOCAL STORAGE
========================================================= */

export const PERMISSION_STORAGE_KEY =
  "kasirfy_permissions";

/* =========================================================
   GET PERMISSIONS
========================================================= */

export function getStoredPermissions() {
  if (typeof window === "undefined") {
    console.log(
      "[Permission] Server render - menggunakan defaultPermissions"
    );

    return defaultPermissions;
  }

  try {
    const stored = localStorage.getItem(
      PERMISSION_STORAGE_KEY
    );

    console.log(
      "[Permission] Membaca localStorage..."
    );

    console.log(
      "[Permission] Raw data:",
      stored
    );

    if (!stored) {
      console.log(
        "[Permission] Tidak ada data tersimpan. Menggunakan defaultPermissions."
      );

      return defaultPermissions;
    }

    const parsed = JSON.parse(stored);

    console.log(
      "[Permission] Data permission berhasil dibaca:",
      parsed
    );

    return parsed;
  } catch (error) {
    console.error(
      "[Permission] Gagal membaca localStorage:",
      error
    );

    return defaultPermissions;
  }
}

/* =========================================================
   SAVE PERMISSIONS
========================================================= */

export function savePermissions(
  permissions: Record<
    RoleName,
    Record<string, AccessType[]>
  >
) {
  if (typeof window === "undefined") {
    console.warn(
      "[Permission] savePermissions dipanggil di server."
    );

    return;
  }

  try {
    localStorage.setItem(
      PERMISSION_STORAGE_KEY,
      JSON.stringify(permissions)
    );

    console.log(
      "[Permission] Permission berhasil disimpan."
    );

    console.log(
      "[Permission] Data yang disimpan:",
      permissions
    );

    console.log(
      "[Permission] localStorage:",
      localStorage.getItem(
        PERMISSION_STORAGE_KEY
      )
    );
  } catch (error) {
    console.error(
      "[Permission] Gagal menyimpan permission:",
      error
    );
  }
}

/* =========================================================
   RESET PERMISSIONS
========================================================= */

export function resetPermissions() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(
    PERMISSION_STORAGE_KEY
  );

  console.log(
    "[Permission] Permission berhasil di-reset."
  );
}

/* =========================================================
   CHECK ACCESS
========================================================= */

export function hasAccess(
  roleName: RoleName,
  menuName: string,
  accessName: AccessType
) {
  const permissions = getStoredPermissions();

  const result =
    permissions[roleName]?.[menuName]?.includes(
      accessName
    ) ?? false;

  console.log(
    `[Permission] ${roleName} -> ${menuName} -> ${accessName}:`,
    result ? "DIIZINKAN" : "DITOLAK"
  );

  return result;
}

/* =========================================================
   GET ACCESSIBLE MENUS
========================================================= */

export function getAccessibleMenus(
  roleName: RoleName
) {
  const permissions = getStoredPermissions();

  const accessibleMenus = menus
    .filter((menu) => {
      if (!menu.is_active) {
        return false;
      }

      return (
        permissions[roleName]?.[menu.nama_menu]?.includes(
          "Read"
        ) ?? false
      );
    })
    .sort((a, b) => a.urutan - b.urutan);

  console.log(
    `[Permission] Menu yang dapat diakses oleh ${roleName}:`,
    accessibleMenus
  );

  return accessibleMenus;
}