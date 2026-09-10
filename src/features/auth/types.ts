import type { AuthSession } from '@/features/user/types';

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: AuthSession;
}

export interface Permission {
  module: string;
  name: string;
  actions: string[];
}

export interface LoginApiResponse {
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
}

export interface ProfileApiResponse {
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
    role?: {
      id_role: string;
      nama_role: string;
      deskripsi?: string;
      created_at?: string;
    };
  };
}

export interface PermissionsApiResponse {
  success: boolean;
  status: number;
  message: string;
  data?: {
    role: string;
    permissions: Permission[];
  };
}

export interface LogoutApiResponse {
  success: boolean;
  status: number;
  message: string;
}