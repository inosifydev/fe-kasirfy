import { AuthSession, Role } from "@/features/user/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: AuthSession;
}

interface LoginApiResponse {
  success: boolean;
  status: number;
  message: string;
  data?: {
    access_token?: string;
    refresh_token?: string;
    user?: {
      id: string;
      username: string;
      name: string;
      email: string;
      roleId: string;
    };
  };
  meta?: {
    timestamp: string;
    path?: string;
  };
}

interface ProfileApiResponse {
  success: boolean;
  status: number;
  message: string;
  data?: {
    id_user: string;
    username: string;
    nama_lengkap: string;
    email: string;
    no_hp: string;
    id_role: string;
    is_active: boolean;
    created_at: string;
  };
}

interface PermissionsApiResponse {
  success: boolean;
  status: number;
  message: string;
  data?: {
    role: string;
    permissions: Permission[];
  };
}

export interface Permission {
  module: string;
  name: string;
  actions: string[];
}

export interface AuthPermissions {
  role: string;
  permissions: Permission[];
}

/**
 * Login menggunakan email atau username.
 *
 * Jika input mengandung "@", dianggap sebagai email.
 * Jika tidak, dianggap sebagai username.
 */
export async function login(
  payload: LoginPayload
): Promise<LoginResponse> {
  try {
    const identifier = payload.identifier.trim();

    if (!identifier) {
      return {
        success: false,
        message: "Email atau username wajib diisi.",
      };
    }

    if (!payload.password) {
      return {
        success: false,
        message: "Password wajib diisi.",
      };
    }

    const isEmail = identifier.includes("@");

    const requestBody = isEmail
      ? {
          email: identifier,
          password: payload.password,
        }
      : {
          username: identifier,
          password: payload.password,
        };

    const response = await fetch(
      `${API_URL}/api/v1/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      }
    );

    let result: LoginApiResponse;

    try {
      result = await response.json();
    } catch {
      return {
        success: false,
        message: "Response dari server tidak valid.",
      };
    }

    if (!response.ok || !result.success) {
      return {
        success: false,
        message:
          result.message ||
          "Email/username atau password salah.",
      };
    }

    if (!result.data?.user) {
      return {
        success: false,
        message: "Data user tidak ditemukan.",
      };
    }

    /*
     * Setelah login berhasil, ambil profile dari backend.
     * Profile merupakan sumber data user yang lebih lengkap.
     */
    const profile = await getProfile();

    if (!profile) {
      return {
        success: false,
        message: "Gagal mengambil profile pengguna.",
      };
    }

    /*
     * Ambil permission user yang sedang login.
     */
    const permissions = await getPermissions();

    if (!permissions) {
      return {
        success: false,
        message: "Gagal mengambil hak akses pengguna.",
      };
    }

    const role: Role = {
      id_role: profile.id_role,
      nama_role: permissions.role,
      deskripsi: "",
      created_at: profile.created_at,
    };

    const sessionUser: AuthSession = {
      id_user: profile.id_user,
      username: profile.username,
      nama_lengkap: profile.nama_lengkap,
      email: profile.email,
      no_hp: profile.no_hp,
      id_role: profile.id_role,
      role,
    };

    /*
     * Simpan permissions untuk kebutuhan frontend.
     * Token tidak disimpan ke localStorage.
     */
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "kasirfy_permissions_api",
        JSON.stringify(permissions)
      );
    }

    return {
      success: true,
      message: result.message || "Login berhasil.",
      user: sessionUser,
    };
  } catch (error) {
    console.error("Login error:", error);

    return {
      success: false,
      message:
        "Tidak dapat terhubung ke server. Pastikan backend sedang berjalan.",
    };
  }
}

/**
 * Mengambil profile user yang sedang login.
 */
export async function getProfile() {
  try {
    const response = await fetch(
      `${API_URL}/api/v1/auth/profile`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const result: ProfileApiResponse =
      await response.json();

    if (!result.success || !result.data) {
      return null;
    }

    return result.data;
  } catch (error) {
    console.error("Get profile error:", error);
    return null;
  }
}

/**
 * Mengambil permission user yang sedang login.
 */
export async function getPermissions(): Promise<AuthPermissions | null> {
  try {
    const response = await fetch(
      `${API_URL}/api/v1/auth/permissions`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const result: PermissionsApiResponse =
      await response.json();

    if (
      !result.success ||
      !result.data
    ) {
      return null;
    }

    return result.data;
  } catch (error) {
    console.error("Get permissions error:", error);
    return null;
  }
}

/**
 * Refresh access token.
 */
export async function refreshToken(): Promise<boolean> {
  try {
    const response = await fetch(
      `${API_URL}/api/v1/auth/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      return false;
    }

    const result = await response.json();

    return result.success === true;
  } catch (error) {
    console.error("Refresh token error:", error);
    return false;
  }
}

/**
 * Logout user.
 */
export async function logout(): Promise<boolean> {
  try {
    const response = await fetch(
      `${API_URL}/api/v1/auth/logout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      return false;
    }

    const result = await response.json();

    return result.success === true;
  } catch (error) {
    console.error("Logout error:", error);
    return false;
  }
}

/**
 * Mengambil permission yang tersimpan di browser.
 */
export function getStoredApiPermissions(): AuthPermissions | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = localStorage.getItem(
    "kasirfy_permissions_api"
  );

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(
      stored
    ) as AuthPermissions;
  } catch {
    localStorage.removeItem(
      "kasirfy_permissions_api"
    );

    return null;
  }
}

/**
 * Menghapus permission dari browser.
 */
export function clearStoredApiPermissions(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(
    "kasirfy_permissions_api"
  );
}