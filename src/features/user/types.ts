export interface Role {
  id_role: string;
  nama_role: string;
  deskripsi: string;
  created_at: string;
}

export interface User {
  id_user: string;
  username: string;
  password?: string;
  nama_lengkap: string;
  email: string;
  no_hp: string;
  id_role: string;
  is_active: boolean;
  created_at: string;
  role?: Role;
}

export interface AuthSession {
  id_user: string;
  username: string;
  nama_lengkap: string;
  email: string;
  no_hp: string;
  id_role: string;
  role: Role;
}