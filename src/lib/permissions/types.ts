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

/**
 * Permission yang dikirim oleh API.
 *
 * Contoh:
 * {
 *   module: "barang",
 *   name: "Data Barang",
 *   actions: ["Create", "Read", "Update", "Delete", "Export"]
 * }
 */
export interface Permission {
  module: string;
  name: string;
  actions: AccessType[];
}

/**
 * Response endpoint permissions.
 */
export interface PermissionResponse {
  role: RoleName;
  permissions: Permission[];
}