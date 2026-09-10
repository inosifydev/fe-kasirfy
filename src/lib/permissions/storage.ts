import type {
  PermissionResponse,
} from "./types";

export const PERMISSION_STORAGE_KEY =
  "kasirfy_permissions_api";

export function getStoredPermissions(): PermissionResponse | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = localStorage.getItem(
      PERMISSION_STORAGE_KEY
    );

    if (!stored) {
      return null;
    }

    return JSON.parse(stored) as PermissionResponse;
  } catch (error) {
    console.error(
      "[Permission] Gagal membaca localStorage:",
      error
    );

    localStorage.removeItem(
      PERMISSION_STORAGE_KEY
    );

    return null;
  }
}

export function savePermissions(
  data: PermissionResponse
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(
      PERMISSION_STORAGE_KEY,
      JSON.stringify(data)
    );
  } catch (error) {
    console.error(
      "[Permission] Gagal menyimpan permission:",
      error
    );
  }
}

export function resetPermissions(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(
    PERMISSION_STORAGE_KEY
  );
}