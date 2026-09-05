import { AuthSession, User } from "@/features/user/types";

const DUMMY_ROLE: AuthSession["role"] = {
  id_role: "550e8400-e29b-41d4-a716-446655440002",
  nama_role: "Administrator",
  deskripsi: "Administrator sistem",
  created_at: "2026-09-05T09:00:00.000Z",
};

const DUMMY_USERS: User[] = [
  {
    id_user: "550e8400-e29b-41d4-a716-446655440001",
    username: "admin",
    password: "admin123",
    nama_lengkap: "Administrator",
    email: "admin@kasirfy.com",
    no_hp: "081234567890",
    id_role: DUMMY_ROLE.id_role,
    is_active: true,
    created_at: "2026-09-05T09:00:00.000Z",
    role: DUMMY_ROLE,
  },
];

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: AuthSession;
}

export async function login(
  payload: LoginPayload
): Promise<LoginResponse> {
  await new Promise((resolve) =>
    setTimeout(resolve, 500)
  );

  const user = DUMMY_USERS.find(
    (item) =>
      item.username === payload.username &&
      item.password === payload.password
  );

  if (!user) {
    return {
      success: false,
      message: "Username atau password salah.",
    };
  }

  if (!user.is_active) {
    return {
      success: false,
      message: "Akun Anda sedang tidak aktif.",
    };
  }

  const sessionUser: AuthSession = {
    id_user: user.id_user,
    username: user.username,
    nama_lengkap: user.nama_lengkap,
    email: user.email,
    no_hp: user.no_hp,
    id_role: user.id_role,
    role: user.role!,
  };

  return {
    success: true,
    message: "Login berhasil.",
    user: sessionUser,
  };
}