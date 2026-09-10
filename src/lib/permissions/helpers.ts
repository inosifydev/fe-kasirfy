import type {
  AccessType,
  Menu,
  Permission,
  RoleName,
} from "./types";

export function hasAccess(
  permissions: Permission[],
  module: string,
  access: AccessType
): boolean {
  return permissions.some(
    (permission) =>
      permission.module === module &&
      permission.actions.includes(access)
  );
}

export function getPermission(
  permissions: Permission[],
  module: string
): Permission | null {
  return (
    permissions.find(
      (permission) =>
        permission.module === module
    ) ?? null
  );
}

export function getAccessibleMenus(
  permissions: Permission[],
  menus: Menu[]
): Menu[] {
  return menus
    .filter((menu) => {
      if (!menu.is_active) {
        return false;
      }

      return hasAccess(
        permissions,
        menu.kode_menu,
        "Read"
      );
    })
    .sort(
      (a, b) => a.urutan - b.urutan
    );
}

export function hasRole(
  role: RoleName | undefined,
  expectedRole: RoleName
): boolean {
  return role === expectedRole;
}