import { menus } from './menu';
import { jenisAkses } from './access';
import type { RoleName, AccessType } from './types';

/**
 * =========================================================
 * ROLES
 * =========================================================
 *
 * Sesuaikan nama/id role di sini kalau berbeda dengan
 * aplikasi kamu. Pastikan setiap `nama_role` di bawah ini
 * juga terdaftar sebagai union value di RoleName (types.ts).
 */
export const roles = [
  { id_role: 'role-owner', nama_role: 'Owner' },
  { id_role: 'role-admin', nama_role: 'Admin' },
  { id_role: 'role-kasir', nama_role: 'Kasir' },
] as const;

//DEFAULT PERMISSIONS
type PermissionState = Record<RoleName, Record<string, AccessType[]>>;

function buildEmptyMenuPermissions(): Record<string, AccessType[]> {
  return menus.reduce<Record<string, AccessType[]>>((acc, menu) => {
    acc[menu.nama_menu] = [];
    return acc;
  }, {});
}

function buildFullMenuPermissions(): Record<string, AccessType[]> {
  const allAccess = jenisAkses.map((access) => access.nama_jenis_akses as AccessType);
  return menus.reduce<Record<string, AccessType[]>>((acc, menu) => {
    acc[menu.nama_menu] = [...allAccess];
    return acc;
  }, {});
}

export const defaultPermissions: PermissionState = {
  Owner: buildFullMenuPermissions(),
  Admin: buildEmptyMenuPermissions(),
  Kasir: buildEmptyMenuPermissions(),
};